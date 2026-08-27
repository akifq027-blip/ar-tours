import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  Car as CarIcon,
  AlertCircle,
  FileCheck,
  Printer,
  ChevronLeft,
  UserCheck,
  Lock,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, CarBooking } from '../types';
import { RazorpayModal } from '../components/RazorpayModal';

export const CarCheckout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const carId = searchParams.get('carId') || '';
  const pickupDate = searchParams.get('pickupDate') || '';
  const pickupTime = searchParams.get('pickupTime') || '10:00';
  const returnDate = searchParams.get('returnDate') || '';
  const returnTime = searchParams.get('returnTime') || '10:00';
  const pickupLocation = searchParams.get('pickupLocation') || 'Mumbai Airport (T1/T2)';
  const dropLocation = searchParams.get('dropLocation') || 'Mumbai Airport (T1/T2)';

  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [drivingLicense, setDrivingLicense] = useState('');
  const [driverRequired, setDriverRequired] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Payment order & modal state
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [razorpayOrderData, setRazorpayOrderData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<CarBooking | null>(null);

  useEffect(() => {
    async function loadCar() {
      if (!carId) {
        setError('Missing vehicle identifier.');
        setLoading(false);
        return;
      }
      try {
        const res = await api.getCarById(carId);
        setCar(res.car);
      } catch (err: any) {
        setError(err.message || 'Vehicle details could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [carId]);

  // If user details load later from AuthContext
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name || '');
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerPhone && user.phone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Calculate duration
  const start = pickupDate ? new Date(`${pickupDate}T${pickupTime}`) : new Date();
  const end = returnDate ? new Date(`${returnDate}T${returnTime}`) : new Date();
  const diffHours = Math.max(1, (end.getTime() - start.getTime()) / (1000 * 60 * 60));
  const rentalDays = Math.max(1, Math.ceil(diffHours / 24));
  const ratePerDay = car?.price_per_day || 0;
  const totalRentalAmount = rentalDays * ratePerDay;
  const bookingSlotFee = car?.booking_amount || 99;
  const securityDeposit = car?.security_deposit || 3000;
  const remainingAtPickup = totalRentalAmount - bookingSlotFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Please agree to the Car Rental Terms & Cancellation Policy to continue.');
      return;
    }

    setIsInitiatingPayment(true);
    setError('');

    try {
      // Initiate Razorpay Order on server
      const orderRes = await api.createCarOrder({
        carId,
        customerName,
        customerEmail,
        customerPhone,
        pickupLocation,
        dropLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        driverRequired,
        specialInstructions: `License: ${drivingLicense} | Instructions: ${specialInstructions}`,
      });

      setRazorpayOrderData(orderRes);
      setIsModalOpen(true);
    } catch (err: any) {
      setError(err.message || 'Failed to initiate booking slot reservation.');
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handlePaymentSuccess = (booking: CarBooking) => {
    setIsModalOpen(false);
    setConfirmedBooking(booking);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // SUCCESS CONFIRMATION RECEIPT SCREEN
  if (confirmedBooking) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Success Banner */}
          <div className="bg-emerald-600/90 backdrop-blur-md text-white p-6 sm:p-8 text-center border-b border-emerald-500/20">
            <div className="w-16 h-16 bg-white text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Car Slot Reserved Successfully!</h1>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1">
              Your ₹99 booking token has been captured and verified via Razorpay.
            </p>
            <div className="mt-4 inline-block bg-slate-950/40 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider border border-white/10">
              Booking Ref: {confirmedBooking.booking_number}
            </div>
          </div>

          {/* Receipt Body */}
          <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-slate-300">
            {/* Vehicle & Date Summary */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-2xl border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400">Reserved Vehicle</span>
                <h3 className="text-base font-bold text-white mt-0.5">{car?.brand} {car?.name}</h3>
                <p className="text-xs text-slate-400">{car?.category} • {car?.transmission} • {car?.fuel_type}</p>
              </div>

              <div>
                <span className="text-[11px] uppercase font-bold text-slate-400">Primary Renter</span>
                <h3 className="text-base font-bold text-white mt-0.5">{confirmedBooking.customer_name}</h3>
                <p className="text-xs text-slate-400">{confirmedBooking.customer_phone} • {confirmedBooking.customer_email}</p>
              </div>
            </div>

            {/* Timings & Locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                  Pickup Details
                </div>
                <div className="font-semibold text-white">{confirmedBooking.pickup_location}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {confirmedBooking.pickup_date} at {confirmedBooking.pickup_time}
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 p-4 rounded-2xl">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-1">
                  Drop-off Details
                </div>
                <div className="font-semibold text-white">{confirmedBooking.drop_location}</div>
                <div className="text-slate-400 text-xs mt-1">
                  {confirmedBooking.return_date} at {confirmedBooking.return_time}
                </div>
              </div>
            </div>

            {/* Financial Breakdown Table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
              <div className="bg-white/5 px-4 py-2.5 font-bold text-white text-xs border-b border-white/10">
                Payment &amp; Tariff Summary
              </div>
              <div className="p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rental Duration ({confirmedBooking.rental_days} Days @ ₹{confirmedBooking.rental_rate_per_day}/day):</span>
                  <span className="font-semibold text-white">₹{confirmedBooking.total_amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Online Slot Token Paid (Razorpay):</span>
                  <span>- ₹{confirmedBooking.booking_fee} (PAID)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Security Deposit (Payable at pickup):</span>
                  <span className="text-white">₹{confirmedBooking.security_deposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white">
                  <span>Remaining Balance at Vehicle Handover:</span>
                  <span className="text-amber-400 font-black">
                    ₹{(confirmedBooking.remaining_amount + confirmedBooking.security_deposit).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Pickup Guidelines */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
              <strong className="block text-amber-400 font-bold">What to bring at vehicle handover:</strong>
              <p>• Original Valid Indian Driving License</p>
              <p>• Original Aadhaar Card / Passport for ID verification</p>
              <p>• Balance payment (UPI / Cash / Card accepted at hub)</p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Booking Receipt</span>
              </button>

              <div className="flex gap-2">
                <Link
                  to="/dashboard"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs shadow border border-white/10 transition"
                >
                  View in My Bookings
                </Link>
                <Link
                  to="/"
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition"
                >
                  Return Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD CHECKOUT FORM
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-8 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <Link to="/cars" className="hover:text-amber-400 transition">Fleet</Link>
            <span>/</span>
            <Link to={`/cars/${carId}`} className="hover:text-amber-400 transition">{car?.name}</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">Slot Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Secure Your Vehicle Slot for ₹99
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Customer Details Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmitOrder} className="bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-400" />
                  <span>1. Primary Driver &amp; Contact Details</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Please enter details matching your Government ID and Driving License.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number (with WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +91 9876543210"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address (for Receipt) *</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Driving License Number *</label>
                  <input
                    type="text"
                    required
                    value={drivingLicense}
                    onChange={e => setDrivingLicense(e.target.value)}
                    placeholder="e.g. MH0120200012345"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              {/* Chauffeur Service Add-on */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={driverRequired}
                    onChange={e => setDriverRequired(e.target.checked)}
                    className="w-4 h-4 text-amber-500 rounded border-white/20 bg-white/5 focus:ring-amber-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-white">Request Professional Chauffeur / Driver</span>
                    <span className="block text-[11px] text-slate-400">
                      Standard driver allowance (₹500/day) will be settled at trip completion.
                    </span>
                  </div>
                </label>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Special Delivery Requests or Flight Numbers (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialInstructions}
                  onChange={e => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Arriving on Indigo flight 6E-204 at T2 at 10:15 AM."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>

              {/* Terms Checkbox */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={agreedTerms}
                    onChange={e => setAgreedTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 text-amber-500 rounded border-white/20 bg-white/5 focus:ring-amber-400"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    I confirm that I possess a valid original Indian Driving License and understand that the ₹99 fee is an online slot reservation token. The remaining rental of ₹{remainingAtPickup.toLocaleString('en-IN')} and refundable security deposit of ₹{securityDeposit.toLocaleString('en-IN')} will be settled upon vehicle handover under our{' '}
                    <Link to="/car-rental-terms" target="_blank" className="text-amber-400 font-semibold hover:underline">
                      Car Rental Terms
                    </Link>{' '}
                    and{' '}
                    <Link to="/refund-policy" target="_blank" className="text-amber-400 font-semibold hover:underline">
                      Refund Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                id="btn-pay-99-checkout"
                disabled={isInitiatingPayment}
                className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Pay ₹{bookingSlotFee} Online to Lock Vehicle Slot</span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary Card */}
          <div>
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl sticky top-24 space-y-5">
              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Booking Review</span>
                <h3 className="text-lg font-bold text-white mt-0.5">{car?.brand} {car?.name}</h3>
                <p className="text-xs text-slate-400">{car?.category} • {car?.seating_capacity} Seater</p>
              </div>

              {/* Photo preview */}
              {car?.images[0] && (
                <div className="h-32 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                  <img src={car.images[0]} alt={car.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              )}

              {/* Trip Schedule */}
              <div className="bg-white/[0.03] backdrop-blur-xl p-3.5 rounded-2xl border border-white/10 text-xs space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-amber-400 uppercase">Pickup Schedule</div>
                  <div className="font-semibold text-white">{pickupDate || 'Selected Date'} at {pickupTime}</div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[10px] font-bold text-blue-400 uppercase">Return Schedule</div>
                  <div className="font-semibold text-white">{returnDate || 'Selected Date'} at {returnTime}</div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Rental Duration:</span>
                  <span className="font-semibold text-white">{rentalDays} Day(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Rate:</span>
                  <span className="font-semibold text-white">₹{ratePerDay.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Total Rental:</span>
                  <span>₹{totalRentalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Security Deposit (at pickup):</span>
                  <span className="text-white">₹{securityDeposit.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-between items-center text-sm font-bold">
                  <span className="text-amber-400">Payable Now (Token Fee):</span>
                  <span className="text-xl font-black text-amber-400">₹{bookingSlotFee}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-300 text-[11px] leading-relaxed">
                ✓ <strong>256-Bit Razorpay Protected:</strong> 100% refundable if canceled 24 hours before pickup.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Interactive Checkout Modal */}
      {razorpayOrderData && (
        <RazorpayModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          orderData={razorpayOrderData}
          customerInfo={{
            name: customerName,
            email: customerEmail,
            phone: customerPhone,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};
