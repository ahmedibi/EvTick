import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventTypes } from "../../redux/slices/eventSlice";
import { useNavigate } from "react-router-dom";
import Reveal from "../home/Reveal";



export default function EventCategoriesSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { events, loading } = useSelector((state) => state.events);

    const [activeCategory] = useState(null);


    const categories = [
        "Charity Events",
        "Community Events",
        "Corporate Events",
        "Educational Events",
        "Entertainment Events",
        "Marketing Events",
        "School & University Events",
        "Tec Events",
        "sports Events",
    ];

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") return window.innerWidth <= 768;
        return false;
    });

    useEffect(() => {
        dispatch(fetchEventTypes());
    }, [dispatch]);

    useEffect(() => {
        const onResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);



    const sectionStyle = isMobile
        ? { scrollSnapAlign: "auto", height: "auto", scrollSnapType: "none" } // disable snap behavior on mobile
        : {};

    return (
        <section style={sectionStyle} className="w-full bg-gradient-to-br from-gray-50 via-white to-gray-100">

            <div
                className="w-full bg-cover bg-center py-16 md:py-24 px-4 sm:px-6 lg:px-12"
                style={{ backgroundImage: "url('/yourImage.jpg')" }}
            >
                <div className="max-w-7xl mx-auto text-center text-black">
                    <Reveal delay={0.2}>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                            Our Event Categories
                        </h2>
                    </Reveal>

                    <Reveal delay={0.3}>
                        <p className="opacity-80 mt-3">
                            Choose a category to explore all events created for this type.
                        </p>
                    </Reveal>

                    {/* Category Buttons */}
                    <div className="flex flex-wrap justify-center gap-3 mt-[30px]">
                        {categories.map((cat, idx) => (
                            <Reveal key={idx} delay={0.1 + idx * 0.05}>
                                <button
                                    onClick={() => {
                                        navigate("/events", { state: { category: cat } });
                                        window.scrollTo({ top: 0, behavior: "smooth" });
                                    }}

                                    className={`px-5 py-2 rounded-full border border-[#545453] transition-all
                                        ${activeCategory === cat
                                            ? "bg-black text-white"
                                            : "bg-white/50 text-black hover:bg-black hover:text-white"
                                        }`}
                                >
                                    {cat}
                                </button>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={0.1}>
                        <div className="flex items-center gap-3 mt-10 mx-20">
                            <div className="w-1 h-6 bg-black"></div>

                            <p className="text-lg tracking-wide text-black text-left">

                                ONLY THE BEST EVENTS
                            </p>
                        </div>
                    </Reveal>

                    {/* Cards Section — Responsive */}
                    <div className="
    flex flex-wrap justify-center gap-6 mt-10
">
                        {[
                            {
                                name: "Entertainment",
                                img: "https://d3vzzcunewy153.cloudfront.net/img/17f95c00-4ab0-492d-94a6-3a647e5ea2fe/1ff490a1bf1fe7bb16c4f02ba1ba038d.jpg"
                            },
                            {
                                name: "sports",
                                img: "https://i.pinimg.com/736x/6a/10/e2/6a10e2d3afa35afab220e28000088b7f.jpg"
                            },
                            {
                                name: "Educational",
                                img: "https://newsroom.info/UploadCache/libfiles/13/0/800x450o/138.jpeg"
                            }
                        ].map((cat, i) => (

                            <div
                                onClick={() => {
                                    navigate("/events", { state: { category: cat.name } });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="
                    w-full 
                    sm:w-[90%] 
                    md:w-[45%] 
                    lg:w-[300px]
                    flex-shrink-0
                "
                            >
                                <div className="relative h-[200px] sm:h-[220px] md:h-[240px] lg:h-[250px] w-full rounded-[25px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300">
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                                    />

                                    <div className="absolute bottom-5 left-6 z-10">
                                        <h3 className="text-white text-2xl sm:text-3xl font-bold drop-shadow-lg">
                                            {cat.name}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                        ))}
                    </div>


                    <br />

                    {/* SEE ALL Button */}
                    <Reveal delay={0.2}>
                        <a
                            href="/events"
                            className="px-6 py-2 bg-black/5 text-black border border-black/30 rounded-full font-semibold shadow-lg hover:bg-black hover:text-white "

                        >
                            See All Events
                        </a>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
