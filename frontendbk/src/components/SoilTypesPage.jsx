import React, { useEffect, useState } from "react";

export default function SoilTypesPage() {
  const [soilTypes, setSoilTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [error, setError] = useState("");

  const API_BASE = "/api";

  const fetchSoilTypes = async () => {
    try {
      const res = await fetch(`${API_BASE}/manage/soil-types`);
      const data = await res.json();
      setSoilTypes(data);
    } catch (err) {
      console.error("Failed to fetch soil types:", err);
      setError("Failed to fetch soil types");
    }
  };

  useEffect(() => {
    fetchSoilTypes();
  }, []);

  const handleAdd = async () => {
    if (!newType.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/manage/soil-types`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: newType }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail ?? errorData);
        console.error("Failed to add soil type:", errorData);
        return;
      }

      setNewType("");
      setError("");
      fetchSoilTypes();
    } catch (err) {
      console.error("Error adding soil type:", err);
      setError("Error adding soil type");
    }
  };

  const handleDelete = async (type) => {
    try {
      const res = await fetch(`${API_BASE}/manage/soil-types/${type}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail || "Failed to delete soil type");
        return;
      }

      setError("");
      fetchSoilTypes();
    } catch (err) {
      console.error("Error deleting soil type:", err);
      setError("Error deleting soil type. Guidelines may be in use.");
    }
  };

  return (
    <div>
      <h2>Soil Types</h2>
      <div>
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New soil type"
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <p style={{ color: "red" }}>
        {typeof error === "string"
          ? error
          : Array.isArray(error)
          ? error.map((e, i) => <div key={i}>{e.msg}</div>)
          : JSON.stringify(error)}
      </p>

      <ul>
        {soilTypes.map((soil) => (
          <li key={soil.id}>
            {soil.type}{" "}
            <button onClick={() => handleDelete(soil.type)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
