import React from "react";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-teal-600 flex items-center justify-center px-4 overflow-hidden relative">
      
      {/* Background blur */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 text-center">

        {/* 404 */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <span className="text-white text-[140px] sm:text-[180px] font-light"
          style={{ 
            fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
            }}
          >4</span>

          {/* Lottie Icon */}
          <div className="bg-white rounded-full shadow-2xl flex items-center justify-center w-[140px] h-[140px] sm:w-[200px] sm:h-[200px]">
            <iframe
              src="https://embed.lottiefiles.com/animation/78773"
              className="w-full h-full rounded-full"
              title="404 animation"
            />
          </div>

          <span className="text-white text-[140px] sm:text-[180px] font-light"
           style={{ 
            fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
            }}
          >4</span>
        </div>

        {/* Text */}
        <h1 className="text-white text-5xl sm:text-6xl font-semibold mb-4"
            style={{ 
            fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
            }}
        >
          Oops!
        </h1>

        <p className="text-white text-3xl sm:text-xl mb-10 opacity-90"
          style={{ 
            fontFamily: '"Brush Script MT", "Lucida Handwriting", cursive',
            }}
        >
          It seems you followed a broken link
        </p>

        {/* Button */}
        <button
          onClick={() =>navigate ("/")}
          className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white text-white rounded-full text-lg font-medium transition hover:bg-white hover:text-teal-600"
        >
          ← Back To Home
        </button>
      </div>
    </div>
  );
}
