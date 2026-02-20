import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturedProjects from '../components/FeaturedProjects';
import Testimonials from '../components/Testimonials';
import { useCategory } from '../context/CategoryContext';

const Home = () => {
  const { selectedCategory } = useCategory();

  return (
    <>
      <HeroSection />
      <FeaturedProjects selectedCategory={selectedCategory} />
      <Testimonials />
    </>
  );
};

export default Home;
