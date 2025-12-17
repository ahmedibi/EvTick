// SeatMap.jsx
import React from "react";
import StageLine from "../StageLine";

export default function MediumSeatMap({ 
  seatMap = {}, 
  modelSeats = [],
  toggleSeat,
  selectedSeats = []
}) {
    const rows = ["A", "B", "C", "D", "E", "F", "G"];
    const seatsPerRow = 12;
    
    // استخدام الـ rows من الـ model إذا كان متوفراً
    const actualRows = modelSeats.length > 0 
      ? [...new Set(modelSeats.map(s => s.row))].sort()
      : rows;

    return (
        <div className="pt-4 py-6 pb-4 rounded-xl shadow-xl bg-gray-500">
            <div className="flex justify-center gap-6 mb-2">
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

            <div className="space-y-2 min-h-[487px] max-w-full  mb-5 ">
                {actualRows.map((row) => {
                    // الحصول على الـ seats الخاصة بهذا الـ row من الـ model
                    const rowSeats = modelSeats.length > 0 
                      ? modelSeats.filter(s => s.row === row).sort((a, b) => a.number - b.number)
                      : Array.from({ length: seatsPerRow }, (_, i) => ({ id: `${row}${i + 1}`, row, number: i + 1 }));
                    
                    return (
                        <div key={row} className="flex flex-wrap justify-center gap-4 ">
                            {rowSeats.map((seat) => {
                                const seatId = seat.id;
                                const seatStatus = seatMap[seatId];
                                const isBooked = seatStatus === true;
                                const isSelected = selectedSeats.includes(seatId);
                                const isFaded = seatStatus === null || seatStatus === undefined;
                                const isUnavailable = seatStatus === false;

                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => toggleSeat && !isBooked && !isUnavailable && toggleSeat(seatId)}
                                        disabled={isBooked || isUnavailable}
                                        className={`
                                            w-10 h-10 flex items-center justify-center text-sm font-semibold
                                            ${isBooked
                                                ? "bg-gray-300 text-white cursor-not-allowed"
                                                : isSelected
                                                ? "bg-amber-400 text-black hover:bg-amber-500"
                                                : isUnavailable
                                                ? "bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed"
                                                : isFaded
                                                ? "bg-teal-500 text-white hover:bg-teal-600"
                                                : "bg-gray-300 text-textColor"
                                            }
                                            rounded-t-2xl
                                            rounded-b-sm
                                            shadow-sm
                                            cursor-pointer
                                            flex-shrink-0
                                            transition-all
                                        `}
                                        title={seatId}
                                    >
                                        {seatId}
                                    </button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>

          
        </div>
    );
}
