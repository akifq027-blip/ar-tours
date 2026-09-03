import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Lock,
} from 'lucide-react';
import { api } from '../services/api';
import { CarBooking } from '../types';

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    bookingId: string;
    bookingNumber: string;
    order: {
      id: string;
      amount: number; // in paise
      currency: string;
    };
    keyId: string;
    car: {
      name: string;
      brand: string;
      image: string;
    };
    pricing: {
      rentalDays: number;
      ratePerDay: number;
      totalRentalAmount: number;
      payableNow: number;
      remainingAmount: number;
      securityDeposit: number;
    };
  };
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (booking: CarBooking) => void;
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  onClose,
  orderData,
  customerInfo,
  onSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [bank, setBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSimulatedPayment = async () => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      // Simulate realistic payment gateway processing latency
      await new Promise(r => setTimeout(r, 1200));

      const fakePaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const simSignature = `sim_sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

      // Send to server for HMAC-SHA256 signature verification & booking status update
      const verificationResponse = await api.verifyPayment({
        razorpay_order_id: orderData.order.id,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: simSignature,
        booking_id: orderData.bookingId,
      });

      if (verificationResponse.success) {
        onSuccess(verificationResponse.booking);
      } else {
        setErrorMsg(verificationResponse.message || 'Payment verification failed on the server.');
      }
    } catch (err: any) {
      console.error('Payment processing error:', err);
      setErrorMsg(err.message || 'Payment failed. Please check your details and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 max-w-lg w-full overflow-hidden text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Razorpay Security Badge */}
        <div className="bg-slate-950/80 text-white p-5 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xs shadow">
              ₹499
            </div>
            <div>
              <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Razorpay 256-Bit Secure Checkout</span>
              </div>
              <h3 className="text-base font-bold text-white">Car Slot Reservation</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking & Price Summary */}
        <div className="bg-white/[0.03] p-5 border-b border-white/10 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Vehicle:</span>
            <span className="font-semibold text-white">{orderData.car.brand} {orderData.car.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Duration:</span>
            <span className="font-medium text-slate-300">{orderData.pricing.rentalDays} Day(s) @ ₹{orderData.pricing.ratePerDay}/day</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Total Rental Estimate:</span>
            <span className="font-semibold text-white">₹{orderData.pricing.totalRentalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Payable at Vehicle Pickup:</span>
            <span className="font-medium text-slate-300">₹{orderData.pricing.remainingAmount.toLocaleString('en-IN')} + ₹{orderData.pricing.securityDeposit} deposit</span>
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm font-bold text-white">Token Slot Fee (Payable Now):</span>
            <span className="text-lg font-black text-amber-400">₹{orderData.pricing.payableNow}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="p-5 space-y-4">
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                paymentMethod === 'upi'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                paymentMethod === 'card'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition ${
                paymentMethod === 'netbanking'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Netbanking</span>
            </button>
          </div>

          {/* Form per method */}
          {paymentMethod === 'upi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Enter UPI ID (Google Pay, PhonePe, Paytm, BHIM)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="e.g. mobile@upi or username@okhdfcbank"
                  className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>
              <div className="flex gap-2">
                {['@okaxis', '@okhdfcbank', '@paytm', '@ybl'].map(handle => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => setUpiId(prev => prev.split('@')[0] + handle)}
                    className="text-[11px] px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-slate-300 transition"
                  >
                    {handle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  placeholder="4111 2222 3333 4444"
                  className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Expiry Date</label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">CVV</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={e => setCardCvv(e.target.value)}
                    placeholder="123"
                    className="w-full px-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'netbanking' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Select Bank</label>
              <select
                value={bank}
                onChange={e => setBank(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              id="btn-pay-razorpay-confirm"
              type="button"
              onClick={handleSimulatedPayment}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Verifying Transaction with Razorpay...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Pay ₹{orderData.pricing.payableNow} &amp; Confirm Vehicle Slot</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-slate-400">
              Receipt will be issued under Order #{orderData.bookingNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
