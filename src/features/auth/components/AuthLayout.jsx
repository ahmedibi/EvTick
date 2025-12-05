import React from "react";

export default function AuthLayout({ children, reverse = false, imageSrc }) {
  return ( <div
    // <div className="min-h-screen flex items-center justify-center p-4 ">
        // {/* bg-[#f5eee9] p-4*/}
        // {/* <div className="auth-liquid-bg"></div> */}
     
        className={`min-h-screen flex shadow-2xl overflow-hidden  
        w-full 
        ${reverse ? "flex-row-reverse" : "flex-row" }
       `}
      > 
      {/* bg-black/90 min-h-[480px] max-w-[900px] shadow-2xl bg-brown/90 rounded-2xl md:h-[300px] */}
        
        {/* IMAGE SIDE */}
        <div className="hidden md:flex w-[50%] bg-white items-center justify-center">
          <img
            src={imageSrc}
            alt="auth"
            className="w-full h-full object-cover"
          />
        </div>

        {/* FORM SIDE */}
        <div
          className="flex-1 flex items-center justify-center bg-black/80 text-white
          p-6 sm:p-10 md:p-16 lg:p-24 relative"
          // ${reverse ? "rounded-l-2xl md:rounded-l-none md:rounded-br-2xl" : 
          //             "rounded-r-2xl md:rounded-r-none md:rounded-bl-2xl"}`}
        >
          <div className="w-full">{children}</div>
        </div>
      </div>
    // </div>
  );
}