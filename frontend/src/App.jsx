import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./components/Home";
import Chat from "./components/chatbot/ChatWindow";
import QA from "./components/QAchatbot/QAChatWindow";
import Filehandler from "./components/filehandler/Filehandler";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/filehandler" element={<Filehandler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
