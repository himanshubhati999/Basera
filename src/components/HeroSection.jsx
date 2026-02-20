import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import "./ButtonGlare.css";

const HeroSection = () => {
  const images = [
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771607847/file_000000000c947208957660a277218cbb_auecox.png",
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771607865/file_000000008e287209a5a6425e169d9899_kqcgit.png",
    "https://res.cloudinary.com/dxxsh8aha/image/upload/v1771607880/file_00000000191472099b136140b25dda97_x79hfw.png"
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
