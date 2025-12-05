import React from 'react'
import Home from '../features/home/Home'
import Login from "../features/auth/login/Login";
import Register from "../features/auth/register/Register";
import { Route, Routes } from 'react-router'
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../features/auth/password/ForgotPassword";
import ResetPassword from "../features/auth/password/ResetPassword";
import Events from '../features/events/Events';



// simple placeholder dashboards
const UserDashboard = () => <div className="p-6">User Dashboard</div>;
const OrgDashboard = () => <div className="p-6">Organizer Dashboard</div>;
const AdminDashboard = () => <div className="p-6">Admin Dashboard</div>;

export default function AppRouter() {
  return (
    <>
    
     <Routes>
      <Route path="/" element={<Home />} />
      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* protected Role-based dashboards */}
       <Route
        path="/user"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/organizer"
        element={
          <ProtectedRoute requiredRole="organizer">
            <OrgDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/events" element={<Events/>} />
     </Routes>
    
    </>
  )
}
