import React, { useState } from 'react';

const VideoBackground = ({ children, videoSrc, overlay = true }) => {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background */}
      {!videoError && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          style={{ filter: 'brightness(0.3)' }}
          onError={handleVideoError}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      
      {/* Fallback background when video fails to load */}
      {videoError && (
        <div 
          className="absolute top-0 left-0 w-full h-full z-0"
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            filter: 'brightness(0.3)'
          }}
        />
      )}
      
      {/* Overlay for better text readability */}
      {overlay && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>
      )}
      
      {/* Content */}
      <div className="relative z-20 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default VideoBackground; 