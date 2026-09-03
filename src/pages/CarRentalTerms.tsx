import React from 'react';
import { ShieldCheck, Car, AlertTriangle, FileText } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const CarRentalTerms: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Car className="w-4 h-4" />
            <span>Vehicle Rental Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Car Rental Agreement &amp; Rules</h1>
          <p className="text-xs text-slate-400 mt-2">Applies to all Self-Drive &amp; Chauffeur fleet bookings</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
            <h2 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>The ₹499 Slot Pre-Booking Policy</span>
            </h2>
            <p className="text-amber-200/90 text-xs">
              The ₹499 online payment secures and reserves the vehicle slot for your requested dates. The remaining tariff balance plus the refundable security deposit (₹3,000) are paid upon vehicle handover.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Driver Eligibility &amp; KYC</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>The primary driver must be at least 21 years old.</li>
              <li>Must present an Original Indian Driving License with minimum 1 year of driving history.</li>
              <li>Original Aadhaar Card or Passport must be verified in person at vehicle delivery.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Security Deposit &amp; Refund</h2>
            <p>
              A refundable security deposit of ₹3,000 (or higher for luxury vehicles) is collected during vehicle key handover. This deposit will be refunded in full within 2 to 24 hours of safe vehicle return after inspection.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Fuel &amp; Toll Charges</h2>
            <p>
              Vehicles are delivered with a documented fuel level. Renters must return the vehicle with equivalent fuel or pay the difference plus a ₹200 refueling service fee. Tolls, FASTag fees, and state border entry taxes are the renter's responsibility.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Speed Limits &amp; Prohibited Uses</h2>
            <p>
              Speed limits are capped according to government regulations (max 100 km/h on expressways). Off-roading, commercial subleasing, transporting illicit substances, or driving under the influence of alcohol/narcotics is strictly prohibited.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
