import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
    const slides = [
        {
            bg: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200',
            title: 'Book your Tickets for Event!',
            subtitle: 'All the fun starts here.',
            features: [
                'Safe, Secure, Reliable ticketing.',
                'Your ticket to live entertainment!'
            ]
        },
        {
            bg: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200',
            title: 'Unforgettable Music Moments',
            subtitle: 'Experience live performances',
            features: [
                'World-class staging and lighting.',
                'Seamless event coordination!'
            ]
        },
        {
            bg: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
            title: 'Where Ideas Meet Impact',
            subtitle: 'Professional events that inspire',
            features: [
                'Business conferences and seminars.',
                'Engaging corporate experiences!'
            ]
        }
    ];

    const images = [
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
    ];

    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const current = slides[index];

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background with transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >

                    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />

                </motion.div>
            </AnimatePresence>

            {/* Decorative elements */}
            <div className="absolute top-20 right-20 w-64 h-64 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-1  origin-left transform rotate-45"
                />
            </div>
            <div className="absolute top-40 right-32 opacity-30">
                {[...Array(30)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-16 bg-black"
                        style={{
                            transform: `rotate(${i * 12}deg)`,
                            transformOrigin: '0 100px'
                        }}
                    />
                ))}
            </div>
            <div className="absolute bottom-32 right-20 opacity-20">
                <svg width="200" height="60" viewBox="0 0 200 60">
                    <path d="M0,30 Q50,0 100,30 T200,30" stroke="black" strokeWidth="2" fill="none" />
                    <path d="M0,45 Q50,15 100,45 T200,45" stroke="black" strokeWidth="2" fill="none" />
                </svg>
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
                <div className="flex items-center justify-between w-full gap-12">
                    {/* Left content */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.8 }}
                            className="flex-1"
                        >
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-gray-700 text-lg mb-4 font-light"
                            >
                                {current.subtitle}
                            </motion.p>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-6xl font-bold text-black mb-8 leading-tight"
                            >
                                {current.title}
                            </motion.h1>

                            <div className="space-y-4 mb-12">
                                {current.features.map((feature, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="w-2 h-2 bg-black rounded-full" />

                                        <p className="text-gray-800 text-lg">{feature}</p>

                                    </motion.div>
                                ))}
                            </div>

                            <motion.a
                                href='/events'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group bg-black/5 backdrop-blur-sm rounded-full text-black border border-black/20 hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-3 px-8 py-3 text-lg font-medium w-[200px]"
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

                            {/* Slide indicators */}
                            <div className="flex gap-3 mt-12">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setIndex(i)}
                                        className={`h-1 transition-all duration-300 ${i === index ? 'w-16 bg-black' : 'w-8 bg-black/40'
                                            }`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Right image grid */}
                    <div className="relative w-[500px] h-[600px] hidden lg:block">
                        {/* Decorative frame */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="absolute -top-4 -right-4 w-64 h-64 border-2 border-black/20"


                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute -bottom-4 left-12 w-48 h-48 border-2 border-black/20"



                        />

                        {/* Image grid */}
                        <div className="relative grid grid-cols-2 gap-4 h-full">
                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={images[0]}
                                    alt="Event"
                                    className="w-full h-[280px] object-cover mt-20 rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/40 via-transparent to-transparent rounded-2xl" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: -50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative overflow-hidden mt-15 rounded-2xl"
                            >
                                <img
                                    src={images[1]}
                                    alt="Event"
                                    className="w-full h-[280px] object-cover mt-5 rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/40 via-transparent to-transparent rounded-2xl" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative overflow-hidden rounded-2xl"
                            >
                                <img
                                    src={images[2]}
                                    alt="Event"
                                    className="w-full h-[280px] object-cover rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-red-500/40 via-transparent to-transparent rounded-2xl" />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2, delay: 0.1 }}
                                whileHover={{ scale: 1.05, zIndex: 10 }}
                                className="relative overflow-hidden -mt-12 rounded-2xl"
                            >
                                <img
                                    src={images[3]}
                                    alt="Event"
                                    className="w-full h-[280px] object-cover mt-12 rounded-2xl"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/40 via-transparent to-transparent rounded-2xl" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}