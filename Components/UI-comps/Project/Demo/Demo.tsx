"use client";

import { useEffect, useRef, useState } from "react";

interface DemoVideoProps {
  src: string;          // path to optimized mp4
  poster: string;       // static preview image
  className?: string;   // optional styling
}

const DemoVideo: React.FC<DemoVideoProps> = ({ src, poster, className }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Lazy load when component enters viewport
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Auto play on hover (desktop only)
  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      videoRef.current?.play();
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      videoRef.current?.pause();
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  };

  // Tap to play (mobile)
  const handleClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) videoRef.current.play();
    else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: "100%",
        aspectRatio: "16 / 9",  // Prevents CLS
        borderRadius: "14px",
        overflow: "hidden",
        position: "relative",
        background: "#000",
        cursor: "pointer"
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {!loaded && (
        <img
          src={poster}
          alt="Project preview"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

      {visible && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          
          playsInline
          preload="none"
          onLoadedData={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: loaded ? "block" : "none"
          }}
        />
      )}
    </div>
  );
};

export default DemoVideo;