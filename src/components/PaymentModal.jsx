import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Zod Schema مع Validation محسّن
const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'googlepay', 'paypal']),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  // Validation only for card payment
  if (data.paymentMethod === 'card') {
    // Card Name
    if (!data.cardName || data.cardName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card name is required',
        path: ['cardName'],
      });
    }

    // Card Number
    if (!data.cardNumber || data.cardNumber.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number is required',
        path: ['cardNumber'],
      });
    } else if (data.cardNumber.replace(/\D/g, '').length !== 16) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card number must be 16 digits',
        path: ['cardNumber'],
      });
    }

    // Card Expiry
    if (!data.cardExpiry || data.cardExpiry.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Expiry date is required',
        path: ['cardExpiry'],
      });
    } else if (!/^\d{2}\/\d{2}$/.test(data.cardExpiry)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Format must be MM/YY',
        path: ['cardExpiry'],
      });
    } else {
      const [month, year] = data.cardExpiry.split('/').map(Number);
      
      // التحقق من الشهر (1-12)
      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Month must be between 01 and 12',
          path: ['cardExpiry'],
        });
      }
      
      // التحقق من السنة (25-32)
      if (year < 25 || year > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Year must be between 25 and 32',
          path: ['cardExpiry'],
        });
      }
      
      // التحقق من أن التاريخ لم ينتهي بعد
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100; // آخر رقمين من السنة
      const currentMonth = currentDate.getMonth() + 1;
      
      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Card has expired',
          path: ['cardExpiry'],
        });
      }
    }

    // CVV - 3 أرقام فقط
    if (!data.cvv || data.cvv.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV is required',
        path: ['cvv'],
      });
    } else if (data.cvv.length !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CVV must be exactly 3 digits',
        path: ['cvv'],
      });
    }
  }
});

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  onPaymentSubmit, 
  total, 
  subtotal, 
  serviceFee, 
  isProcessing 
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cvv: ''
    },
    mode: 'onBlur'
  });

  const paymentMethod = watch('paymentMethod');
  const cardNumber = watch('cardNumber');
  const cardExpiry = watch('cardExpiry');
  const cvv = watch('cvv');

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onPaymentSubmit(data);
  };

  // Format card number with dashes
  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    const formatted = numbers.match(/.{1,4}/g)?.join('-') || numbers;
    return formatted;
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      setValue('cardNumber', value, { shouldValidate: true });
    }
  };

  // Handle expiry input مع validation محسّن
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // إضافة / تلقائياً بعد الشهر
    if (value.length >= 2) {
      const month = value.slice(0, 2);
      const year = value.slice(2, 4);
      value = month + (year ? '/' + year : '');
    }
    
    if (value.length <= 5) {
      setValue('cardExpiry', value, { shouldValidate: true });
    }
  };

  // Handle CVV input - 3 أرقام فقط
  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setValue('cvv', value, { shouldValidate: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-neutral-800 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-white mb-8">Payment Details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Payment Method Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'googlepay')}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 transition ${
                  paymentMethod === 'googlepay'
                    ? 'bg-neutral-700 border-blue-500'
                    : 'bg-neutral-700 border-gray-600 hover:border-gray-500'
                }`}
              >
                <span className="text-white font-semibold">Google Pay</span>
              </button>

                <button
                type="button"
                onClick={() => setValue('paymentMethod', 'paypal')}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 transition ${
                  paymentMethod === 'paypal'
                    ? 'bg-yellow-500 border-yellow-500'
                    : 'bg-teal-400 border-teal-400 hover:bg-teal-500'
                }`}
              >
                <span className="text-xl text-blue-900">
                  <i className="fa-brands fa-paypal"></i>
                </span>
                <span className="text-blue-900 font-bold">Paypal</span>
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-gray-600"></div>
              <span className="text-gray-400 text-sm">or pay with card</span>
              <div className="flex-1 h-px bg-gray-600"></div>
            </div>

            {/* Card Form - Show only if card method */}
            {paymentMethod === 'card' && (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-white text-sm mb-2 font-medium">
                    Full name (as displayed on card)
                  </label>
                  <input
                    type="text"
                    {...register('cardName')}
                    placeholder="Abdallah Elsaid"
                    className={`w-full bg-neutral-700 border-2 ${
                      errors.cardName ? 'border-red-500' : 'border-gray-600'
                    } text-white px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                  />
                  {errors.cardName && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.cardName.message}
                    </p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-white text-sm mb-2 font-medium">
                    Card number
                  </label>
                  <input
                    type="text"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardNumberChange}
                    placeholder="1234-5678-9012-3456"
                    className={`w-full bg-neutral-700 border-2 ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-600'
                    } text-white px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.cardNumber.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Expiry */}
                  <div>
                    <label className="block text-white text-sm mb-2 font-medium">
                      Card expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/25"
                      maxLength={5}
                      className={`w-full bg-neutral-700 border-2 ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-600'
                      } text-white px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                    />
                    {errors.cardExpiry && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.cardExpiry.message}
                      </p>
                    )}
                  </div>

                  {/* CVV */}
                  <div>
                    <label className="block text-white text-sm mb-2 font-medium">
                      CVV (3 digits)
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      maxLength={3}
                      className={`w-full bg-neutral-700 border-2 ${
                        errors.cvv ? 'border-red-500' : 'border-gray-600'
                      } text-white px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                    />
                    {errors.cvv && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.cvv.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Summary */}
            <div className="bg-neutral-700 rounded-lg p-6 space-y-3 mt-8">
              <div className="flex justify-between text-white">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Service Fee</span>
                <span className="font-semibold">${serviceFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-600 pt-3 mt-3">
                <div className="flex justify-between text-white text-xl font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Pay Now Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-4 rounded-lg transition-all duration-200 text-lg mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}