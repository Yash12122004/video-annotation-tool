import { useState, useRef } from 'react';

export function useAnnotationInteraction(videoRef, state, dispatch) {
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  const selectAnnotation = (annotation, event) => {
    if (event) {
      event.stopPropagation();
    }
    console.log("annotation is getting selected", annotation.id);
    setSelectedAnnotation(annotation);
    dispatch({ type: 'SET_SELECTED', payload: annotation.id });
  };

  const startDrag = (annotation, event) => {
    if (state.tool !== 'select') return;
    
    event.stopPropagation();
    event.preventDefault();
    
    const rect = videoRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    let annotationX, annotationY;
    if (annotation.tool === 'text') {
      annotationX = annotation.x;
      annotationY = annotation.y;
    } else {
      annotationX = Math.min(annotation.startX, annotation.endX);
      annotationY = Math.min(annotation.startY, annotation.endY);
    }
    
    dragOffsetRef.current = {
      x: mouseX - annotationX,
      y: mouseY - annotationY
    };
    
    setIsDragging(true);
    setSelectedAnnotation(annotation);
    dispatch({ type: 'SET_SELECTED', payload: annotation.id });
  };

  const handleDrag = (event) => {
    if (!isDragging || !selectedAnnotation) return;
    console.log("handling dragging!!")
    const rect = videoRef.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    const newX = mouseX - dragOffsetRef.current.x;
    const newY = mouseY - dragOffsetRef.current.y;
    
    dispatch({
      type: 'UPDATE_ANNOTATION',
      payload: {
        id: selectedAnnotation.id,
        updates: selectedAnnotation.tool === 'text' 
          ? { x: newX, y: newY }
          : {
              startX: newX,
              startY: newY,
              endX: newX + (selectedAnnotation.endX - selectedAnnotation.startX),
              endY: newY + (selectedAnnotation.endY - selectedAnnotation.startY)
            }
      }
    });
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const deleteSelected = () => {
    if (selectedAnnotation) {
      dispatch({ type: 'DELETE_ANNOTATION', payload: selectedAnnotation.id });
      setSelectedAnnotation(null);
    }
  };

  return {
    selectedAnnotation,
    selectAnnotation,
    startDrag,
    handleDrag,
    stopDrag,
    deleteSelected,
    isDragging
  };
}