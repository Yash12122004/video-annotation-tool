const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'annotations.json');


// Middleware
const allowedOrigin = process.env.CORS_ORIGIN || true; 
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

// Helper function to read annotations from file
async function readAnnotations() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];  // Ensure it's always an array
  } catch (error) {
    console.error('Error reading annotations:', error);
    return [];
  }
}


// Helper function to write annotations to file
async function writeAnnotations(annotations) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(annotations, null, 2));
  } catch (error) {
    console.error('Error writing annotations:', error);
    throw error;
  }
}

// Routes

// GET /api/annotations - Retrieve all annotations
app.get('/api/annotations', async (req, res) => {
  try {
    const annotations = await readAnnotations();
    res.json({
      success: true,
      data: annotations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve annotations'
    });
  }
});

// GET /api/annotations/:videoId - Retrieve annotations for specific video
app.get('/api/annotations/:videoId', async (req, res) => {
  try {
    const { videoId } = req.params;
    const annotations = await readAnnotations();
    const videoAnnotations = annotations.filter(annot => annot.videoId === videoId);
    
    res.json({
      success: true,
      data: videoAnnotations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve annotations'
    });
  }
});

// POST /api/annotations - Create a new annotation
app.post('/api/annotations', async (req, res) => {
  try {
    const newAnnotation = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };

    // Validate required fields
    const requiredFields = ['tool', 'start', 'end'];
    for (const field of requiredFields) {
      if (!newAnnotation[field] && newAnnotation[field] !== 0) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }

    const annotations = await readAnnotations();
    annotations.push(newAnnotation);
    await writeAnnotations(annotations);

    res.status(201).json({
      success: true,
      data: newAnnotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create annotation'
    });
  }
});

// POST /api/annotations/bulk - Save all annotations at once
app.post('/api/annotations/bulk', async (req, res) => {
  try {
    const { annotations, videoId } = req.body;
    
    if (!Array.isArray(annotations)) {
      return res.status(400).json({
        success: false,
        error: 'Annotations must be an array'
      });
    }

    // Add metadata to each annotation
    const annotationsWithMetadata = annotations.map(annot => ({
      ...annot,
      videoId: videoId || 'default',
      createdAt: annot.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    // If videoId is provided, replace annotations for that video
    if (videoId) {
      const allAnnotations = await readAnnotations();
      const otherAnnotations = allAnnotations.filter(annot => annot.videoId !== videoId);
      const finalAnnotations = [...otherAnnotations, ...annotationsWithMetadata];
      await writeAnnotations(finalAnnotations);
    } else {
      // Replace all annotations
      await writeAnnotations(annotationsWithMetadata);
    }

    res.json({
      success: true,
      data: annotationsWithMetadata,
      message: `Saved ${annotations.length} annotations`
    });
  } catch (error) {
    console.error('Bulk save error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save annotations'
    });
  }
});

// PUT /api/annotations/:id - Update an existing annotation
app.put('/api/annotations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const annotations = await readAnnotations();
    
    const annotationIndex = annotations.findIndex(annot => annot.id == id);
    
    if (annotationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }

    // Update annotation
    annotations[annotationIndex] = {
      ...annotations[annotationIndex],
      ...req.body,
      id: annotations[annotationIndex].id, // Preserve original ID
      createdAt: annotations[annotationIndex].createdAt, // Preserve creation time
      updatedAt: new Date().toISOString()
    };

    await writeAnnotations(annotations);

    res.json({
      success: true,
      data: annotations[annotationIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update annotation'
    });
  }
});

// DELETE /api/annotations/:id - Delete an annotation
app.delete('/api/annotations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const annotations = await readAnnotations();
    
    const annotationIndex = annotations.findIndex(annot => annot.id == id);
    
    if (annotationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Annotation not found'
      });
    }

    const deletedAnnotation = annotations.splice(annotationIndex, 1)[0];
    await writeAnnotations(annotations);

    res.json({
      success: true,
      data: deletedAnnotation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete annotation'
    });
  }
});

// DELETE /api/annotations - Delete all annotations (for testing/reset)
app.delete('/api/annotations', async (req, res) => {
  try {
    await writeAnnotations([]);
    res.json({
      success: true,
      message: 'All annotations deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete annotations'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Annotation API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    await initializeDataFile();
    app.listen(PORT, () => {
      console.log(`Annotation API server running on port ${PORT}`);
      // console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();