import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateEventAfterCheckout } from '../../redux/slices/eventSlice';
import { clearCheckout, fetchLatestCheckout } from '../../redux/slices/checkoutSlice';
import { savePayment } from '../../redux/slices/paymentSlice';
import PaymentModal from '../../components/PaymentModal';
import { motion } from 'framer-motion';



const checkoutSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address')
});

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading } = useSelector(state => state.checkout);
  const { loading: paymentLoading } = useSelector(state => state.payment);
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState(null);

  // لو مفيش بيانات، نجيبها من Firebase
  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchLatestCheckout())
        .unwrap()
        .then((fetchedData) => {
          if (!fetchedData) {
            navigate('/');
          }
        })
        .catch(() => {
          navigate('/');
        });
    }
  }, [data, loading, dispatch, navigate]);

  // React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    mode: 'onBlur'
  });

  if (loading) return <p className="text-center text-white text-xl mt-10">Loading...</p>;
  if (!data) return null;

  const { eventName, eventDate, venue, tickets, serviceFee, eventId, userId , eventOwner } = data;

  const subtotal = tickets.reduce((sum, t) => sum + t.price, 0);
  const total = subtotal + serviceFee;
  const dateObj = eventDate ? new Date(eventDate) : null;

  // Handle Continue - فتح الـ Modal فقط
  const onContinue = async (formData) => {
    setUserFormData(formData);
    setIsPaymentModalOpen(true);
  };

  // Handle Payment - عند الضغط على Pay Now
  const handlePaymentSubmit = async (paymentData) => {
    try {
      // 1. حفظ بيانات الدفع في Firebase
      const paymentResult = await dispatch(savePayment({
        ...paymentData,
        eventId,
        eventName,
        eventOwner,
        tickets,
        total,
        serviceFee,
        userInfo: userFormData
      })).unwrap();

      // 2. تحديث الحدث لحجز المقاعد
      const eventResult = await dispatch(updateEventAfterCheckout({
        eventId,
        seats: tickets.map(t => ({ row: t.row, seat: t.seat })),
        userId,
        userInfo: userFormData
      })).unwrap();

      // 3. مسح الـ checkout من Redux
      dispatch(clearCheckout());
       alert("Payment completed successfully!");
      
      navigate("/events");
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  return (
    <>
      <div 
        className="min-h-screen bg-gray-100  flex items-center justify-center p-6">
        
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
                    className={`w-full bg-gray-100  border-2 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-600'
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
                    className={`w-full bg-gray-100 border-2 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-600'
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
                  className={`w-full bg-gray-100 border-2 ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
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
          className="w-full lg:w-96 "
        >
          {/* Right Side - Order Summary */}
          <div className="w-full lg:w-96 bg-black/8 backdrop-blur-md border border-white/20 rounded-lg p-6">
            
            {/* Event Info */}
            <div className="mb-6 pb-6 border-b border-black/20">
              <h2 className="text-xl font-semibold text-gray-700 my-3">{eventName}</h2>
              <p className="text-gray-700 text-sm mb-1">
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
              <p className="text-gray-700 text-sm">{venue}</p>
            </div>

            {/* Tickets */}
            <div className="mb-6 pb-6 border-b border-black/20">
              {tickets.map((ticket, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700 font-semibold">{ticket.type}</span>
                    <span className="text-gray-700 font-semibold">${ticket.price.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-4 text-gray-700 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Row</span>
                      <span>{ticket.row}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">Seat</span>
                      <span>{ticket.seat}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service fee</span>
                <span className="font-semibold">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-xl font-bold pt-3 border-t border-black/20">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
      </motion.div>
        </div>
      </div>

      {/* Payment Modal */}
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