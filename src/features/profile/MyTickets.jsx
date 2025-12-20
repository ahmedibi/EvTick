import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserTickets } from '../../redux/slices/eventSlice';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import TicketCard from '../../components/TicketCard';
import { FaSearch } from 'react-icons/fa';

const MyTickets = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const ticketsPerPage = 6;

  // Redux state
  const { userTickets, loadingTickets, errorTickets } = useSelector(state => state.events);

  // Auth user
  const authState = useSelector(state => state.auth);
  const user = authState?.user || authState?.currentUser;

  useEffect(() => {
    const userId = user?.uid || user?.id;
    if (userId) {
      dispatch(fetchUserTickets(userId));
    }
  }, [dispatch, user]);

  
   // Group tickets by ID (Event ID)
  const groupedTickets = Object.values(
    (userTickets || []).reduce((acc, ticket) => {
      // Use eventId if available, otherwise fallback to id
      const id = ticket.eventId || ticket.id;

      if (!acc[id]) {
        acc[id] = { ...ticket, count: 0, id }; // Ensure ID is preserved
      }
      acc[id].count += 1;
      return acc;
    }, {})
  ).filter(ticket =>
    ticket.eventName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(groupedTickets.length / ticketsPerPage);
  const startIndex = (currentPage - 1) * ticketsPerPage;
  const endIndex = startIndex + ticketsPerPage;
  const currentTickets = groupedTickets.slice(startIndex, endIndex);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [userTickets?.length, searchTerm]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading UI
  if (loadingTickets) {
    return (
      <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-700">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  // Error UI
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
    <div className="relative min-h-screen bg-gray-100 ">
      

      <div className="relative z-10 max-w-7xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-black mb-3">My Tickets</h1>

             {/* Search Input */}
          <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className='text-gray-600' />
              </span>
            <input
              type="text"
              placeholder="Search by event name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-10 py-2 rounded-lg border text-gray-700 border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
            />
          </div>
        </div>

        {/* No Tickets */}
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
              {/* Tickets List */}
            {currentTickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No tickets found matching "{searchTerm}"</p>
              </div>
            ) : (
              
            <div key={currentPage} className=" gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {currentTickets.map((ticket) => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
            ) }
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 border border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageClick(pageNum)}
                       className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${currentPage === pageNum
                          ? 'bg-teal-500 text-white border-2 border-teal-400 shadow-lg scale-110'
                          : 'bg-white text-black border border-white/30 hover:bg-white/30'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700  border border-white/30 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
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