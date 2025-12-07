import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventTypes, fetchAllEvents } from "../../redux/slices/eventSlice";
import bgImage from '../../assets/bg2.jpg';

// Components
import EventCard from "../../components/EventCard.jsx";
import FilterModal from "../../components/FilterModal.jsx";

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
    <>
      <div className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-6 backdrop-blur-3xl"
        style={{ backgroundImage: `url(${bgImage})` }}>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70 min-h-screen"></div>

        <style>{`
          .react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
          .react-calendar__navigation button { color: black; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; }
          .react-calendar__tile--now { background: transparent !important; color: #FFC107 !important; font-weight: bold; }
          .react-calendar__tile--active { background: transparent !important; color: black !important; font-weight: 800; border: 2px solid black !important; border-radius: 8px; }
        `}</style>

        <div className="relative z-10 w-full max-w-7xl mt-12 mb-12 px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col items-start">
            <h1 className={`text-3xl font-bold mb-2 text-teal-300`}>Discover Events</h1>
            <p className=" ml-1 text-gray-200">Find and book your next experience</p>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-5">
            <div className="relative w-110">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2 pl-11 pr-4 bg-white text-gray-900 border border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-sm transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-4">
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
          
          {/* Grid & Pagination */}
          {loadingEvents ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
          ) : errorEvents ? (
            <div className="text-center py-16 bg-white rounded-xl border border-red-300"><p className="text-red-500 text-lg">{errorEvents}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.length > 0 ? (
                currentItems.map(event => <EventCard key={event.id} event={event} />)
              ) : (
                <div className="col-span-full text-center py-16 bg-white rounded-xl border border-dashed border-gray-300"><p className="text-gray-500 text-lg">No events found.</p></div>
              )}
            </div>
          )}
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

      <FilterModal 
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        onApply={applyModal}
        tempSelection={tempSelection}
        setTempSelection={setTempSelection}
        types={types}
        uniqueLocations={uniqueLocations}
      />
    </>
  );
}