import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import creditCard from '../assets/credit card.png';
import { FaGooglePay } from 'react-icons/fa';
import { showConfirmAlert } from './sweetAlert';

// ================= LUHN ALGORITHM =================
function validateCardNumberLuhn(cardNumber) {
  // إزالة أي مسافات أو شرطات
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  // التحقق من أن الرقم يحتوي على 16 رقم
  if (cleanNumber.length !== 16) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  // البدء من آخر رقم والسير للخلف
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
}

// ================= CARD PREVIEW =================
function CardPreview({ cardName, cardNumber, cardExpiry }) {
  const formattedNumber = cardNumber?.replace(/\D/g, "").match(/.{1,4}/g)?.join(" ") || "---- ---- ---- ----";
  
  return (
    <div
      className="w-full h-60 md:h-67 rounded-xl mb-8 bg-cover bg-center relative shadow-xl overflow-hidden"
      style={{
        backgroundImage: `url(${creditCard})`,
      }}
    >
      {/* Card Number */}
      <div className="absolute bottom-20 left-6 text-white text-2xl tracking-widest font-semibold">
        {formattedNumber}
      </div>
      {/* Cardholder Name */}
      <div className="absolute bottom-10 left-6 text-white text-sm">
        {cardName || "Card Name"}
      </div>
      {/* Expiry */}
      <div className="absolute bottom-40 right-6 text-white text-sm">
        {cardExpiry || "MM/YY"}
      </div>
    </div>
  );
}

// ================= ZOD SCHEMA =================
const paymentSchema = z.object({
  paymentMethod: z.enum(['card', 'googlepay', 'paypal']),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cvv: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'card') {
    if (!data.cardName || data.cardName.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Card name is required',
        path: ['cardName'],
      });
    }
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
    } else if (!validateCardNumberLuhn(data.cardNumber)) {
      // استخدام Luhn Algorithm للتحقق من صحة رقم الكارد
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid card number',
        path: ['cardNumber'],
      });
    }
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
      // التحقق من الشهر والسنة
      const [month, year] = data.cardExpiry.split('/').map(Number);
      if (month < 1 || month > 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Month must be between 01 and 12',
          path: ['cardExpiry'],
        });
      }
      if (year < 25 || year > 32) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Year must be between 25 and 32',
          path: ['cardExpiry'],
        });
      }
    }
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

// ================= PAYMENT MODAL =================
export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentSubmit,
  total,
  subtotal,
  serviceFee,
  isProcessing
}) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'card',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cvv: ''
    },
    mode: 'onChange'
  });

  const paymentMethod = watch('paymentMethod');
  const cardName = watch('cardName');
  const cardNumber = watch('cardNumber');
  const cardExpiry = watch('cardExpiry');
  const cvv = watch('cvv');

  if (!isOpen) return null;

  const onSubmit = async  (data) => {
    const confirmed = await showConfirmAlert("Do you want to proceed with the payment?");
     if (!confirmed) return;
    onPaymentSubmit(data);
  };

  const formatCardNumber = (value) =>
    value.replace(/\D/g, '').match(/.{1,4}/g)?.join('-') || value;

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/^-/, ''); // منع الأرقام السالبة
    if (value.length <= 16) {
      setValue('cardNumber', value, { shouldValidate: true });
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').replace(/^-/, ''); // منع الأرقام السالبة
    if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    if (value.length <= 5) setValue('cardExpiry', value, { shouldValidate: true });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').replace(/^-/, ''); // منع الأرقام السالبة
    if (value.length <= 3) setValue('cvv', value, { shouldValidate: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-gray-200 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer transition"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* ================= CARD PREVIEW HERE ================= */}
          <CardPreview
            cardName={cardName}
            cardNumber={cardNumber}
            cardExpiry={cardExpiry}
          />

          <h2 className="text-2xl font-bold text-gray-800 mb-8">Payment Details</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Payment Method Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                type="button"
                onClick={() => setValue('paymentMethod', 'googlepay')}
                className={`flex items-center justify-center gap-2 py-4 px-6 rounded-lg border-2 transition ${
                  paymentMethod === 'googlepay'
                    ? 'bg-pink-900 '
                    : 'bg-pink-900'
                }`}
              >
                <span className="text-[#ECCA5E] font-semibold"><FaGooglePay className='text-3xl'/></span>
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

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-6">
                {/* Card Name */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2 font-medium">
                    Full name (as displayed on card)
                  </label>
                  <input
                    type="text"
                    {...register('cardName')}
                    placeholder="Abdallah Elsaid"
                    className={`w-full bg-white text-gray-700 border ${
                      errors.cardName ? 'border-red-500' : 'border-gray-200'
                    } px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                  />
                  {errors.cardName && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>
                  )}
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-gray-700 text-sm mb-2 font-medium">
                    Card number
                  </label>
                  <input
                    type="text"
                    value={formatCardNumber(cardNumber)}
                    onChange={handleCardNumberChange}
                    placeholder="1234-5678-9012-3456"
                    className={`w-full bg-white border ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-200'
                    } text-gray-700 px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                {/* Expiry + CVV */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2 font-medium">
                      Card expiration (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="12/25"
                      maxLength={5}
                      className={`w-full bg-white border ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-200'
                      } text-gray-700 px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                    />
                    {errors.cardExpiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm mb-2 font-medium">
                      CVV (3 digits)
                    </label>
                    <input
                      type="text"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="123"
                      maxLength={3}
                      className={`w-full bg-white border ${
                        errors.cvv ? 'border-red-500' : 'border-gray-200'
                      } text-gray-700 px-4 py-3 rounded-lg focus:border-teal-400 focus:outline-none transition`}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pricing */}
            <div className="bg-neutral-400 rounded-lg p-6 space-y-3 mt-8">
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

            {/* Pay Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-teal-400 hover:bg-teal-500 text-black font-semibold py-4 rounded-lg transition-all duration-200 text-lg mt-6 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Pay now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}