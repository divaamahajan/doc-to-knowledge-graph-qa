import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./components/Home";
import Chat from "./components/chatbot/ChatWindow";
import QA from "./components/QAchatbot/QAChatWindow";
import Filehandler from "./components/filehandler/Filehandler";
import URLHandler from "./components/urlhandler/URLHandler";

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/qa" element={<QA />} />
        <Route path="/filehandler" element={<Filehandler />} />
        <Route path="/urlhandler" element={<URLHandler />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
