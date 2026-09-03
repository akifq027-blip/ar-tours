import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Fuel, Gauge, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Car } from '../types';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const navigate = useNavigate();

  const handleBookNow = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/cars/${car.id}`);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col group text-slate-100">
      {/* Image Container */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-950/60">
        <img
          src={car.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'}
          alt={car.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
            {car.category}
          </span>
          {car.status === 'available' && (car.available_slots === undefined || car.available_slots > 0) ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Available {car.available_slots ? `(${car.available_slots} slots)` : ''}</span>
            </span>
          ) : car.status === 'maintenance' ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-md">
              In Maintenance
            </span>
          ) : car.status === 'inactive' ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/80 text-slate-300 border border-white/10 backdrop-blur-md">
              Inactive
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              Slots Full
            </span>
          )}
        </div>

        {/* ₹499 Badge */}
        <div className="absolute bottom-3 right-3 bg-amber-500 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Pay ₹499 to Reserve Slot</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            {car.brand}
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
            {car.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
            {car.description}
          </p>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 mt-4 py-3 border-y border-white/10 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-1.5 justify-center bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{car.seating_capacity} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 justify-center bg-white/5 backdrop-blur-md p-2 rounded-xl border border-white/5">
              <Fuel className="w-4 h-4 text-amber-400" />
              <span>{car.fuel_type}</span>
            </div>
          </div>

          {/* Features snippet */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {car.features.slice(0, 3).map((feat, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Daily Rental</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">₹{car.price_per_day.toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-400 font-normal">/ day</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/cars/${car.id}`}
              className="px-3.5 py-2 text-xs font-semibold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl backdrop-blur-md transition"
            >
              Details
            </Link>
            {car.status === 'available' && (car.available_slots === undefined || car.available_slots > 0) ? (
              <button
                onClick={handleBookNow}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Book Slot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                disabled
                className="px-4 py-2 text-xs font-bold text-slate-400 bg-white/5 border border-white/10 rounded-xl opacity-60 cursor-not-allowed"
              >
                {car.status === 'maintenance' ? 'In Maintenance' : 'Slot Unavailable'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
