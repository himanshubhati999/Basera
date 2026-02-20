import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login'); // 'login', 'signup', or 'verify-otp'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpEmail, setOtpEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { login, signup, verifyOTP, resendOTP } = useAuth();

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
    setSuccess('');

    if (!validateSignupForm()) {
      return;
    }

    setLoading(true);

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      setOtpEmail(formData.email);
      setActiveTab('verify-otp');
      setSuccess('OTP sent to your email! Please check your inbox and enter the code.');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setLoading(true);

    const result = await verifyOTP(otpEmail, otpValue);

    if (result.success) {
      setSuccess('Email verified successfully!');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await resendOTP(otpEmail);

    if (result.success) {
      setSuccess('OTP resent successfully! Please check your email.');
      setOtp(['', '', '', '', '', '']);
    } else {
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
    setOtp(['', '', '', '', '', '']);
    setOtpEmail('');
    setError('');
    setSuccess('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setActiveTab('login');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
  };

  console.log('Rendering AuthModal with activeTab:', activeTab, 'otpEmail:', otpEmail);

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleClose}><span className="material-symbols-outlined">close</span></button>
        
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
          <div className="auth-modal-form">
            <div style={{background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', color: 'white', padding: '20px', marginBottom: '20px', borderRadius: '12px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'}}>
              🎉 OTP VERIFICATION SCREEN ACTIVE! 🎉
            </div>
            <h2>Verify Your Email</h2>
            <p className="auth-subtitle">Enter the 6-digit OTP sent to <strong>{otpEmail}</strong></p>

            <form onSubmit={handleVerifyOTP}>
              {error && (
                <div className="error-message">
                  <span>⚠️</span> {error}
                </div>
              )}

              {success && (
                <div className="success-message">
                  <span>✅</span> {success}
                </div>
              )}

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    disabled={loading}
                    className="otp-input"
                    autoComplete="off"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="resend-otp">
                <p>Didn't receive the code?</p>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="resend-btn"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="back-btn"
              >
                ← Back to Sign Up
              </button>
            </form>
          </div>
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
                        setSuccess('Enter the OTP sent to your email');
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
                    setSuccess('Enter your OTP or click Resend OTP');
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
                            setSuccess('New OTP sent to your email!');
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
