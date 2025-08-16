import React, { useState, useEffect } from "react";

export default function GuidelineForm({ onSuccess, editing, setEditing }) {
  const [form, setForm] = useState({
    contaminant: "",
    soil_type: "",
    pathway: "",
    value: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        contaminant: editing.contaminant,
        soil_type: editing.soil_type,
        pathway: editing.pathway,
        value: editing.value,
      });
    }
  }, [editing]);
  """update the corresponding form field"""
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editing ? "PUT" : "POST";
    const url = "/api/manage/guidelines";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ contaminant: "", soil_type: "", pathway: "", value: "" });
      setEditing(null);
      onSuccess();
    } else {
      const data = await res.json();
      alert(data.detail || "Failed to save guideline.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
      <input
        name="contaminant"
        placeholder="Contaminant"
        value={form.contaminant}
        onChange={handleChange}
        required
      />
      <input
        name="soil_type"
        placeholder="Soil Type"
        value={form.soil_type}
        onChange={handleChange}
        required
      />
      <input
        name="pathway"
        placeholder="Pathway"
        value={form.pathway}
        onChange={handleChange}
        required
      />
      <input
        name="value"
        type="number"
        placeholder="Value"
        value={form.value}
        onChange={handleChange}
        required
      />
      <button type="submit">{editing ? "Update" : "Create"}</button>
      {editing && <button onClick={() => setEditing(null)}>Cancel</button>}
    </form>
  );
}
