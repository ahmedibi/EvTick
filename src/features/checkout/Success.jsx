import { ArrowBigRight } from "lucide-react";
import { useNavigate } from "react-router";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useMemo } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const COLORS = [
  "bg-yellow-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-blue-400",
  "bg-lime-400",
  "bg-orange-400",
];

export default function Success() {
  const navigate = useNavigate();

  function goHome() {
    navigate("/");
  }

  // 🎊 Generate ribbons ONCE
  const ribbons = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        // eslint-disable-next-line react-hooks/purity
        left: Math.random() * 100, // %
          // eslint-disable-next-line react-hooks/purity
        delay: Math.random() * 2,
          // eslint-disable-next-line react-hooks/purity
        duration: 6 + Math.random() * 4,
          // eslint-disable-next-line react-hooks/purity
        rotate: Math.random() * 360,
          // eslint-disable-next-line react-hooks/purity
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
          // eslint-disable-next-line react-hooks/purity
        size: 2 + Math.random() * 2,
      })),
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gray-100">

      {/* 🎉 Ribbons */}
      {ribbons.map((r, i) => (
        <motion.div
          key={i}
          initial={{ y: -60, rotate: r.rotate, opacity: 0.6 }}
          animate={{ y: "110vh", opacity: 1 }}
          transition={{
            duration: r.duration,
            repeat: Infinity,
            delay: r.delay,
            ease: "linear",
          }}
          style={{
            left: `${r.left}%`,
            width: `${r.size * 3}px`,
            height: `${r.size * 10}px`,
          }}
          className={`absolute top-0 rounded-full ${r.color}`}
        />
      ))}

      {/* 🧾 Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg p-8 w-[350px] text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-teal-100 flex items-center justify-center">
           <DotLottieReact
      src="https://lottie.host/110f3706-5568-4394-a06e-93d041590f46/9VAnJoPWkv.lottie"
      loop
      autoplay
    />
        </div>
        <div className="w-30 h-30 mx-auto rounded-full flex items-center justify-center">
           <DotLottieReact
      src="https://lottie.host/7aeb1658-873f-42e0-939d-b8ac13bd0bd5/PCbGcirPIL.lottie"
      loop
      autoplay
    />
        </div>

        <h2 className="text-xl font-bold text-gray-800 mt-4">
          Payment Successful
        </h2>

        <p className="text-gray-600 mt-2">
          Your booking has been confirmed. You are now prepared to attend the event.
        </p>

        <button
          className="text-sm mx-auto text-gray-400 mt-4 flex justify-center items-center gap-1 border-b cursor-pointer"
          onClick={goHome}
        >
          Go Home <ArrowBigRight />
        </button>

        <button className="mt-6 w-full bg-teal-500 text-white py-3 cursor-pointer rounded-xl font-semibold hover:bg-teal-600"
        onClick={()=>navigate("/profile/tickets")}
        >
          View My Tickets
        </button>
      </div>
    </div>
  );
}
