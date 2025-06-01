import React, { useEffect } from 'react';
import { useVideo } from './VideoContext.jsx';
import { useAnnotationStorage } from './hooks/useAnnotationStorage';
import { useVideoControls } from './hooks/useVideoControls';
import { useAnnotationInteraction } from './hooks/useAnnotationInteraction';
import { useDrawing } from './hooks/useDrawing';
import { useTextAnnotation } from './hooks/useTextAnnotation';
import StorageToggle from './components/StorageToggle';
import TextInput from './components/TextInput';
import AnnotationRenderer from './components/AnnotationRenderer';

export default function VideoPlayer({ dispatch, state }) {
  const { videoRef, handleMetadataLoad, setCurrentTime } = useVideo();
  
  // Custom hooks
  const { useLocalStorage, toggleStorageMethod } = useAnnotationStorage(state.annotations, dispatch);
  
  useVideoControls(videoRef, setCurrentTime);
  
  const {
    selectedAnnotation,
    selectAnnotation,
    startDrag,
    handleDrag,
    stopDrag,
    deleteSelected,
    isDragging
  } = useAnnotationInteraction(videoRef, state, dispatch);
  
  const {
    annotRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useDrawing(videoRef, state, dispatch);
  
  const {
    textInput,
    setTextInput,
    showTextInput,
    textPosition,
    handleTextClick,
    handleTextSubmit,
    handleTextKeyDown
  } = useTextAnnotation(videoRef, state, dispatch);

  // Global event listeners
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    
    const handleClick = (e) => {
      if (state.tool === 'text') {
        handleTextClick(e);
      } else if (state.tool === 'select') {
        // Clear selection if clicking on video background
        selectAnnotation(null);
      }
    };

    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Delete' && selectedAnnotation && state.tool === 'select') {
        e.preventDefault();
        deleteSelected();
      } else if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        dispatch({ type: 'UNDO' });
      } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        dispatch({ type: 'REDO' });
      }
    };

    const handleMouseMoveGlobal = (e) => {
      if (isDragging) {
        handleDrag(e);
      } else {
        handleMouseMove(e);
      }
    };

    const handleMouseUpGlobal = (e) => {
      handleMouseUp(e);
      stopDrag();
    };

    video.addEventListener("click", handleClick);
    video.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMoveGlobal);
    document.addEventListener("mouseup", handleMouseUpGlobal);
    document.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      video.removeEventListener("click", handleClick);
      video.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMoveGlobal);
      document.removeEventListener("mouseup", handleMouseUpGlobal);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [videoRef, state, selectedAnnotation, isDragging]);

  return (
    <div className='video-canvas'>
      <StorageToggle 
        useLocalStorage={useLocalStorage} 
        toggleStorageMethod={toggleStorageMethod} 
      />

      <video
        ref={videoRef}
        src="/video.mp4"
        controls={false}
        className="video-player"
        onClick={() => {
          if (state.tool === "select") {
            const video = videoRef.current;
            if (video) {
              video.paused ? video.play() : video.pause();
            }
          }
        }}
        onLoadedMetadata={handleMetadataLoad}
      />
      
      <div 
        ref={annotRef}
        className="annotation"
        style={{ 
          border: `2px dashed ${state.color}`,
          display: "none",
          position: "absolute"
        }}>
      </div>

      <TextInput
        showTextInput={showTextInput}
        textPosition={textPosition}
        textInput={textInput}
        setTextInput={setTextInput}
        handleTextKeyDown={handleTextKeyDown}
        handleTextSubmit={handleTextSubmit}
        color={state.color}
      />

      <AnnotationRenderer
        annotations={state.annotations}
        currentTime={videoRef.current?.currentTime || 0}
        selectedAnnotation={selectedAnnotation}
        selectAnnotation={selectAnnotation}
        startDrag={startDrag}
        tool={state.tool}
      />
    </div>
  );
}