import React, { useEffect, useState } from "react";

const API_BASE = "/api/manage";

export default function PathwaysPage() {
  const [pathways, setPathways] = useState([]);
  const [newPathway, setNewPathway] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/pathways`)
      .then((res) => res.json())
      .then(setPathways)
      .catch((err) => setError("Failed to fetch pathways"));
  }, []);

  const handleAdd = async () => {
    if (!newPathway.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/pathways`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newPathway }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail ?? "Failed to add pathway");
      } else {
        const data = await res.json();
        setPathways((prev) => [...prev, data]);
        setNewPathway("");
        setError("");
      }
    } catch (err) {
      setError("Failed to add pathway");
    }
  };

  const handleDelete = async (name) => {
    try {
      const res = await fetch(
        `${API_BASE}/pathways/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.detail ?? "Failed to delete pathway");
      } else {
        setPathways((prev) => prev.filter((p) => p.name !== name));
        setError("");
      }
    } catch (err) {
      setError("Failed to delete pathway");
    }
  };

  return (
    <div>
      <h2>Pathways Page</h2>
      <input
        type="text"
        placeholder="Enter new pathway name"
        value={newPathway}
        onChange={(e) => setNewPathway(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
      {error && (
        <p style={{ color: "red" }}>
          {typeof error === "string"
            ? error
            : Array.isArray(error)
            ? error.map((e, i) => <div key={i}>{e.msg}</div>)
            : JSON.stringify(error)}
        </p>
      )}
      <ul>
        {pathways.map((p) => (
          <li key={p.name}>
            {p.name}{" "}
            <button
              onClick={() => handleDelete(p.name)}
              style={{ marginLeft: "1rem" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
// This component allows users to manage pathways, including adding and deleting pathways.
