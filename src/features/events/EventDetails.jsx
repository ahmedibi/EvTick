import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { X, Plus, Minus } from "lucide-react";
import { saveCheckout } from "../../redux/slices/checkoutSlice";
import { fetchEventById } from "../../redux/slices/eventSlice";
import SeatsModal from "../../components/SeatsModal";
import { auth } from "../../firebase/firebase.config";
import EventMap from "../../components/EventMap";

export default function EventDetails() {
  const { id } = useParams();
  const { events } = useSelector((state) => state.events);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showPrices, setShowPrices] = useState(false);

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

  if (loading) return <p>Loading...</p>;
  if (!event) return <p>Event not found</p>;

  // تحويل seatMap لصفوف
  const rows = ["A", "B", "C", "D"];
  const seatsPerRow = 6;

  const isSeatBookedInFirebase = (seatId) => {
    if (!event.bookedSeats) return false;

    const row = seatId[0];
    const seatNumber = seatId.slice(1);

    return event.bookedSeats.some(
      (b) => b.row === row && b.seat === seatNumber
    );
  };

  const getSeatStatus = (seatId) => {
    // أولاً لو الكرسي موجود في seatMap ومحجوز
    if (event.seatMap && event.seatMap[seatId]) return true;

    // ثانياً لو موجود في bookedSeats بتوع Firebase
    return isSeatBookedInFirebase(seatId);
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

    setIsCheckoutLoading(true);

    const tickets = selectedSeats.map((seatId) => ({
      row: seatId[0],
      seat: seatId.slice(1),
      price: getSeatPrice(seatId[0]),
      type: "GENERAL",
    }));

    const checkoutData = {
      eventId: event.id,
      eventName: event.eventName,
      eventDate: event.date?.seconds
        ? new Date(event.date.seconds * 1000).toISOString()
        : null,
      venue: event.address,
      tickets,
      subtotal: tickets.reduce((sum, t) => sum + t.price, 0),
      serviceFee: 0.5,
      total: tickets.reduce((sum, t) => sum + t.price, 0) + 0.5,
      userId: auth.currentUser?.uid || "guest", // أضف الـ userId هنا
      eventOwner: event.eventOwner,
    };
    // تخزين البيانات في Firestore
    await dispatch(saveCheckout(checkoutData));

    navigate("/checkout");
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
        getSeatStatus={getSeatStatus}
        getSeatPrice={getSeatPrice}
        showPrices={showPrices}
        setShowPrices={setShowPrices}
        isLoading={isCheckoutLoading}
      />
    </div>
  );
}
