import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import {
  FaUser,
  FaClipboardList,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaFacebookMessenger,
  FaTicketAlt,
} from "react-icons/fa";
import { auth } from "../../firebase/firebase.config.js"; 
import LogoutButton from "../../components/LogoutButton.jsx";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // لو المستخدم موجود
        setUser({
          name: firebaseUser.displayName,
          email: firebaseUser.email,
          avatar: firebaseUser.photoURL,
        });
      } else {
        // لو مفيش مستخدم
        navigate("/login");
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-neutral-100">
      {/* Mobile Header with Toggle */}
      <div className="md:hidden bg-neutral-900 p-4 flex items-center justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="text-white z-50">
          <FaBars size={22} />
        </button>
        <h2 className="text-white font-semibold">Profile</h2>
        <div className="w-6"></div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:relative
          top-0 left-0
          z-50
          bg-neutral-900
          text-white
          transition-transform duration-300
          flex flex-col
          shadow-xl
          ${isOpen ? "translate-y-0" : "-translate-y-full"}
          w-full
          max-h-[85vh]
          overflow-y-auto
          md:translate-y-0
          md:w-72
          md:h-full
          md:max-h-full
          p-5
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white hover:text-red-400 transition-colors"
        >
          <FaTimes size={24} />
        </button>

        {/* User Info */}
        <div className="flex flex-col items-center text-center mt-4 md:mt-0">
          <img
            src={
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-white shadow-md"
          />
          <h3 className="mt-3 text-lg font-semibold">{user?.name}</h3>
          <p className="text-sm text-gray-200">{user?.email}</p>
        </div>

        {/* Links */}
        <ul className="mt-6 space-y-3">
          <NavLink
            to="/profile/info"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "hover:bg-teal-300 hover:text-black"
              }`
            }
          >
            <FaUser />
            <span>Update account</span>
          </NavLink>
          <NavLink
            to="/profile/tickets"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "hover:bg-teal-300 hover:text-black"
              }`
            }
          >
            <FaTicketAlt />
            <span>My Tickets</span>
          </NavLink>
          <NavLink
            to="/profile/messages"
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded transition-colors ${
                isActive
                  ? "bg-teal-600 text-white"
                  : "hover:bg-teal-300 hover:text-black"
              }`
            }
          >
            <FaFacebookMessenger />
            <span>My Messages</span>
          </NavLink>
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded hover:bg-teal-300 hover:text-black transition-colors"
          >
            <FaHome />
            <span>Back to Home</span>
          </NavLink>
        </ul>

        {/* Logout */}
        <div className="mt-auto pt-4">
          <LogoutButton />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white md:bg-neutral-100 p-4 md:p-6">
        <Outlet />
      </div>
    </div>
  );
}
