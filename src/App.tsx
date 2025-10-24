import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Layout/Header';
import { Toaster } from "react-hot-toast";

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import VoiceGenrator from './pages/VoiceGenrator';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();

  const urls = [
    "https://ai-tools-api-klod.onrender.com",
    "https://left-right-api.onrender.com",
    "https://leadgen-api-58tl.onrender.com",
    // "https://emp-prod-apis.onrender.com",
    // "https://telegrambot-qkrd.onrender.com",
    "https://emphasisetech-api.onrender.com",
    "https://lic-agent-api.onrender.com",
    "https://e-tech-center-api.onrender.com",
    "https://crypto-api-nnvd.onrender.com"
  ]
  useEffect(() => {
    // const urls = JSON.parse(import.meta.env.VITE_URLS || "[]");
    if (!urls || urls.length === 0) {
      console.error("No URLs found in environment variable VITE_URLS");
    } else {
      const restartCalls = urls?.map((baseUrl: string) => {
        const fullUrl = `${baseUrl}/restart`;
        return fetch(fullUrl)
          .then((res) => {
            console.log(`✅ Pinged: ${fullUrl}`, res.status);
            return res;
          })
          .catch((err) => {
            console.error(`❌ Failed to ping: ${fullUrl}`, err);
            return null;
          });
      });

      let data = Promise.all(restartCalls)
    }
  }, []);
  
  return (
    <Router>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-gray-900">
        {user && <Header />}
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

          {/* Public Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
           <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
       
          {/* Protected Routes */}
           <Route path="/voice-genrator" element={
            <ProtectedRoute>
              <VoiceGenrator />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
           <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } /> 
         </Routes>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;