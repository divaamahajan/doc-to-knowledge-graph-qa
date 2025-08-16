import React, { useEffect, useState } from "react";
import GuidelineForm from "./GuidelineForm";

export default function GuidelinesTable() {
  const [guidelines, setGuidelines] = useState([]);
  const [editing, setEditing] = useState(null); // store guideline being edited

  const API_BASE = "/api/manage/guidelines";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch(API_BASE)
      .then((res) => res.json())
      .then(setGuidelines)
      .catch((err) => console.error("Fetch error:", err));
  };

  const handleDelete = async (guideline) => {
    const res = await fetch(API_BASE, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(guideline),
    });
    if (res.ok) fetchData();
  };

  const handleEdit = (item) => setEditing(item);

  return (
    <div>
      <h2>Guidelines</h2>
      <GuidelineForm
        onSuccess={fetchData}
        editing={editing}
        setEditing={setEditing}
      />
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Contaminant</th>
            <th style={styles.th}>Soil Type</th>
            <th style={styles.th}>Pathway</th>
            <th style={styles.th}>Value</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {guidelines.map((g) => (
            <tr key={g.id}>
              <td style={styles.td}>{g.id}</td>
              <td style={styles.td}>{g.contaminant}</td>
              <td style={styles.td}>{g.soil_type}</td>
              <td style={styles.td}>{g.pathway}</td>
              <td style={styles.td}>{g.value}</td>
              <td style={styles.td}>
                <button onClick={() => handleEdit(g)}>Edit</button>{" "}
                <button onClick={() => handleDelete(g)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  table: { borderCollapse: "collapse", width: "100%" },
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "black",
    color: "white",
  },
  td: { border: "1px solid #ccc", padding: "8px" },
};
