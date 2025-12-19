import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from "react-router-dom";
import { FaChartLine, FaMapMarkedAlt, FaPlusCircle, FaSearch, FaTicketAlt, FaUsers } from "react-icons/fa";

export default function Services() {
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
    
      {/* ===== OUR SERVICES SECTION ===== */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* background effects */}
        

    

        <div className="relative max-w-6xl mx-auto">
          {/* Stylish Section Title */}
          <div className="text-center mb-16 fade-in">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-wide">
              <span className="text-teal-600">Our</span> Services
            </h2>

            {/* Line under title */}
            <div className="mt-4 w-24 h-1 bg-teal-500 mx-auto rounded-full"></div>

            <p className="text-gray-600 mt-4 text-lg max-w-xl mx-auto">
              Everything you need to explore, manage and enjoy events in Egypt.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
{[
  {
    icon: FaSearch,
    title: "Browse Events",
    text: "Find events across all governorates with powerful filters.",
  },
  {
    icon: FaTicketAlt,
    title: "Book Tickets",
    text: "Instant ticket booking with secure payment integration.",
  },
  {
    icon: FaPlusCircle,
    title: "Create Events",
    text: "Publish and manage your events easily.",
  },
  {
    icon: FaMapMarkedAlt,
    title: "Governorate Search",
    text: "Search Cairo, Alex, Giza, Luxor, Aswan and more.",
  },
  {
    icon: FaUsers,
    title: "Real-Life Activities",
    text: "Gaming events, meetups, exhibitions, festivals and more.",
  },
  {
    icon: FaChartLine,
    title: "Event Analytics",
    text: "Track sales, revenue, attendance and engagement.",
  },
].map((card, i) => {
  const Icon = card.icon;
  return (
    <div
      key={i}
      className="bg-white p-8 rounded-xl shadow-lg border border-gray-200
      hover:border-teal-500/50 hover:shadow-teal-500/20 transition duration-300
      transform hover:-translate-y-1 fade-in"
    >
      <Icon className="text-teal-600 text-4xl mb-4" />
      <h3 className="text-2xl font-bold mb-3 text-gray-900">{card.title}</h3>
      <p className="text-gray-600 text-lg">{card.text}</p>
    </div>
  );
})}

          </div>
        </div>
      </section>

      {/* ===== HERO SECTION (Clean, No Images) ===== */}
      <section
        className="relative py-28 mx-45 rounded-2xl text-center text-gray-900 fade-in 
        bg-gradient-to-b from-gray-100 via-gray-100 to-gray-100 overflow-hidden"
      >
        {/* animated glow */}
        <div className="absolute inset-0">
          <div
            className="absolute w-[500px] h-[500px] rounded-full 
            opacity-10 bg-teal-500 blur-[150px] animate-pulse-slow 
            -top-20 left-1/2 -translate-x-1/2"
          ></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your Next Event in Egypt
          </h1>
          <p className="text-gray-700 text-lg md:text-xl">
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
                className="px-6 py-3 bg-gray-800 text-white 
                font-semibold rounded-xl shadow hover:bg-gray-900 transition cursor-pointer"
              >
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

    


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