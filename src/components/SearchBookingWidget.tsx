import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Palmtree, Moon, Calendar, MapPin, Search, Users, ArrowRight } from 'lucide-react';

export const SearchBookingWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cars' | 'tours' | 'pilgrimage'>('cars');
  const navigate = useNavigate();

  // Car Search State
  const [carCategory, setCarCategory] = useState('All');
  const [pickupDate, setPickupDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [returnDate, setReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });

  // Tour Search State
  const [tourDest, setTourDest] = useState('');
  const [tourCategory, setTourCategory] = useState('All');

  // Pilgrimage State
  const [pilgrimType, setPilgrimType] = useState<'Umrah' | 'Hajj' | 'Ramadan Umrah'>('Umrah');
  const [travelMonth, setTravelMonth] = useState('October 2026');
  const [numPeople, setNumPeople] = useState('2');

  const handleCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/cars?category=${carCategory}&pickupDate=${pickupDate}&returnDate=${returnDate}`);
  };

  const handleTourSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/tours?destination=${encodeURIComponent(tourDest)}&category=${tourCategory}`);
  };

  const handlePilgrimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/hajj-umrah?type=${pilgrimType}&month=${encodeURIComponent(travelMonth)}&people=${numPeople}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden text-slate-100">
      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-white/[0.03] backdrop-blur-md">
        <button
          id="tab-cars"
          onClick={() => setActiveTab('cars')}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'cars'
              ? 'border-amber-400 text-amber-400 bg-white/10 backdrop-blur-md shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Car className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Rent a Car (₹99 Slot)</span>
        </button>

        <button
          id="tab-tours"
          onClick={() => setActiveTab('tours')}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'tours'
              ? 'border-amber-400 text-amber-400 bg-white/10 backdrop-blur-md shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Palmtree className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Tour Packages</span>
        </button>

        <button
          id="tab-pilgrimage"
          onClick={() => setActiveTab('pilgrimage')}
          className={`flex-1 py-4 px-4 text-center font-semibold text-sm sm:text-base flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'pilgrimage'
              ? 'border-amber-400 text-amber-400 bg-white/10 backdrop-blur-md shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
          }`}
        >
          <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span>Hajj &amp; Umrah</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 sm:p-8">
        {/* 1. CAR RENTAL TAB */}
        {activeTab === 'cars' && (
          <form onSubmit={handleCarSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Vehicle Type
                </label>
                <div className="relative">
                  <Car className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <select
                    value={carCategory}
                    onChange={e => setCarCategory(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="All" className="bg-slate-900 text-slate-100">All Vehicle Types</option>
                    <option value="MUV" className="bg-slate-900 text-slate-100">MUV (Innova, Ertiga)</option>
                    <option value="SUV" className="bg-slate-900 text-slate-100">SUV (XUV700, Fortuner, Creta)</option>
                    <option value="Sedan" className="bg-slate-900 text-slate-100">Sedan (Honda City)</option>
                    <option value="Luxury" className="bg-slate-900 text-slate-100">Luxury &amp; Executive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Pickup Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={e => setPickupDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Return Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <input
                    type="date"
                    value={returnDate}
                    min={pickupDate}
                    onChange={e => setReturnDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs text-slate-300 flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Pay only <strong className="text-amber-400 font-bold">₹99</strong> online to confirm vehicle slot. Balance payable at pickup.</span>
              </div>
              <button
                type="submit"
                id="btn-search-cars"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Find &amp; Reserve Fleet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* 2. TOURS TAB */}
        {activeTab === 'tours' && (
          <form onSubmit={handleTourSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Destination / Keyword
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <input
                    type="text"
                    placeholder="e.g. Kashmir, Kerala, Agra, Jaipur"
                    value={tourDest}
                    onChange={e => setTourDest(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 placeholder-slate-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Tour Type / Category
                </label>
                <div className="relative">
                  <Palmtree className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <select
                    value={tourCategory}
                    onChange={e => setTourCategory(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="All" className="bg-slate-900 text-slate-100">All Categories</option>
                    <option value="Honeymoon & Family" className="bg-slate-900 text-slate-100">Honeymoon &amp; Family</option>
                    <option value="Heritage & Culture" className="bg-slate-900 text-slate-100">Heritage &amp; Culture</option>
                    <option value="Nature & Wellness" className="bg-slate-900 text-slate-100">Nature &amp; Wellness</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  id="btn-search-tours"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Explore Tours</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 3. PILGRIMAGE TAB */}
        {activeTab === 'pilgrimage' && (
          <form onSubmit={handlePilgrimSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Pilgrimage Package
                </label>
                <div className="relative">
                  <Moon className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <select
                    value={pilgrimType}
                    onChange={e => setPilgrimType(e.target.value as any)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Umrah" className="bg-slate-900 text-slate-100">15-Day Deluxe Umrah</option>
                    <option value="Ramadan Umrah" className="bg-slate-900 text-slate-100">Ramadan Umrah with Eid</option>
                    <option value="Hajj" className="bg-slate-900 text-slate-100">Executive Hajj 2026</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Number of Pilgrims
                </label>
                <div className="relative">
                  <Users className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                  <select
                    value={numPeople}
                    onChange={e => setNumPeople(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl text-sm font-medium text-slate-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="1" className="bg-slate-900 text-slate-100">1 Person</option>
                    <option value="2" className="bg-slate-900 text-slate-100">2 Persons (Couple)</option>
                    <option value="4" className="bg-slate-900 text-slate-100">4 Persons (Family Quad)</option>
                    <option value="6" className="bg-slate-900 text-slate-100">6+ Persons (Group)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  id="btn-search-pilgrimage"
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>View Packages &amp; Enquire</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
