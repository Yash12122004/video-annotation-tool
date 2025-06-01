import { useState } from 'react';

export function useTextAnnotation(videoRef, state, dispatch) {
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const handleTextClick = (e) => {
    if (state.tool !== 'text') return;
    
    if (!videoRef.current.paused) {
      videoRef.current.pause();
    }
    
    const rect = videoRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setTextPosition({ x, y });
    setShowTextInput(true);
    setTextInput('');
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      const textAnnotation = {
        id: Date.now() + Math.random(),
        tool: 'text',
        color: state.color,
        text: textInput,
        x: textPosition.x,
        y: textPosition.y,
        start: videoRef.current.currentTime,
        end: videoRef.current.currentTime + +state.annotDuration
      };
      
      dispatch({ type: 'ADD_ANNOTATION', payload: textAnnotation });
    }
    
    setShowTextInput(false);
    setTextInput('');
  };

  const handleTextKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTextSubmit();
    } else if (e.key === 'Escape') {
      setShowTextInput(false);
      setTextInput('');
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.stopPropagation(); // Prevent deletion of annotations while typing
    }
  };

  return {
    textInput,
    setTextInput,
    showTextInput,
    textPosition,
    handleTextClick,
    handleTextSubmit,
    handleTextKeyDown
  };
}