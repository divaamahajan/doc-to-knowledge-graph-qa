const BASE_URL = "/api"; // adjust if your FastAPI runs elsewhere

export async function analyzeSoil(data) {
  console.log("Analyzing soil with data: %o", data);
  if (!data || !data.Contaminant || !data.MeasuredValue || !data.SoilType) {
    throw new Error("Invalid data provided for analysis");
  }
  if (data.Pathways && !Array.isArray(data.Pathways)) {
    throw new Error("Pathways should be an array");
  }
  if (data.Pathways && data.Pathways.length === 0) {
    throw new Error("At least one pathway must be selected");
  }
  if (isNaN(data.MeasuredValue)) {
    throw new Error("MeasuredValue must be a number");
  }
  if (data.MeasuredValue < 0) {
    throw new Error("MeasuredValue cannot be negative");
  }
  if (data.MeasuredValue > 1000000) {
    throw new Error("MeasuredValue is too high, please check your input");
  }
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function fetchContaminants() {
  const res = await fetch(`${BASE_URL}/manage/contaminants`);
  return await res.json();
}

export async function fetchSoilTypes() {
  const res = await fetch(`${BASE_URL}/manage/soil-types`);
  return await res.json();
}

export async function fetchPathways() {
  const res = await fetch(`${BASE_URL}/manage/pathways`);
  return await res.json();
}
