import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import LoginAdmin from './pages/LoginAdmin'
import Register from './pages/Register'
import Subscription from './pages/Subscription'

import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'

// Placeholder for protected route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    if (adminOnly) {
      return <Navigate to="/admin/login" />;
    }
    return <Navigate to="/login" />;
  }
  // Simple admin check (mock logic: replace with claims or specific email check)
  if (adminOnly && currentUser.email !== 'admin@phoenixtrade.com') {
    // For demo purposes, we will allow anyone to access admin if they type the URL, 
    // but in prod this should redirect.
    // return <Navigate to="/dashboard" />;
    console.warn("Non-admin accessing admin route for demo");
  }
  return children;
};

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subscription"
          element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  )
}

export default App
