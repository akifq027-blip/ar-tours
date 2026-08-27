import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';
import { Tour } from '../types';

interface TourCardProps {
  tour: Tour;
}

export const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col group text-slate-100">
      {/* Image Header */}
      <div className="relative h-56 overflow-hidden bg-slate-950/60">
        <img
          src={tour.images[0] || 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80'}
          alt={tour.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-slate-950/80 text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
            {tour.category}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 bg-slate-950/80 text-white text-xs font-semibold px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5 border border-white/10">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{tour.duration}</span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-950/80 text-white font-bold text-xs px-2.5 py-1 rounded-xl backdrop-blur-md border border-white/10 shadow flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{tour.rating || 4.9}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{tour.destination}</span>
          </div>

          <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-amber-400 transition-colors">
            {tour.title}
          </h3>

          <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
            {tour.short_description}
          </p>

          {/* Inclusions summary */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tour.inclusions.slice(0, 3).map((inc, i) => (
              <span
                key={i}
                className="text-[11px] text-slate-300 bg-white/5 border border-white/5 px-2 py-0.5 rounded-lg"
              >
                {inc}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & Link */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Starting from</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">
                ₹{tour.starting_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ person</span>
            </div>
          </div>

          <Link
            to={`/tours/${tour.slug}`}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
          >
            <span>View Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
