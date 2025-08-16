
import React from 'react';
import GoogleLoginButton from './GoogleLoginButton';
import '../../styles/login.css'; 

function LoginView({ onLoginSuccess }) {
  return (
    <div className="login-container">
      {/* Background elements */}
      <div className="login-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
      </div>

      {/* Main login card */}
      <div className="login-card">
        {/* Header section */}
        <div className="login-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="12" fill="url(#gradient1)"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#667eea"/>
                    <stop offset="1" stopColor="#764ba2"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="app-title">Welcome Back</h1>
          </div>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        {/* Login content */}
        <div className="login-content">
          <div className="login-form">
            <GoogleLoginButton onLoginSuccess={onLoginSuccess} />
            
            {/* Divider */}
            <div className="divider">
              <span className="divider-text">Secure authentication</span>
            </div>

            {/* Features list */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <span>Secure OAuth2 authentication</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Lightning fast access</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🛡️</div>
                <span>Privacy protected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p className="footer-text">
            By signing in, you agree to our <a href="#" className="footer-link">Terms of Service</a> and <a href="#" className="footer-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
