import { useEffect } from 'react';

export function useVideoControls(videoRef, setCurrentTime) {
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const interval = setInterval(() => {
      setCurrentTime(video.currentTime);
    }, 100);

    const handleKeyDown = (e) => {
      if (!video) return;
      if (e.key === "ArrowRight") {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      } else if (e.key === "ArrowLeft") {
        video.currentTime = Math.max(0, video.currentTime - 5);
      } else if (e.key === " ") {
        e.preventDefault();
        if (video.paused) video.play();
        else video.pause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [videoRef, setCurrentTime]);
}