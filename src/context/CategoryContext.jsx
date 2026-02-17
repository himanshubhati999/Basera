import React, { createContext, useContext, useState } from 'react';

const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('projects');
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    location: '',
    category: '',
    priceFrom: '',
    priceTo: ''
  });

  return (
    <CategoryContext.Provider value={{ 
      selectedCategory, 
      setSelectedCategory,
      searchFilters,
      setSearchFilters
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategory must be used within a CategoryProvider');
  }
  return context;
};
