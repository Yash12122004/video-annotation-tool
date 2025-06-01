import React from 'react';

export default function TextInput({ 
  showTextInput, 
  textPosition, 
  textInput, 
  setTextInput, 
  handleTextKeyDown, 
  handleTextSubmit, 
  color 
}) {
  if (!showTextInput) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${textPosition.x}px`,
        top: `${textPosition.y}px`,
        zIndex: 1000,
      }}
    >
      <input
        type="text"
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
        onKeyDown={handleTextKeyDown}
        onBlur={handleTextSubmit}
        autoFocus
        style={{
          padding: '4px 8px',
          border: `2px solid ${color}`,
          borderRadius: '4px',
          backgroundColor: 'white',
          fontSize: '14px',
          minWidth: '100px'
        }}
        placeholder="Enter text..."
      />
    </div>
  );
}