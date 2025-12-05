import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchEventTypes, fetchAllEvents } from "../../redux/slices/eventSlice";

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// --- Icons ---
const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  MapPin: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  FilterIcon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

const goldenStyle = "bg-gradient-to-r from-[#FFC107] to-[#FF9800] text-gray-900  rounded-2xl px-4 py-1 shadow-sm hover:brightness-105 transition-all";

export default function Events() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, types, loadingEvents, errorEvents } = useSelector((state) => state.events);

  // --- States ---
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [tempSelection, setTempSelection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchEventTypes());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const uniqueLocations = useMemo(() => {
    return ["All", ...new Set(events.map(e => e.location || e.address || "Online Event"))];
  }, [events]);

  const formatDateForComparison = (dateInput) => {
    if (!dateInput) return "";
    let d;
    if (dateInput.seconds) {
      d = new Date(dateInput.seconds * 1000);
    } else {
      d = new Date(dateInput);
    }
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US");
  };

  const openModal = (type) => {
    if (type === 'category') setTempSelection(activeFilter);
    if (type === 'location') setTempSelection(addressFilter || "All");
    if (type === 'date') {
      setTempSelection(dateFilter ? new Date(dateFilter) : new Date());
    }
    setActiveModal(type);
  }

  const applyModal = () => {
    if (activeModal === 'category') setActiveFilter(tempSelection);
    if (activeModal === 'location') setAddressFilter(tempSelection === "All" ? "" : tempSelection);
    if (activeModal === 'date') {
      if (!tempSelection) {
        setDateFilter("");
      } else {
        setDateFilter(formatDateForComparison(tempSelection));
      }
    }
    setActiveModal(null);
    setCurrentPage(1);
  }

  const formatPrice = (priceVal) => {
    if (!priceVal) return "Free";
    if (typeof priceVal === "object") {
      const prices = Object.values(priceVal).map(p => Number(p)).filter(n => !isNaN(n))
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

  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchesSearch = e.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const loc = e.address || e.location || "Online Event";
      const matchesLocation = addressFilter === "" || loc.toLowerCase().includes(addressFilter.toLowerCase());
      const eventDateStr = formatDateForComparison(e.date);
      const matchesDate = dateFilter === "" || eventDateStr === dateFilter;
      const matchesCategory = activeFilter === "All" || e.type === activeFilter;
      return matchesSearch && matchesLocation && matchesDate && matchesCategory;
    });
  }, [events, searchTerm, addressFilter, dateFilter, activeFilter]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-screen min-h-screen flex flex-col items-center overflow-x-hidden bg-[#F9F8F6] bg-[radial-gradient(ellipse_at_top,_#FFEBB7_0%,_#F9F8F6_80%)]">

      <style>{`
        .react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
        .react-calendar__navigation button { color: black; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #f3f4f6; border-radius: 8px; }
        .react-calendar__month-view__weekdays { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 0.75rem; color: #9ca3af; text-decoration: none; }
        .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
        .react-calendar__tile { padding: 10px 6px; background: transparent !important; color: #374151; text-align: center; font-weight: 500; font-size: 0.95rem; border: 2px solid transparent; border-radius: 8px; transition: all 0.2s ease; }
        .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background: #f3f4f6 !important; color: black; }
        .react-calendar__tile--active { background: transparent !important; color: black !important; font-weight: 800; border: 2px solid black !important; border-radius: 8px; }
        .react-calendar__tile--active:enabled:hover, .react-calendar__tile--active:enabled:focus { background: transparent !important; border: 2px solid black !important; }
        .react-calendar__tile--now { background: transparent !important; color: #FFC107 !important; font-weight: bold; }
        button:where(.clear-date-btn) { background: transparent !important;}
      `}</style>

      <div className="w-full max-w-7xl mt-12 mb-12 px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col items-start">
          <h1 className={`text-3xl font-semibold mb-2 inline-block ${goldenStyle}`}>Discover Events</h1>
          <p className="text-blue-950 ml-1">Find and book your next experience</p>
        </div>

        {/* --- Controls Section --- */}
        <div className="flex flex-col gap-5">
          {/* Search Bar */}
          <div className="relative w-114  ">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4"><Icons.Search /></span>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-11 pr-4 bg-white text-gray-900 border border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107] shadow-sm transition-all"
            />
          </div>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => openModal('date')} className={`flex items-center gap-2 ${goldenStyle} ${!dateFilter && 'opacity-80'}`}>
              <Icons.Calendar /><span>{dateFilter || "All Dates"}</span>
            </button>
            <button onClick={() => openModal('category')} className={`flex items-center gap-2 ${goldenStyle} ${activeFilter === "All" && 'opacity-80'}`}>
              <Icons.FilterIcon /><span>{activeFilter === "All" ? "All Categories" : types.find(t => t.id === activeFilter)?.name || "Category"}</span>
            </button>
            <button onClick={() => openModal('location')} className={`flex items-center gap-2 ${goldenStyle} ${!addressFilter && 'opacity-80'}`}>
              <Icons.MapPin /><span>{addressFilter || "All Venues"}</span>
            </button>
          </div>
        </div>

        {/* --- MODAL --- */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setActiveModal(null)}></div>
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in border-2 border-black">
              <div className="bg-[#FFC107] p-5 flex justify-between items-center border-b border-black">
                <h2 className="text-xl font-bold mx-auto text-gray-950">
                  {activeModal === 'date' && "Select Date"}
                  {activeModal === 'category' && "Select Category"}
                  {activeModal === 'location' && "Select Venue"}
                </h2>
                <button onClick={() => setActiveModal(null)} className="absolute right-5 hover:scale-110 transition-transform"><Icons.Close /></button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto bg-white">
                {activeModal === 'date' && (
                  <div className="flex flex-col items-center">
                    <Calendar onChange={setTempSelection} value={tempSelection instanceof Date ? tempSelection : null} locale="en-US" />
                    <button
                      onClick={() => setTempSelection(null)}
                      className="clear-date-btn mt-4 flex items-center gap-2 text-red-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:text-red-800 
                        bg-transparent !bg-transparent hover:bg-transparent hover:!bg-transparent 
                        outline-none focus:outline-none focus:ring-0"
                    >
                      <Icons.Trash /> Clear Date Selection
                    </button>
                  </div>
                )}
                {activeModal === 'category' && (
                  <div className="flex flex-col gap-2">
                    <button onClick={() => setTempSelection("All")} className={`w-full text-left flex justify-between items-center ${goldenStyle} ${tempSelection !== "All" ? 'opacity-50 hover:opacity-80' : ''}`}>All Categories</button>
                    {types.map(t => (
                      <button key={t.id} onClick={() => setTempSelection(t.id)} className={`w-full text-left flex justify-between items-center ${goldenStyle} ${tempSelection !== t.id ? 'opacity-50 hover:opacity-80' : ''}`}>{t.name || t.type}</button>
                    ))}
                  </div>
                )}
                {activeModal === 'location' && (
                  <div className="flex flex-col gap-2">
                    {uniqueLocations.map((loc, idx) => {
                      const isSelected = tempSelection === loc || (tempSelection === "" && loc === "All");
                      return <button key={idx} onClick={() => setTempSelection(loc === "All" ? "All" : loc)} className={`w-full text-left flex justify-between items-center ${goldenStyle} ${!isSelected ? 'opacity-50 hover:opacity-80' : ''}`}>{loc}</button>
                    })}
                  </div>
                )}
              </div>
              <div className="p-5 pt-2 flex gap-3">
                <button onClick={() => setActiveModal(null)} className={`flex-1 opacity-70 ${goldenStyle}`}>Cancel</button>
                <button onClick={applyModal} className={`flex-1 font-bold ${goldenStyle}`}>Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* --- Events Grid  --- */}
        {loadingEvents ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
        ) : errorEvents ? (
          <div className="text-center py-16 bg-white rounded-xl border border-red-300"><p className="text-red-500 text-lg">{errorEvents}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.length > 0 ? (
              currentItems.map(event => {
                const title = event.eventName || event.name || "Untitled Event";
                const image = event.photo || event.image || "https://via.placeholder.com/400x300?text=No+Image";
                const displayPrice = formatPrice(event.price);
                const { day, month } = getDateParts(event.date); 
                const address = event.address || event.location || "Online";

                return (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="relative h-[450px] w-full rounded-[30px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
                  >

                    <img
                      src={image}
                      alt={title}
                      className="absolute inset-0 h-full w-full object-center transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.src = "https://via.placeholder.com/400x600?text=Error" }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                    <div className="absolute bottom-0 left-0 w-full p-6 text-white">

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-3 leading-tight drop-shadow-md">
                        {title}
                      </h3>

                      <div className="flex items-end gap-4">
                        {/*  Date Box */}
                        <div className="bg-[#FFC107] backdrop-blur-sm rounded-xl p-2.5 text-center min-w-[60px] text-black shadow-lg">
                          <span className="block text-xs font-bold uppercase tracking-wide text-red-700">{month}</span>
                          <span className="block text-2xl font-extrabold leading-none">{day}</span>
                        </div>

                        {/*  Info */}
                        <div className="flex flex-col gap-1 pb-1">
                          <div className="flex items-center gap-2 text-gray-200 text-sm font-medium">
                            <Icons.MapPin />
                            <span className="truncate max-w-[180px]">{address}</span>
                          </div>
                          <div className="text-[#FFC107] font-bold text-lg drop-shadow-sm">
                            EGP {displayPrice}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300"><p className="text-gray-500 text-lg">No events found.</p></div>
            )}
          </div>
        )}

        {/* --- Pagination --- */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center md:justify-end items-center gap-2 mt-8 pt-4 border-t border-gray-300">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`${goldenStyle} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}><Icons.ChevronLeft /></button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i + 1} onClick={() => paginate(i + 1)} className={`${goldenStyle} ${currentPage !== i + 1 ? 'opacity-70' : 'font-bold'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className={`${goldenStyle} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}><Icons.ChevronRight /></button>
          </div>
        )}
      </div>
    </div>
  );
}