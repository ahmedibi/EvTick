import React from "react";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/events/${ticket.id}`)}
      className="bg-white rounded-2xl p-4 flex flex-col gap-4 cursor-pointer relative
                 hover:scale-[1.01] hover:shadow-lg transition-all duration-300"
    >
      {/* TOP ROW */}
      <div className="flex gap-4">
        {/* Event Image */}
        <img
          src={ticket.photo}
          alt="event"
          className="w-20 h-20 rounded-xl object-cover border border-white/10"
        />

          {/* Count Badge */}
        {ticket.count > 1 && (
          <div className="absolute top-4 left-4 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
            x{ticket.count}
          </div>
        )}

      
        {/* Title & Description */}
        <div className="flex flex-col justify-center flex-1">
          <h2 className="text-lg font-semibold leading-tight text-black">
            {ticket.eventName}
          </h2>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {ticket.venue?.name || ticket.address ||"Unknown Location"}
          </p>
        </div>

        {/* Icon */}
        <div className="flex items-center">
          <ArrowUpRight className="text-gray-500 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* DOTTED LINE */}
<svg className="w-full" height="1">
  <line 
    x1="0" 
    y1="0" 
    x2="100%" 
    y2="0" 
    stroke="#6b7280" 
    strokeWidth="1" 
    strokeDasharray="10 15"
  />
</svg>
      {/* BOTTOM ROW */}
      <div className="flex justify-between px-1">
        <div>
          <p className="text-gray-500 text-sm">Time</p>
          <p className="font-semibold text-gray-500  ">
            {ticket.time || "10:00 PM"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Location</p>
          <p className="font-semibold text-gray-500 ">
            {ticket.venue?.address.split(" ").slice(0, 6).join(" ") || ticket.address}
          </p>
        </div>
      </div>
    </div>
  );
}
