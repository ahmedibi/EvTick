import React from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const Icons = {
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

const goldenStyle = "bg-[#0f9386] text-white rounded-2xl px-4 py-1 shadow-sm hover:brightness-105 transition-all";

const FilterModal = ({ 
  activeModal, 
  onClose, 
  onApply, 
  tempSelection, 
  setTempSelection, 
  types, 
  uniqueLocations 
}) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <style>{`
        .react-calendar { width: 100%; border: none; background: transparent; font-family: inherit; }
        .react-calendar__navigation button { color: black; min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; }
        .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #f3f4f6; border-radius: 8px; }
        .react-calendar__month-view__weekdays { text-align: center; text-transform: uppercase; font-weight: bold; font-size: 0.75rem; color: #9ca3af; text-decoration: none; }
        
        .react-calendar__tile { 
          padding: 10px 6px; 
          background: transparent !important; 
          color: #374151 !important; 
          text-align: center; 
          font-weight: 500; 
          font-size: 0.95rem; 
          border: 2px solid transparent; 
          border-radius: 8px; 
          transition: all 0.2s ease; 
        }
        
        .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { 
          background: #f3f4f6 !important; 
          color: black !important; 
        }
        
        .react-calendar__tile--active { 
          background: transparent !important; 
          color: black !important; 
          font-weight: 800; 
          border: 2px solid black !important; 
          border-radius: 8px; 
        }

        .react-calendar__tile--now { 
          background: transparent !important; 
          color: #0f9386 !important; 
          font-weight: bold; 
        }
      `}</style>

      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in border-2 border-none">
        {/* Header */}
        <div className="bg-[#0f9386] text-white p-5 flex justify-between items-center border-b border-none">
          <h2 className="text-xl font-bold mx-auto text-white">
            {activeModal === 'date' && "Select Date"}
            {activeModal === 'category' && "Select Category"}
            {activeModal === 'location' && "Select Venue"}
          </h2>
          <button onClick={onClose} className="absolute right-5 hover:scale-110 transition-transform">
            <Icons.Close />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto bg-white">
          
          {/* 1. Date Content */}
          {activeModal === 'date' && (
            <div className="flex flex-col items-center">
              <Calendar 
                onChange={setTempSelection} 
                value={tempSelection instanceof Date ? tempSelection : null} 
                locale="en-US" 
              />
              <button
                onClick={() => setTempSelection(null)}
                className="mt-4 flex items-center gap-2 text-red-600 font-semibold transition-colors px-4 py-2 rounded-lg hover:text-red-800 outline-none hover:bg-red-50 !bg-transparent"
              >
                <Icons.Trash /> Clear Date Selection
              </button>
            </div>
          )}

          {/* 2. Category Content */}
          {activeModal === 'category' && (
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setTempSelection("All")} 
                className={`w-full text-left flex justify-between items-center ${goldenStyle} ${tempSelection !== "All" ? 'opacity-50 hover:opacity-80' : ''}`}
              >
                All Categories
              </button>
              {types.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setTempSelection(t.id)} 
                  className={`w-full text-left flex justify-between items-center ${goldenStyle} ${tempSelection !== t.id ? 'opacity-50 hover:opacity-80' : ''}`}
                >
                  {t.name || t.type}
                </button>
              ))}
            </div>
          )}

          {/* 3. Location Content */}
          {activeModal === 'location' && (
            <div className="flex flex-col gap-2">
              {uniqueLocations.map((loc, idx) => {
                const isSelected = tempSelection === loc || (tempSelection === "" && loc === "All");
                return (
                  <button 
                    key={idx} 
                    onClick={() => setTempSelection(loc === "All" ? "All" : loc)} 
                    className={`w-full text-left flex justify-between items-center ${goldenStyle} ${!isSelected ? 'opacity-50 hover:opacity-80' : ''}`}
                  >
                    {loc}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 pt-2 flex gap-3">
          <button onClick={onClose} className={`flex-1 opacity-70 ${goldenStyle}`}>Cancel</button>
          <button onClick={onApply} className={`flex-1 font-bold ${goldenStyle}`}>Apply</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;