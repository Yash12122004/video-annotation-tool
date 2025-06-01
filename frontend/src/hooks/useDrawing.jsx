import { useRef, useState } from 'react';

export function useDrawing(videoRef, state, dispatch) {
  const currentAnnotation = useRef(null);
  const annotRef = useRef(null);

  const handleMouseDown = (e) => {
    if (state.tool === 'text' || state.tool === 'select') return;
    
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }
    
    const rect = videoRef.current.getBoundingClientRect();
    let annotation = {
      id: Date.now() + Math.random(),
      tool: state.tool,
      color: state.color,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      start: videoRef.current.currentTime,
      end: +videoRef.current.currentTime + +state.annotDuration
    };

    if (annotRef.current) {
      annotRef.current.style.display = 'block';
      annotRef.current.style.top = annotation.startY + 'px';
      annotRef.current.style.left = annotation.startX + 'px';
      annotRef.current.style.transition = 'none';
    }

    currentAnnotation.current = annotation;
  };

  const handleMouseMove = (e) => {
    if (state.tool === 'select' || state.tool === 'text' || !currentAnnotation.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    
    const startX = currentAnnotation.current.startX;
    const startY = currentAnnotation.current.startY;
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    currentAnnotation.current = {
      ...currentAnnotation.current,
      width: Math.abs(endX - startX),
      height: Math.abs(endY - startY),
      scaleX: endX < startX ? -1 : 1,
      scaleY: endY < startY ? -1 : 1,
      endX: endX,
      endY: endY,
    };

    if (annotRef.current) {
      annotRef.current.style.transform = `scale(${currentAnnotation.current.scaleX}, ${currentAnnotation.current.scaleY})`;
      annotRef.current.style.left = `${Math.min(startX, endX)}px`;
      annotRef.current.style.top = `${Math.min(startY, endY)}px`;
      annotRef.current.style.width = `${currentAnnotation.current.width}px`;
      annotRef.current.style.height = `${currentAnnotation.current.height}px`;
    }
  };

  const handleMouseUp = () => {
    if (currentAnnotation.current) {
      dispatch({ type: 'ADD_ANNOTATION', payload: currentAnnotation.current });
      currentAnnotation.current = null;
      if (annotRef.current) {
        annotRef.current.style.display = 'none';
      }
    }
  };

  return {
    annotRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    currentAnnotation
  };
}