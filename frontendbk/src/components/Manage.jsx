// Manage.js
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Manage() {
const navigate = useNavigate();

return (
  <div>
    <h2>Manage Page</h2>
    <p style={{ marginBottom: "16px", maxWidth: "600px" }}>
      Use the buttons below to navigate and enter data for contaminants, soil types, and pathways. Select an option to view or update the relevant data.
    </p>
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={() => navigate("/manage/contaminants")}>Contaminants</button>
      <button onClick={() => navigate("/manage/soil-types")}>Soil Types</button>
      <button onClick={() => navigate("/manage/pathways")}>Pathways</button>
    </div>
  </div>
);
}