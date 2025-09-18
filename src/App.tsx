import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/Auth/LoginPage';
import AdminLayout from './components/Layout/AdminLayout';
import Dashboard from './components/Admin/Dashboard';
import Sales from './components/Admin/Sales';
import Attendance from './components/Admin/Attendance';
import Cashflow from './components/Admin/Cashflow';
import StaffDashboard from './components/Staff/StaffDashboard';

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* Staff Routes */}
      {user?.role === 'staff' && (
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
      )}

      {/* Admin/Manager Routes */}
      {(user?.role === 'manager' || user?.role === 'administrasi') && (
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['manager', 'administrasi']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sales" element={<Sales />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="cashflow" element={<Cashflow />} />
          {/* Add more admin routes here */}
        </Route>
      )}

      {/* Default redirect based on role */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;