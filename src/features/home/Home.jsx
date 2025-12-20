import React, { useMemo } from 'react';
import HeroSection from './HeroSection';
import ModernAppSection from './ModernAppSection';
import Navbar from './Navbar';
import EventCategoriesSection from './EventCategoriesSection';
import Footer from './Footer';
import ChatBot from './ChatBot';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Home() {

 const COLORS = [
  "bg-yellow-400",
  "bg-pink-400",
  "bg-purple-400",
  "bg-blue-400",
  "bg-lime-400",
  "bg-orange-400",
];

  const ribbons = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        // eslint-disable-next-line react-hooks/purity
        left: Math.random() * 90, // %
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
    <>

      <div className="snap-y snap-mandatory min-h-screen ">


     {ribbons.map((r, i) => (
           <motion.div
             key={i}
             initial={{ y: -60, rotate: r.rotate, opacity: 0.6 }}
             animate={{ y: "100vh", opacity: 1 }}
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

        <HeroSection />

        <ModernAppSection />



        <EventCategoriesSection />


        <ChatBot/>

      </div>


    </>
  );
}
