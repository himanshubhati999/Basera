import React from 'react';
import './ShinyText.css';

const ShinyText = ({
  text = "Shiny Text",
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  direction = "left",
  yoyo = false,
  pauseOnHover = false,
  className = ""
}) => {
  const animationDuration = `${speed}s`;
  const animationDelay = `${delay}s`;
  
  return (
    <span 
      className={`shiny-text ${pauseOnHover ? 'pause-on-hover' : ''} ${className}`}
      style={{
        '--shiny-text-color': color,
        '--shiny-color': shineColor,
        '--shiny-spread': `${spread}deg`,
        '--animation-duration': animationDuration,
        '--animation-delay': animationDelay,
        '--animation-direction': direction === 'right' ? 'reverse' : 'normal',
        '--animation-iteration': yoyo ? 'alternate infinite' : 'infinite'
      }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
