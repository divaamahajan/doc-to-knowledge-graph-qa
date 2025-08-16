import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import Home from "./components/Home";
import Chat from "./components/chatbot/ChatWindow";
import QA from "./components/QAchatbot/QAChatWindow";
import Filehandler from "./components/filehandler/Filehandler";
import LoginView from './components/login/LoginView';
import ProfileView from './components/login/ProfileView';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLoginSuccess = (data) => {
    setUser(data.user);
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/home" element={<Home user={user} />} />

        <Route
          path="/login"
          element={!user ? <LoginView onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/home" replace />}
        />

        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/qa" element={<QA user={user} token={localStorage.getItem("token")} />} />
        <Route path="/filehandler" element={<Filehandler user={user} token={localStorage.getItem("token")} />} />

        <Route
          path="/profile"
          element={user ? <ProfileView user={user} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
