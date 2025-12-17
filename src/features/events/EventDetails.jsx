import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { X, Plus, Minus } from "lucide-react";
import { saveCheckout } from "../../redux/slices/checkoutSlice";
import { fetchEventById } from "../../redux/slices/eventSlice";
import SeatsModal from "../../components/SeatsModal";
import { auth } from "../../firebase/firebase.config";
import EventMap from "../../components/EventMap";
import { fetchSeatModelById, clearSeatModel } from "../../redux/slices/seatModelSlice";

export default function EventDetails() {
  const { id } = useParams();
  const { events } = useSelector((state) => state.events);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPrices, setShowPrices] = useState(false);
  const { currentModel, loading: seatModelLoading } = useSelector((state) => state.seatModel);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // نشوف الأول لو الحدث موجود في store
    const found = events.find((e) => e.id === id);
    if (found) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEvent(found);
      setLoading(false);
    } else {
      // نجيب من Firebase مباشرة
      dispatch(fetchEventById(id))
        .unwrap()
        .then((e) => {
          setEvent(e);
        })
        .finally(() => setLoading(false));
    }
  }, [id, events, dispatch]);


    useEffect(() => {
    if (isModalOpen) {
      // جلب الـ model من venue.seatModel
      const modelUid = event?.venue?.seatModel;
      if (modelUid) {
        dispatch(fetchSeatModelById(modelUid));
      }
    } else if (!isModalOpen) {
      // تنظيف الـ seat model عند إغلاق الـ modal
      dispatch(clearSeatModel());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedSeats([]);
    }
  }, [isModalOpen, event?.venue?.seatModel, dispatch]);


  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event not found</p>;

    // استخراج الـ rows و seats من الـ seat model
  const getRowsAndSeats = () => {
    if (!currentModel || !currentModel.seats || currentModel.seats.length === 0) {
      // Fallback للـ hardcoded rows في حالة عدم وجود model
      return { rows: ["A", "B", "C", "D"], seatsPerRow: 6, seats: [] };
    }

    // تجميع الـ seats حسب الـ row
    const seatsByRow = {};
    currentModel.seats.forEach((seat) => {
      if (!seatsByRow[seat.row]) {
        seatsByRow[seat.row] = [];
      }
      seatsByRow[seat.row].push(seat);
    });

    // ترتيب الـ rows و حساب أقصى عدد seats في أي row
    const rows = Object.keys(seatsByRow).sort();
    const rowLengths = rows.map((row) => seatsByRow[row].length);
    const seatsPerRow = rowLengths.length > 0 ? Math.max(...rowLengths) : 0;

    return { rows, seatsPerRow, seats: currentModel.seats };
  };

  const { rows, seatsPerRow, seats: modelSeats } = getRowsAndSeats();


  const isSeatBookedInFirebase = (seatId) => {
    if (!event.bookedSeats) return false;
    // البحث في الـ bookedSeats باستخدام الـ seat id أو row + seat
    return event.bookedSeats.some((b) => {
      // لو الـ booked seat فيه id مباشر
      if (b.id === seatId) return true;
      // لو الـ booked seat فيه row و seat
      const row = seatId[0];
      const seatNumber = seatId.slice(1);
      return b.row === row && b.seat === seatNumber;
    });
  };

  const getSeatStatus = (seatId) => {
    // أولاً لو الكرسي موجود في seatMap ومحجوز
    if (event.seatMap && event.seatMap[seatId]) return true;

    // ثانياً لو موجود في bookedSeats بتوع Firebase
      if (isSeatBookedInFirebase(seatId)) return true;

    // ثالثاً لو الـ seat موجود في الـ model و status مش available
    if (modelSeats && modelSeats.length > 0) {
      const seat = modelSeats.find((s) => s.id === seatId);
      if (seat && seat.status !== "available") return true;
    }

    return false;
  };

  const getSeatPrice = (row) => {
    return event.price[row];
  };

  const toggleSeat = (seatId) => {
    const isBooked = getSeatStatus(seatId);
    if (isBooked) return; // لو الكرسي محجوز مش هنعمل حاجة

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId[0];
      return total + getSeatPrice(row);
    }, 0);
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

      if (!auth.currentUser) {
      alert("Please login to continue");
      return;
    }

    setIsCheckoutLoading(true);

      try {
      const tickets = selectedSeats.map((seatId) => {
        const row = seatId[0];
        const seatNumber = seatId.slice(1);
        const price = getSeatPrice(row);
        
        return {
          row: row,
          seat: seatNumber,
          price: typeof price === 'number' ? price : 0,
          type: "GENERAL",
        };
      });

      const subtotal = tickets.reduce((sum, t) => sum + (t.price || 0), 0);
      const serviceFee = parseFloat((subtotal * 0.05).toFixed(2)); 
      const total = subtotal + serviceFee;

      // التحقق من وجود event.date
      let eventDateValue = null;
      if (event.date) {
        if (event.date.seconds) {
          eventDateValue = new Date(event.date.seconds * 1000).toISOString();
        } else if (event.date instanceof Date) {
          eventDateValue = event.date.toISOString();
        } else {
          eventDateValue = new Date(event.date).toISOString();
        }
      }

      const checkoutData = {
        eventId: event.id || "",
        eventName: event.eventName || "",
        eventDate: eventDateValue,
        venue: event.address || event.venue?.name || "",
        tickets: tickets,
        subtotal: subtotal,
        serviceFee: serviceFee,
        total: total,
        userId: auth.currentUser.uid,
        eventOwner: event.eventOwner || "",
      };

      // التحقق من البيانات قبل الإرسال
      if (!checkoutData.eventId || !checkoutData.eventName || tickets.length === 0) {
        throw new Error("Invalid checkout data");
      }

      // تخزين البيانات في Firestore
      await dispatch(saveCheckout(checkoutData)).unwrap();

    navigate("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error during checkout. Please try again.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };
  const eventDate = event.date?.seconds
    ? new Date(event.date.seconds * 1000)
    : new Date(event.date);
  return (
    <div className="min-h-screen bg-black text-white w-full">
      {/* HERO COVER */}
      <div className="relative w-full h-[40vh] md:h-[50vh]">
        <img
          src={event.cover || event.photo}
          className="w-full h-full object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="w-full px-4 md:px-12 lg:px-40 pb-10 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* LEFT - Poster */}
        <div className="flex justify-center md:justify-start relative z-20 -mt-20 md:-mt-0">
          <img
            src={event.photo}
            className="w-52 h-52 md:h-full md:w-72 lg:w-80 rounded-xl shadow-xl object-cover"
          />
        </div>

        {/* CENTER - Title + Description */}
        <div className="space-y-6 ">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            {event.eventName}
          </h1>

          <p className="text-sm text-gray-400">Hosted by: {event.eventOwner}</p>

          <p className="text-gray-300 leading-relaxed text-base md:text-lg">
            {event.description}
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white w-full py-3  rounded-xl mt-4 text-lg font-medium transition cursor-pointer  "
          >
            Buy Ticket
          </button>
        </div>

        {/* RIGHT - Information Box */}
        <div className="flex md:justify-end ">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8 max-w-xs w-full  space-y-4">
            <div>
              <p className="text-sm text-gray-400">Date</p>
              <p className="text-xl font-semibold">
                {eventDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Time</p>
              <p className="text-xl font-semibold">
                {eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Location</p>
              <p className="text-lg font-medium">{event.venue?.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* MAP SECTION */}
      <div className="w-full px-4 md:px-12 lg:px-40 pb-20">
        <h2 className="text-2xl font-bold mb-4">Location</h2>

        {event.venue && (
          <EventMap
            lat={event.venue.latitude}
            lng={event.venue.longitude}
            name={event.venue.name}
          />
        )}
      </div>

      {/* MODAL */}
      <SeatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        bookedSeats={Array.isArray(event.bookedSeats) ? event.bookedSeats : []}
        selectedSeats={selectedSeats}
        toggleSeat={toggleSeat}
        calculateTotal={calculateTotal}
        handleCheckout={handleCheckout}
        rows={rows}
        seatsPerRow={seatsPerRow}
        modelSeats={modelSeats}
        currentModel={currentModel}
        getSeatStatus={getSeatStatus}
        getSeatPrice={getSeatPrice}
        showPrices={showPrices}
        setShowPrices={setShowPrices}
        isLoading={isCheckoutLoading || seatModelLoading}
      />
    </div>
  );
}
