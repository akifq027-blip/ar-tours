import React from 'react';
import {
  CreditCard,
  ShieldCheck,
  Award,
  Headphones,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: CreditCard,
      title: '₹99 Slot Pre-Booking',
      description:
        'Reserve any vehicle in our verified fleet with just ₹99 online token fee. Pay the balance amount at vehicle handover.',
      badge: 'Zero Risk',
    },
    {
      icon: Award,
      title: 'Hajj & Umrah Excellence',
      description:
        'Guaranteed 5-star Haram proximity in Makkah & Madinah, full ziyarat with senior Islamic scholars, and 24/7 dedicated group assistance.',
      badge: 'Spiritual Peace',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Sanitized Fleet',
      description:
        'Modern SUVs, MUVs, and luxury sedans maintained to manufacturer standards, comprehensively insured with 24/7 roadside assistance.',
      badge: '100% Insured',
    },
    {
      icon: Calendar,
      title: 'Customized Tour Curations',
      description:
        'Handpicked itineraries for Kashmir, Kerala, Golden Triangle, Himachal, and Dubai, with flexibility for families and private groups.',
      badge: 'Personalized',
    },
    {
      icon: Headphones,
      title: '24/7 Live Concierge Support',
      description:
        'Real human travel managers reachable via phone, WhatsApp, and email at every step of your holiday or car rental.',
      badge: 'Always On',
    },
    {
      icon: Sparkles,
      title: 'Honest & Transparent Pricing',
      description:
        'No hidden surcharges, no surprise driver fees. Clear breakdown of tariffs, refundable security deposits, and inclusions.',
      badge: 'Zero Hidden Fees',
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Why Travel With AR</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built on Reliability, Transparency, and Care
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 leading-relaxed">
            From flexible car rental token reservations to spiritually guided pilgrimage itineraries, we take pride in delivering frictionless travel journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={idx}
                className="bg-white/[0.03] backdrop-blur-xl p-7 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group text-slate-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 backdrop-blur-md">
                      {pt.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{pt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {pt.description}
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
