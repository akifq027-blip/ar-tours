import React from 'react';
import { Search, CreditCard, Key, Compass } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Choose Vehicle or Package',
      description:
        'Browse our verified car rental fleet, all-inclusive tour packages, or sacred Hajj & Umrah itineraries with transparent pricing.',
    },
    {
      num: '02',
      icon: CreditCard,
      title: 'Pay Slot Fee via UPI',
      description:
        'For car rentals, lock in your vehicle reservation instantly with a direct UPI token payment (GPay, PhonePe, Paytm) and instant UTR verification.',
    },
    {
      num: '03',
      icon: Key,
      title: 'Hassle-Free Handover',
      description:
        'Pick up your car at Mumbai Airport or our hub, complete quick digital KYC, pay the remaining rental, and hit the open road.',
    },
    {
      num: '04',
      icon: Compass,
      title: '24/7 Support on Journey',
      description:
        'Enjoy your holiday or pilgrimage with complete peace of mind, backed by our round-the-clock roadside and concierge team.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Seamless Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            Booking your car rental or curated holiday with AR Tours &amp; Travel takes less than two minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-white/[0.03] backdrop-blur-xl p-6 rounded-2xl sm:rounded-3xl border border-white/10 flex flex-col justify-between hover:border-amber-400/40 shadow-xl hover:shadow-2xl transition-all duration-300 group text-slate-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 backdrop-blur-md flex items-center justify-center shadow group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-600 group-hover:text-amber-400/40 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
