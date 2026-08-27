import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Car as CarIcon,
  Search,
  Filter,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CarCard } from '../components/CarCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { api } from '../services/api';
import { Car } from '../types';

export const Cars: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || 'All');
  const [selectedTransmission, setSelectedTransmission] = useState<string>('All');
  const [selectedFuel, setSelectedFuel] = useState<string>('All');
  const [selectedSeats, setSelectedSeats] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pickupDate, setPickupDate] = useState<string>(searchParams.get('pickupDate') || '');
  const [returnDate, setReturnDate] = useState<string>(searchParams.get('returnDate') || '');

  useEffect(() => {
    async function fetchCars() {
      setLoading(true);
      try {
        const res = await api.getCars({
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          transmission: selectedTransmission !== 'All' ? selectedTransmission : undefined,
          fuel_type: selectedFuel !== 'All' ? selectedFuel : undefined,
          seating: selectedSeats !== 'All' ? selectedSeats : undefined,
          search: searchQuery || undefined,
          pickupDate: pickupDate || undefined,
          returnDate: returnDate || undefined,
        });
        setCars(res.cars);
      } catch (err) {
        console.error('Fetch cars error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchCars();
  }, [selectedCategory, selectedTransmission, selectedFuel, selectedSeats, searchQuery, pickupDate, returnDate]);

  const categories = ['All', 'SUV', 'MUV', 'Sedan', 'Luxury', 'Hatchback'];

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedTransmission('All');
    setSelectedFuel('All');
    setSelectedSeats('All');
    setSearchQuery('');
    setPickupDate('');
    setReturnDate('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Header Banner */}
      <div className="py-12 sm:py-16 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>₹99 Slot Pre-Booking Available</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Verified Car Rental Fleet
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore our sanitized, fully insured vehicles for self-drive or chauffeur service in Mumbai, Pune, and surrounding corridors. Reserve your slot for just ₹99 online.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Quick Filter Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/10 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Fleet</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Innova, Fortuner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Vehicle Type</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Vehicle Types' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Transmission</label>
              <select
                value={selectedTransmission}
                onChange={e => setSelectedTransmission(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                <option value="All">All Transmissions</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={e => setSelectedFuel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                <option value="All">All Fuel Types</option>
                <option value="Diesel">Diesel</option>
                <option value="Petrol">Petrol</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Seating Capacity */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Seating Capacity</label>
              <select
                value={selectedSeats}
                onChange={e => setSelectedSeats(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                <option value="All">Any Seating</option>
                <option value="5">5 Seater (Sedan / Hatchback)</option>
                <option value="7">7 Seater (Innova / Ertiga / XUV)</option>
                <option value="8">8+ Seater (MUV / Executive)</option>
              </select>
            </div>
          </div>

          {/* Optional Availability Date Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" /> Check Availability Dates:
              </span>
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="Pickup Date"
              />
              <span className="text-slate-500">to</span>
              <input
                type="date"
                value={returnDate}
                min={pickupDate}
                onChange={e => setReturnDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-white/10 rounded-xl bg-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="Return Date"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetFilters}
                className="text-amber-400 hover:text-amber-300 underline text-xs font-medium transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Cars Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-400">Loading available vehicle fleet...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center max-w-lg mx-auto shadow-2xl">
            <CarIcon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Vehicles Match Your Search</h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your category, transmission, or date filters to view other available options in our fleet.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-medium">
              <span>Showing <strong className="text-white">{cars.length}</strong> available vehicle(s)</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Instant ₹99 slot booking enabled
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        )}

        {/* Rental Policies Callout */}
        <div className="mt-16 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span>Important Car Rental Booking Guidelines</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <strong className="block text-white mb-1 font-semibold">1. ₹99 Slot Pre-Booking</strong>
              The ₹99 online fee reserves your chosen car. Remaining rental amount is collected at pickup.
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <strong className="block text-white mb-1 font-semibold">2. Refundable Security Deposit</strong>
              A standard ₹3,000 security deposit is collected at vehicle handover and refunded upon return.
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <strong className="block text-white mb-1 font-semibold">3. Valid Documents Required</strong>
              Original Indian Driving License (min. 1 yr old) and Aadhaar/Passport are mandatory for KYC.
            </div>
            <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <strong className="block text-white mb-1 font-semibold">4. 24/7 Roadside Assistance</strong>
              Every rental includes round-the-clock emergency support and breakdown replacement.
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
