import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { X, Plus, Minus } from "lucide-react";
import { saveCheckout } from "../../redux/slices/checkoutSlice";
import { fetchEventById } from "../../redux/slices/eventSlice";
import SeatsModal from "../../components/SeatsModal";
export default function EventDetails() {
  const { id } = useParams();
  const { events } = useSelector((state) => state.events);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getSeatStatus = (seatId) => {
    return event.seatMap[seatId];
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
      {" "}
      {/* NAV BAR */}{" "}
      <nav className="w-full bg-black/70 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        {" "}
        <div className="flex items-center justify-between py-4 px-6">
          {" "}
          <div className="text-white font-extrabold tracking-widest text-xl">
            {" "}
            EVTICK{" "}
          </div>{" "}
          <div className="hidden md:flex gap-8 text-white/80">
            {" "}
            <button className="hover:text-white transition">Home</button>{" "}
            <button className="hover:text-white transition">Events</button>{" "}
            <button className="hover:text-white transition">Categories</button>{" "}
            <button className="hover:text-white transition">Contact</button>{" "}
          </div>{" "}
          <div className="flex items-center gap-4">
            {" "}
            <button className="text-white hover:text-gray-300">
              {" "}
              <i className="ri-search-line text-xl"></i>{" "}
            </button>{" "}
            <button className="bg-teal-600 text-white px-4 py-1.5 rounded-md transition cursor-pointer">
              {" "}
              Sign In{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </nav>{" "}
      {/* HERO COVER */}{" "}
      <div className="relative w-full h-[30vh]">
        {" "}
        <img
          src={event.cover || event.photo}
          className="w-full h-full object-cover brightness-50"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black"></div>{" "}
      </div>{" "}
      {/* MAIN CONTENT */}{" "}
      <div className="w-full px-50 py-0 grid grid-cols-1 md:grid-cols-3 gap-8">
        {" "}
        {/* LEFT - Poster */}{" "}
        <div className="flex justify-center md:justify-start relative z-20 -mt-36 md:-mt-12">
          {" "}
          <img
            src={event.photo}
            className="w-80 h-auto rounded-xl shadow-xl object-cover"
          />{" "}
        </div>{" "}
        {/* CENTER - Title + Description */}
        <div className="space-y-12">
          <h1 className="text-4xl font-extrabold tracking-wide">
            {event.eventName}
          </h1>

          <p className="text-sm text-gray-400">Hosted by: {event.eventOwner}</p>

          <p className="text-gray-300 leading-relaxed text-lg">
            {event.description}
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-600 text-white px-40 py-4 rounded-xl mt-4 text-lg font-medium transition cursor-pointer"
          >
            Buy Ticket
          </button>
        </div>
        {/* RIGHT - Information Box */}{" "}
        <div className="flex justify-end">
          {" "}
          <div className="bg-white/5 border border-white/10 rounded-xl p-12 max-w-xs self-start space-y-3 ">
            {" "}
            <div>
              {" "}
              <p className="text-sm text-gray-400">Date</p>{" "}
              <p className="text-xl font-semibold">
                {" "}
                {eventDate.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-sm text-gray-400">Time</p>{" "}
              <p className="text-xl font-semibold">
                {eventDate.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>{" "}
            <div>
              {" "}
              <p className="text-sm text-gray-400">Location</p>{" "}
              <p className="text-lg font-medium">{event.address}</p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      {/* MAP SECTION */}{" "}
      <div className="w-full px-50 pb-18 py-24">
        {" "}
        <h2 className="text-2xl font-bold mb-4"></h2>{" "}
        <div className="w-full h-[350px] rounded-xl overflow-hidden">
          {" "}
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27607.10562459786!2d31.2357!3d30.0444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c1df9d0b!2sCairo!5e0!3m2!1sen!2seg!4v1700000000000"
          ></iframe>{" "}
        </div>{" "}
      </div>{" "}
      {/* FOOTER */}{" "}
      <footer className="w-full border-t border-white/10 py-8 mt-10 text-center text-gray-400">
        {" "}
        © 2025 EvTick. All rights reserved.{" "}
      </footer>{" "}
      {/* MODAL */}{" "}
      <SeatsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
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
      />{" "}
    </div>
  );
}
