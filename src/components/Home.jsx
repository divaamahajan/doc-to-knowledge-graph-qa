import React from 'react';
import "../styles/home.css";

const Home = () => {
  return (
    <div className="app-container">
      {/* Enhanced Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-icon">✨</span>
            <span>Powered by Advanced AI</span>
          </div>
          <h1 className="hero-title">
            Universal <span className="gradient-text">Knowledge Graph</span> Builder
          </h1>
          <p className="hero-subtitle">
            Transform your documents into interactive knowledge graphs with AI-powered analysis, 
            intelligent Q&A capabilities, and beautiful visualizations that reveal hidden insights.
          </p>
          <div className="hero-buttons">
            <a href="#features" className="btn btn-primary hero-btn">
              <span>🚀</span>
              <span>Get Started</span>
            </a>
            <a href="#features" className="btn btn-secondary hero-btn">
              <span>📖</span>
              <span>Learn More</span>
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Documents Processed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50M+</div>
              <div className="stat-label">Connections Made</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99%</div>
              <div className="stat-label">Accuracy Rate</div>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-title">Data Analysis</div>
              <div className="card-desc">Advanced processing</div>
            </div>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🕸️</div>
            <div className="card-content">
              <div className="card-title">Graph Builder</div>
              <div className="card-desc">Interactive networks</div>
            </div>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🤖</div>
            <div className="card-content">
              <div className="card-title">AI Assistant</div>
              <div className="card-desc">Smart Q&A system</div>
            </div>
          </div>
          <div className="hero-graph-preview">
            <div className="graph-node"></div>
            <div className="graph-node"></div>
            <div className="graph-node"></div>
            <div className="graph-connection"></div>
            <div className="graph-connection"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Knowledge Management</h2>
          <p className="section-subtitle">Everything you need to understand and explore your documents</p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📁</div>
              <h3>Smart File Processing</h3>
              <p>Upload PDFs, text files, and documents. Our AI automatically extracts knowledge, creates chunks, and builds relationships between concepts and entities.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🕸️</div>
              <h3>Interactive Knowledge Graphs</h3>
              <p>Visualize connections between your documents with beautiful, interactive graphs. Explore relationships, navigate concepts, and discover hidden insights.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Q&A</h3>
              <p>Ask questions about your documents and get intelligent answers with source citations. Our AI understands context and provides evidence-based responses.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Deep Document Understanding</h3>
              <p>Go beyond simple search. Our system understands semantic relationships, extracts key concepts, and maps knowledge across your entire document collection.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-Time Processing</h3>
              <p>Fast document processing with immediate feedback. Watch your knowledge graph grow in real-time as you upload and process new documents.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3>Beautiful Visualizations</h3>
              <p>D3.js-powered interactive graphs with force-directed layouts, zoom capabilities, and intuitive node-link representations of your knowledge.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>How It Works</h2>
          <div className="workflow-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Upload Documents</h3>
              <p>Drag and drop your files in the Files tab</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>AI Processing</h3>
              <p>Our AI extracts knowledge and builds connections</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Explore & Query</h3>
              <p>Visualize graphs and ask questions in Chat</p>
            </div>
          </div>
          <p className="mt-6">Navigate through the tabs above to start building your knowledge graph.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;