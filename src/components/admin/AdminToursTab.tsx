import React, { useState } from 'react';
import {
  Palmtree,
  Plus,
  Trash2,
  Edit2,
  Star,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Eye,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Tour } from '../../types';
import { api } from '../../services/api';

const PRESET_TOUR_IMAGES = [
  { label: 'Kashmir Paradise (Pahalgam & Gulmarg)', url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Kerala Backwaters & Houseboat', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Dubai Luxury Desert Safari & Skyline', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Himachal Snow & Manali Valleys', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Rajasthan Royal Forts & Palaces', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Goa Golden Beaches & Coastal Cruise', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
];

interface AdminToursTabProps {
  tours: Tour[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminToursTab: React.FC<AdminToursTabProps> = ({ tours, onRefresh, showToast }) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);

  const [tourForm, setTourForm] = useState({
    title: '',
    destination: '',
    category: 'Family',
    duration: '5 Days / 4 Nights',
    starting_price: 18999,
    short_description: '',
    description: '',
    inclusions: 'Deluxe Hotel Stays, Daily Breakfast & Dinner, Private AC Cab with Driver, Sightseeing Tolls',
    exclusions: 'Airfare / Train Tickets, Personal Expenses, Monument Entry Tickets',
    images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'],
    newImageUrl: '',
    featured: false,
    available: true,
    itineraryDays: [
      { day: 1, title: 'Arrival & Welcome Check-in', description: 'Airport pickup and check-in at luxury hotel. Evening leisure walk.' },
      { day: 2, title: 'Full Day Scenic Sightseeing', description: 'Guided tour of prominent landmarks, cultural hubs, and viewpoints.' },
    ],
  });

  const handleOpenAdd = () => {
    setEditingTourId(null);
    setTourForm({
      title: '',
      destination: '',
      category: 'Family',
      duration: '5 Days / 4 Nights',
      starting_price: 18999,
      short_description: '',
      description: '',
      inclusions: 'Deluxe Hotel Stays, Daily Breakfast & Dinner, Private AC Cab with Driver, Sightseeing Tolls',
      exclusions: 'Airfare / Train Tickets, Personal Expenses, Monument Entry Tickets',
      images: ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'],
      newImageUrl: '',
      featured: false,
      available: true,
      itineraryDays: [
        { day: 1, title: 'Arrival & Welcome Check-in', description: 'Airport pickup and check-in at luxury hotel. Evening leisure walk.' },
        { day: 2, title: 'Full Day Scenic Sightseeing', description: 'Guided tour of prominent landmarks, cultural hubs, and viewpoints.' },
      ],
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tour: Tour) => {
    setEditingTourId(tour.id);
    setTourForm({
      title: tour.title,
      destination: tour.destination,
      category: tour.category,
      duration: tour.duration,
      starting_price: tour.starting_price,
      short_description: tour.short_description || '',
      description: tour.description || '',
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(', ') : '',
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join(', ') : '',
      images: Array.isArray(tour.images) && tour.images.length > 0 ? tour.images : ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'],
      newImageUrl: '',
      featured: Boolean(tour.featured),
      available: tour.available !== false,
      itineraryDays: Array.isArray(tour.itinerary) && tour.itinerary.length > 0
        ? tour.itinerary.map((it, idx) => ({ day: Number(it.day) || idx + 1, title: it.title, description: it.description }))
        : [
            { day: 1, title: 'Arrival & Check-in', description: 'Transfer to hotel and evening orientation.' },
          ],
    });
    setIsModalOpen(true);
  };

  const handleAddItineraryDay = () => {
    const nextDay = tourForm.itineraryDays.length + 1;
    setTourForm({
      ...tourForm,
      itineraryDays: [
        ...tourForm.itineraryDays,
        { day: nextDay, title: `Day ${nextDay} Sightseeing`, description: 'Exploration and local experience.' },
      ],
    });
  };

  const handleRemoveItineraryDay = (index: number) => {
    if (tourForm.itineraryDays.length <= 1) return;
    const updated = tourForm.itineraryDays.filter((_, idx) => idx !== index);
    setTourForm({ ...tourForm, itineraryDays: updated });
  };

  const handleItineraryChange = (index: number, field: 'title' | 'description', val: string) => {
    const updated = [...tourForm.itineraryDays];
    updated[index][field] = val;
    setTourForm({ ...tourForm, itineraryDays: updated });
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanImages = tourForm.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (cleanImages.length === 0) {
        cleanImages.push('https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80');
      }

      const payload = {
        title: tourForm.title,
        destination: tourForm.destination,
        category: tourForm.category,
        duration: tourForm.duration,
        starting_price: Number(tourForm.starting_price),
        short_description: tourForm.short_description || tourForm.title,
        description: tourForm.description || tourForm.short_description || tourForm.title,
        inclusions: tourForm.inclusions.split(',').map(s => s.trim()).filter(Boolean),
        exclusions: tourForm.exclusions.split(',').map(s => s.trim()).filter(Boolean),
        itinerary: tourForm.itineraryDays,
        images: cleanImages,
        featured: tourForm.featured,
        available: tourForm.available,
      };

      if (editingTourId) {
        await api.admin.updateTour(editingTourId, payload);
        showToast(`Tour package "${tourForm.title}" updated successfully!`);
      } else {
        await api.admin.createTour(payload);
        showToast(`Tour package "${tourForm.title}" created successfully!`);
      }

      setIsModalOpen(false);
      setEditingTourId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save tour package.', 'error');
    }
  };

  const handleDeleteTour = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.admin.deleteTour(id);
      showToast(`Tour package "${title}" removed.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete tour.', 'error');
    }
  };

  const handleToggleFeatured = async (tour: Tour) => {
    try {
      const updated = !tour.featured;
      await api.admin.updateTour(tour.id, { featured: updated });
      showToast(`Package is now ${updated ? 'Featured on Home' : 'Standard'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update featured status', 'error');
    }
  };

  const handleToggleAvailable = async (tour: Tour) => {
    try {
      const updated = !tour.available;
      await api.admin.updateTour(tour.id, { available: updated });
      showToast(`Package is now ${updated ? 'Active & Bookable' : 'Paused / Inactive'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability', 'error');
    }
  };

  // Filter
  const filteredTours = tours.filter(t => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);

    const matchesCategory =
      categoryFilter === 'all' || t.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Holiday &amp; Tour Packages Management</span>
            <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              {tours.length} Packages
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Add new holiday itineraries, manage pricing, photos, inclusions, and featured status.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Tour</span>
        </button>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Palmtree className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Tours</div>
            <div className="text-lg font-black text-white">{tours.length}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Active Tours</div>
            <div className="text-lg font-black text-emerald-400">
              {tours.filter(t => t.available !== false).length}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Featured Tours</div>
            <div className="text-lg font-black text-yellow-400">
              {tours.filter(t => t.featured).length}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Destinations</div>
            <div className="text-lg font-black text-cyan-400">
              {new Set(tours.map(t => t.destination)).size}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tours by destination, title, category..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Categories</option>
            <option value="Family">Family</option>
            <option value="Honeymoon">Honeymoon</option>
            <option value="Adventure">Adventure</option>
            <option value="Luxury">Luxury</option>
            <option value="Heritage">Heritage</option>
          </select>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTours.map(tour => {
          const coverImg = Array.isArray(tour.images) && tour.images[0] ? tour.images[0] : 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80';

          return (
            <div
              key={tour.id}
              className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-amber-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden group bg-slate-950">
                  <img
                    src={coverImg}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-950/80 backdrop-blur-md text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                      {tour.category}
                    </span>
                    {tour.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-lg backdrop-blur-md">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{tour.destination}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold mb-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{tour.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{tour.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                      {tour.short_description || tour.description}
                    </p>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Starting From</span>
                      <span className="text-lg font-black text-amber-400">₹{tour.starting_price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-500"> /person</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tour.available !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {tour.available !== false ? '● Active' : '● Paused'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>{tour.itinerary?.length || 0} Itinerary Days</span>
                    <span className="text-amber-400">★ {tour.rating || 4.9} rating</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(tour)}
                    title={tour.featured ? 'Unfeature tour' : 'Feature tour'}
                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                      tour.featured
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${tour.featured ? 'fill-current text-amber-400' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(tour)}
                    title={tour.available !== false ? 'Pause tour' : 'Activate tour'}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                      tour.available !== false
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {tour.available !== false ? 'Active' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(tour)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteTour(tour.id, tour.title)}
                    className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition cursor-pointer"
                    title="Delete tour"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TOUR CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-3xl w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  {editingTourId ? `Edit Tour Package: ${tourForm.title}` : 'Create New Holiday Tour Package'}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure destination, pricing, itinerary milestones, and inclusions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.title}
                    onChange={e => setTourForm({ ...tourForm, title: e.target.value })}
                    placeholder="e.g. Kashmir Winter Wonderland & Gulmarg"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={tourForm.destination}
                    onChange={e => setTourForm({ ...tourForm, destination: e.target.value })}
                    placeholder="e.g. Srinagar, Gulmarg, Pahalgam"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={tourForm.category}
                    onChange={e => setTourForm({ ...tourForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Family">Family Holiday</option>
                    <option value="Honeymoon">Honeymoon Special</option>
                    <option value="Adventure">Adventure &amp; Trekking</option>
                    <option value="Luxury">Luxury &amp; Premium</option>
                    <option value="Heritage">Heritage &amp; Cultural</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    required
                    value={tourForm.duration}
                    onChange={e => setTourForm({ ...tourForm, duration: e.target.value })}
                    placeholder="e.g. 5 Days / 4 Nights"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Starting Price (₹/person) *</label>
                  <input
                    type="number"
                    required
                    value={tourForm.starting_price}
                    onChange={e => setTourForm({ ...tourForm, starting_price: Number(e.target.value) })}
                    placeholder="18999"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tourForm.featured}
                    onChange={e => setTourForm({ ...tourForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-white/20 focus:ring-amber-400"
                  />
                  <span className="font-bold text-slate-200 text-xs">Featured Package (Show on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tourForm.available}
                    onChange={e => setTourForm({ ...tourForm, available: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/20 focus:ring-emerald-400"
                  />
                  <span className="font-bold text-slate-200 text-xs">Active &amp; Accepting Bookings</span>
                </label>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Short Catchy Summary</label>
                <input
                  type="text"
                  value={tourForm.short_description}
                  onChange={e => setTourForm({ ...tourForm, short_description: e.target.value })}
                  placeholder="Experience shikara rides on Dal Lake and snow slopes of Gulmarg."
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Full Detailed Overview</label>
                <textarea
                  rows={2}
                  value={tourForm.description}
                  onChange={e => setTourForm({ ...tourForm, description: e.target.value })}
                  placeholder="Detailed tour highlights, hotel tier description, altitude notes, etc."
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Inclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={tourForm.inclusions}
                    onChange={e => setTourForm({ ...tourForm, inclusions: e.target.value })}
                    placeholder="Hotels, Breakfast, Cab with Driver, Tolls"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Exclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={tourForm.exclusions}
                    onChange={e => setTourForm({ ...tourForm, exclusions: e.target.value })}
                    placeholder="Airfare, Monument tickets, Personal shopping"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Dynamic Day-by-Day Itinerary Builder */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>Day-by-Day Itinerary ({tourForm.itineraryDays.length} Days)</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItineraryDay}
                    className="px-2.5 py-1 bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 rounded-lg text-[10px] font-bold border border-amber-400/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Day</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {tourForm.itineraryDays.map((it, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-950/80 border border-white/10 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black text-amber-400">Day {it.day}</span>
                        <input
                          type="text"
                          value={it.title}
                          onChange={e => handleItineraryChange(idx, 'title', e.target.value)}
                          placeholder="Day Title (e.g. Arrival & Sunset Boat Ride)"
                          className="flex-1 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItineraryDay(idx)}
                          className="text-slate-500 hover:text-red-400 p-1 cursor-pointer"
                          title="Remove day"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={it.description}
                        onChange={e => handleItineraryChange(idx, 'description', e.target.value)}
                        placeholder="Milestone activities, visits, night stay location..."
                        className="w-full px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Photos & Presets */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-300">Tour Photos (Web URLs)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={tourForm.newImageUrl}
                    onChange={e => setTourForm({ ...tourForm, newImageUrl: e.target.value })}
                    placeholder="Add photo URL (https://...)"
                    className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tourForm.newImageUrl.trim()) {
                        setTourForm({
                          ...tourForm,
                          images: [...tourForm.images, tourForm.newImageUrl.trim()],
                          newImageUrl: '',
                        });
                      }
                    }}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {tourForm.images.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-14 rounded-lg overflow-hidden border border-white/20">
                      <img src={img} alt="Tour thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => {
                          setTourForm({
                            ...tourForm,
                            images: tourForm.images.filter((_, i) => i !== idx),
                          });
                        }}
                        className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Presets */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pick High-Res Destination Presets:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TOUR_IMAGES.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setTourForm({ ...tourForm, images: [...tourForm.images, preset.url] })}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] text-slate-300 hover:text-amber-400 transition cursor-pointer"
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingTourId ? 'Update Tour Package' : 'Save & Publish Tour'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
