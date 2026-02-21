import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './OTPVerification.css';

const OTPVerification = ({ email, onSuccess, onBack, isStandalone = false }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const { verifyOTP, resendOTP } = useAuth();

  // Countdown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOTPChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) value = value[0];
    
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(''); // Clear error on input

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const pastedOtp = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pastedOtp.length; i++) {
          newOtp[i] = pastedOtp[i];
        }
        setOtp(newOtp);
        
        // Focus last filled input
        const lastIndex = Math.min(pastedOtp.length, 5);
        const lastInput = document.getElementById(`otp-input-${lastIndex}`);
        if (lastInput) lastInput.focus();
      });
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

    const result = await verifyOTP(email, otpValue);

    if (result.success) {
      setSuccess('Email verified successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } else {
      setError(result.error || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']); // Clear OTP inputs
      const firstInput = document.getElementById('otp-input-0');
      if (firstInput) firstInput.focus();
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await resendOTP(email);

    if (result.success) {
      setSuccess('OTP resent successfully! Please check your email.');
      setOtp(['', '', '', '', '', '']);
      setResendCooldown(60); // 60 seconds cooldown
      const firstInput = document.getElementById('otp-input-0');
      if (firstInput) firstInput.focus();
    } else {
      setError(result.error || 'Failed to resend OTP. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className={`otp-verification-container ${isStandalone ? 'standalone' : ''}`}>
      <div className="otp-verification-card">
        {/* Success Banner */}
        <div className="otp-success-banner">
          <div className="success-icon">✅</div>
          <h2>Check Your Email!</h2>
          <p>We've sent a verification code to</p>
          <p className="email-display">{email}</p>
        </div>

        {/* OTP Form */}
        <form onSubmit={handleVerifyOTP} className="otp-form">
          <div className="otp-header">
            <h3>Enter Verification Code</h3>
            <p className="otp-subtitle">Enter the 6-digit code from your email</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="otp-error-message">
              <span className="error-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="otp-success-message">
              <span className="success-icon">✅</span>
              <span>{success}</span>
            </div>
          )}

          {/* OTP Input Boxes */}
          <div className="otp-inputs-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOTPChange(index, e.target.value)}
                onKeyDown={(e) => handleOTPKeyDown(index, e)}
                disabled={loading}
                className="otp-input-box"
                autoComplete="off"
                autoFocus={index === 0}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="otp-verify-btn"
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Verifying...
              </>
            ) : (
              'Verify Email'
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="otp-resend-section">
            <p>Didn't receive the code?</p>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || resendCooldown > 0}
              className="otp-resend-btn"
            >
              {resendCooldown > 0 
                ? `Resend in ${resendCooldown}s` 
                : 'Resend Code'}
            </button>
          </div>

          {/* Help Text */}
          <div className="otp-help-text">
            <p>📧 Check your inbox and spam folder</p>
            <p>🕐 Code expires in 10 minutes</p>
          </div>

          {/* Back Button */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="otp-back-btn"
            >
              ← Back to Sign Up
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
