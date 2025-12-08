import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTickets } from '../../redux/slices/eventSlice';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import bgImage from "../../assets/auth.jpeg";
import { useNavigate } from 'react-router';

const MyTickets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 3;
  
  // Get data from Redux store
  const { userTickets, loadingTickets, errorTickets } = useSelector(state => state.events);
  
  // Try different possible auth state structures
  const authState = useSelector(state => state.auth);
  const user = authState?.user || authState?.currentUser;

  useEffect(() => {
    const userId = user?.uid || user?.id;
    
    if (userId) {
      dispatch(fetchUserTickets(userId));
    }
  }, [dispatch, user]);

  // Calculate pagination
  const totalPages = Math.ceil((userTickets?.length || 0) / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = userTickets?.slice(startIndex, endIndex) || [];

  // Reset to page 1 when tickets change
  useEffect(() => {
    setCurrentPage(1);
  }, [userTickets?.length]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const formatDate = (date) => {
    let dateObj;
    if (date?.toDate) {
      dateObj = date.toDate();
    } else if (date?.seconds) {
      dateObj = new Date(date.seconds * 1000);
    } else if (date instanceof Date) {
      dateObj = date;
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return { day: '', month: '', time: '' };
    }
    
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    
    return { day, month };
  };

  if (loadingTickets) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center">
        <div className=" absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-100">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (errorTickets) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-red-600 font-semibold mb-2">Error loading tickets</h2>
          <p className="text-red-500">{errorTickets}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black"
    
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">My Tickets</h1>
        </div>

        {/* Tickets List */}
        {!userTickets || userTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">No tickets yet</h2>
            <p className="text-gray-500 text-lg">Start exploring events and book your tickets!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentTickets.map((ticket, index) => {
                const dateInfo = formatDate(ticket.date);
                
                return (
                  <div
                    key={`${ticket.id}-${ticket.bookedSeat?.row}${ticket.bookedSeat?.seat}-${index}`}
                    className="group relative bg-white/10 backdrop-blur-2xl rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Hover Image Background */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                      style={{
                        backgroundImage: `url(${ticket.photo})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 bg-black/60"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center p-6">
                      {/* Date Section */}
                      <div className="flex-shrink-0 w-32 h-48 bg-gradient-to-br from-teal-200 via-teal-400 to-teal-700 rounded-lg flex flex-col items-center justify-center text-white mr-8">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">
                            {dateInfo.day}
                          </div>
                          <div className="text-lg font-semibold tracking-wider">
                            {dateInfo.month}
                          </div>
                        </div>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-3">
                          <div className="text-sm text-gray-300 group-hover:text-gray-200 mb-1 transition-colors">
                            {ticket.time || '10:00 am - 12:00 pm'}
                          </div>
                          <h3 className="text-3xl font-bold text-white transition-colors mb-2">
                            {ticket.eventName || 'Untitled Event'}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 text-gray-300 group-hover:text-gray-100 transition-colors">
                          <div>
                            <span className="text-sm opacity-75">Location:</span>
                            <div className="font-semibold">{ticket.address || 'Location TBA'}</div>
                          </div>
                          <div>
                            <span className="text-sm opacity-75">Seat:</span>
                            <div className="font-semibold">
                              Row {ticket.bookedSeat?.row} - Seat {ticket.bookedSeat?.seat}
                            </div>
                          </div>
                          <div>
                            <span className="text-sm opacity-75">Price:</span>
                            <div className="font-semibold">{ticket.ticketPrice || 0} EGP</div>
                          </div>
                        </div>
                      </div>

                      {/* Arrow Button */}
                      <div className="flex-shrink-0 ml-6">
                        <button className="w-14 h-14 rounded-full border-2 border-white/50 group-hover:border-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                        onClick={() => navigate(`/events/${ticket.id}`)}
                        >
                          <ArrowUpRight className="w-6 h-6 text-white transition-colors" />
                        </button>
                      </div>
                    </div>

                    {/* Bottom decorative line */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-teal-500 to-teal-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-teal-500 text-white border-2 border-teal-400 shadow-lg scale-110'
                          : 'bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

    
          
          </>
        )}
      </div>
    </div>
  );
};

export default MyTickets;