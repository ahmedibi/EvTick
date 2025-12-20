import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { db } from "../../firebase/firebase.config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import Navbar from "../home/Navbar";
import { useSelector } from "react-redux";

export default function ContactUs() {

  const { currentUser } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };


  const validate = () => {
    const newErrors = {};


    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }


    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{8,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Phone number must be 8-15 digits";
    }


    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email.trim())
    ) {
      newErrors.email = "Invalid email address";
    }


    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await addDoc(collection(db, "contactMessages"), {
        ...formData,
        userId: currentUser?.uid || null,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      toast.success("Message sent successfully!");
      setFormData({ fullName: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <>
    

    
      <div className="relative w-full pt-30 pb-10 overflow-hidden">

        {/* Lines + Title */}
        <div className="relative z-10  flex flex-col items-center bg-gray-100 justify-center h-full text-center">

          {/* Top Moving Line */}
          <div className="w-full max-w-[600px] h-[2px]  relative overflow-hidden mb-6">
            <div className="absolute top-0 h-full w-[120px] bg-gradient-to-r from-teal-300 via-teal-500 to-teal-700 animate-line"></div>
          </div>

          <h1 className="text-gray-800 text-4xl md:text-6xl font-bold tracking-widest">
            CONTACT&nbsp;US
          </h1>

          {/* Bottom Moving Line */}
          <div className="w-full max-w-[600px] h-[3px]  relative overflow-hidden mt-6">
            <div className="absolute top-0 h-full w-[120px] bg-gradient-to-r from-teal-300 via-teal-500 to-teal-700 animate-line-reverse"></div>
          </div>

        </div>
      </div>

      <div className="w-full  min-h-screen bg-gray-100 pb-20 px-6">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 ">

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-full blur-3xl opacity-60"></div>
            <div className="relative bg-white/80 backdrop-blur-sm p-12 lg:p-16 rounded-full shadow-2xl aspect-square flex flex-col justify-center max-w-[600px] mx-auto">
              <h2 className="text-xl lg:text-3xl text-center font-bold text-black mb-10 tracking-wide">
                GET THE PARTY START
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* FULL NAME */}
                <div>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full border-b-2 pb-3 outline-none text-gray-700 placeholder:text-gray-400 text-lg focus:border-gray-500 transition-colors bg-transparent ${errors.fullName ? "border-red-500" : "border-gray-300"
                      }`}
                    type="text"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                {/* PHONE */}
                <div>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone no"
                    className={`w-full border-b-2 pb-3 outline-none text-gray-700 placeholder:text-gray-400 text-lg focus:border-gray-500 transition-colors bg-transparent ${errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    type="text"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* EMAIL */}
                <div>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                    className={`w-full border-b-2 pb-3 outline-none text-gray-700 placeholder:text-gray-400 text-lg focus:border-gray-500 transition-colors bg-transparent ${errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                {/* MESSAGE */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message"
                    className={`w-full border-b-2 pb-3 outline-none text-gray-700 placeholder:text-gray-400 text-lg focus:border-gray-500 transition-colors bg-transparent resize-none ${errors.message ? "border-red-500" : "border-gray-300"
                      }`}
                    rows={3}
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                  )}
                </div>

                <div className="flex justify-center pt-6">
                  <button
                    type="submit"
                    className="px-16 py-5 text-black font-bold text-xl tracking-widest rounded-full bg-gradient-to-r from-teal-300 via-teal-500 to-teal-700 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    SUBMIT
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/*   RIGHT INFO  */}
          <div className="space-y-10 mt-14">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-black mb-6 tracking-wide">
                LET'S GET IN TOUCH
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                We love making every event unforgettable. Reach out to us and let’s start booking your perfect party today!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 pt-6">

              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <MapPin size={32} className="text-black" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold tracking-widest text-black mb-3 text-sm">LOCATION</h4>
                  <p className="text-gray-600 leading-relaxed">
                    7065 West Clinton St.Palm Coast, FL 32137
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <Phone size={32} className="text-black" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold tracking-widest text-black mb-3 text-sm">PHONE NO</h4>
                  <p className="text-gray-600">+09(123)(4567)(890)</p>
                  <p className="text-gray-600">+09(123)(4567)(890)</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <Clock size={32} className="text-black" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold tracking-widest text-black mb-3 text-sm">TIME</h4>
                  <p className="text-gray-600">Mon - saturday  10am to 08pm</p>
                  <p className="text-gray-600">Sunday                    Close</p>
                </div>
              </div>

              <div className="flex items-start gap-5">
                <div className="flex-shrink-0">
                  <Mail size={32} className="text-black" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-bold tracking-widest text-black mb-3 text-sm">EMAIL ADDRESS</h4>
                  <p className="text-gray-600">sale@themetechmount.com</p>
                  <p className="text-gray-600">info@themetechmount.com</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );

}
