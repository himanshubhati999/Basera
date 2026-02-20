import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import "./ButtonGlare.css";

const HeroSection = () => {
  const images = [
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771601944/file_000000006750720b8be2e07181e51781_vkhche.png",
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771601914/file_000000003380720bbc0fb7108f878125_okg4qi.png",
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771601873/file_00000000d0b0720bb64b691110531d80_rfk055.png"
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
