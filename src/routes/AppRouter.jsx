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
import GuestRoute from "../components/GuestRoute";
import Messages from "../features/profile/Messages";
import NotFound from "../components/NotFound";
import Success from "../features/checkout/Success";
import StreamPage from "../features/stream/StreamPage";
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

  // Hide footer for auth pages, profile pages, admin pages, and 404 page
  const hideFooter = hideLayout || 
    !["/", "/contact", "/events"].some(route => 
      location.pathname === route || location.pathname.startsWith("/events/")
    );
    

  return (
    <>
    {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/services" element={<Services />} />
        {/* Authentication */}
        <Route path="/login" element={
          <GuestRoute>
          <Login />
          </GuestRoute>
          
          } />
        <Route path="/register" element={
          <GuestRoute>
          <Register />
          </GuestRoute>
          } />

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

        <Route path="/forgot-password" element={
          <GuestRoute>
          <ForgotPassword />
          </GuestRoute>
          } />
        <Route path="/reset-password" element={
          <GuestRoute>
          <ResetPassword />
          </GuestRoute>
          } />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
         <Route path="/checkout" element={  <ProtectedRoute>  <Checkout />  </ProtectedRoute>  }/>
         <Route path="/success" element={ <ProtectedRoute> <Success />  </ProtectedRoute> }/>
          <Route path="/stream" element={ <ProtectedRoute> <StreamPage/>  </ProtectedRoute> }/>
         <Route path="*" element={<NotFound />} />


        <Route path="/profile" element={<ProtectedRoute> <ProfileLayout /> </ProtectedRoute>}>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info" element={<ProfilePage />} />
          <Route path="tickets" element={<MyTickets />} />
          <Route path="messages" element={<Messages/>} />
          <Route path="messages/:id" element={<Messages/>} />
        </Route>
      </Routes>
      {!hideFooter && <Footer/>}  
    </>
  );
}