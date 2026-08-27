import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Palmtree,
  Moon,
  Plane,
  Building2,
  Map,
  ShieldCheck,
  Headphones,
  ArrowRight,
} from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const Services: React.FC = () => {
  const servicesList = [
    {
      icon: Car,
      title: 'Car Rentals (Self-Drive & Chauffeur)',
      desc: 'Sanitized SUVs, MUVs, and sedans with easy ₹99 online slot reservations. Daily, weekly, and monthly corporate leasing options available.',
      link: '/cars',
      cta: 'View Fleet & Book',
    },
    {
      icon: Palmtree,
      title: 'Curated Tour Packages',
      desc: 'All-inclusive domestic (Kashmir, Kerala, Himachal, Rajasthan) and international (Dubai, Thailand) tours with 4-star hotels and private transfers.',
      link: '/tours',
      cta: 'Browse Tour Catalog',
    },
    {
      icon: Moon,
      title: 'Hajj & Umrah Pilgrimage',
      desc: 'Spiritual guidance packages with 5-star hotels right in front of Masjid Al-Haram and Masjid An-Nabawi, visa processing, and scholar lectures.',
      link: '/hajj-umrah',
      cta: 'Explore Pilgrimage Plans',
    },
    {
      icon: Plane,
      title: 'Airport & Intercity Transfers',
      desc: 'Punctual point-to-point transfers between Mumbai International Airport, Pune, Lonavala, Shirdi, Nashik, and Mahabaleshwar.',
      link: '/contact',
      cta: 'Book Airport Cab',
    },
    {
      icon: Map,
      title: 'Customized & Private Itineraries',
      desc: 'Bespoke vacation itineraries designed specifically for family reunions, honeymoons, or corporate retreats with customized pace.',
      link: '/contact',
      cta: 'Request Custom Plan',
    },
    {
      icon: Headphones,
      title: '24/7 Travel Concierge & Assistance',
      desc: 'Round-the-clock emergency support, flight rebooking, roadside assistance, and instant WhatsApp consultation for all active travelers.',
      link: '/contact',
      cta: 'Speak to Travel Desk',
    },
  ];

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Header */}
      <div className="py-14 sm:py-20 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 inline-block backdrop-blur-md">
            Comprehensive Travel Solutions
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Our Core Services
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            From flexible vehicle rentals to sacred spiritual pilgrimages and bespoke luxury vacations, AR Tours &amp; Travel delivers excellence at every step.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-white/[0.03] backdrop-blur-xl p-7 rounded-3xl border border-white/10 shadow-2xl hover:bg-white/[0.06] hover:border-white/20 transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">{srv.desc}</p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    to={srv.link}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
