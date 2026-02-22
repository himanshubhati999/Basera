import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import FeaturedProjects from '../components/FeaturedProjects';
import Testimonials from '../components/Testimonials';
import { useCategory } from '../context/CategoryContext';

const Home = () => {
  const { selectedCategory } = useCategory();

  return (
    <>
      <Helmet>
        <title>Basera Infra Home - Premium Real Estate in Greater Noida | Plots, Flats & Commercial Properties</title>
        <meta 
          name="description" 
          content="Find your dream property in Greater Noida with Basera Infra Home. Residential plots, affordable housing, commercial spaces. Trusted real estate partner with transparent deals and legal support." 
        />
        <meta property="og:title" content="Basera Infra Home - Premium Real Estate in Greater Noida" />
        <meta property="og:description" content="Trusted real estate company offering residential and commercial properties in Greater Noida." />
        <meta property="og:type" content="website" />
        <meta name="keywords" content="Greater Noida real estate, property in Greater Noida, residential plots, flats for sale, affordable housing, investment property, Basera Infra Home" />
        <link rel="canonical" href="https://baserainfrahome.com/" />
      </Helmet>
      
      <HeroSection />
      <FeaturedProjects selectedCategory={selectedCategory} />
      <Testimonials />
    </>
  );
};

export default Home;
