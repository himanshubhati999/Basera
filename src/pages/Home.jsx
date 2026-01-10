import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProjects from '../components/FeaturedProjects';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('projects');

  return (
    <>
      <HeroSection onCategoryChange={setSelectedCategory} selectedCategory={selectedCategory} />
      <FeaturedProjects selectedCategory={selectedCategory} />
    </>
  );
};

export default Home;
