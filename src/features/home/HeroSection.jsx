
import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from "react";
import Reveal from "../home/Reveal";

const slides = [
    {
        titleTop: "All the fun starts here.",
        titleMain: "Book your Tickets for Event!",
        desc: "Your ticket to live entertainment",
    },
    {
        titleTop: "Feel the energy live.",
        titleMain: "Discover Amazing Events!",
        desc: "Music, shows and unforgettable moments",
    },
    {
        titleTop: "Moments that matter.",
        titleMain: "Experience Events Together!",
        desc: "Create memories with the people you love",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.15,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
    float: (i) => ({
        y: [0, -8 - i * 2, 0],
        transition: {
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
        },
    }),
};


function HeroSection() {

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

            <main className="container mx-auto px-6 pt-12 pb-24">

                <Reveal delay={0.1}>
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        className="flex flex-col items-center text-center mb-16 overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="flex flex-col items-center"
                            >
                                <motion.h2
                                    className="text-6xl md:text-7xl lg:text-6xl mt-10 text-black leading-tight mb-6 max-w-5xl font-semibold"
                                >
                                    <span className="text-teal-500 text-4xl">
                                        {slides[index].titleTop}
                                    </span>
                                    <br />
                                    {slides[index].titleMain}
                                </motion.h2>
                                <motion.p
                                    className="text-xl text-gray-700 mb-10 font-semibold"
                                >
                                    {slides[index].desc}
                                </motion.p>
                            </motion.div>
                        </AnimatePresence>
                        <motion.a
                            href='/events'
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group backdrop-blur-sm rounded-full bg-teal-500 text-white
                         hover:bg-teal-600 hover:text-white 
                        transition-all duration-300 flex items-center gap-3 px-8 py-3 text-lg w-[200px] font-semibold"
                        >
                            View More
                            <svg
                                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </motion.a>

                    </motion.div>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="relative mt-15">
                        <svg
                            className="absolute top-[-50px] left-0 w-full h-12"
                            viewBox="0 0 1200 60"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 30 Q600 50 1200 30"
                                fill="none"
                                stroke="#d1d5db"
                                strokeWidth="2"
                            />
                        </svg>


                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pt-2">
                            <motion.div
                                custom={0}
                                variants={cardVariants}
                                initial="hidden"
                                animate={["visible", "float"]}
                                whileHover={{ y: -10, rotate: 0 }} className="bg-white pt-0 rounded-3xl shadow-xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                                <div className="relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-teal-500  rounded-t-lg"></div>
                                    <div className="rounded-2xl h-40 mb-4 overflow-hidden">
                                        <img
                                            src="/img.png"
                                            alt="History"
                                            className="w-full h-full"
                                        />
                                    </div>


                                </div>
                            </motion.div>

                            <motion.div
                                custom={1}
                                variants={cardVariants}
                                initial="hidden"
                                animate={["visible", "float"]}
                                whileHover={{ y: -10, rotate: 0 }} className="bg-white rounded-3xl pt-0  shadow-xl p-6 transform rotate-1 hover:rotate-0 transition-transform">
                                <div className="relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-teal-500  rounded-t-lg"></div>
                                    <div className="rounded-2xl h-40 mb-4 overflow-hidden">
                                        <img
                                            src="/img1.jpg"
                                            alt="History"
                                            className="w-full h-full"
                                        />
                                    </div>


                                </div>
                            </motion.div>

                            <motion.div
                                custom={2}
                                variants={cardVariants}
                                initial="hidden"
                                animate={["visible", "float"]}
                                whileHover={{ y: -10, rotate: 0 }} className="bg-white rounded-3xl pt-0  shadow-xl p-6 transform -rotate-1 hover:rotate-0 transition-transform">
                                <div className="relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-teal-500  rounded-t-lg"></div>
                                    <div className="rounded-2xl h-40 mb-4 overflow-hidden">
                                        <img
                                            src="/img2.jpg"
                                            alt="Animals"
                                            className="w-full h-full"
                                        />
                                    </div>

                                </div>
                            </motion.div>

                            <motion.div
                                custom={3}
                                variants={cardVariants}
                                initial="hidden"
                                animate={["visible", "float"]}
                                whileHover={{ y: -10, rotate: 0 }} className="bg-white rounded-3xl pt-0  shadow-xl p-6 transform rotate-2 hover:rotate-0 transition-transform">
                                <div className="relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-teal-500  rounded-t-lg"></div>
                                    <div className="rounded-2xl h-40 mb-4 overflow-hidden">
                                        <img
                                            src="/event2.jpg"
                                            alt="Entertainment"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                </div>
                            </motion.div>

                            <motion.div
                                custom={4}
                                variants={cardVariants}
                                initial="hidden"
                                animate={["visible", "float"]}
                                whileHover={{ y: -10, rotate: 0 }} className="bg-white rounded-3xl pt-0  shadow-xl p-6 transform -rotate-2 hover:rotate-0 transition-transform">
                                <div className="relative">
                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-teal-500  rounded-t-lg"></div>
                                    <div className="rounded-2xl h-40 mb-4 overflow-hidden">
                                        <img
                                            src="/event1.jpg"
                                            alt="Geography"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                </div>
                            </motion.div>
                        </div>
                    </div>
                </Reveal>
            </main >
        </div >
    );
}

export default HeroSection;
