import React from "react";
import { useNavigate, Outlet } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  return (
    <div>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "#4a90e2",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 2rem",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          color: "#fff",
          fontWeight: "600",
        }}
      >
        <h2
          style={{ cursor: "pointer", margin: 0 }}
          onClick={() => navigate("/")}
          title="Go to Home"
        >
          Soil Analyzer
        </h2>

        <nav style={{ display: "flex", gap: "1rem" }}>
          {[
            { label: "Home", path: "/" },
            { label: "Analyse", path: "/analyse" },
            { label: "Manage", path: "/manage" },
            { label: "Guidelines", path: "/guidelines" },
          ].map(({ label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              style={{
                backgroundColor: "transparent",
                border: "2px solid #fff",
                borderRadius: "5px",
                color: "#fff",
                padding: "0.4rem 1rem",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "background-color 0.3s, color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.color = "#4a90e2";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#fff";
              }}
              aria-label={`Navigate to ${label}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main style={{ paddingTop: "80px", padding: "2rem", minHeight: "calc(100vh - 80px)" }}>
        <Outlet />
      </main>
    </div>
  );
}
