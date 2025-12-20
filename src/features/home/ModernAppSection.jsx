import React from "react";
import phone1 from "../../assets/img.png";
import phone2 from "../../assets/img1.jpg";
import Reveal from "../home/Reveal";



export default function ModernAppSection() {
    return (

        <section className="relative w-full h-full py-28 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 overflow-hidden bg-gray-100">


            {/* Background behind everything */}


            <div className="relative max-w-7xl mx-auto z-20">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-12 md:gap-16 lg:gap-20 xl:gap-24">
                    <Reveal delay={0.1}>
                        <div className="relative w-full lg:w-1/2 flex items-center justify-center min-h-[350px] sm:min-h-[400px] md:min-h-[250px] lg:min-h-[500px] mt-[-82px]">
                            <img
                                src={phone1}
                                alt="App screen 1"
                                className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[580px] 
                                     rotate-[-8deg] drop-shadow-2xl 
                                     relative z-10
                                     absolute top-14 right-10
                                     transition-transform duration-300 hover:scale-105"
                            />
                            <img
                                src={phone2}
                                alt="App screen 2"
                                className="w-[180px] xs:w-[200px] sm:w-[220px] md:w-[240px] lg:w-[260px] xl:w-[280px] 
                                     absolute 
                                     top-8 sm:top-50 md:top-12 lg:top-25
                                     right-0 xs:right-4 sm:right-8 md:right-12 lg:left-30 xl:right-20
                                     rotate-[6deg] drop-shadow-2xl 
                                     z-20
                                     transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    </Reveal>

                    {/* Right Side - Text */}
                    <div className="w-full lg:w-1/2 text-black text-center lg:text-left px-2 sm:px-4 md:px-6 lg:px-0">

                        {/* Label */}
                        <Reveal delay={0.2}>
                            <p className="uppercase tracking-widest text-teal-500
                            lg:text-1xl
                                   xs:text-xs sm:text-sm 
                                      mb-2 sm:mb-3 
                                     font-semibold">
                                Convenient Interaction
                            </p>
                        </Reveal>

                        {/* Title */}
                        <Reveal delay={0.3}>
                            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-semibold
                                    font-bold text-black
                                     mb-3 sm:mb-4 md:mb-5 
                                     leading-tight">
                                Modern App
                            </h2>
                        </Reveal>
                        {/* Description */}
                        <Reveal delay={0.4}>
                            <p className="text-black/70 leading-relaxed
                            font-semibold 
                                    text-sm xs:text-base sm:text-lg md:text-xl lg:text-base xl:text-lg 
                                    mb-6 sm:mb-7 md:mb-8 
                                    max-w-xl mx-auto lg:mx-0">
                                We developed a simple and functional app. It is built in such a way
                                as to simplify the problem of the car selection and rental process.
                                View the location, statement, and other information about each
                                vehicle in one click.
                            </p>
                        </Reveal>
                        {/* Download Button */}
                        <Reveal delay={0.5}>
                            <a
                                href="/app-file.apk"
                                download
                                className="inline-flex items-center gap-2 px-10 py-2.5 rounded-full font-semibold hover:text-white transition  bg-teal-500 text-white
                         hover:bg-teal-600 "

                            >
                                Download App
                            </a>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section >
    );
}