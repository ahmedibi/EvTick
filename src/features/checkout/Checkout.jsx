import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


import {
  fetchLatestCheckout,
  clearCheckout,
  deleteCheckout
} from '../../redux/slices/checkoutSlice';

import { auth } from "../../firebase/firebase.config";

import { updateEventAfterCheckout } from '../../redux/slices/eventSlice';
import { savePayment } from '../../redux/slices/paymentSlice';

import PaymentModal from '../../components/PaymentModal';
import { showErrorAlert } from '../../components/sweetAlert';

const checkoutSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email()
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { data, loading, error } = useSelector(state => state.checkout);
  const { loading: paymentLoading } = useSelector(state => state.payment);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState(null);
  const paymentCompletedRef = useRef(false);
  const isNavigatingRef = useRef(false);
  const hasFetched = useRef(false);

  /* =========================
     FETCH CHECKOUT
  ========================= */
  useEffect(() => {
    // Don't redirect if payment was just completed
    if (paymentCompletedRef.current || isNavigatingRef.current || location.pathname === '/success') return;

    if (!data && !loading && !error && !hasFetched.current) {
      hasFetched.current = true;
      dispatch(fetchLatestCheckout())
        .unwrap()
        .then(res => {
          // Only redirect if payment wasn't completed, not navigating, and no data found
          if (!res && !paymentCompletedRef.current && !isNavigatingRef.current && location.pathname !== '/success') {
            navigate('/');
          }
        })
        .catch(() => {
          // Only redirect if payment wasn't completed and not navigating
          if (!paymentCompletedRef.current && !isNavigatingRef.current && location.pathname !== '/success') {
            navigate('/');
          }
        });
    }
  }, [data, loading, error, dispatch, navigate, location.pathname]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (auth.currentUser?.email) {
      setValue("email", auth.currentUser.email);
    }
    if (auth.currentUser?.displayName) {
      const parts = auth.currentUser.displayName.split(" ");
      if (parts.length > 0) setValue("firstName", parts[0]);
      if (parts.length > 1) setValue("lastName", parts.slice(1).join(" "));
    }
  }, [setValue]);

  if (loading) return <p>Loading checkout...</p>;
  if (error) {
    console.error("Checkout error:", error);
    return <p>Error loading checkout: {error}</p>;
  }
  if (!data) {
    console.log("No checkout data available");
    return null;
  }

  // التحقق من وجود البيانات المطلوبة
  // if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
  //   console.error("Invalid tickets data:", tickets);
  //   return <p>Error: Invalid checkout data. Please try again.</p>;
  // }

  const {
    id: checkoutId,
    eventId,
    eventName,
    eventDate,
    venue,
    tickets,
    serviceFee,
    eventOwner,
    userId,
    isOnline,
    subtotal: storedSubtotal
  } = data;

  const dateObj = eventDate
    ? (eventDate.seconds
      ? new Date(eventDate.seconds * 1000)
      : new Date(eventDate))
    : null;


  const subtotal = isOnline ? storedSubtotal : tickets.reduce((s, t) => s + t.price, 0);
  const total = subtotal + serviceFee;

  /* =========================
     CONTINUE
     ========================= */
  const onContinue = (formData) => {
    setUserFormData(formData);
    setIsPaymentModalOpen(true);
  };

  /* =========================
     PAYMENT
     ========================= */
  const handlePaymentSubmit = async (paymentData) => {
    try {
      await dispatch(savePayment({
        ...paymentData,
        eventId,
        eventName,
        eventOwner,
        tickets,
        total,
        subtotal,
        serviceFee,
        userInfo: userFormData,
        isOnline
      })).unwrap();

      await dispatch(updateEventAfterCheckout({
        eventId,
        seats: tickets.map(t => ({ row: t.row, seat: t.seat })),
        userId,
        userInfo: userFormData,
        isOnline
      })).unwrap();

      // Mark payment as completed and navigating BEFORE deleteCheckout to prevent useEffect redirect
      paymentCompletedRef.current = true;
      isNavigatingRef.current = true;

      await dispatch(deleteCheckout(checkoutId)).unwrap();

      // Clear checkout before navigation
      dispatch(clearCheckout());

      // Navigate to success page with replace to prevent back navigation
      navigate("/success", { replace: true });

    } catch (err) {
      console.error(err);
      showErrorAlert("Payment failed");
    }
  };

  return (
    <>
      <div
        className="min-h-screen bg-gray-100  flex items-center justify-center pt-30">

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 w-full "
          >
            {/* Left Side - Form */}
            <div className="flex-1 w-full bg-white p-8 rounded-2xl">
              <h1 className="text-5xl font-bold text-teal-400 mb-8">Add your details</h1>

              <form onSubmit={handleSubmit(onContinue)} className="space-y-6">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-black text-sm mb-2">
                      First name
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`w-full bg-gray-100  border-2 ${errors.firstName ? 'border-red-500' : 'border-gray-600'
                        } text-gray-600 px-4 py-3 rounded focus:border-teal-300 focus:outline-none transition`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-black text-sm mb-2">
                      Last name
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`w-full bg-gray-100 border-2 ${errors.lastName ? 'border-red-500' : 'border-gray-600'
                        } text-gray-600 px-4 py-3 rounded focus:border-teal-300 focus:outline-none transition`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-black text-sm mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    readOnly
                    className={`w-full bg-gray-200 cursor-not-allowed border-2 ${errors.email ? 'border-red-500' : 'border-gray-600'
                      } text-gray-600 px-4 py-3 rounded focus:border-teal-300 focus:outline-none transition`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-teal-300 text-black font-semibold py-4 rounded hover:bg-teal-400 transition-all duration-200 text-lg mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Continue'}
                </button>
              </form>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="w-full lg:w-96 h-screen"
          >
            {/* Right Side - Order Summary */}
            <div className="w-full lg:w-96 bg-black/8 backdrop-blur-md border border-white/20 rounded-lg p-6">

              {/* Event Info */}
              <div className="mb-6 pb-3 border-b border-black/20">
                <h2 className="text-xl font-semibold text-gray-700 my-3">{eventName}</h2>
                <p className="text-gray-700 text-sm mb-1">{venue}</p>
                <p className="text-gray-700 text-sm ">
                  {dateObj?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}, {dateObj?.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>

              {/* Tickets */}
              <div className="mb-6  pb-3 border-b border-black/20">
                {isOnline ? (
                  <div className="mb-4">
                    <div className="flex justify-between gap-4 text-gray-700 text-sm">
                      <div className='flex gap-5'>
                        <span className="font-medium">Online Ticket (General Admission)</span>
                      </div>
                      <span className="text-gray-700 font-semibold">{subtotal.toFixed(2)} EGP</span>
                    </div>
                  </div>
                ) : (
                  tickets.map((ticket, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between gap-4 text-gray-700 text-sm">
                        <div className='flex gap-5'>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Row</span>
                            <span>{ticket.row}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Seat</span>
                            <span>{ticket.seat}</span>
                          </div>
                        </div>
                        <span className="text-gray-700 font-semibold">{ticket.price.toFixed(2)} EGP</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service fee</span>
                  <span className="font-semibold">{serviceFee.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-gray-700 text-xl font-bold pt-3 border-t border-black/20">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentSubmit={handlePaymentSubmit}
        total={total}
        subtotal={subtotal}
        serviceFee={serviceFee}
        isProcessing={paymentLoading}
      />
    </>
  );
}
