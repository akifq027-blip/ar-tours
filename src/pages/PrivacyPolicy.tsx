import React from 'react';
import { Lock, FileText } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-4 h-4" />
            <span>Data Security</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy &amp; Data Policy</h1>
          <p className="text-xs text-slate-400 mt-2">How AR Tours &amp; Travel protects your personal &amp; payment data</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Information We Collect</h2>
            <p>
              We collect necessary details including your name, email, contact number, government ID data for driving licenses or pilgrim visa submissions, and flight schedules.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Payment Data Protection</h2>
            <p>
              All online transactions are processed via Razorpay's PCI-DSS compliant secure servers. AR Tours &amp; Travel never stores your credit card numbers, CVVs, or net banking passwords.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Zero Spam Guarantee</h2>
            <p>
              We strictly do not sell, rent, or trade your personal information to third-party telemarketers or advertisers. Communications are limited to your active bookings, quotes, and emergency notifications.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
