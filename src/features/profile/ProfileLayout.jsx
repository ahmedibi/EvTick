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
} from "react-icons/fa";

export default function ProfileLayout() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const initialUser = JSON.parse(localStorage.getItem("user") || "null");
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (!initialUser) {
      navigate("/login");
    }
  }, [initialUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-72" : "w-20"
        }  text-white duration-300 p-5 flex flex-col shadow-xl`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white mb-5"
        >
          {isOpen ? <FaTimes size={22} /> : <FaBars size={22} className="ms-2"/>}
        </button>

        {/* User Info */}
        {isOpen && (
          <div className="flex flex-col items-center text-center">
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
        )}

        {/* Links */}
        <ul className="mt-6 space-y-3">
          <NavLink
            to="/profile/info"
            className="flex items-center gap-3 p-3 rounded focus:bg-teal-300 focus:text-black  hover:bg-teal-300 hover:text-black"
          >
            <FaUser /> {isOpen && "Update account"}
          </NavLink>

          <NavLink
            to="/profile/messages"
            className="flex items-center gap-3 p-3 rounded focus:bg-teal-300  hover:bg-teal-300 hover:text-black"
          >
            <FaFacebookMessenger /> {isOpen && "My Messages"}
          </NavLink>

          <NavLink
            to="/profile/orders"
            className="flex items-center gap-3 p-3 rounded  focus:bg-teal-300  hover:bg-teal-300 hover:text-black"
          >
            <FaClipboardList /> {isOpen && "Orders"}
          </NavLink>

          <NavLink
            to="/"
            className="flex items-center gap-3 p-3 rounded  focus:bg-teal-300  hover:bg-teal-300 hover:text-black"
          >
            <FaHome /> {isOpen && "Back to Home"}
          </NavLink>
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-auto bg-teal-600 py-2 rounded hover:bg-teal-700 flex justify-center items-center gap-2"
        >
          <FaSignOutAlt /> {isOpen && "Logout"}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 ">
        <Outlet />
      </div>
    </div>
  );
}
