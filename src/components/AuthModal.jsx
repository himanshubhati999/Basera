import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import OTPVerification from './OTPVerification';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', or 'verify-otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otpEmail, setOtpEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, signup, resendOTP } = useAuth();

  // Monitor activeTab changes for debugging
  useEffect(() => {
    console.log('🔍 ActiveTab changed to:', activeTab);
    console.log('📧 OTP Email:', otpEmail);
  }, [activeTab, otpEmail]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateLoginForm = () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const validateSignupForm = () => {
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }

    if (name.length < 2) {
      setError('Name must be at least 2 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain uppercase, lowercase, and numbers');
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateLoginForm()) {
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      resetForm();
      onClose();
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);

    console.log('🚀 Starting signup with email:', formData.email);
    
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    console.log('📨 Signup result:', result);
    console.log('✅ result.success:', result.success);

    if (result.success) {
      console.log('✓ Signup successful, switching to OTP screen');
      console.log('📧 Setting OTP email to:', formData.email);
      
      // Store the email for OTP verification
      const emailForOTP = formData.email;
      
      // Update all states together - React will batch these
      setOtpEmail(emailForOTP);
      setActiveTab('verify-otp');
      
      // Immediate check after state update
      console.log('🔄 State update requested - activeTab should become: verify-otp');
      console.log('📧 otpEmail should become:', emailForOTP);
      
      // Force a re-render check with setTimeout
      setTimeout(() => {
        console.log('⏰ After 100ms - checking state...');
        console.log('Current activeTab value:', activeTab);
        console.log('Current otpEmail value:', otpEmail);
      }, 100);
      
      // Clear form data except email
      setFormData({
        name: '',
        email: emailForOTP,
        password: '',
        confirmPassword: ''
      });
      
      console.log('🎯 All state updates requested - component should re-render');
    } else {
      console.error('❌ Signup failed:', result.error);
      setError(result.error);
    }

    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setOtpEmail('');
    setError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchTab = (tab) => {
    console.log('🔄 switchTab called:', tab);
    setActiveTab(tab);
    setError('');
  };

  const handleOTPSuccess = () => {
    resetForm();
    onClose();
  };

  const handleOTPBack = () => {
    setActiveTab('signup');
    setError('');
  };

  console.log('🎨 Rendering AuthModal - activeTab:', activeTab, '| otpEmail:', otpEmail, '| isOpen:', isOpen);
  console.log('🔍 Conditional check: activeTab === "verify-otp"?', activeTab === 'verify-otp');

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}><span className="material-symbols-outlined">close</span></button>
        
        {/* Debug indicator - shows current state */}
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          background: activeTab === 'verify-otp' ? '#4CAF50' : '#2196F3',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: 'bold',
          zIndex: 100
        }}>
          {activeTab.toUpperCase()}
        </div>
        
        {activeTab !== 'verify-otp' && (
          <div className="auth-modal-tabs">
            <button
              className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => switchTab('signup')}
            >
              Sign Up
            </button>
          </div>
        )}

        {activeTab === 'verify-otp' ? (
          <OTPVerification 
            email={otpEmail}
            onSuccess={handleOTPSuccess}
            onBack={handleOTPBack}
            isStandalone={false}
          />
        ) : activeTab === 'login' ? (
          <div className="auth-modal-form">
            <h2>Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleLogin}>
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                  {error.includes('verify your email') && formData.email && (
                    <button
                      type="button"
                      onClick={() => {
                        setOtpEmail(formData.email);
                        setActiveTab('verify-otp');
                        setError('');
                      }}
                      style={{
                        display: 'block',
                        marginTop: '10px',
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Verify Email Now
                    </button>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="login-email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button className="social-btn google-btn">
                <span>🔍</span> Continue with Google
              </button>
              <button className="social-btn facebook-btn">
                <span>📘</span> Continue with Facebook
              </button>
            </div>
            
            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 8px 0' }}>
                Need to verify your email?
              </p>
              <button
                type="button"
                onClick={() => {
                  const email = prompt('Enter your email address:');
                  if (email && email.includes('@')) {
                    setFormData({...formData, email: email});
                    setOtpEmail(email);
                    setActiveTab('verify-otp');
                  }
                }}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  color: '#3b82f6',
                  border: '1px solid #3b82f6',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Verify Email with OTP
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-modal-form">
            <div style={{background: '#2196F3', color: 'white', padding: '8px', marginBottom: '15px', borderRadius: '8px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold'}}>
              📧 OTP VERIFICATION ENABLED - You will receive OTP via email
            </div>
            
            {/* Test button to directly open OTP screen */}
            <div style={{marginBottom: '15px', textAlign: 'center'}}>
              <button
                type="button"
                onClick={() => {
                  const testEmail = formData.email || 'test@example.com';
                  console.log('🧪 TEST: Manually triggering OTP screen with email:', testEmail);
                  setOtpEmail(testEmail);
                  setActiveTab('verify-otp');
                }}
                style={{
                  padding: '8px 16px',
                  background: '#ff9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                🧪 TEST: Open OTP Screen
              </button>
            </div>
            
            <h2>Create Account</h2>
            <p className="auth-subtitle">Sign up to get started with your property journey</p>

            <form onSubmit={handleSignup}>
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                  {error.includes('already exists') && formData.email && (
                    <div style={{ marginTop: '10px', fontSize: '14px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('login');
                          setError('');
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginRight: '8px'
                        }}
                      >
                        Go to Login
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          setLoading(true);
                          setError('');
                          const result = await resendOTP(formData.email);
                          if (result.success) {
                            setOtpEmail(formData.email);
                            setActiveTab('verify-otp');
                          } else {
                            setError(result.error);
                          }
                          setLoading(false);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500'
                        }}
                      >
                        Resend OTP to Verify
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="signup-name">Full Name</label>
                <div className="input-with-icon">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email Address</label>
                <div className="input-with-icon">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <small className="input-hint">
                  Must be 6+ characters with uppercase, lowercase, and numbers
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="signup-confirm-password">Confirm Password</label>
                <div className="input-with-icon">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="signup-confirm-password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox" required />
                  <span>I agree to the Terms & Conditions</span>
                </label>
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="social-login">
              <button className="social-btn google-btn">
                <span>🔍</span> Continue with Google
              </button>
              <button className="social-btn facebook-btn">
                <span>📘</span> Continue with Facebook
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
