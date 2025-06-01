import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { useVideo } from './VideoContext';

export default function TaskBar() {
  const { videoRef, currentTime } = useVideo();

  const isPaused = videoRef.current ? videoRef.current?.paused : true;

  const handlePlayPause = () => {
    if (videoRef.current.paused) videoRef.current.play();
    else videoRef.current.pause();
  };

  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = percent * videoRef.current.duration;
  };

  const progressPercent =
    (currentTime / (videoRef.current?.duration || 1)) * 100 || 0;

  return (
    <div className="taskbar">
      <button
        onClick={handlePlayPause}
        style={{
          background: 'none',
          border: 'none',
          color: '#f0f0f0',
          fontSize: '1.2rem',
          cursor: 'pointer',
        }}
      >
        <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
      </button>

      <div className="progress-bar" onClick={handleSeek}>
        <div className="progress" style={{ width: `${progressPercent}%` }} />
      </div>

      <span style={{ fontSize: '0.85rem', minWidth: '120px', textAlign: 'right' }}>
        {currentTime.toFixed(2)}s /{' '}
        {videoRef.current?.duration
          ? videoRef.current.duration.toFixed(2)
          : '0.00'}
        s
      </span>
    </div>
  );
}
