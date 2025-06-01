# Video Annotation Tool

A sophisticated web-based video annotation tool that allows users to watch videos and add timestamped annotations with drawing capabilities. Built with React and Express.js, featuring a YouTube-inspired interface with advanced annotation management.

## Features

### Core Functionality
- **Custom Video Player** with YouTube-inspired design
- **Advanced Annotation System** with multiple drawing tools
- **Real-time Annotation Management** with undo/redo functionality
- **Flexible Storage Options** (Local Storage or API-based)
- **Comprehensive Keyboard Shortcuts** for enhanced productivity

### Video Player Features
- Play/pause controls
- Progress bar with seek functionality
- Current time / total duration display
- Fullscreen toggle
- Frame-by-frame navigation
- Playback speed control (0.5x, 1x, 1.25x, 1.5x, 2x)
- Responsive design across desktop, tablet, and mobile

### Annotation Tools
- **Circle Tool**: Click and drag to draw circles of varying sizes
- **Rectangle Tool**: Click and drag to create rectangles/squares
- **Line Tool**: Click and drag to draw straight lines
- **Text Tool**: Click to add text annotations at specific positions

### Advanced Features
- **Selection & Interaction**: Click annotations to select with visual handles
- **Drag & Drop**: Reposition annotations on the video frame
- **Timeline Integration**: Visual markers on progress bar showing annotation locations
- **Timestamp Visibility**: Annotations appear only during their respective timestamps
- **Undo/Redo System**: Complete history management for all annotation actions

## Technology Stack

### Frontend
- **React** with Vite for fast development
- **Modern CSS** with responsive design
- **Custom Hooks** for state management
- **ESLint** for code quality

### Backend
- **Node.js** with Express.js
- **File-based Storage** (JSON) for annotations
- **RESTful API** design
- **CORS** enabled for cross-origin requests

## Project Structure

```
video-annotation-tool/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AnnotationRenderer.jsx
│   │   │   ├── TextInput.jsx
│   │   │   └── StorageToggle.jsx
│   │   ├── hooks/
│   │   │   ├── useAnnotationStorage.jsx
│   │   │   ├── useAnnotationInteraction.jsx
│   │   │   ├── useDrawing.jsx
│   │   │   └── useTextAnnotation.jsx
│   │   ├── App.jsx
│   │   ├── Video.jsx
│   │   └── styles.css
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── server.js
│   ├── annotations.json
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- Modern browser (Chrome, Firefox, Safari, Edge)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

To create a production build:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Annotations
```http
GET /api/annotations
```
**Response:**
```json
[
  {
    "id": "unique-id",
    "type": "rectangle",
    "x": 100,
    "y": 50,
    "width": 200,
    "height": 100,
    "timestamp": 15.5,
    "videoId": "default"
  }
]
```

#### Get Annotations by Video ID
```http
GET /api/annotations/:videoId
```

#### Create New Annotation
```http
POST /api/annotations
```
**Request Body:**
```json
{
  "type": "circle",
  "x": 150,
  "y": 75,
  "radius": 50,
  "timestamp": 20.3,
  "videoId": "default"
}
```

#### Bulk Save Annotations
```http
POST /api/annotations/bulk
```
**Request Body:**
```json
{
  "annotations": [/* array of annotations */],
  "videoId": "default"
}
```

#### Update Annotation
```http
PUT /api/annotations/:id
```

#### Delete Annotation
```http
DELETE /api/annotations/:id
```

#### Delete All Annotations
```http
DELETE /api/annotations
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Space` | Play/Pause video |
| `←` `→` | Seek backward/forward |
| `Delete` | Delete selected annotation |
| `Ctrl+Z` | Undo last action |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo action |
| `C` | Select Circle tool |
| `R` | Select Rectangle tool |
| `L` | Select Line tool |
| `T` | Select Text tool |

## Component Documentation

### Core Components

#### `Video.jsx`
Main video component handling playback and annotation rendering.
- Manages video state and controls
- Handles annotation overlay rendering
- Integrates with annotation tools

#### `AnnotationRenderer.jsx`
Renders annotations on the video canvas.
- Displays different annotation types
- Handles selection indicators
- Manages annotation visibility based on timestamp

#### `TextInput.jsx`
Handles text annotation input with inline editing.
- Dynamic positioning
- Real-time text editing
- Keyboard event handling

#### `StorageToggle.jsx`
Toggle component for switching between storage methods.
- Local Storage mode
- API-based storage mode
- Visual indicator of current mode

### Custom Hooks

#### `useAnnotationStorage.jsx`
Manages annotation persistence and storage methods.
```javascript
const {
  annotations,
  setAnnotations,
  storageMethod,
  toggleStorageMethod,
  loadAnnotations,
  saveAnnotations
} = useAnnotationStorage();
```

#### `useAnnotationInteraction.jsx`
Handles annotation selection, dragging, and deletion.
```javascript
const {
  selectedAnnotation,
  selectAnnotation,
  startDrag,
  handleDrag,
  stopDrag,
  deleteSelected
} = useAnnotationInteraction(annotations, setAnnotations);
```

#### `useDrawing.jsx`
Manages drawing interactions and tool selection.
```javascript
const {
  currentTool,
  setCurrentTool,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp
} = useDrawing(/* parameters */);
```

#### `useTextAnnotation.jsx`
Handles text annotation creation and editing.
```javascript
const {
  textInput,
  handleTextClick,
  handleTextSubmit,
  handleTextKeyDown
} = useTextAnnotation(/* parameters */);
```

## Configuration

### Vite Configuration
The project uses Vite for fast development and building. Configuration is in `vite.config.js`.

### ESLint Configuration
Code quality is maintained using ESLint with React-specific rules in `eslint.config.js`.

## Key Features Implementation

### Annotation Persistence
- **Local Storage**: Annotations saved to browser's localStorage
- **API Storage**: Annotations saved to backend via REST API
- **Real-time Sync**: Seamless switching between storage methods

### Timeline Integration
- Visual markers on progress bar indicating annotation locations
- Automatic annotation visibility based on video timestamp
- 2-3 second display duration for each annotation

### Undo/Redo System
- Complete action history tracking
- Support for all annotation operations
- Keyboard shortcuts for quick access

### Responsive Design
- Mobile-first approach
- Touch-friendly controls
- Adaptive layout for different screen sizes

## Deployment

### Frontend Deployment
Recommended platforms:
- **Vercel** (recommended)
- **Netlify**
- **GitHub Pages**

Build command: `npm run build`
Publish directory: `dist`

### Backend Deployment
Recommended platforms:
- **Heroku**
- **Railway**
- **Render**

Ensure environment variables are configured for production.

## Future Enhancements

### Planned Features
- **Database Integration**: Replace file-based storage with MongoDB
- **User Authentication**: Multi-user support with personal annotations
- **Advanced Drawing Tools**: Freehand drawing and more shapes
- **Export/Import**: JSON/CSV export for annotations
- **Video Upload**: Support for multiple video files
- **Collaboration**: Real-time collaborative annotations

### Performance Optimizations
- Canvas optimization for smooth drawing
- Lazy loading for large annotation sets
- Video streaming optimization
- Caching strategies

### Accessibility Improvements
- Screen reader support
- High contrast mode
- Voice navigation
- Keyboard-only operation mode

## Testing

### Current Testing Setup
- ESLint for code quality
- Basic error handling

### Recommended Testing Additions
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Cypress for full user workflows

## Design Decisions

### Architecture Choices
- **Component-based Architecture**: Modular React components for maintainability
- **Custom Hooks**: Separation of concerns and reusability
- **File-based Storage**: Simplicity over complexity for initial implementation
- **Canvas-based Annotations**: Performance and flexibility for drawing operations

### UI/UX Decisions
- **YouTube-inspired Design**: Familiar interface for users
- **Pause-to-Annotate**: Prevents accidental annotations during playback
- **Visual Feedback**: Clear selection indicators and tool states
- **Keyboard Shortcuts**: Power user efficiency

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Built with using React, Express.js, and modern web technologies**