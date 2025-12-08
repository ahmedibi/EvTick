import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventTypes } from "../../redux/slices/eventSlice";
import { useNavigate } from "react-router-dom";
import Reveal from "../home/Reveal";

export default function EventCategoriesSection() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { types: eventTypes } = useSelector((state) => state.events);

    const fallbackCategories = [
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

    // إصلاح شكل البيانات لتوافق Firestore
    const displayCategories =
        eventTypes && eventTypes.length > 0
            ? eventTypes.map((cat) => ({
                  id: cat.id,
                  name: cat.type,
                  image: cat.photo,
                  description: cat.description,
              }))
            : fallbackCategories.map((name, index) => ({
                  id: index,
                  name,
                  image: null,
                  description: "",
              }));

    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchEventTypes());
    }, [dispatch]);

    // أول 3 كروسات فقط
    const topCategories = displayCategories.slice(0, 3);

    return (
        <section className="w-full bg-black">
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
                        {displayCategories.map((type, idx) => (
                            <Reveal key={type.id} delay={0.1 + idx * 0.05}>
                                <button
                                    onClick={() => {
                                        setActiveCategory(type.name);
                                        navigate(`events?eventType=${encodeURIComponent(type.name)}`);
                                      
                                    }}
                                    className={`px-5 py-2 rounded-full border border-[#545453] transition-all
                                        ${activeCategory === type.name
                                            ? "bg-white text-black"
                                            : "bg-black bg-opacity-40 text-white hover:bg-white hover:text-black"
                                        }`}
                                >
                                    {type.name}
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

                    {/* Cards Section — أول 3 فقط */}
                    <div className="flex justify-center gap-6 mt-10">
                        {topCategories.map((type, i) => (
                            <Reveal key={type.id} delay={0.1 + i * 0.1}>
                                <div className="w-[300px] flex-shrink-0">
                                    <div
                                        onClick={() =>
                                            navigate("/events", { state: { category: type.name } })
                                        }
                                        className="relative h-[250px] w-full rounded-[25px] overflow-hidden group cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300"
                                    >
                                        <img
                                            src={
                                                type.image ||
                                                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400"
                                            }
                                            alt={type.name}
                                            className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80"></div>
                                        <div className="absolute bottom-6 left-10 text-white">
                                            <h3 className="text-2xl font-bold">{type.name}</h3>
                                      
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>

                    {/* SEE ALL Button */}
                    <Reveal delay={0.1}>
                        <button
                            onClick={() => navigate("/events")}
                            className="px-6 py-2 bg-transparent text-white border border-[#545453] rounded-xl font-semibold shadow-lg hover:bg-white hover:text-black mt-10"
                        >
                            See All Events
                        </button>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
