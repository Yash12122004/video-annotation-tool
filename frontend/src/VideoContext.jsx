import React, { createContext, useContext, useState, useRef } from 'react';

const VideoContext = createContext();

export const useVideo = () => useContext(VideoContext);

export function VideoProvider({ children }) {
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0); // add this

  const [videoInfo, setVideoInfo] = useState({
    duration: 0,
    width: 0,
    height: 0,
    ready: false
  });

  const handleMetadataLoad = () => {
    const video = videoRef.current;
    if (video) {
      setVideoInfo({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight,
        ready: true
      });
    }
  };

  return (
    <VideoContext.Provider value={{ videoRef, videoInfo, handleMetadataLoad, currentTime, setCurrentTime }}>
      {children}
    </VideoContext.Provider>
  );
}
