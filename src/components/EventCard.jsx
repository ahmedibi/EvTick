import React from "react";
import { useNavigate } from "react-router-dom";

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const formatPrice = (priceVal) => {
  if (!priceVal) return "Free";
  if (typeof priceVal === "object") {
    const prices = Object.values(priceVal).map(p => Number(p)).filter(n => !isNaN(n));
    if (prices.length === 0) return "Free";
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `${min}`;
    return `${min} - ${max}`;
  }
  return `${priceVal}`;
};

const getDateParts = (dateVal) => {
  let d;
  if (!dateVal) return { day: "--", month: "---" };
  if (dateVal.seconds) d = new Date(dateVal.seconds * 1000);
  else d = new Date(dateVal);

  if (isNaN(d.getTime())) return { day: "--", month: "---" };

  return {
    day: d.getDate(),
    month: d.toLocaleString('default', { month: 'short' }).toUpperCase()
  };
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const title = event.eventName || event.name || "Untitled Event";
  const image = event.photo || event.image || "https://via.placeholder.com/400x300?text=No+Image";
  const displayPrice = formatPrice(event.price);
  const { day, month } = getDateParts(event.date);
  const address = event.venue.name || event.location || "Online";

  return (
    <div
      onClick={() => navigate(`/events/${event.id}`)}
      className="relative h-[350px] w-[350px] rounded-[30px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 h-full w-full object-center   transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Error" }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full p-6 text-white">
        
        <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-md">
          {title}
        </h3>

        <div className="flex items-end gap-4">
          <div className="bg-[#0f9386] backdrop-blur-sm rounded-xl p-2.5 text-center min-w-[60px] text-white shadow-lg">
            <span className="block text-xs font-bold uppercase tracking-wide text-gray-950">{month}</span>
            <span className="block text-2xl font-extrabold leading-none">{day}</span>
          </div>

          <div className="flex flex-col gap-1 pb-1">
            <div className="flex items-center gap-2 text-gray-200 text-XL font-medium">
              <MapPinIcon />
              <span className="truncate max-w-[250px]">{address}</span>
            </div>
            <div className="text-[#FFF] font-bold text-lg drop-shadow-sm">
              EGP {displayPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;