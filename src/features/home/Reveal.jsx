import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function RevealRepeat({ children, delay = 0 }) {
    const controls = useAnimation();
    const { ref, inView } = useInView({
        threshold: 0.3,
        triggerOnce: false, // 👈 خليها false علشان يشتغل كل مرة
    });

    useEffect(() => {
        if (inView) {
            controls.start("visible");
        } else {
            controls.start("hidden"); // 👈 يخليه يختفي لما يخرج من الشاشة
        }
    }, [inView]);

    const variants = {
        hidden: {
            opacity: 0,
            y: 100,
            filter: "blur(10px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1,
                delay: delay,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={variants}
        >
            {children}
        </motion.div>
    );
}
