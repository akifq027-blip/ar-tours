import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  AlertCircle,
  FileText,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Car } from '../types';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { useSettings } from '../context/SettingsContext';

export const CarDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();

  const [car, setCar] = useState<Car | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Date Check State
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('10:00');
  const [pickupLocation, setPickupLocation] = useState('Mumbai Airport (T1/T2)');
  const [dropLocation, setDropLocation] = useState('Mumbai Airport (T1/T2)');

  // Availability calculation
  const [isCheckingAvail, setIsCheckingAvail] = useState(false);
  const [availResult, setAvailResult] = useState<{
    available: boolean;
    message: string;
    pricing?: {
      rentalDays: number;
      ratePerDay: number;
      rentalTotal: number;
      bookingSlotFee: number;
      securityDeposit: number;
      remainingPayableAtPickup: number;
    };
  } | null>(null);

  useEffect(() => {
    async function fetchCar() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.getCarById(id);
        setCar(res.car);
      } catch (err: any) {
        setError(err.message || 'Vehicle not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  const checkAvailability = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!car) return;

    setIsCheckingAvail(true);
    try {
      const res = await api.checkCarAvailability({
        carId: car.id,
        pickupDate,
        returnDate,
        pickupTime,
        returnTime,
      });
      setAvailResult(res as any);
    } catch (err: any) {
      setAvailResult({
        available: false,
        message: err.message || 'Availability check failed.',
      });
    } finally {
      setIsCheckingAvail(false);
    }
  };

  // Run availability check on initial render once car is loaded
  useEffect(() => {
    if (car) {
      checkAvailability();
    }
  }, [car, pickupDate, returnDate, pickupTime, returnTime]);

  const handleProceedToCheckout = () => {
    if (!car) return;
    const query = new URLSearchParams({
      carId: car.id,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      pickupLocation,
      dropLocation,
    });
    navigate(`/cars/checkout?${query.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen py-20 px-4 text-center relative z-10">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Vehicle Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested car is not in our system.'}</p>
        <Link
          to="/cars"
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl shadow transition inline-flex items-center gap-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Breadcrumb Header */}
      <div className="py-6 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <span>/</span>
            <Link to="/cars" className="hover:text-amber-400 transition">Fleet</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">{car.brand} {car.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Image Gallery & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery Card */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <img
                  src={car.images[activeImageIndex] || car.images[0]}
                  alt={car.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                  {car.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>₹499 Slot Pre-Booking</span>
                </div>
              </div>

              {/* Thumbnails */}
              {car.images.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                  {car.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        activeImageIndex === idx ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${car.name} thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vehicle Overview & Specs */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    {car.brand}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{car.name}</h1>
                  <p className="text-xs text-slate-400 mt-1">Plate / Fleet Code: {car.registration_number}</p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400">Daily Tariff</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    ₹{car.price_per_day.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400"> / 24 hrs</span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-white/10 text-xs">
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl text-center">
                  <Users className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                  <div className="text-slate-400 text-[11px]">Seating</div>
                  <div className="font-bold text-white">{car.seating_capacity} Persons</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl text-center">
                  <Gauge className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                  <div className="text-slate-400 text-[11px]">Transmission</div>
                  <div className="font-bold text-white">{car.transmission}</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl text-center">
                  <Fuel className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                  <div className="text-slate-400 text-[11px]">Fuel Type</div>
                  <div className="font-bold text-white">{car.fuel_type}</div>
                </div>
                <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-3.5 rounded-2xl text-center">
                  <ShieldCheck className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                  <div className="text-slate-400 text-[11px]">Drive Type</div>
                  <div className="font-bold text-white">Self / Chauffeur</div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-6">
                <h3 className="text-base font-bold text-white mb-2">About This Vehicle</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{car.description}</p>
              </div>

              {/* Key Features & Amenities */}
              <div className="pt-6">
                <h3 className="text-base font-bold text-white mb-3">Features &amp; Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  {car.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white/[0.02] p-2.5 rounded-xl border border-white/10">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandatory Documents Notice */}
              <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Info className="w-4 h-4 text-amber-400" />
                  <span>Mandatory Requirements at Pickup</span>
                </div>
                <p>
                  Original Indian Driving License (min. 1 year driving experience) and Aadhaar Card or Passport must be physically presented for KYC verification prior to key handover.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Live Booking & ₹499 Reservation Box */}
          <div className="space-y-6">
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl sticky top-24">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reservation</span>
                  <h3 className="text-xl font-bold text-white">Check Dates &amp; Reserve</h3>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
                  ₹499 Slot Token
                </div>
              </div>

              <div className="space-y-4">
                {/* Pickup Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={e => setPickupDate(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Pickup Time</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={e => setPickupTime(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Return Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate}
                      onChange={e => setReturnDate(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Return Time</label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={e => setReturnTime(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pricing Summary Box */}
                {availResult && availResult.available && availResult.pricing && (
                  <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Rental Duration:</span>
                      <span className="font-semibold text-white">{availResult.pricing.rentalDays} Day(s)</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Tariff Rate:</span>
                      <span className="font-semibold text-white">₹{availResult.pricing.ratePerDay}/day</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Estimated Total Rental:</span>
                      <span className="font-semibold text-white">₹{availResult.pricing.rentalTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Refundable Deposit (at pickup):</span>
                      <span className="font-semibold text-white">₹{availResult.pricing.securityDeposit.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between items-center font-bold text-white">
                      <span className="text-amber-400">Online Token to Reserve:</span>
                      <span className="text-base text-amber-400 font-black">₹{availResult.pricing.bookingSlotFee}</span>
                    </div>
                  </div>
                )}

                {/* Availability State Feedback */}
                {availResult && !availResult.available && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{availResult.message}</span>
                  </div>
                )}

                {/* Reserve Slot Button */}
                <button
                  id="btn-proceed-to-checkout"
                  onClick={handleProceedToCheckout}
                  disabled={!availResult?.available || isCheckingAvail}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reserve Vehicle Slot (Pay ₹{availResult?.pricing?.bookingSlotFee || 499})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <p className="text-[11px] text-slate-400">
                    256-bit SSL encrypted. 100% refund on cancellations &gt;24 hrs.
                  </p>
                </div>

                <div className="pt-2 text-center border-t border-white/10">
                  <WhatsAppButton
                    variant="inline"
                    label="Need custom hours or long-term rental? Chat on WhatsApp"
                    message={`Hi AR Tours & Travel, I am inquiring about renting the ${car.brand} ${car.name} from ${pickupDate} to ${returnDate}.`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
