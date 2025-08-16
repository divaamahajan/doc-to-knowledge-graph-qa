// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnalyzeForm from "./components/AnalyzeForm";
import Manage from "./components/Manage";
import Layout from "./components/Layout";
import GuidelinesTable from "./components/GuidelinesTable";
import ContaminantsPage from "./components/ContaminantsPage";
import SoilTypesPage from "./components/SoilTypesPage";
import PathwaysPage from "./components/PathwaysPage";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/analyse" element={<AnalyzeForm />} />
          <Route path="/manage" element={<Manage />} />
          <Route path="/manage/contaminants" element={<ContaminantsPage />} />
          <Route path="/manage/soil-types" element={<SoilTypesPage />} />
          <Route path="/manage/pathways" element={<PathwaysPage />} />
          <Route path="/guidelines" element={<GuidelinesTable />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
