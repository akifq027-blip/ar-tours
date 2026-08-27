import React from 'react';
import { Palmtree, FileText } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const TourTerms: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Palmtree className="w-4 h-4" />
            <span>Tour Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Tour Package Booking Conditions</h1>
          <p className="text-xs text-slate-400 mt-2">Applies to all Domestic and International holiday packages</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Booking &amp; Payment Schedule</h2>
            <p>
              A 30% advance deposit is required to confirm hotel bookings and transport allocations. The remaining balance is payable 15 days prior to scheduled departure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Hotel &amp; Itinerary Changes</h2>
            <p>
              In rare circumstances of hotel overbooking or local road closures, AR Tours &amp; Travel reserves the right to arrange equivalent or upgraded 4-star/5-star accommodation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Health &amp; Travel Insurance</h2>
            <p>
              Travelers are strongly advised to obtain comprehensive domestic/international travel insurance covering medical contingencies, trip disruptions, and baggage loss.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
