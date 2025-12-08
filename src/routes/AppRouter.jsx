import React from "react";
import Home from "../features/home/Home";
import Login from "../features/auth/login/Login";
import Register from "../features/auth/register/Register";
import { Navigate, Route, Routes, useLocation } from "react-router";
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../features/auth/password/ForgotPassword";
import ResetPassword from "../features/auth/password/ResetPassword";
import Events from "../features/events/Events";
import EventDetails from "../features/events/EventDetails";
import Checkout from "../features/checkout/Checkout";
import ProfilePage from "../features/profile/ProfilePage";
import ProfileLayout from "../features/profile/ProfileLayout";
import MyTickets from "../features/profile/MyTickets";
import ContactUs from "../features/contactUs/ContactUs";
import Services from "../features/services/Services";
import Navbar from "../features/home/Navbar";
import Footer from "../features/home/Footer";
// simple placeholder dashboards
const UserDashboard = () => <div className="p-6">User Dashboard</div>;
const OrgDashboard = () => <div className="p-6">Organizer Dashboard</div>;
const AdminDashboard = () => <div className="p-6">Admin Dashboard</div>;



export default function AppRouter() {
  const location = useLocation();
  const hideLayoutRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ];

  const hideLayout =
    location.pathname.startsWith("/admin") ||
    hideLayoutRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/profile");

  return (
    <>
    {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />

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
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/checkout" element={<Checkout />} />


        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<ProfilePage />} />
          <Route path="tickets" element={<MyTickets />} />
        </Route>
      </Routes>
      {!hideLayout && <Footer/>}  
    </>
  );
}
