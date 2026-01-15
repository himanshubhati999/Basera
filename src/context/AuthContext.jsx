import React, { createContext, useState, useContext, useEffect } from 'react';

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
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        // Load wishlist from localStorage
        const storedWishlist = localStorage.getItem(`wishlist_${parsedUser.id}`);
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
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
      localStorage.setItem(`wishlist_${userWithToken.id}`, JSON.stringify([]));

      return { success: true, user: userWithToken };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
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
      
      // Load wishlist for this user
      const storedWishlist = localStorage.getItem(`wishlist_${userWithToken.id}`);
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      } else {
        setWishlist([]);
        localStorage.setItem(`wishlist_${userWithToken.id}`, JSON.stringify([]));
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

  const addToWishlist = (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login to add to wishlist' };
    }

    if (wishlist.includes(propertyId)) {
      return { success: false, error: 'Property already in wishlist' };
    }

    const newWishlist = [...wishlist, propertyId];
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    return { success: true, message: 'Added to wishlist' };
  };

  const removeFromWishlist = (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login' };
    }

    const newWishlist = wishlist.filter(id => id !== propertyId);
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(newWishlist));
    return { success: true, message: 'Removed from wishlist' };
  };

  const toggleWishlist = (propertyId) => {
    if (!user) {
      return { success: false, error: 'Please login to add to wishlist' };
    }

    if (wishlist.includes(propertyId)) {
      return removeFromWishlist(propertyId);
    } else {
      return addToWishlist(propertyId);
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
