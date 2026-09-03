import React from 'react';
import { ShieldCheck, Award, Users, HeartHandshake, Compass, Car, Moon, CheckCircle } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Header */}
      <div className="py-14 sm:py-20 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
            Our Journey &amp; Legacy
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            About AR Tours &amp; Travel
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            Delivering trusted travel services, verified vehicle rentals with instant ₹499 slot reservations, and spiritually blessed Hajj &amp; Umrah journeys for over a decade.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Core Pillars */}
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Uncompromising Trust</h3>
            <p className="text-xs text-slate-400">
              Transparent pricing without hidden charges, verified fleet sanitization, and 100% comprehensive insurance.
            </p>
          </div>

          <div className="text-center p-4 border-y md:border-y-0 md:border-x border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Pilgrim-Centric Care</h3>
            <p className="text-xs text-slate-400">
              5-star Haram proximity hotels and certified scholars ensuring peace of mind during your sacred Hajj &amp; Umrah rituals.
            </p>
          </div>

          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Seamless Technology</h3>
            <p className="text-xs text-slate-400">
              Modern digital booking with direct UPI slot reservations, digital vouchers, and instant WhatsApp support.
            </p>
          </div>
        </div>

        {/* Company Story & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-4">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Our Mission</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Crafting Memorable Journeys with Authenticity
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              At AR Tours &amp; Travel, we believe every travel experience should be effortless, secure, and enriching. Founded with the mission to redefine travel standards, we bridge the gap between premium service and accessible affordability.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              From family road trips across the Western Ghats to scenic holidays in Kashmir and Kerala, and sacred pilgrimages to Makkah and Madinah, we handle every detail—flight tickets, visas, transfers, and accommodations—with extreme precision.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/cars"
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 font-bold text-xs rounded-xl shadow backdrop-blur-md transition"
              >
                Browse Car Fleet
              </Link>
              <Link
                to="/tours"
                className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
              >
                Explore Tours
              </Link>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 h-80 sm:h-96 relative">
            <img
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1000&q=80"
              alt="AR Tours & Travel Team"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
