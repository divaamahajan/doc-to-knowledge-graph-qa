import React from "react";
import "../styles/home.css";

function Home() {
  // Public version of home - no authentication required
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
              <p>Your data is protected with bank-level encryption. Secure authentication and complete privacy controls.</p>
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
          <p>Navigate through the tabs above to explore different features.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;