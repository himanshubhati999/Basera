import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { clearAuthStorage, getValidatedStoredToken } from '../utils/authToken';

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

  const clearSessionState = useCallback(() => {
    setUser(null);
    setWishlist([]);
    clearAuthStorage();
  }, []);

  // Remove stale auth if token is missing/expired/corrupt.
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = getValidatedStoredToken();

    if (storedUser && !token) {
      clearSessionState();
      return;
    }

    if (storedUser) {
      try {
        JSON.parse(storedUser);
      } catch {
        clearSessionState();
      }
    }
  }, [clearSessionState]);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    const token = getValidatedStoredToken();
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token });
        
        // Fetch wishlist from backend
        fetch(API_ENDPOINTS.WISHLIST, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then(response => {
          if (response.status === 401) {
            clearSessionState();
            return { success: false, data: [] };
          }
          return response.json();
        })
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
        clearSessionState();
        setLoading(false);
      }
    } else {
      if (storedUser && !token) {
        clearSessionState();
      }
      setLoading(false);
    }
  }, [clearSessionState]);

  const signup = async (userData) => {
    try {
      console.log('Calling signup API with:', userData);
      const response = await fetch(API_ENDPOINTS.SIGNUP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();
      console.log('Signup API response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      // Return success with email for OTP verification
      console.log('Returning signup success - should NOT log in yet');
      return { success: true, email: userData.email, message: data.message };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.message };
    }
  };

  const verifyOTP = async (email, otp) => {
    try {
      console.log('Verifying OTP for:', email, 'OTP:', otp);
      const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      console.log('Verify OTP response:', data);

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      if (!data?.data?.token) {
        throw new Error('Authentication token is missing. Please login again.');
      }

      // Store user data and token after successful verification
      const userWithToken = {
        id: data.data._id,
        name: data.data.name,
        email: data.data.email,
        role: data.data.role,
        token: data.data.token
      };
      
      console.log('OTP verified! Logging in user:', userWithToken);
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      localStorage.setItem('token', data.data.token);
      
      // Initialize empty wishlist for new user
      setWishlist([]);

      return { success: true, user: userWithToken };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: error.message };
    }
  };

  const resendOTP = async (email) => {
    try {
      const response = await fetch(API_ENDPOINTS.RESEND_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return { success: true, message: data.message };
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

      if (!data?.data?.token) {
        throw new Error('Authentication token is missing. Please login again.');
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
    clearSessionState();
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
      const token = getValidatedStoredToken();
      if (!token) {
        clearSessionState();
        return { success: false, error: 'Session expired. Please login again.' };
      }

      const response = await fetch(`${API_ENDPOINTS.WISHLIST}/${propertyId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        clearSessionState();
        return { success: false, error: 'Session expired. Please login again.' };
      }

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
      const token = getValidatedStoredToken();
      if (!token) {
        clearSessionState();
        return { success: false, error: 'Session expired. Please login again.' };
      }

      const response = await fetch(`${API_ENDPOINTS.WISHLIST}/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        clearSessionState();
        return { success: false, error: 'Session expired. Please login again.' };
      }

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
    verifyOTP,
    resendOTP,
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
