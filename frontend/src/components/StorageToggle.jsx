import React from 'react';

export default function StorageToggle({ useLocalStorage, toggleStorageMethod }) {
  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '5px 10px',
      borderRadius: '5px',
      fontSize: '12px'
    }}>
      <button 
        onClick={toggleStorageMethod}
        style={{
          backgroundColor: useLocalStorage ? '#4CAF50' : '#2196F3',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        {useLocalStorage ? 'Local Storage' : 'API Storage'}
      </button>
    </div>
  );
}