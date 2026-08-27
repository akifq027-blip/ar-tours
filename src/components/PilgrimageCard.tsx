import React from 'react';
import { Link } from 'react-router-dom';
import { Moon, Clock, Building2, Utensils, Bus, ShieldCheck, ArrowRight } from 'lucide-react';
import { PilgrimagePackage } from '../types';

interface PilgrimageCardProps {
  packageData: PilgrimagePackage;
}

export const PilgrimageCard: React.FC<PilgrimageCardProps> = ({ packageData }) => {
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col group text-slate-100">
      {/* Header Visual with Islamic Gradient */}
      <div className="relative h-56 overflow-hidden bg-slate-950/60">
        <img
          src={packageData.images[0] || 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=800&q=80'}
          alt={packageData.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
            {packageData.package_type}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-semibold px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1.5 shadow">
          <Moon className="w-3.5 h-3.5" />
          <span>Full Ziyarat &amp; Scholar</span>
        </div>

        <div className="absolute bottom-3 left-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{packageData.duration}</span>
          </div>
          <h3 className="text-lg font-bold text-white line-clamp-1 mt-0.5 group-hover:text-amber-400 transition-colors">
            {packageData.title}
          </h3>
        </div>
      </div>

      {/* Hotel Proximity & Inclusions */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Hotel Distances Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/5 border border-white/5 backdrop-blur-md p-2.5 rounded-xl">
              <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                <span>Makkah</span>
              </div>
              <div className="font-semibold text-white line-clamp-1 mt-0.5">{packageData.makkah_hotel}</div>
              <div className="text-[11px] text-emerald-400 font-medium">{packageData.makkah_distance}</div>
            </div>

            <div className="bg-white/5 border border-white/5 backdrop-blur-md p-2.5 rounded-xl">
              <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-blue-400" />
                <span>Madinah</span>
              </div>
              <div className="font-semibold text-white line-clamp-1 mt-0.5">{packageData.madinah_hotel}</div>
              <div className="text-[11px] text-emerald-400 font-medium">{packageData.madinah_distance}</div>
            </div>
          </div>

          {/* Core Feature Highlights */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{packageData.transport_details}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Utensils className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{packageData.food_details}</span>
            </div>
          </div>

          {/* Inclusions checklist */}
          <div className="pt-2 flex flex-wrap gap-1.5">
            {packageData.inclusions.slice(0, 3).map((inc, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] bg-white/5 border border-white/5 text-slate-300 px-2 py-0.5 rounded-lg"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{inc}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-400 font-medium">All-Inclusive Starting</div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-white">
                ₹{packageData.starting_price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-slate-400 font-normal">/ person</span>
            </div>
          </div>

          <Link
            to={`/hajj-umrah/${packageData.slug}`}
            className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5 transform hover:-translate-y-0.5"
          >
            <span>Details &amp; Enquire</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
