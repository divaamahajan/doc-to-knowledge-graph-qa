
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoutClick = () => {
    onLogout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <Link to="/home" style={styles.brandLink}>
            <span style={styles.brandIcon}>⚡</span>
            ProductivePro
          </Link>
        </div>

        <div style={styles.navLinks}>
          <Link 
            to="/home" 
            style={{
              ...styles.navLink,
              ...(isActive('/home') ? styles.activeLink : {})
            }}
          >
            Home
          </Link>
          
          <Link 
            to="/chat" 
            style={{
              ...styles.navLink,
              ...(isActive('/chat') ? styles.activeLink : {})
            }}
          >
            Chat
          </Link>
          
          <Link 
            to="/qa" 
            style={{
              ...styles.navLink,
              ...(isActive('/qa') ? styles.activeLink : {})
            }}
          >
            Q&A
          </Link>
          
          <Link 
            to="/filehandler" 
            style={{
              ...styles.navLink,
              ...(isActive('/filehandler') ? styles.activeLink : {})
            }}
          >
            Files
          </Link>

          {user && (
            <Link 
              to="/profile" 
              style={{
                ...styles.navLink,
                ...(isActive('/profile') ? styles.activeLink : {})
              }}
            >
              Profile
            </Link>
          )}
        </div>

        <div style={styles.authSection}>
          {!user ? (
            <Link to="/login" style={styles.loginButton}>
              Sign In
            </Link>
          ) : (
            <div style={styles.userSection}>
              <div style={styles.userInfo}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={styles.userAvatar} />
                ) : (
                  <div style={styles.avatarPlaceholder}>
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span style={styles.userName}>{user.name}</span>
              </div>
              <button onClick={handleLogoutClick} style={styles.logoutButton}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 5%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    color: '#1a202c',
    fontSize: '1.5rem',
    fontWeight: '700',
    transition: 'color 0.2s ease',
  },
  brandIcon: {
    fontSize: '1.75rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  navLink: {
    color: '#4a5568',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.95rem',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  activeLink: {
    color: '#667eea',
    background: 'rgba(102, 126, 234, 0.1)',
  },
  authSection: {
    display: 'flex',
    alignItems: 'center',
  },
  loginButton: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '0.625rem 1.5rem',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e2e8f0',
  },
  avatarPlaceholder: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  userName: {
    color: '#2d3748',
    fontWeight: '500',
    fontSize: '0.9rem',
  },
  logoutButton: {
    background: 'transparent',
    border: '1px solid #e2e8f0',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    color: '#4a5568',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '0.875rem',
    transition: 'all 0.2s ease',
  },
};

// Add hover effects
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    nav a:hover {
      color: #667eea !important;
      background: rgba(102, 126, 234, 0.05) !important;
    }
    
    nav button:hover {
      background: #f7fafc !important;
      border-color: #cbd5e0 !important;
    }
    
    .login-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3) !important;
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Navbar;
