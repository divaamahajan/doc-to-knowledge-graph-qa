import React, { useEffect, useState } from "react";

export default function ContaminantsPage() {
  const [contaminants, setContaminants] = useState([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "/api";

  // Fetch contaminants from backend
  const fetchContaminants = async () => {
    try {
      const response = await fetch(`${API_BASE}/manage/contaminants`);
      const data = await response.json();
      setContaminants(data);
    } catch (err) {
      console.error("Failed to fetch contaminants:", err);
      setError("Failed to fetch contaminants");
    }
  };

  useEffect(() => {
    fetchContaminants();
  }, []);

  // Create a new contaminant
  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/manage/contaminants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to add contaminant");
        return;
      }

      setNewName("");
      setError("");
      fetchContaminants();
    } catch (err) {
      console.error("Error adding contaminant:", err);
      setError("Error adding contaminant");
    }
  };

  // Delete a contaminant
  const handleDelete = async (name) => {
    try {
      const response = await fetch(`${API_BASE}/manage/contaminants/${name}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to delete contaminant");
        return;
      }

      setError("");
      fetchContaminants();
    } catch (err) {
      console.error("Error deleting contaminant:", err);
      setError("Error deleting contaminant");
    }
  };

  return (
    <div>
      <h2>Contaminants</h2>
      <div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New contaminant name"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {contaminants.map((item) => (
          <li key={item.id}>
            {item.name}{" "}
            <button onClick={() => handleDelete(item.name)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
// This component allows users to manage contaminants by adding new ones and deleting existing ones.
// It fetches the list of contaminants from the backend, displays them, and provides functionality to add or delete contaminants.
// The API_BASE variable is used to construct the URL for API requests.
