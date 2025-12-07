// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchEventTypes, fetchEventsByType } from "../../redux/slices/eventSlice";
// import { useNavigate } from "react-router-dom";
// import Reveal from "../home/Reveal"; // نفس الكومبوننت اللي استخدمتيه في ModernAppSection

// export default function EventCategoriesSection() {
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const { events, loading } = useSelector((state) => state.events);

//     const [activeCategory, setActiveCategory] = useState(null);

//     const categories = [
//         "Charity",
//         "Community",
//         "Corporate",
//         "Educational",
//         "Entertainment",
//         "Marketing",
//         "School & University",
//         "Tec",
//         "sports",
//     ];

//     useEffect(() => {
//         dispatch(fetchEventTypes());
//     }, [dispatch]);

//     const handleCategoryClick = (cat) => {
//         setActiveCategory(cat);
//         dispatch(fetchEventsByType(cat));
//     };

//     return (
//         <section className="w-full py-0 bg-black">
//             <div
//                 className="w-full py-20 bg-cover bg-center"
//                 style={{
//                     backgroundImage: "url('/yourImage.jpg')",
//                 }}
//             >
//                 <div className="max-w-10xl  text-center px-6 text-white">

//                     <Reveal delay={0.2}>
//                         <h2 className="text-4xl font-bold">Our Event Categories</h2>
//                     </Reveal>

//                     <Reveal delay={0.3}>
//                         <p className="opacity-80 mt-3">
//                             Choose a category to explore all events created for this type.
//                         </p>
//                     </Reveal>

//                     {/* Category Buttons */}
//                     <div className="flex flex-wrap justify-center gap-3 mt-[30px]">
//                         {categories.map((cat, idx) => (
//                             <Reveal key={idx} delay={0.1 + idx * 0.05}>
//                                 <button
//                                     onClick={() => navigate("/events", { state: { category: cat } })}
//                                     className={`px-5 py-2 rounded-full border border-[#545453] transition-all
//                                         ${activeCategory === cat
//                                             ? "bg-black text-white"
//                                             : "bg-black bg-opacity-40 text-white hover:bg-white hover:text-black"
//                                         }`}
//                                 >
//                                     {cat}
//                                 </button>
//                             </Reveal>
//                         ))}
//                     </div>


//                     <Reveal delay={0.1}>
//                         <div className="flex items-center gap-3 mt-10 mx-20">
//                             <div className="w-1 h-6 bg-white"></div>

//                             <p className="text-lg tracking-wide opacity-120 text-left">
//                                 ONLY THE BEST EVENTS
//                             </p>
//                         </div>
//                     </Reveal>

//                     {/* Cards Section */}
//                     <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
//                         {[
//                             {
//                                 name: "Entertainment",
//                                 img: "https://d3vzzcunewy153.cloudfront.net/img/17f95c00-4ab0-492d-94a6-3a647e5ea2fe/75c89964b5dc5f135cef1ac6f5269c59.jpg"
//                             },
//                             {
//                                 name: "sports",
//                                 img: "https://i.ibb.co/wrFf4SxM/0da609fe2283484394f0e6b9c823b746.jpg"
//                             },
//                             {
//                                 name: "Educational",
//                                 img: "https://newsroom.info/UploadCache/libfiles/13/0/800x450o/138.jpeg"
//                             }
//                         ].map((cat, i) => (
//                             <Reveal key={i} delay={0.1 + i * 0.1}>
//                                 <div
//                                     onClick={() => navigate("/events", { state: { category: cat.name } })}
//                                     className="relative h-[200px] w-full rounded-[25px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
//                                 >
//                                     <img
//                                         src={cat.img}
//                                         alt={cat.name}
//                                         className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
//                                     />
//                                     <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
//                                     <div className="absolute bottom-6 left-6 text-white">
//                                         <h3 className="text-3xl font-bold">{cat.name}</h3>
//                                         <p className="opacity-100 text-sm mt-1">
//                                             Explore all events in this category
//                                         </p>
//                                     </div>
//                                 </div>
//                             </Reveal>
//                         ))}
//                     </div>

//                     {/* SEE ALL Button */}
//                     <Reveal delay={0.1}>
//                         <button
//                             onClick={() => navigate("/events")}
//                             className="px-6 py-2 bg-transparent text-white border border-[#545453] rounded-xl font-semibold shadow-lg hover:bg-white hover:text-black transition"
//                         >
//                             See All Events
//                         </button>
//                     </Reveal>
//                 </div>
//             </div>
//         </section>
//     );
// }


import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventTypes, fetchEventsByType } from "../../redux/slices/eventSlice";
import { useNavigate } from "react-router-dom";
import Reveal from "../home/Reveal";

export default function EventCategoriesSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { events, loading } = useSelector((state) => state.events);

    const [activeCategory, setActiveCategory] = useState(null);

    // IMPORTANT — لازم يكون هنا
    const categories = [
        "Charity",
        "Community",
        "Corporate",
        "Educational",
        "Entertainment",
        "Marketing",
        "School & University",
        "Tec",
        "sports",
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


    // inline styles to disable snap & avoid full-screen forcing on mobile
    const sectionStyle = isMobile
        ? { scrollSnapAlign: "auto", height: "auto", scrollSnapType: "none" } // disable snap behavior on mobile
        : {}; // keep default behavior on larger screens

    return (
        <section
            className="w-full bg-black"
            style={sectionStyle}
        >
            <div
                className="w-full bg-cover bg-center py-16 md:py-24 px-4 sm:px-6 lg:px-12"
                style={{ backgroundImage: "url('/yourImage.jpg')" }}
            >
                <div className="max-w-7xl mx-auto text-center text-white">

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
                                    onClick={() => navigate("/events", { state: { category: cat } })}
                                    className={`px-5 py-2 rounded-full border border-[#545453] transition-all
                                        ${activeCategory === cat
                                            ? "bg-black text-white"
                                            : "bg-black bg-opacity-40 text-white hover:bg-white hover:text-black"
                                        }`}
                                >
                                    {cat}
                                </button>
                            </Reveal>
                        ))}
                    </div>


                    <Reveal delay={0.1}>
                        <div className="flex items-center gap-3 mt-10 mx-20">
                            <div className="w-1 h-6 bg-white"></div>

                            <p className="text-lg tracking-wide opacity-120 text-left">
                                ONLY THE BEST EVENTS
                            </p>
                        </div>
                    </Reveal>

                    {/* Cards Section */}
                    <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Entertainment",
                                img: "https://d3vzzcunewy153.cloudfront.net/img/17f95c00-4ab0-492d-94a6-3a647e5ea2fe/75c89964b5dc5f135cef1ac6f5269c59.jpg"
                            },
                            {
                                name: "sports",
                                img: "https://i.ibb.co/wrFf4SxM/0da609fe2283484394f0e6b9c823b746.jpg"
                            },
                            {
                                name: "Educational",
                                img: "https://newsroom.info/UploadCache/libfiles/13/0/800x450o/138.jpeg"
                            }
                        ].map((cat, i) => (
                            <Reveal key={i} delay={0.1 + i * 0.1}>
                                <div
                                    onClick={() => navigate("/events", { state: { category: cat.name } })}
                                    className="relative h-[200px] w-full rounded-[25px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
                                >
                                    <img
                                        src={cat.img}
                                        alt={cat.name}
                                        className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-3xl font-bold">{cat.name}</h3>
                                        <p className="opacity-100 text-sm mt-1">
                                            Explore all events in this category
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* SEE ALL Button */}
                    <Reveal delay={0.1}>
                        <button
                            onClick={() => navigate("/events")}
                            className="px-6 py-2 bg-transparent text-white border border-[#545453] rounded-xl font-semibold shadow-lg hover:bg-white hover:text-black transition"
                        >
                            See All Events
                        </button>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

