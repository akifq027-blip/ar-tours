import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Palmtree, Search, Filter, Clock, MapPin, Star, ArrowRight } from 'lucide-react';
import { TourCard } from '../components/TourCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { api } from '../services/api';
import { Tour } from '../types';

export const Tours: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const [destinationFilter, setDestinationFilter] = useState(searchParams.get('destination') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');
  const [maxPrice, setMaxPrice] = useState<string>('');

  useEffect(() => {
    async function loadTours() {
      setLoading(true);
      try {
        const res = await api.getTours({
          destination: destinationFilter !== 'All' ? destinationFilter : undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          maxPrice: maxPrice || undefined,
        });
        setTours(res.tours);
      } catch (err) {
        console.error('Fetch tours error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTours();
  }, [destinationFilter, categoryFilter, maxPrice]);

  const categories = ['All', 'Honeymoon & Family', 'Heritage & Culture', 'Nature & Wellness', 'International'];

  const resetFilters = () => {
    setDestinationFilter('');
    setCategoryFilter('All');
    setMaxPrice('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Header Banner */}
      <div className="py-12 sm:py-16 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
              <Palmtree className="w-3.5 h-3.5" />
              <span>Handcrafted Holiday Journeys</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Curated Tour Packages
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              Explore mesmerizing domestic escapes and international destinations with 4/5-star accommodation, expert local tour guides, and seamless transfers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        {/* Filter Card */}
        <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/10 mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Destination / Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Kashmir, Kerala, Dubai"
                  value={destinationFilter}
                  onChange={e => setDestinationFilter(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Max Budget (per person)
              </label>
              <select
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-medium"
              >
                <option value="">Any Budget</option>
                <option value="25000">Up to ₹25,000</option>
                <option value="35000">Up to ₹35,000</option>
                <option value="60000">Up to ₹60,000</option>
                <option value="100000">Up to ₹1,00,000</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={resetFilters}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-amber-400 hover:text-amber-300 text-xs font-semibold rounded-xl backdrop-blur-md transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-400">Loading tour packages...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center max-w-lg mx-auto shadow-2xl">
            <Palmtree className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No Tours Found</h3>
            <p className="text-xs text-slate-400 mb-6">
              We couldn't find any packages matching your exact criteria. Contact our travel desk for a customized itinerary.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-400 font-medium px-1">
              Showing <strong className="text-white">{tours.length}</strong> handcrafted tour package(s)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </div>
        )}
      </div>

      <WhatsAppButton />
    </div>
  );
};
