import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import OTPVerification from '../components/OTPVerification';
import './Login.css';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state or localStorage - avoiding setState in useEffect
  const emailFromState = location.state?.email;
  const emailFromStorage = typeof window !== 'undefined' ? localStorage.getItem('pendingVerificationEmail') : null;
  const initialEmail = emailFromState || emailFromStorage || '';
  
  const [email] = useState(initialEmail);

  useEffect(() => {
    // Save email to localStorage if it came from state
    if (emailFromState && emailFromState !== emailFromStorage) {
      localStorage.setItem('pendingVerificationEmail', emailFromState);
    }
    
    // Redirect if no email
    if (!initialEmail) {
      navigate('/signup', { replace: true });
    }
  }, [emailFromState, emailFromStorage, initialEmail, navigate]);

  const handleSuccess = () => {
    // Clear pending email from storage
    localStorage.removeItem('pendingVerificationEmail');
    // Navigate to home or dashboard
    navigate('/', { replace: true });
  };

  const handleBack = () => {
    navigate('/signup');
  };

  if (!email) {
    return (
      <div className="login-container">
        <div className="login-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <OTPVerification 
        email={email}
        onSuccess={handleSuccess}
        onBack={handleBack}
        isStandalone={true}
      />
    </div>
  );
};

export default OTPVerificationPage;
