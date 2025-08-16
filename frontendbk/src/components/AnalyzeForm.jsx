import React, { useEffect, useState } from "react";
import {
  analyzeSoil,
  fetchContaminants,
  fetchSoilTypes,
  fetchPathways,
} from "../api";

export default function AnalyzeForm() {
  const [form, setForm] = useState({
    Contaminant: "",
    MeasuredValue: "",
    SoilType: "",
    Pathways: [],
  });

  const [contaminants, setContaminants] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [pathways, setPathways] = useState([]);
  const [result, setResult] = useState(null);


#FETCHING DROP DOWN DATA
  useEffect(() => {
    fetchContaminants().then(setContaminants);
    fetchSoilTypes().then(setSoilTypes);
    fetchPathways().then(setPathways);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, Pathways: [...form.Pathways, value] });
    } else {
      setForm({
        ...form,
        Pathways: form.Pathways.filter((p) => p !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await analyzeSoil(form);
    setResult(data);
  };

  // Simple style object for spacing form elements
  const sectionStyle = { marginBottom: "1.5rem" };
  const checkboxStyle = { marginBottom: "0.5rem", display: "block" };


  return (
    <div style={{ maxWidth: 500, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}><br />
        Soil Contamination Analysis
      </h2>

      <form onSubmit={handleSubmit}>

        <div style={sectionStyle}>
          <label htmlFor="Contaminant" style={{ display: "block", marginBottom: 6 }}>
            Contaminant:
          </label>
          <select
            id="Contaminant"
            name="Contaminant"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            value={form.Contaminant}
          >
            <option value="">Select</option>
            {contaminants.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div style={sectionStyle}>
          <label htmlFor="SoilType" style={{ display: "block", marginBottom: 6 }}>
            Soil Type:
          </label>
          <select
            id="SoilType"
            name="SoilType"
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, fontSize: 16 }}
            value={form.SoilType}
          >
            <option value="">Select</option>
            {soilTypes.map((s) => (
              <option key={s.id} value={s.type}>
                {s.type}
              </option>
            ))}
          </select>
        </div>

        <div style={sectionStyle}>
          <label htmlFor="MeasuredValue" style={{ display: "block", marginBottom: 6 }}>
            Measured Value:
          </label>
          <input
            type="number"
            id="MeasuredValue"
            name="MeasuredValue"
            value={form.MeasuredValue}
            onChange={handleChange}
            required
            step="any"
            min="0"
            style={{ width: "100%", padding: 8, fontSize: 16 }}
          />
        </div>

        <div style={sectionStyle}>
          <label style={{ display: "block", marginBottom: 6 }}>
            Pathways:
          </label>
          <div>
            {pathways.map((p) => (
              <label key={p.id} style={checkboxStyle}>
                <input
                  type="checkbox"
                  value={p.name}
                  checked={form.Pathways.includes(p.name)}
                  onChange={handleCheckbox}
                />
                {" "}{p.name}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            fontSize: 18,
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: 4,
          }}
        >
          Analyze
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "2rem", padding: 16, border: "1px solid #ddd", borderRadius: 6 }}>
          <h3>Result</h3>
          <p>
            <strong>Compliant:</strong> {result.IsCompliant ? "Yes" : "No"}
          </p>
          <p>
            <strong>Guideline Value:</strong> {result.GuidelineValue}
          </p>
          <p>
            <strong>Exceeding Pathways:</strong>
          </p>
          <ul>
            {result.ExceedingPathways.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
