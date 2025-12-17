import React from "react";
import StageLine from "../StageLine";

const defaultConfig = {
  left: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "L" },
  center: { rows: [1, 2, 3, 4, 5, 6], seats: 10, prefix: "C" },
  right: { rows: [1, 2, 3, 4, 5], seats: 4, prefix: "R" }
};

export default function SmallSeatMap({ 
  seatMap = {}, 
  config = defaultConfig,
  modelSeats = [],
  toggleSeat,
  selectedSeats = []
}) {
  const { left, center, right } = config;

  const renderSeat = (seatId) => {
    const seatStatus = seatMap[seatId];
    const isBooked = seatStatus === true;
    const isSelected = selectedSeats.includes(seatId);
    const isUnavailable = seatStatus === false;
    
    return (
      <button
        key={seatId}
        onClick={() => toggleSeat && !isBooked && !isUnavailable && toggleSeat(seatId)}
        disabled={isBooked || isUnavailable}
        className={`
                    w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[8px] md:text-[10px] font-semibold
                    ${isBooked
            ? "bg-gray-300 text-white cursor-not-allowed"
            : isSelected
            ? "bg-amber-400 text-black hover:bg-amber-500"
            : isUnavailable
            ? "bg-gray-200 text-textColor hover:bg-gray-300 opacity-50 cursor-not-allowed"
            : "bg-teal-500 text-white hover:bg-teal-600"
          }
                    rounded-t-lg rounded-b-sm shadow-sm cursor-pointer flex-shrink-0 transition-transform hover:scale-110
                `}
        title={seatId}
      >
        {seatId}
      </button>
    );
  };

  const renderSection = (rows, seatsPerRow, isAngled = false, angleDir = "left", prefix) => {
    // الحصول على الـ seats الخاصة بهذا الـ prefix من الـ model
    const sectionSeats = modelSeats.length > 0
      ? modelSeats.filter(s => s.row === prefix).sort((a, b) => a.number - b.number)
      : null;
    
    if (sectionSeats && sectionSeats.length > 0) {
      // تقسيم الـ seats إلى rows بناءً على الـ number
      // مثلاً: Left section (4 seats per row): L1-L4 (row 1), L5-L8 (row 2), etc.
      const seatsByRow = [];
      const numRows = rows.length;
      
      for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        const startIndex = rowIndex * seatsPerRow;
        const endIndex = startIndex + seatsPerRow;
        const rowSeats = sectionSeats.slice(startIndex, endIndex);
        seatsByRow.push(rowSeats);
      }
      
      return (
        <div className={`flex flex-col gap-1 ${isAngled ? (angleDir === "left" ? "rotate-12 translate-y-4" : "-rotate-12 translate-y-4") : ""}`}>
          {seatsByRow.map((rowSeats, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {rowSeats.map((seat) => renderSeat(seat.id))}
            </div>
          ))}
        </div>
      );
    }
    
    // Fallback للـ default rendering
    let seatCounter = 1;
    return (
      <div className={`flex flex-col gap-1 ${isAngled ? (angleDir === "left" ? "rotate-12 translate-y-4" : "-rotate-12 translate-y-4") : ""}`}>
        {rows.map((row) => (
          <div key={row} className="flex justify-center gap-1">
            {[...Array(seatsPerRow)].map(() => {
              const seatId = `${prefix}${seatCounter}`;
              seatCounter++;
              return renderSeat(seatId);
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="pt-4 py-6 pb-4 rounded-xl shadow-xl bg-gray-500 ">
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded-full bg-teal-500"></div>
          <span className="text-white text-sm">Available</span>
        </div>
        <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded-full bg-amber-400"></div>
          <span className="text-white text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <span className="text-white text-sm">Booked</span>
        </div>
      </div>

      <StageLine />

      <div className="flex justify-start md:justify-center items-start gap-8 md:gap-16 mt-4 px-5 pb-8 overflow-x-auto w-full h-123">
        {/* Left Section */}
        <div className="mt-6 flex-shrink-0">
          {renderSection(left.rows, left.seats, true, "left", left.prefix || "L")}
        </div>

        {/* Center Section */}
        <div className="flex-shrink-0">
          {renderSection(center.rows, center.seats, false, "center", center.prefix || "C")}
        </div>

        {/* Right Section */}
        <div className="mt-6 flex-shrink-0">
          {renderSection(right.rows, right.seats, true, "right", right.prefix || "R")}
        </div>
      </div>

      
    </div>
  );
}