import React from 'react';
import img3 from "../../assets/img3.jpg";
import { FiHelpCircle } from "react-icons/fi";
import { Link, NavLink } from 'react-router';
import Logo from '../../assets/EvTick_Logo.png';

export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black pt-16 pb-10">

            {/* ==== TOP SECTION (Banner) ==== */}
            <div className="max-w-7xl mx-auto mb-16 px-4">
                <div className="w-full h-[300px] sm:h-[350px] md:h-[200px] rounded-3xl relative overflow-hidden">

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 z-[1]"></div>

                    {/* Light Bottom Fade */}
                    <div className="absolute bottom-0 left-0 w-full h-20 
               bg-gradient-to-t from-white via-white/40 to-transparent z-[2]"></div>

                    <img
                        src={img3}
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        alt="Wedding scene"
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-[3]">
                        <h2
                            className="text-[1.5rem] sm:text-[2rem] md:text-5xl mb-4 tracking-wide italic font-serif leading-tight text-white"
                            style={{ fontFamily: "Georgia, serif" }}
                        >
                            In love with what you're seeing?
                        </h2>

                        <div className="w-32 sm:w-60 h-px bg-black mb-3"></div>

                        <button className="text-xl sm:text-[2rem] italic font-serif text-white hover:opacity-70 transition font-bold">
                            let's connect
                        </button>
                    </div>
                </div>
            </div>

            {/* ==== BOTTOM FOOTER CONTENT ==== */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left items-center md:items-start">

                    {/* Column 1 — Logo */}
                    <div className="flex justify-center md:justify-start">
                        <img src={Logo} alt="EvTeck Logo" className="w-32 sm:w-40" />
                    </div>

                    {/* Column 2 — Links */}
                    <div className="flex flex-col gap-3 text-base sm:text-lg items-center md:items-start lg:mx-auto text-black">
                        <NavLink to="/" className="hover:text-gray-500">Home</NavLink>
                        <NavLink to="/services" className="hover:text-gray-500">Services</NavLink>
                        <NavLink to="/events" className="hover:text-gray-500">Events</NavLink>
                    </div>

                    {/* Column 3 — Button */}
                    <div className="flex justify-center md:justify-end">
                        <Link
                            to="/contact"
                            className="
                flex items-center gap-2 sm:gap-3 
                mt-4 md:mt-10
                bg-black/5
                backdrop-blur-sm 
                rounded-full 
                px-5 sm:px-10 
                py-3 sm:py-4 
                text-sm sm:text-lg 
                border border-gray-400  
                text-black
                hover:bg-black  
                hover:text-white 
                transition-all duration-300
              "
                        >
                            <FiHelpCircle size={20} className="text-green-700" />
                            <span className="whitespace-nowrap">
                                Need some help? Contact us
                            </span>
                        </Link>
                    </div>

                </div>
            </div>

            <div className="w-full py-8 mt-5 text-center text-gray-600">
                © 2025 EvTick. All rights reserved.
            </div>
        </footer>
    );
}
