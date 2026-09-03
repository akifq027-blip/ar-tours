import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  Star,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Sparkles,
} from 'lucide-react';
import { PilgrimagePackage } from '../../types';
import { api } from '../../services/api';

const PRESET_PILGRIMAGE_IMAGES = [
  { label: 'Holy Kaaba & Mataf (Makkah)', url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Masjid Al-Haram Clock Tower', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Al-Masjid An-Nabawi (Madinah)', url: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Madinah Green Dome & Umbrellas', url: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Pilgrim Spiritual Journey', url: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80' },
];

interface AdminPilgrimageTabProps {
  packages: PilgrimagePackage[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const AdminPilgrimageTab: React.FC<AdminPilgrimageTabProps> = ({ packages, onRefresh, showToast }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const [packageForm, setPackageForm] = useState({
    package_type: 'Umrah' as 'Hajj' | 'Umrah' | 'Ramadan Umrah',
    title: '',
    duration: '15 Days / 14 Nights',
    starting_price: 78500,
    makkah_hotel: 'Swissôtel Al Maqam / Pullman Zamzam (5-Star)',
    makkah_distance: '0 Metres (Clock Tower)',
    madinah_hotel: 'Dar Al Taqwa / Anwar Al Madinah Mövenpick (5-Star)',
    madinah_distance: '50 Metres to Haram',
    hotel_details: 'Direct Haram view options with daily buffet breakfast and 24/7 room service.',
    transport_details: 'VIP High-Speed Haramain Train / Luxury AC Bus with English/Urdu speaking coordinator.',
    food_details: 'Buffet Indian/Continental 3 Times Meal daily (Breakfast, Lunch, Dinner).',
    ziyarat_details: 'Guided historical Ziyarats in Makkah (Jabal Al-Noor, Mina, Arafat) and Madinah (Masjid Quba, Mount Uhud).',
    inclusions: 'Umrah Visa, Health Insurance, Round-trip Flights, 5-Star Hotels, 3 Daily Meals, Complete Ziyarats, Zamzam 5L Canister, Welcome Kit',
    exclusions: 'Personal shopping, Laundry, Excess baggage fees',
    images: ['https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'],
    newImageUrl: '',
    featured: false,
    available: true,
  });

  const handleOpenAdd = () => {
    setEditingPackageId(null);
    setPackageForm({
      package_type: 'Umrah',
      title: '',
      duration: '15 Days / 14 Nights',
      starting_price: 78500,
      makkah_hotel: 'Swissôtel Al Maqam / Pullman Zamzam (5-Star)',
      makkah_distance: '0 Metres (Clock Tower)',
      madinah_hotel: 'Dar Al Taqwa / Anwar Al Madinah Mövenpick (5-Star)',
      madinah_distance: '50 Metres to Haram',
      hotel_details: 'Direct Haram view options with daily buffet breakfast and 24/7 room service.',
      transport_details: 'VIP High-Speed Haramain Train / Luxury AC Bus with English/Urdu speaking coordinator.',
      food_details: 'Buffet Indian/Continental 3 Times Meal daily (Breakfast, Lunch, Dinner).',
      ziyarat_details: 'Guided historical Ziyarats in Makkah (Jabal Al-Noor, Mina, Arafat) and Madinah (Masjid Quba, Mount Uhud).',
      inclusions: 'Umrah Visa, Health Insurance, Round-trip Flights, 5-Star Hotels, 3 Daily Meals, Complete Ziyarats, Zamzam 5L Canister, Welcome Kit',
      exclusions: 'Personal shopping, Laundry, Excess baggage fees',
      images: ['https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'],
      newImageUrl: '',
      featured: false,
      available: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: PilgrimagePackage) => {
    setEditingPackageId(pkg.id);
    setPackageForm({
      package_type: pkg.package_type,
      title: pkg.title,
      duration: pkg.duration,
      starting_price: pkg.starting_price,
      makkah_hotel: pkg.makkah_hotel || '',
      makkah_distance: pkg.makkah_distance || '',
      madinah_hotel: pkg.madinah_hotel || '',
      madinah_distance: pkg.madinah_distance || '',
      hotel_details: pkg.hotel_details || '',
      transport_details: pkg.transport_details || '',
      food_details: pkg.food_details || '',
      ziyarat_details: pkg.ziyarat_details || '',
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : '',
      exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : '',
      images: Array.isArray(pkg.images) && pkg.images.length > 0 ? pkg.images : ['https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'],
      newImageUrl: '',
      featured: Boolean(pkg.featured),
      available: pkg.available !== false,
    });
    setIsModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanImages = packageForm.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (cleanImages.length === 0) {
        cleanImages.push('https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80');
      }

      const payload = {
        package_type: packageForm.package_type,
        title: packageForm.title,
        duration: packageForm.duration,
        starting_price: Number(packageForm.starting_price),
        makkah_hotel: packageForm.makkah_hotel,
        makkah_distance: packageForm.makkah_distance,
        madinah_hotel: packageForm.madinah_hotel,
        madinah_distance: packageForm.madinah_distance,
        hotel_details: packageForm.hotel_details,
        transport_details: packageForm.transport_details,
        food_details: packageForm.food_details,
        ziyarat_details: packageForm.ziyarat_details,
        inclusions: packageForm.inclusions.split(',').map(s => s.trim()).filter(Boolean),
        exclusions: packageForm.exclusions.split(',').map(s => s.trim()).filter(Boolean),
        images: cleanImages,
        featured: packageForm.featured,
        available: packageForm.available,
      };

      if (editingPackageId) {
        await api.admin.updatePilgrimagePackage(editingPackageId, payload);
        showToast(`Pilgrimage package "${packageForm.title}" updated successfully!`);
      } else {
        await api.admin.createPilgrimagePackage(payload);
        showToast(`Pilgrimage package "${packageForm.title}" created successfully!`);
      }

      setIsModalOpen(false);
      setEditingPackageId(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to save pilgrimage package.', 'error');
    }
  };

  const handleDeletePackage = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.admin.deletePilgrimagePackage(id);
      showToast(`Pilgrimage package "${title}" removed.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete package.', 'error');
    }
  };

  const handleToggleFeatured = async (pkg: PilgrimagePackage) => {
    try {
      const updated = !pkg.featured;
      await api.admin.updatePilgrimagePackage(pkg.id, { featured: updated });
      showToast(`Package is now ${updated ? 'Featured on Home' : 'Standard'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update featured status', 'error');
    }
  };

  const handleToggleAvailable = async (pkg: PilgrimagePackage) => {
    try {
      const updated = !pkg.available;
      await api.admin.updatePilgrimagePackage(pkg.id, { available: updated });
      showToast(`Package is now ${updated ? 'Active & Accepting Pilgrims' : 'Paused / Inactive'}.`);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability', 'error');
    }
  };

  // Filter
  const filteredPackages = packages.filter(p => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(q) ||
      p.package_type.toLowerCase().includes(q) ||
      (p.makkah_hotel && p.makkah_hotel.toLowerCase().includes(q)) ||
      (p.madinah_hotel && p.madinah_hotel.toLowerCase().includes(q));

    const matchesType =
      typeFilter === 'all' || p.package_type.toLowerCase() === typeFilter.toLowerCase();

    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header & Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Hajj &amp; Umrah Pilgrimage Packages Management</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              {packages.length} Packages
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage VIP, Deluxe &amp; Economy Hajj and Umrah tiers, Makkah/Madinah hotels, and pilgrim inclusions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pilgrimage Package</span>
        </button>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Total Packages</div>
            <div className="text-lg font-black text-white">{packages.length}</div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Hajj Tours</div>
            <div className="text-lg font-black text-amber-400">
              {packages.filter(p => p.package_type === 'Hajj').length}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Umrah Groups</div>
            <div className="text-lg font-black text-cyan-400">
              {packages.filter(p => p.package_type === 'Umrah' || p.package_type === 'Ramadan Umrah').length}
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-medium">Active &amp; Open</div>
            <div className="text-lg font-black text-purple-400">
              {packages.filter(p => p.available !== false).length}
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
            placeholder="Search pilgrimage by package title, Makkah hotel, duration..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="all">All Pilgrimages</option>
            <option value="Hajj">Hajj Only</option>
            <option value="Umrah">Umrah Only</option>
            <option value="Ramadan Umrah">Ramadan Umrah</option>
          </select>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map(pkg => {
          const coverImg = Array.isArray(pkg.images) && pkg.images[0] ? pkg.images[0] : 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80';

          return (
            <div
              key={pkg.id}
              className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-xl hover:border-emerald-500/30 transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden group bg-slate-950">
                  <img
                    src={coverImg}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      {pkg.package_type}
                    </span>
                    {pkg.featured && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-bold text-white bg-slate-950/80 px-2 py-0.5 rounded-lg backdrop-blur-md">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{pkg.duration}</span>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-white line-clamp-1">{pkg.title}</h3>
                  </div>

                  {/* Hotels & Distance */}
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-white/5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-[10px] uppercase font-bold text-amber-400">Makkah:</span>
                      <span className="truncate max-w-[170px] font-medium">{pkg.makkah_hotel}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold pl-2">
                      ↳ {pkg.makkah_distance || 'Close to Haram'}
                    </div>

                    <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-white/5">
                      <span className="text-[10px] uppercase font-bold text-amber-400">Madinah:</span>
                      <span className="truncate max-w-[170px] font-medium">{pkg.madinah_hotel}</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-semibold pl-2">
                      ↳ {pkg.madinah_distance || 'Walking distance'}
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between pt-1 border-t border-white/5">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Starting From</span>
                      <span className="text-lg font-black text-amber-400">₹{pkg.starting_price.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] text-slate-500"> /pilgrim</span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        pkg.available !== false
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {pkg.available !== false ? '● Active' : '● Paused'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs gap-2">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(pkg)}
                    title={pkg.featured ? 'Unfeature package' : 'Feature package'}
                    className={`p-1.5 rounded-xl border transition cursor-pointer ${
                      pkg.featured
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/40'
                        : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${pkg.featured ? 'fill-current text-amber-400' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleAvailable(pkg)}
                    title={pkg.available !== false ? 'Pause package' : 'Activate package'}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition cursor-pointer ${
                      pkg.available !== false
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {pkg.available !== false ? 'Active' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(pkg)}
                    className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeletePackage(pkg.id, pkg.title)}
                    className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition cursor-pointer"
                    title="Delete package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* PACKAGE CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-3xl w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  {editingPackageId ? `Edit Package: ${packageForm.title}` : 'Add New Hajj & Umrah Pilgrimage Package'}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure hotels, distances to Haram, meals, ziyarat inclusions, and pricing.
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

            <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Pilgrimage Category *</label>
                  <select
                    value={packageForm.package_type}
                    onChange={e => setPackageForm({ ...packageForm, package_type: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Umrah">Umrah Package</option>
                    <option value="Hajj">Hajj Package</option>
                    <option value="Ramadan Umrah">Ramadan Special Umrah</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-300 mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.title}
                    onChange={e => setPackageForm({ ...packageForm, title: e.target.value })}
                    placeholder="e.g. VIP 5-Star Deluxe Umrah Package"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Duration *</label>
                  <input
                    type="text"
                    required
                    value={packageForm.duration}
                    onChange={e => setPackageForm({ ...packageForm, duration: e.target.value })}
                    placeholder="e.g. 15 Days / 14 Nights"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">Starting Price (₹/pilgrim) *</label>
                  <input
                    type="number"
                    required
                    value={packageForm.starting_price}
                    onChange={e => setPackageForm({ ...packageForm, starting_price: Number(e.target.value) })}
                    placeholder="78500"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Hotels */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>Makkah &amp; Madinah Accommodation</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Makkah Hotel</label>
                    <input
                      type="text"
                      value={packageForm.makkah_hotel}
                      onChange={e => setPackageForm({ ...packageForm, makkah_hotel: e.target.value })}
                      placeholder="e.g. Swissôtel Al Maqam / Pullman Zamzam"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Distance to Haram (Makkah)</label>
                    <input
                      type="text"
                      value={packageForm.makkah_distance}
                      onChange={e => setPackageForm({ ...packageForm, makkah_distance: e.target.value })}
                      placeholder="e.g. 0 Metres (Clock Tower)"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Madinah Hotel</label>
                    <input
                      type="text"
                      value={packageForm.madinah_hotel}
                      onChange={e => setPackageForm({ ...packageForm, madinah_hotel: e.target.value })}
                      placeholder="e.g. Anwar Al Madinah Mövenpick"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Distance to Haram (Madinah)</label>
                    <input
                      type="text"
                      value={packageForm.madinah_distance}
                      onChange={e => setPackageForm({ ...packageForm, madinah_distance: e.target.value })}
                      placeholder="e.g. 50 Metres to Gate"
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Transport</label>
                  <input
                    type="text"
                    value={packageForm.transport_details}
                    onChange={e => setPackageForm({ ...packageForm, transport_details: e.target.value })}
                    placeholder="VIP High-Speed Bullet Train / Luxury Bus"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Catering &amp; Food</label>
                  <input
                    type="text"
                    value={packageForm.food_details}
                    onChange={e => setPackageForm({ ...packageForm, food_details: e.target.value })}
                    placeholder="Buffet Breakfast, Lunch & Dinner"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Ziyarats</label>
                  <input
                    type="text"
                    value={packageForm.ziyarat_details}
                    onChange={e => setPackageForm({ ...packageForm, ziyarat_details: e.target.value })}
                    placeholder="Guided Makkah & Madinah holy places"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.featured}
                    onChange={e => setPackageForm({ ...packageForm, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-white/20 focus:ring-amber-400"
                  />
                  <span className="font-bold text-slate-200 text-xs">Featured Package (Show on Homepage)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={packageForm.available}
                    onChange={e => setPackageForm({ ...packageForm, available: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-slate-950 border-white/20 focus:ring-emerald-400"
                  />
                  <span className="font-bold text-slate-200 text-xs">Active &amp; Accepting Pilgrims</span>
                </label>
              </div>

              {/* Inclusions / Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Inclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={packageForm.inclusions}
                    onChange={e => setPackageForm({ ...packageForm, inclusions: e.target.value })}
                    placeholder="Visa, Tickets, 5-Star Hotel, 3 Meals, Zamzam"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Exclusions (Comma separated)</label>
                  <input
                    type="text"
                    value={packageForm.exclusions}
                    onChange={e => setPackageForm({ ...packageForm, exclusions: e.target.value })}
                    placeholder="Personal shopping, Laundry"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Photos & Presets */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-300">Package Photos (Web URLs)</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={packageForm.newImageUrl}
                    onChange={e => setPackageForm({ ...packageForm, newImageUrl: e.target.value })}
                    placeholder="Add photo URL (https://...)"
                    className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (packageForm.newImageUrl.trim()) {
                        setPackageForm({
                          ...packageForm,
                          images: [...packageForm.images, packageForm.newImageUrl.trim()],
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
                  {packageForm.images.map((img, idx) => (
                    <div key={idx} className="relative group w-20 h-14 rounded-lg overflow-hidden border border-white/20">
                      <img src={img} alt="Pilgrimage thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => {
                          setPackageForm({
                            ...packageForm,
                            images: packageForm.images.filter((_, i) => i !== idx),
                          });
                        }}
                        className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Presets */}
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1 mb-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Pick High-Res Holy Sites Presets:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_PILGRIMAGE_IMAGES.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setPackageForm({ ...packageForm, images: [...packageForm.images, preset.url] })}
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
                  {editingPackageId ? 'Update Package' : 'Save & Publish Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
