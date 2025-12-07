
import React from "react";
import img21 from "../../assets/img2.jpg";
import img22 from "../../assets/img2.jpg";
import img23 from "../../assets/img2.jpg";
import img24 from "../../assets/img2.jpg";
import img25 from "../../assets/img2.jpg";

export default function WeddingSection() {
    return (
        <section className="w-full bg-[#000] text-white px-6 py-16 md:px-12 relative overflow-hidden">


            {/* BOTTOM SECTION */}
            <div className="mt-135 w-screen relative h-80 left-1/2 right-1/2 
                -mx-[50vw] overflow-hidden">
                <img
                    src={img25}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt="Wedding scene"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <h3 className="text-4xl md:text-5xl font-serif mb-6 tracking-wide" style={{ fontFamily: 'Georgia, serif', fontWeight: 300 }}>
                        In love with what you're seeing?
                    </h3>
                    <div className="w-60 h-px bg-white mb-4"></div>
                    <button className="text-[1.25rem] italic font-serif hover:opacity-70 transition">
                        let's connect
                    </button>
                </div>
            </div>
        </section>
    );
}