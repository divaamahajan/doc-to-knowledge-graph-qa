import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h2>Soil Contamination Guideline API</h2>

      <p>
        A RESTful API and interactive React UI for managing environmental guideline values related to soil contamination.
      </p>

      <h3>🌱 What You Can Do</h3>
      <ul>
        <li>Manage contaminants, soil types, and exposure pathways</li>
        <li>Create, edit, and delete environmental guideline values</li>
        <li>Analyze measured values for compliance</li>
      </ul>

      <h3>🛠️ Tech Stack</h3>
      <ul>
        <li>Backend: FastAPI with SQLAlchemy ORM</li>
        <li>Database: PostgreSQL</li>
        <li>Frontend: React with Vite</li>
        <li>Containerization: Docker + Docker Compose</li>
        <li>Testing: Pytest</li>
        <li>API Docs: Swagger (FastAPI)</li>
      </ul>

      <h3>🔗 Explore</h3>
      <ul>
        <li><Link to="/analyse">Analyse Soil</Link></li>
        <li>
          <Link to="/manage">Manage Data</Link>
          <ul>
            <li><Link to="/manage/contaminants">Contaminants</Link></li>
            <li><Link to="/manage/soil-types">Soil Types</Link></li>
            <li><Link to="/manage/pathways">Pathways</Link></li>
          </ul>
        </li>
        <li><Link to="/guidelines">Guidelines</Link></li>
      </ul>

      <h3>📂 Project Repository</h3>
      <p>
        View the source code on GitHub:&nbsp;
        <a
          href="https://github.com/supriyagupta07/soil_analyzer"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/supriyagupta07/soil_analyzer
        </a>
      </p>
    </div>
  );
}

export default Home;
