
import React from "react";
import "../styles/home.css";

function Home({ user }) {
  if (user) {
    // Logged-in version of home
    return (
      <div className="home-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, {user.name}!</h1>
            <p className="welcome-subtitle">Ready to get productive? Choose from your tools below.</p>
          </div>
          <div className="user-avatar">
            {user.picture ? (
              <img src={user.picture} alt={user.name} className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">💬</div>
            <h3>AI Assistant</h3>
            <p>Chat with our intelligent AI for instant help and support</p>
            <a href="/chat" className="card-button">Open Chat</a>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">🧠</div>
            <h3>Knowledge Q&A</h3>
            <p>Ask questions about your uploaded documents using our knowledge graph</p>
            <a href="/qa" className="card-button">Ask Questions</a>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">📁</div>
            <h3>File Handler</h3>
            <p>Upload, manage and process your files with ease</p>
            <a href="/filehandler" className="card-button">Manage Files</a>
          </div>
          
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>Profile</h3>
            <p>View and manage your account settings</p>
            <a href="/profile" className="card-button">View Profile</a>
          </div>
        </div>

        <div className="stats-section">
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">AI Support</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Secure</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Possibilities</div>
          </div>
        </div>
      </div>
    );
  }

  // Public version of home
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">ProductivePro</span>
          </h1>
          <p className="hero-subtitle">
            Your all-in-one platform for AI assistance, file management, and productivity tools. 
            Get started today and transform how you work.
          </p>
          <div className="hero-buttons">
            <a href="/login" className="btn-primary">Get Started</a>
            <a href="#features" className="btn-secondary">Learn More</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">🤖</div>
            <span>AI Assistant</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">📊</div>
            <span>Analytics</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">⚡</div>
            <span>Fast & Secure</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to boost your productivity</p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>AI-Powered Assistant</h3>
              <p>Get instant answers, generate content, and solve problems with our advanced AI chatbot that understands context and provides meaningful responses.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>Smart File Management</h3>
              <p>Upload, organize, and process files effortlessly. Support for multiple formats with intelligent categorization and search capabilities.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Enterprise Security</h3>
              <p>Your data is protected with bank-level encryption. Secure authentication with Google integration and complete privacy controls.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Built for speed and efficiency. Instant responses, real-time updates, and optimized performance across all devices.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Interface</h3>
              <p>Clean, modern design that's intuitive to use. Responsive layout that works perfectly on desktop, tablet, and mobile.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔄</div>
              <h3>Seamless Integration</h3>
              <p>Connect with your favorite tools and services. API-first approach with webhooks and automation capabilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of users who are already boosting their productivity</p>
          <a href="/login" className="btn-primary-large">Sign Up Now</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
