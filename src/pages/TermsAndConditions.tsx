import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const TermsAndConditions: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Legal Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">General Terms &amp; Conditions</h1>
          <p className="text-xs text-slate-400 mt-2">Last Updated: October 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Scope of Agreement</h2>
            <p>
              Welcome to AR Tours &amp; Travel. By accessing our website, reserving car rental slots, booking tour packages, or enrolling in Hajj &amp; Umrah journeys, you agree to be bound by these General Terms and Conditions, alongside our Service-Specific terms.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Identity &amp; Compliance</h2>
            <p>
              All clients must provide valid legal identification (Passport, Indian Driving License, or Aadhaar Card) prior to service fulfillment. Supplying fraudulent documentation will result in immediate service termination without refund.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Payment &amp; Gateway Security</h2>
            <p>
              Online slot reservations and advance payments are processed securely through certified payment gateways (Razorpay) utilizing 256-bit SSL encryption. We do not store raw card credentials on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">4. Force Majeure</h2>
            <p>
              AR Tours &amp; Travel shall not be held liable for failure or delay in performance resulting from acts of God, weather anomalies, sovereign flight cancellations, highway blockades, or government regulatory changes in India or Saudi Arabia.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
