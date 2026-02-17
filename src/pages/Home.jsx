import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProjects from '../components/FeaturedProjects';
import { useCategory } from '../context/CategoryContext';

const Home = () => {
  const { selectedCategory } = useCategory();

  return (
    <>
      <HeroSection />
      <FeaturedProjects selectedCategory={selectedCategory} />
    </>
  );
};

export default Home;
