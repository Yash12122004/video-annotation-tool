import React from 'react';
import { useVideo } from './VideoContext';

export default function AnnotationList({ annotations }) {

  const { videoRef } = useVideo();

  const jumpToTime = (time) => {
    videoRef.current.currentTime = time;
    videoRef.current.pause();
  };

  return (
    <div className="annotation-list">
      <h3>Annotations</h3>
      {annotations.map((a, i) => (
        <div key={i} className="annotation-item" onClick={() => jumpToTime(a.start)}>
          ⏱ {a.start.toFixed(1)}s
        </div>
      ))}
    </div>
  );
}
