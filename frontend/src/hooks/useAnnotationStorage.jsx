import { useState, useEffect, useRef } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const VIDEO_ID = 'default';

const apiService = {
  async loadAnnotations(videoId = VIDEO_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/annotations/${videoId}`);
      const result = await response.json();
      return result.success ? result.data : [];
    } catch (error) {
      console.error('Failed to load annotations from API:', error);
      return [];
    }
  },

  async saveAnnotations(annotations, videoId = VIDEO_ID) {
    try {
      const response = await fetch(`${API_BASE_URL}/annotations/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ annotations, videoId }),
      });
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Failed to save annotations to API:', error);
      return false;
    }
  }
};

export function useAnnotationStorage(annotations, dispatch) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(true);
  const saveTimeoutRef = useRef(null);

  // Load annotations on component mount
  useEffect(() => {
    if (!isLoaded) {
      loadAnnotations();
    }
  }, [isLoaded]);

  // Save annotations with debouncing
  useEffect(() => {
    if (isLoaded && annotations) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveAnnotations();
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [annotations, isLoaded, useLocalStorage]);

  const loadAnnotations = async () => {
    try {
      let annotations = [];
      
      if (useLocalStorage) {
        const savedAnnotations = localStorage.getItem('video-annotations');
        if (savedAnnotations) {
          annotations = JSON.parse(savedAnnotations);
        }
      } else {
        annotations = await apiService.loadAnnotations();
      }

      if (Array.isArray(annotations)) {
        dispatch({ type: 'LOAD_ANNOTATIONS', payload: annotations });
      }
    } catch (error) {
      console.error('Failed to load annotations:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveAnnotations = async () => {
    try {
      if (useLocalStorage) {
        localStorage.setItem('video-annotations', JSON.stringify(annotations));
        console.log('Annotations saved to localStorage:', annotations.length);
      } else {
        const success = await apiService.saveAnnotations(annotations);
        if (success) {
          console.log('Annotations saved to API:', annotations.length);
        } else {
          console.error('Failed to save to API, falling back to localStorage');
          localStorage.setItem('video-annotations', JSON.stringify(annotations));
        }
      }
    } catch (error) {
      console.error('Failed to save annotations:', error);
      if (!useLocalStorage) {
        localStorage.setItem('video-annotations', JSON.stringify(annotations));
      }
    }
  };

  const toggleStorageMethod = () => {
    setUseLocalStorage(!useLocalStorage);
    setIsLoaded(false);
  };

  return {
    useLocalStorage,
    toggleStorageMethod,
    isLoaded
  };
}