import React from 'react';
import { Moon, ShieldCheck } from 'lucide-react';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const PilgrimageTerms: React.FC = () => {
  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      <div className="py-12 border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Moon className="w-4 h-4" />
            <span>Spiritual Journey Guidelines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Hajj &amp; Umrah Regulations</h1>
          <p className="text-xs text-slate-400 mt-2">Adherence to Ministry of Hajj &amp; Umrah, KSA directives</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-2">1. Passport &amp; Visa Validity</h2>
            <p>
              Pilgrims must possess an Indian passport valid for at least 6 months from the date of departure with at least 2 blank pages. Visa issuance is subject to approval by the Saudi Embassy and Ministry of Foreign Affairs (MOFA).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">2. Health &amp; Mandatory Vaccinations</h2>
            <p>
              All pilgrims must have valid Meningitis (ACWY) vaccination and Covid-19/Polio certification as required by the Kingdom of Saudi Arabia Ministry of Health guidelines.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-2">3. Group Discipline &amp; Scholar Protocol</h2>
            <p>
              Pilgrims are required to adhere to scheduled departure timings for Ziyarat tours, buses, and prayers. Group safety and respect for sacred premises remain paramount.
            </p>
          </section>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
