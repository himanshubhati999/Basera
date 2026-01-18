import React, { createContext, useState, useContext, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Fetch wishlist from backend
        fetch(API_ENDPOINTS.WISHLIST, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setWishlist(data.data || []);
          }
        })
        .catch(error => {
          console.error('Error fetching wishlist:', error);
          setWishlist([]);
        })
        .finally(() => {
          setLoading(false);
        });
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const signup = async (userData) => {
    try {
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Store user data and token
      const userWithToken = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        token: data.data.token
      };
      
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      localStorage.setItem('token', data.data.token);
      
      // Initialize empty wishlist for new user
      setWishlist([]);

      return { success: true, user: userWithToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user data and token
      const userWithToken = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        token: data.data.token
      };
      
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      localStorage.setItem('token', data.data.token);
      
      // Fetch wishlist from backend
      try {
        const wishlistResponse = await fetch(API_ENDPOINTS.WISHLIST, {
          headers: {
            'Authorization': `Bearer ${data.data.token}`
          }
        });
        
        if (wishlistResponse.ok) {
          const wishlistData = await wishlistResponse.json();
          setWishlist(wishlistData.data || []);
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        setWishlist([]);
      }

      return { success: true, user: userWithToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const addToWishlist = async (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login to add to wishlist' };
    }

    if (wishlist.includes(propertyId)) {
      return { success: false, error: 'Property already in wishlist' };
    }

    console.log('=== Adding to wishlist ===');
    console.log('PropertyId:', propertyId);
    console.log('PropertyId type:', typeof propertyId);
    console.log('PropertyId length:', propertyId?.length);
    console.log('API URL:', `${API_ENDPOINTS.WISHLIST}/${propertyId}`);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.WISHLIST}/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('API Response status:', response.status);
      console.log('API Response data:', JSON.stringify(data, null, 2));

      if (response.ok) {
        setWishlist(data.data);
        return { success: true, message: data.message };
      } else {
        console.error('API Error:', JSON.stringify(data, null, 2));
        alert(`Error: ${data.message || 'Failed to add to wishlist'}\nProperty ID: ${propertyId}\nID Type: ${typeof propertyId}\nID Length: ${propertyId?.length}`);
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return { success: false, error: 'Failed to add to wishlist' };
    }
  };

  const removeFromWishlist = async (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login' };
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.WISHLIST}/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setWishlist(data.data);
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return { success: false, error: 'Failed to remove from wishlist' };
    }
  };

  const toggleWishlist = async (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login to add to wishlist' };
    }

    console.log('=== AuthContext toggleWishlist ===');
    console.log('Received propertyId:', propertyId);
    console.log('Type:', typeof propertyId);

    if (wishlist.includes(propertyId)) {
      return await removeFromWishlist(propertyId);
    } else {
      return await addToWishlist(propertyId);
    }
  };

  const isInWishlist = (propertyId) => {
    return wishlist.includes(propertyId);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
    wishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
