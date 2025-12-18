import React from "react";

export default function MessageCard({ msg }) {
  return (
    <div className="bg-white text-white rounded-2xl shadow-lg flex flex-col h-full max-h-[420px]">
      
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4 bg-gray-200 rounded-t-2xl">
        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-sm font-bold">
          {msg.fullName?.charAt(0)}
        </div>
        <div>
          <h4 className="text-sm text-gray-700 font-semibold">{msg.fullName}</h4>
          <p className="text-xs text-gray-400">{msg.email}</p>
        </div>
      </div>

      {/* ===== Messages Body ===== */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-3">
        
        {/* User Message */}
        <div className="self-end max-w-[85%] bg-neutral-800 rounded-2xl px-4 py-2 mx-2">
          <p className="text-sm break-words">{msg.message}</p>
          <span className="block text-[10px] text-gray-400 mt-1 text-right">
            {msg.createdAt &&
                new Date(msg.createdAt).toLocaleString()}
          </span>
        </div>

        {/* Admin Reply */}
        {msg.adminReply && (
          <div className="self-start max-w-[85%] bg-teal-600 rounded-2xl px-4 py-2 mx-2">
            <p className="text-sm break-words">{msg.adminReply}</p>
            <span className="block text-[10px] text-teal-100 mt-1">
              {msg.replyTimestamp &&
                new Date(msg.replyTimestamp).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* ===== Footer (دايمًا تحت) ===== */}
      <div className="flex items-center justify-between border-t border-gray-400 p-4 mt-auto">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            msg.status === "replied"
              ? "bg-green-500/20 text-green-400"
              : "bg-orange-500/20 text-orange-400"
          }`}
        >
          {msg.status}
        </span>

        {msg.isRead && (
          <span className="text-xs text-blue-400 font-medium">
            ✔ Read
          </span>
        )}
      </div>
    </div>
  );
}
