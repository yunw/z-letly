import React, { useState } from 'react';

const VideoBackground = ({ children, videoSrc, overlay = true }) => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-[-2]"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
            opacity: 0.7,
            background: '#0a0a40', // fallback color
            transition: 'opacity 0.5s',
          }}
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      {/* Fallback background when video fails to load */}
      {videoError && (
        <div
          className="absolute top-0 left-0 w-full h-full z-[-2]"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            opacity: 0.7,
            zIndex: -2,
          }}
        />
      )}
      {/* Overlay for better text readability */}
      {overlay && (
        <div
          className="absolute top-0 left-0 w-full h-full z-[-1]"
          style={{
            background: 'rgba(10,10,64,0.4)', // dark blue overlay
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground; 