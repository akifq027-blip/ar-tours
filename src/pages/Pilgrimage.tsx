import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Moon, ShieldCheck, Star, Building2, Utensils, Bus, Compass, HeartHandshake } from 'lucide-react';
import { PilgrimageCard } from '../components/PilgrimageCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { api } from '../services/api';
import { PilgrimagePackage } from '../types';

export const Pilgrimage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [packages, setPackages] = useState<PilgrimagePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || 'All');

  useEffect(() => {
    async function loadPackages() {
      setLoading(true);
      try {
        const res = await api.getPilgrimagePackages({
          package_type: selectedType !== 'All' ? selectedType : undefined,
        });
        setPackages(res.packages);
      } catch (err) {
        console.error('Fetch pilgrimage error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, [selectedType]);

  const packageTypes = ['All', 'Umrah', 'Hajj', 'Ramadan Umrah'];

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Islamic Elegance Header */}
      <div className="py-14 sm:py-18 border-b border-white/10 relative overflow-hidden z-10">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-500/20 backdrop-blur-md">
              <Moon className="w-4 h-4 text-amber-400" />
              <span>Sacred Hajj &amp; Umrah Journeys</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Perform Your Pilgrimage with Tranquility &amp; Care
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Certified pilgrimage packages featuring 5-star hotels directly facing Masjid Al-Haram in Makkah &amp; Masjid An-Nabawi in Madinah, authentic scholar guidance, and complete Ziyarat.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Type Selection Tabs */}
        <div className="bg-slate-900/60 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/10 mb-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {packageTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition ${
                    selectedType === t
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md'
                  }`}
                >
                  {t === 'All' ? 'All Packages' : t}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Saudi Ministry of Hajj &amp; Umrah Compliant</span>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-400">Loading pilgrimage packages...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <PilgrimageCard key={pkg.id} packageData={pkg} />
              ))}
            </div>
          </div>
        )}

        {/* Pilgrimage Standards Banner */}
        <div className="mt-16 bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-white mb-2">Our Commitments to Every Pilgrim</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              We treat your sacred journey not as a tour, but as an honor and supreme responsibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm">Walking Distance to Haram</div>
              <p className="text-slate-400">Hotels located within 50m to 150m from outer courtyards for elderly-friendly prayer access.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Compass className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm">Certified Islamic Scholars</div>
              <p className="text-slate-400">Daily spiritual lectures, step-by-step Umrah workshops, and guidance at historic Ziyarat sites.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm">Authentic Indian Buffet</div>
              <p className="text-slate-400">Wholesome Indian buffet breakfast, lunch, and dinner prepared fresh daily with mineral water.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div className="font-bold text-white text-sm">24/7 Ground Assistance</div>
              <p className="text-slate-400">Dedicated bilingual group leaders from airport pickup in Jeddah/Madinah to departure.</p>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
