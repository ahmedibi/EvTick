import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTicketAlt,
  faPlusCircle,
  faMapMarkedAlt,
  faUsers,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200">
      {/* Navbar */}
      <nav className="bg-[#111] shadow-sm sticky top-0 z-20 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-400">EvTick</h1>
          <ul className="hidden md:flex gap-8 font-medium">
            <li>
              <a href="/" className="hover:text-teal-400">
                Home
              </a>
            </li>
            <li>
              <a href="/events" className="hover:text-teal-400">
                Events
              </a>
            </li>
            <li>
              <a href="/create" className="hover:text-teal-400">
                Create Event
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-teal-400">
                Contact
              </a>
            </li>
          </ul>
          <button className="md:hidden text-teal-400 text-2xl">☰</button>
        </div>
      </nav>

      {/* ===== OUR SERVICES SECTION ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0d0d0d]"></div>

        {/* Glow Orbs */}
        <div className="absolute w-[400px] h-[400px] bg-teal-500/10 blur-[150px] rounded-full -top-10 -left-10"></div>
        <div className="absolute w-[350px] h-[350px] bg-purple-500/10 blur-[150px] rounded-full bottom-0 right-0"></div>

        <div className="relative max-w-6xl mx-auto">
          {/* Stylish Section Title */}
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
              <span className="text-teal-400">Our</span> Services
            </h2>

            {/* Line under title */}
            <div className="mt-4 w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>

            <p className="text-gray-400 mt-4 text-lg max-w-xl mx-auto">
              Everything you need to explore, manage and enjoy events in Egypt.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: faSearch,
                title: "Browse Events",
                text: "Find events across all governorates with powerful filters.",
              },
              {
                icon: faTicketAlt,
                title: "Book Tickets",
                text: "Instant ticket booking with secure payment integration.",
              },
              {
                icon: faPlusCircle,
                title: "Create Events",
                text: "Publish and manage your events easily.",
              },
              {
                icon: faMapMarkedAlt,
                title: "Governorate Search",
                text: "Search Cairo, Alex, Giza, Luxor, Aswan and more.",
              },
              {
                icon: faUsers,
                title: "Real-Life Activities",
                text: "Gaming events, meetups, exhibitions, festivals and more.",
              },
              {
                icon: faChartLine,
                title: "Event Analytics",
                text: "Track sales, revenue, attendance and engagement.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#161616] p-8 rounded-xl shadow-xl border border-gray-800
                hover:border-teal-500/50 hover:shadow-teal-500/10 transition duration-300
                transform hover:-translate-y-1 fade-in"
              >
                <FontAwesomeIcon
                  icon={card.icon}
                  className="text-teal-400 text-4xl mb-4"
                />
                <h3 className="text-2xl font-bold mb-3 text-teal-300">
                  {card.title}
                </h3>
                <p className="text-gray-400 text-lg">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HERO SECTION (Clean, No Images) ===== */}
      <section
        className="relative py-28 text-center text-white fade-in 
        bg-gradient-to-b from-[#151515] via-[#111] to-[#0d0d0d] overflow-hidden"
      >
        {/* animated glow */}
        <div className="absolute inset-0">
          <div
            className="absolute w-[500px] h-[500px] rounded-full 
            opacity-20 bg-teal-500 blur-[150px] animate-pulse-slow 
            -top-20 left-1/2 -translate-x-1/2"
          ></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Event in Egypt
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Concerts, festivals, gaming tournaments, workshops and more.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Link to="/events">
              <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl shadow hover:bg-teal-600 transition cursor-pointer">
                Explore Events
              </button>
            </Link>

            <Link to="/contact">
              <button
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white 
                font-semibold rounded-xl shadow hover:bg-white/20 transition cursor-pointer"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Paragraph */}
      <section className="max-w-4xl mx-auto px-6 py-12 text-center fade-in">
        <p className="text-gray-400 text-lg">
          EvTick brings every event across Egypt into one modern platform —
          simple for guests, powerful for organizers.
        </p>
      </section>

      {/* Footer */}
      <footer className="bg-[#111] text-gray-300 py-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <p>© 2025 EvTick. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-400">
              Terms
            </a>
            <a href="#" className="hover:text-teal-400">
              Privacy
            </a>
            <a href="#" className="hover:text-teal-400">
              Support
            </a>
          </div>
        </div>
      </footer>

      {/* slow glow animation */}
      <style>
        {`
          @keyframes pulse-slow {
            0% { opacity: .2; transform: scale(1); }
            50% { opacity: .35; transform: scale(1.1); }
            100% { opacity: .2; transform: scale(1); }
          }
          .animate-pulse-slow {
            animation: pulse-slow 6s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
