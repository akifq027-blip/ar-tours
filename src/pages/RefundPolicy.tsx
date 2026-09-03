import React from 'react';
import { DollarSign, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Financial Policies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Cancellation &amp; Refund Policy</h1>
          <p className="text-xs text-slate-400 mt-2">Clear, fair, and transparent cancellation guidelines</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
            <h2 className="text-sm font-bold text-emerald-300 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Car Rental (₹499 Slot Fee) Refund Schedule</span>
            </h2>
            <ul className="text-emerald-200 text-xs list-disc pl-5 space-y-1">
              <li><strong>Cancellation &gt; 24 hours before pickup:</strong> 100% full refund of the ₹499 slot booking fee.</li>
              <li><strong>Cancellation &lt; 24 hours before pickup:</strong> ₹499 is retained as fleet reservation &amp; blocking charge.</li>
              <li><strong>Security Deposit:</strong> 100% refundable upon vehicle handover return with no damages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Holiday Tour Packages Cancellation</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li><strong>30+ days prior to travel:</strong> 90% refund of advance deposit (minus actual airline cancellation penalties).</li>
              <li><strong>15 - 29 days prior:</strong> 50% refund.</li>
              <li><strong>Less than 15 days:</strong> Non-refundable due to guaranteed hotel allocations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Hajj &amp; Umrah Packages</h2>
            <p>
              Due to strict visa quotas and Saudi Ministry hotel contracts, pilgrimage packages follow non-refundable visa policy once MOFA approval is stamped. In genuine emergencies, passenger name replacement is permitted up to 14 days before flight departure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">Refund Processing Timeline</h2>
            <p>
              Approved refunds are credited directly back to the original payment source (Credit Card / Debit Card / UPI / NetBanking) within 5 to 7 banking working days via Razorpay.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
