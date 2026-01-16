import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import LoginAdmin from './pages/LoginAdmin'
import Register from './pages/Register'
import Subscription from './pages/Subscription'
import UserProfile from './pages/UserProfile'

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
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={
          <div className="min-h-screen bg-slate-900 text-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-cyan-400 mb-4">Page non trouvée</h1>
              <p className="text-gray-400 mb-4">La page que vous recherchez n'existe pas.</p>
              <a href="/" className="text-cyan-400 hover:underline">Retour à l'accueil</a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
