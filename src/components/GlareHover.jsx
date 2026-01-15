import React, { useState, useRef } from 'react';
import './GlareHover.css';

const GlareHover = ({
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false
}) => {
  const [glarePosition, setGlarePosition] = useState({ x: -100, y: -100 });
  const [hasPlayed, setHasPlayed] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (playOnce && hasPlayed) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setGlarePosition({ x, y });
    if (playOnce && !hasPlayed) {
      setHasPlayed(true);
    }
  };

  const handleMouseLeave = () => {
    if (!playOnce) {
      setGlarePosition({ x: -100, y: -100 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="glare-hover-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--glare-x': `${glarePosition.x}px`,
        '--glare-y': `${glarePosition.y}px`,
        '--glare-color': glareColor,
        '--glare-opacity': glareOpacity,
        '--glare-angle': `${glareAngle}deg`,
        '--glare-size': `${glareSize}px`,
        '--transition-duration': `${transitionDuration}ms`
      }}
    >
      {children}
    </div>
  );
};

export default GlareHover;
