import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "../home/Reveal";

import img2 from "../../assets/img2.jpg";
import img1 from "../../assets/img1.jpg";
import img from "../../assets/img.png";

export default function HeroBackground() {
    const slides = [img, img1, img2];
    const [index, setIndex] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    return (

        <div className=" relative w-full h-full overflow-hidden">
            {/* Background Transition */}

            <AnimatePresence>

                <motion.img
                    key={slides[index]}
                    src={slides[index]}
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 1.2 }}
                    style={{
                        filter: "blur(8px)",
                    }}
                />

            </AnimatePresence>

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Dark Bottom Fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 w-full h-72
                bg-gradient-to-t 
                from-black via-black/80 to-transparent">
            </div>

        </div >

    );
}
