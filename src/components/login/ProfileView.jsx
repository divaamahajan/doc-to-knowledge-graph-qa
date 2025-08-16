
import React from 'react';
import '../../styles/login.css';

function ProfileView({ user }) {
  return (
    <div className="profile-container">
      <div className="profile-background">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="avatar-image" />
            ) : (
              <div className="avatar-placeholder">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">Welcome back, {user.name}!</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-icon">👤</div>
            <div className="stat-content">
              <span className="stat-label">Account Status</span>
              <span className="stat-value">Active</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">🔐</div>
            <div className="stat-content">
              <span className="stat-label">Security</span>
              <span className="stat-value">Protected</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <span className="stat-label">Quick Access</span>
              <span className="stat-value">Enabled</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-button primary">
            <span>Continue to Dashboard</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
