import React, { useState } from "react";
import { Link } from "react-router-dom";
import EvTick from "../../assets/EvTick_Logo.png";
import LogOutNav from "../../components/LogOutNav.jsx";
import NotificationDropdown from "../../components/NotificationDropdown.jsx";
import { User2Icon, UserCircle } from "lucide-react";


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));


    return (
        <nav className="fixed w-full z-50 ">
            <div className="max-w-8xl mx-10 my-6 bg-teal-500 border shadow-lg rounded-4xl px-4">
                <div className="flex items-center justify-between h-15">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img className="text-2xl sm:text-3xl w-30 tracking-tight" src={EvTick} alt="EvTick Logo" />


                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                        <Link
                            to="/"
                            className="text-black text-lg hover:text-gray-100 transition-colors duration-200  font-medium">
                            Home
                        </Link>

                        <Link
                            to="/services"
                            className="text-black text-lg hover:text-gray-100 transition-colors duration-200 font-medium">
                            Services
                        </Link>

                        <Link
                            to="/events"
                            className="text-black text-lg hover:text-gray-100 transition-colors duration-200  font-medium">
                            Events
                        </Link>

                        <Link
                            to="/contact"
                            className="text-black text-lg hover:text-gray-100 transition-colors duration-200 font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* Right Side  */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {user ? (
                            <>


                              <div className="p-2 rounded-full hover:bg-gray-200  transition-colors duration-200">
                                  <NotificationDropdown />
                              </div>

                                {/* Profile Icon */}
                                <Link
                                    className="p-2 rounded-full hover:bg-gray-200  transition-colors duration-200"
                                    aria-label="Profile"
                                    to="/profile"
                                >
                                  <UserCircle className="text-black"/>
                                </Link>

                                {/* Logout Icon */}
                                <LogOutNav />
                            </>
                        ) : (
                            <>
                                {/* login icon */}
                                <Link
                                    to="/login"
                                    aria-label="Login"
                                    className="p-2 rounded-full bg-teal-500 hover:bg-teal-600 transition-colors duration-200"
                                >
                                    <svg
                                        fill="none"
                                        stroke="white"
                                        strokeWidth={2}
                                        className="w-6 h-6"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5m5 5H3"
                                        />
                                    </svg>
                                </Link>
                            </>
                        )}
                    </div>



                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-black hover:bg-teal-500
                            hover:text-white transition-colors duration-200"
                            aria-label="Toggle menu">
                            {isMenuOpen ? (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
             {isMenuOpen && (
                <div className="lg:hidden bg-teal-500 border-t border-teal-600 mx-10 rounded-3xl">
                    <div className="px-4 pt-2 pb-4 space-y-1 text-center">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-teal-600 transition-colors duration-200">
                            Home
                        </Link>

                        <Link
                            to="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-teal-600 transition-colors duration-200">
                            Services
                        </Link>

                        <Link
                            to="/events"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-teal-600 transition-colors duration-200">
                            Events
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-white hover:bg-teal-600 transition-colors duration-200">
                            Contact
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center justify-center space-x-4 px-3 pt-4 border-t border-teal-400 mt-4">

                        <div className="p-2 rounded-full bg-white hover:bg-gray-200  transition-colors duration-200">
                                  <NotificationDropdown />
                              </div>
                            <Link
                                className="p-2 rounded-full hover:bg-teal-600 transition-colors duration-200 bg-white"
                                aria-label="Profile" to="/profile">
                                <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <button
                                className="p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200 bg-white"
                                aria-label="Logout" to>
                                <svg
                                    className="w-6 h-6 text-red-600 hover:text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}