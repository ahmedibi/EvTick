import React from "react";
import { X, Plus, Minus } from "lucide-react";
import Spinner from "./Spinner";
import MediumSeatMap from "./modelsSeat/mediumSeatMap/MediumSeatMap";
import SmallSeatMap from "./modelsSeat/smallSeatMap/SmallSeatMap";

export default function SeatsModal({
  isOpen,
  onClose,
  event,
  selectedSeats,
  toggleSeat,
  calculateTotal,
  handleCheckout,
  rows,
  modelSeats,
  currentModel,
  getSeatStatus,
  getSeatPrice,
  showPrices,
  setShowPrices,
  isLoading,
}) {
  if (!isOpen) return null;

  // تحديد نوع الـ model بناءً على الـ name
  const isMediumModel = currentModel?.name?.toLowerCase() === "medium";
  const isSmallModel = currentModel?.name?.toLowerCase() === "small";

  // تحويل الـ seats إلى seatMap format
  const buildSeatMap = () => {
    const seatMap = {};
    
    if (!modelSeats || modelSeats.length === 0) {
      return seatMap;
    }

    modelSeats.forEach((seat) => {
      const seatId = seat.id;
      const isBooked = getSeatStatus(seatId);
      const isSelected = selectedSeats.includes(seatId);
      
      // seatMap format: null = available, true = booked, false = unavailable/selected
      if (isBooked) {
        seatMap[seatId] = true; // Booked
      } else if (isSelected) {
        seatMap[seatId] = null; // Available but selected (will be handled by UI)
      } else if (seat.status !== "available") {
        seatMap[seatId] = false; // Unavailable
      } else {
        seatMap[seatId] = null; // Available
      }
    });

    return seatMap;
  };

  const seatMap = buildSeatMap();

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/30 z-9999">

<div className="bg-white/10 backdrop-blur-lg z-50 rounded-lg w-full max-w-7xl h-[90vh] flex flex-col md:flex-row overflow-y-auto">


    {/* LEFT SIDE */}
    <div className="flex-1 bg-black/20 p-4 md:p-0 ">
      <div className="max-w-4xl mx-auto">

      

        {/* Seats - عرض الـ model المناسب */}
        <div className="flex justify-center">
          {isSmallModel ? (
            <div className="w-full">
              <SmallSeatMap 
                seatMap={seatMap} 
                totalPrice={calculateTotal()}
                modelSeats={modelSeats}
                toggleSeat={toggleSeat}
                selectedSeats={selectedSeats}
              />
            </div>
          ) : isMediumModel ? (
            <div className="w-full">
              <MediumSeatMap 
                seatMap={seatMap} 
                totalPrice={calculateTotal()}
                modelSeats={modelSeats}
                toggleSeat={toggleSeat}
                selectedSeats={selectedSeats}
              />
            </div>
          ) : (
            // Fallback للـ default display
            <div className="flex justify-center gap-4 md:gap-8">
              <div className="space-y-2 md:space-y-3">
                {rows.map((row) => {
                  const rowSeats = modelSeats?.filter(s => s.row === row) || [];
                  return (
                    <div key={row} className="flex items-center gap-1 md:gap-2">
                      <span className="text-sm font-semibold w-4 text-white">
                        {row}
                      </span>

                      {rowSeats.map((seat) => {
                        const seatId = seat.id;
                        const isBooked = getSeatStatus(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isBooked}
                            className={`w-6 h-6 md:w-8 md:h-8 m-2 rounded-full transition-all ${
                              isBooked
                                ? "bg-gray-400 cursor-not-allowed"
                                : isSelected
                                ? "bg-amber-400 hover:bg-amber-500"
                                : "bg-cyan-500 hover:bg-cyan-600"
                            }`}
                            title={seatId}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
           <button
        onClick={() => setShowPrices(!showPrices)}
        className="absolute bottom-30  bg-teal-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-teal-600 z-10"
      >
        Show Prices {showPrices ? <Minus size={16} /> : <Plus size={16} />}
      </button>

      {showPrices && (
          <div className="mt-4 md:mt-6 bg-gray-800 p-4 rounded-lg shadow absolute bottom-10 ">
            <div className="grid grid-cols-2 md:grid-cols-7 gap-4 ">
              {rows.map((row) => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-teal-300 text-black text-center rounded-full">
                    {row}
                  </div>
                  <span className="text-gray-100">{getSeatPrice(row)} EGP</span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>


    

      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="w-full md:w-96 border-t md:border-t-0 md:border-l p-6 flex flex-col bg-black/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-1 text-white">
            {event.eventName}
          </h2>

          {/* Date */}
          <p className="text-gray-300 text-sm">
            {(() => {
              const dateObj = event.date?.seconds
                ? new Date(event.date.seconds * 1000)
                : new Date(event.date);
              return (
                <>
                  {dateObj.toISOString().split("T")[0]} at{" "}
                  {dateObj.toTimeString().slice(0, 5)}
                </>
              );
            })()}
          </p>

          <p className="text-gray-300 text-sm">{event.address}</p>
        </div>

        {/* Close */}
        <button onClick={onClose}>
          <X className="text-white" size={26} />
        </button>
      </div>

      {/* Basket */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-white">
          Basket ({selectedSeats.length})
        </h3>

        {selectedSeats.length === 0 ? (
          <p className="text-sm text-gray-400">
            When you've chosen your tickets, they will appear here.
          </p>
        ) : (
          <div className="mt-3 space-y-2 max-h-[300px] overflow-y-auto scrollbar-hide">
            {selectedSeats.map((seat) => (
              <div
                key={seat}
                className="flex justify-between items-center text-sm bg-white/5 p-2 rounded"
              >
                <span className="text-white">Seat {seat}</span>
                <span className="text-gray-300">{getSeatPrice(seat[0])} EGP</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center border-t border-gray-500 mt-6 pt-3">
          <p className="text-xl font-bold text-white">Total :</p>
          <p className="text-xl font-bold text-white">
            {calculateTotal().toFixed(2)} EGP
          </p>
        </div>
      </div>

      {/* Checkout */}
      <div className="mt-auto">
        <button
          onClick={handleCheckout}
          disabled={selectedSeats.length === 0}
          className="w-full py-3   text-white font-semibold rounded-xl bg-teal-500 hover:bg-teal-600 hover:text-white disabled:bg-gray-500 disabled:cursor-not-allowed transition"
        >
           {isLoading ? (
                <div className="flex items-center justify-center">
                  <Spinner className={"flex items-center justify-center"} />
                  <span className="ml-2">Processing...</span>
                </div>
              ) : (
                "Checkout"
              )}
        </button>
      </div>
    </div>

  </div>
</div>

  );
}
