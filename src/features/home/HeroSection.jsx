import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../home/Reveal";

import img2 from "../../assets/img2.jpg";
import img1 from "../../assets/img1.jpg";
import img from "../../assets/img.png";
import { Link } from 'react-router-dom';

export default function HeroSection() {
    const slides = [
        {
            bg: img,
            title: "Unforgettable Music Moments",
            text: "We bring concerts and festivals to life with world-class staging, lighting, and seamless coordination—so every moment feels electric.",
        },
        {
            bg: img1,
            title: "Where Ideas Meet Impact",
            text: "From business conferences to large-scale corporate events, we handle every detail to create seamless, inspiring experiences that engage your audience.",
        },
        {
            bg: img2,
            title: "Live. Connect. Experience.",
            text: "Discover powerful talks, inspiring speakers, and unforgettable live event experiences",
        },
    ];

    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const current = slides[index];

    return (
        <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-gray-900">

            {/* Background Transition */}
            <AnimatePresence>
                <motion.img
                    key={current.bg}
                    src={current.bg}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover opacity-70"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                />
            </AnimatePresence>


            <div className="absolute inset-0 bg-black/40"></div>


            <div className="absolute bottom-0 left-0 w-full h-50
                            bg-gradient-to-t from-black via-black/70 to-transparent z-[2]"></div>

            {/* Text Content */}
            <div className="relative z-10 max-w-3xl text-center px-4">

                <AnimatePresence mode="wait">
                    <Reveal delay={0.1}>
                        <motion.h1
                            key={current.title}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.8 }}
                            className="text-white text-4xl md:text-6xl font-bold tracking-wide leading-tight"
                        >
                            {current.title}
                        </motion.h1>
                    </Reveal>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <Reveal delay={0.2}>
                        <motion.p
                            key={current.text}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-gray-200 mt-6 text-lg md:text-xl"
                        >
                            {current.text}
                        </motion.p>
                    </Reveal>
                </AnimatePresence>
                <Reveal delay={0.3}>
                    <Link to="/events">
                        <motion.button
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-8 px-6 py-3 bg-transparent text-white border rounded-xl font-semibold shadow-lg hover:bg-white hover:text-black transition"
                        >
                            Explore Event Types
                        </motion.button>
                    </Link>
                </Reveal>
            </div>
        </div>
    );
}
