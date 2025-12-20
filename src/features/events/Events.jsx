import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchEventTypes, fetchAllEvents } from "../../redux/slices/eventSlice";
import bgImage from '../../assets/Untitled design.png';

// Components
import EventCard from "../../components/EventCard.jsx";
import FilterModal from "../../components/FilterModal.jsx";
import { FaSearch } from "react-icons/fa";

const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  MapPin: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
  ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
  FilterIcon: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>,
};

const goldenStyle = "bg-teal-500 text-white rounded-xl px-4 py-1 shadow-sm hover:brightness-105 transition-all";

export default function Events() {
  const dispatch = useDispatch();
  const { events, types, loadingEvents, errorEvents } = useSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [addressFilter, setAddressFilter] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [tempSelection, setTempSelection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const location = useLocation();

  useEffect(() => {
    dispatch(fetchEventTypes());
    dispatch(fetchAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.category) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveFilter(location.state.category);
    }
  }, [location.state]);

  const uniqueLocations = useMemo(() => {
    return ["All", ...new Set(events.map(e => e.location || e.address || "Online Event"))];
  }, [events]);

  const formatDateForComparison = (dateInput) => {
    if (!dateInput) return "";
    let d;
    if (dateInput.seconds) d = new Date(dateInput.seconds * 1000);
    else d = new Date(dateInput);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US");
  };

  const openModal = (type) => {
    if (type === 'category') setTempSelection(activeFilter);
    if (type === 'location') setTempSelection(addressFilter || "All");
    if (type === 'date') setTempSelection(dateFilter ? new Date(dateFilter) : new Date());
    setActiveModal(type);
  }

  const applyModal = () => {
    if (activeModal === 'category') setActiveFilter(tempSelection);
    if (activeModal === 'location') setAddressFilter(tempSelection === "All" ? "" : tempSelection);
    if (activeModal === 'date') {
      if (!tempSelection) setDateFilter("");
      else setDateFilter(formatDateForComparison(tempSelection));
    }
    setActiveModal(null);
    setCurrentPage(1);
  }

  const filteredEvents = useMemo(() => {
      const now = new Date();
      const threeHoursMs = 3 * 60 * 60 * 1000;
         const lowerSearch = searchTerm.trim().toLowerCase();
    return events.filter(e => {
        // 1. Check if event is past
      let eventDate = null;
      if (e.date) {
        if (e.date.seconds) eventDate = new Date(e.date.seconds * 1000);
        else eventDate = new Date(e.date);
      }

      let isPast = false;
      if (eventDate) {
        const isOnline =
          (e.type && e.type.toLowerCase() === "online") ||
          (e.venue === "Online") ||
          (e.address === "Online") ||
          (typeof e.venue === 'string' && e.venue.toLowerCase() === 'online') ||
          (e.venue?.name?.toLowerCase() === 'online');

        if (isOnline) {
          // Online: hide if now > start + 3 hours
          if (now.getTime() > eventDate.getTime() + threeHoursMs) {
            isPast = true;
          }
        } else {
          // Offline: hide if now > start
          if (now.getTime() > eventDate.getTime()) {
            isPast = true;
          }
        }
      }

      if (isPast) return false;
      
       const matchesSearch = e.eventName?.toLowerCase().includes(lowerSearch) ||
        e.name?.toLowerCase().includes(lowerSearch);
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
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gray-100 pt-30">

      {/* ---------------------- HERO SECTION ---------------------- */}
      <div
        className="relative h-[350px] md:h-[420px]  md:mx-37 bg-no-repeat rounded-2xl  shadow-xl "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
  

        <div className="absolute left-6 md:left-20 top-15 text-white max-w-xl">
          <h1 className="text-3xl md:text-4xl font-bold leading-snug">
            The Citywide <br />
          </h1>
          <p className="mt-3 text-gray-200 text-sm md:text-base max-w-md">
            <p className=" ml-1 text-gray-200">Find and book your next experience</p>
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%]">
          <div className="bg-gray-100 rounded-2xl shadow-xl flex  md:flex-row md:items-center px-4 py-3 gap-3">

            <div className="relative flex-1 bg-white rounded-lg text-gray-800">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch />
              </span>
              <input
                type="text"
                placeholder="Search by name or type"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-black-100 text-gray-800 outline-none"
              />
            </div>

            <button onClick={() => openModal("date")} className="flex items-center gap-1 px-1.5 md:px-4 py-2 bg-teal-600 rounded-lg hover:bg-gray-200 hover:text-black transition">
              <Icons.Calendar />
              <span>{dateFilter || "Date"}</span>
            </button>

            <button onClick={() => openModal("location")} className="flex items-center gap-1 px-1.5 md:px-4 py-2 bg-teal-600 rounded-lg hover:bg-gray-200 hover:text-black transition">
              <Icons.MapPin />
              <span >{addressFilter || "Location"}</span>
            </button>

            <button onClick={() => openModal("category")} className="flex items-center gap-1 px-1.5 md:px-4 py-2 bg-teal-600 rounded-lg hover:bg-gray-200 hover:text-black transition">
              <Icons.FilterIcon />
              <span>
                {activeFilter === "All" ? "Events" : activeFilter}
              </span>
            </button>

          </div>
        </div>
      </div>

      {/* ---------------------- REST OF THE PAGE ---------------------- */}

      <div className="relative min-h-screen bg-gray-100 flex items-center justify-center p-6 ">
      

        <style>{`
          .react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
          .react-calendar__navigation button { color: black; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; }
          .react-calendar__tile--now { background: transparent !important; color: #FFC107 !important; font-weight: bold; }
          .react-calendar__tile--active { background: transparent !important; color: black !important; font-weight: 800; border: 2px solid black !important; border-radius: 8px; }
        `}</style>

        <div className="relative z-10 w-full max-w-7xl mt-12 mb-12 px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex flex-col items-start">
            <h1 className={`text-3xl font-bold mb-2 text-gray-800`}>Discover Events</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center">
            {loadingEvents ? (
              <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
            ) : errorEvents ? (
              <div className="text-center py-16 bg-white rounded-xl border border-red-300"><p className="text-red-500 text-lg">{errorEvents}</p></div>
            ) : (
              <>
                {filteredEvents.length > 0 ? (
                  filteredEvents.slice(indexOfFirstItem, indexOfLastItem).map(event => (
                    <EventCard key={event.id} event={event} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No events found.</p>
                  </div>
                )}
              </>
            )}
          </div>

          {filteredEvents.length > 0 && (
            <div className="flex justify-center md:justify-end items-center gap-2 mt-8 pt-4 border-t border-gray-300">
              <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className={`${goldenStyle} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}><Icons.ChevronLeft /></button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`${goldenStyle} ${currentPage !== i + 1 ? 'opacity-70' : 'font-bold'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${goldenStyle} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Icons.ChevronRight />
              </button>
            </div>
          )}

        </div>
      </div>

      <FilterModal
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onApply={applyModal}
        tempSelection={tempSelection}
        setTempSelection={setTempSelection}
        types={types}
        uniqueLocations={uniqueLocations}
      />
    </div>
  );
}
