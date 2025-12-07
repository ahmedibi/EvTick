import React, { useState } from "react";
import { Link } from "react-router-dom";
import EvTick from "../../assets/EvTick_Logo.png";


export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50">
            <div className="max-w-8xl mx-5 my-6 bg-transparent border shadow-lg rounded-4xl px-4">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img className="text-2xl sm:text-3xl w-30 tracking-tight" src={EvTick} alt="EvTick Logo" />


                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                        <Link
                            to="/"
                            className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium">
                            Home
                        </Link>

                        <Link
                            to="/services"
                            className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium">
                            Services
                        </Link>

                        <Link
                            to="/events"
                            className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium">
                            Events
                        </Link>

                        <Link
                            to="/contact"
                            className="text-white hover:text-gray-300 transition-colors duration-200 text-base font-medium">
                            Contact
                        </Link>
                    </div>

                    {/* Right Side  */}
                    <div className="hidden lg:flex items-center space-x-4">

                        {/* Profile Icon */}
                        <Link
                            className="p-2 rounded-full hover:bg-gray-300 transition-colors duration-200"
                            aria-label="Profile" to="/profile">
                            <svg
                                className="w-6 h-6 text-white hover:text-black"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </Link>

                        {/* Logout Icon */}
                        <button
                            className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                            aria-label="Logout">
                            <svg
                                className="w-6 h-6 text-red-500"
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


                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md text-white hover:bg-gray-600 transition-colors duration-200"
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
                <div className="lg:hidden bg-white border-t border-gray-200">
                    <div className="px-4 pt-2 pb-4 space-y-1">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                            Home
                        </Link>

                        <Link
                            to="/services"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                            Services
                        </Link>

                        <Link
                            to="/events"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                            Events
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-black transition-colors duration-200">
                            Contact
                        </Link>

                        {/* Mobile Actions */}
                        <div className="flex items-center space-x-4 px-3 pt-4 border-t border-gray-200 mt-4">

                            <Link
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                aria-label="Profile" to="/profile">
                                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <button
                                className="p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                aria-label="Logout" to>
                                <svg
                                    className="w-6 h-6 text-red-600"
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