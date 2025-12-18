import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMessages } from "../../redux/slices/messageSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";
import MessageCard from "../../components/MessageCard";

export default function Messages() {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.messages);

  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const messagesPerPage = 6;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) dispatch(fetchUserMessages());
    });

    return () => unsubscribe();
  }, [dispatch]);

  // ===== Reset page when filter changes =====
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [statusFilter]);

  // ===== Counts =====
  const pendingCount = messages.filter(
    (msg) => msg.status === "pending"
  ).length;

  // ===== Filter =====
  const filteredMessages =
    statusFilter === "all"
      ? messages
      : messages.filter((msg) => msg.status === statusFilter);

  // ===== Pagination =====
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const totalPages = Math.ceil(
    filteredMessages.length / messagesPerPage
  );

  // ===== Loading =====
  if (loading) {
    return (
      <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-700">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 ">

   <div className="max-w-7xl mx-auto py-12 px-4 ">

    <div className="mb-3 md:mb-12">
      <h1 className="text-3xl font-bold text-black mb-3">My Messages</h1>
    </div>
        {/* ===== Filter + Badge ===== */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-1 rounded-full text-sm ${
              statusFilter === "all"
                ? "bg-teal-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            All
          </button>
      
          <button
            onClick={() => setStatusFilter("pending")}
            className={`relative px-4 py-1 rounded-full text-sm ${
              statusFilter === "pending"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Pending
            {pendingCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
      
          <button
            onClick={() => setStatusFilter("replied")}
            className={`px-4 py-1 rounded-full text-sm ${
              statusFilter === "replied"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Replied
          </button>
        </div>


        {/* ===== Empty Pending State ===== */}
{statusFilter === "pending" && pendingCount === 0 && (
  <div className="bg-white rounded-xl shadow-sm p-12 text-center">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-10 h-10 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V7a2 2 0 00-2-2H6a2 2 0 00-2 2v6m16 0l-8 5-8-5m16 0H4"
        />
      </svg>
    </div>

    <h2 className="text-xl font-semibold text-gray-800 mb-2">
      No pending messages 
    </h2>
    <p className="text-gray-500">
      You're all caught up! There are no pending messages right now.
    </p>
  </div>
)}

      
        {/* ===== GRID ===== */}
        {!(statusFilter === "pending" && pendingCount === 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentMessages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} />
            ))}
          </div>
        )}

      
        {/* ===== PAGINATION ===== */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg bg-gray-100 disabled:opacity-40"
            >
              Prev
            </button>
      
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
      
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
    </div>
    </div>
  );
}
