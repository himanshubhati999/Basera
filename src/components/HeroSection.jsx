import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import "./ButtonGlare.css";

const HeroSection = () => {
  const images = [
    "/image1.png",
    "/image2.png",
    "/image3.png"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="hero-section-component">
      <div className="hero-section">
        <div className="hero-carousel">
          {images.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentImageIndex ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
      </div>
    </section>
  );
};

export default HeroSection;
