import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Palmtree,
  Moon,
  CalendarCheck,
  MessageSquare,
  Star,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  DollarSign,
  Users,
  ShieldCheck,
  RefreshCw,
  Eye,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Wrench,
  Search,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import { Car as CarType, Tour, PilgrimagePackage, CarBooking, TourEnquiry, PilgrimageEnquiry, Review } from '../types';

// Curated high quality presets for car images
const PRESET_CAR_IMAGES = [
  { label: 'Innova Crysta (White)', url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Innova Crysta (Silver)', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mahindra XUV700 (Midnight Blue)', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mahindra XUV700 (Interior Skyroof)', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Toyota Fortuner Legender (Black)', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Hyundai Creta Turbo (Red/Black)', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Honda City Executive Sedan', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Maruti Ertiga Smart Hybrid', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80' },
  { label: 'BMW Luxury Sedan', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mercedes E-Class VIP', url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Audi Quattro Luxury SUV', url: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Mahindra Thar 4x4 Off-roader', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80' },
];

export const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'cars' | 'tours' | 'pilgrimage' | 'bookings' | 'enquiries' | 'reviews' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionToast, setActionToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Entities state
  const [cars, setCars] = useState<CarType[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [pilgrimPackages, setPilgrimPackages] = useState<PilgrimagePackage[]>([]);
  const [bookings, setBookings] = useState<CarBooking[]>([]);
  const [tourEnquiries, setTourEnquiries] = useState<TourEnquiry[]>([]);
  const [pilgrimEnquiries, setPilgrimEnquiries] = useState<PilgrimageEnquiry[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Fleet Filter & Search State
  const [carSearch, setCarSearch] = useState('');
  const [carStatusFilter, setCarStatusFilter] = useState<'all' | 'available' | 'booked' | 'maintenance' | 'inactive'>('all');
  const [carCategoryFilter, setCarCategoryFilter] = useState<string>('all');

  // Car Create / Edit Modal State
  const [isCarModalOpen, setIsCarModalOpen] = useState(false);
  const [editingCarId, setEditingCarId] = useState<string | null>(null);
  const [carForm, setCarForm] = useState({
    name: '',
    brand: '',
    model: '',
    registration_number: '',
    category: 'SUV',
    seating_capacity: 7,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    price_per_day: 3499,
    booking_amount: 99,
    security_deposit: 3000,
    total_slots: 5,
    available_slots: 4,
    status: 'available' as 'available' | 'booked' | 'maintenance' | 'inactive',
    location: 'Mumbai Central Hub & Airport',
    description: '',
    imagesList: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    newModalImageUrl: '',
    features: '7 Captain Seats, Dual AC, Cruise Control, Apple CarPlay & Android Auto, 24/7 Roadside Assistance',
  });

  // Dedicated Fast Image Manager Modal State
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [activeCarForImages, setActiveCarForImages] = useState<CarType | null>(null);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState('');
  const [imageModalLoading, setImageModalLoading] = useState(false);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState({
    company_name: settings?.company_name || 'AR Tours & Travel',
    phone: settings?.phone || '+91 81214 34741',
    whatsapp: settings?.whatsapp || '+918121434741',
    email: settings?.email || 'contact@artours.com',
    address: settings?.address || 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
    booking_slot_fee: settings?.booking_slot_fee ?? 99,
    standard_security_deposit: settings?.standard_security_deposit ?? 3000,
  });

  // Sync settings when settings context loads
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        company_name: settings.company_name || 'AR Tours & Travel',
        phone: settings.phone || '+91 81214 34741',
        whatsapp: settings.whatsapp || '+918121434741',
        email: settings.email || 'contact@artours.com',
        address: settings.address || '',
        booking_slot_fee: settings.booking_slot_fee ?? 99,
        standard_security_deposit: settings.standard_security_deposit ?? 3000,
      });
    }
  }, [settings]);

  // Auto clear toast
  useEffect(() => {
    if (actionToast) {
      const timer = setTimeout(() => setActionToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [actionToast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setActionToast({ message, type });
  };

  useEffect(() => {
    if (isLoading) return;

    if (!user || user.role !== 'admin') {
      navigate('/login?from=/admin', { replace: true });
      return;
    }
    loadAdminData();
  }, [user, isLoading, navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [dashRes, carsRes, toursRes, pilgRes, bookRes, enqRes, revsRes] = await Promise.all([
        api.admin.getDashboard(),
        api.admin.getCars(),
        api.admin.getTours(),
        api.admin.getPilgrimage(),
        api.admin.getBookings(),
        api.admin.getEnquiries(),
        api.admin.getReviews(),
      ]);

      setStats(dashRes.metrics);
      setCars(carsRes.cars);
      setTours(toursRes.tours);
      setPilgrimPackages(pilgRes.packages);
      setBookings(bookRes.bookings);
      setTourEnquiries(enqRes.tourEnquiries || []);
      setPilgrimEnquiries(enqRes.pilgrimageEnquiries || []);
      setReviews(revsRes.reviews);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Car CRUD Handlers
  const handleOpenAddCar = () => {
    setEditingCarId(null);
    setCarForm({
      name: '',
      brand: '',
      model: '',
      registration_number: 'MH 02 CZ ' + Math.floor(1000 + Math.random() * 9000),
      category: 'SUV',
      seating_capacity: 7,
      transmission: 'Automatic',
      fuel_type: 'Diesel',
      price_per_day: 3499,
      booking_amount: 99,
      security_deposit: 3000,
      total_slots: 5,
      available_slots: 5,
      status: 'available',
      location: 'Mumbai Central Hub & Airport',
      description: 'Well-maintained, clean, high-performance vehicle with 24/7 roadside assistance.',
      imagesList: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
      ],
      newModalImageUrl: '',
      features: 'AC & Rear Vents, Touchscreen Infotainment, Power Steering, 24/7 Roadside Assistance',
    });
    setIsCarModalOpen(true);
  };

  const handleOpenEditCar = (car: CarType) => {
    setEditingCarId(car.id);
    setCarForm({
      name: car.name,
      brand: car.brand,
      model: car.model || car.name,
      registration_number: car.registration_number || 'MH 02 CZ 4401',
      category: car.category,
      seating_capacity: car.seating_capacity,
      transmission: car.transmission,
      fuel_type: car.fuel_type,
      price_per_day: car.price_per_day,
      booking_amount: car.booking_amount || 99,
      security_deposit: car.security_deposit || 3000,
      total_slots: car.total_slots || car.available_slots || 5,
      available_slots: car.available_slots ?? 4,
      status: car.status || 'available',
      location: car.location || 'Mumbai Central Hub & Airport',
      description: car.description,
      imagesList: Array.isArray(car.images) && car.images.length > 0 ? [...car.images] : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80'],
      newModalImageUrl: '',
      features: Array.isArray(car.features) ? car.features.join(', ') : car.features || '',
    });
    setIsCarModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanImages = carForm.imagesList.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (cleanImages.length === 0) {
        cleanImages.push('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80');
      }

      const payload = {
        name: carForm.name,
        brand: carForm.brand,
        model: carForm.model || carForm.name,
        registration_number: carForm.registration_number,
        category: carForm.category,
        seating_capacity: Number(carForm.seating_capacity),
        transmission: carForm.transmission,
        fuel_type: carForm.fuel_type,
        price_per_day: Number(carForm.price_per_day),
        booking_amount: Number(carForm.booking_amount),
        security_deposit: Number(carForm.security_deposit),
        total_slots: Number(carForm.total_slots),
        available_slots: Number(carForm.available_slots),
        status: carForm.status,
        location: carForm.location,
        description: carForm.description,
        images: cleanImages,
        features: carForm.features.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (editingCarId) {
        await api.admin.updateCar(editingCarId, payload);
        showToast(`Vehicle "${carForm.name}" updated successfully!`);
      } else {
        await api.admin.createCar(payload);
        showToast(`Vehicle "${carForm.name}" added to fleet!`);
      }

      setIsCarModalOpen(false);
      setEditingCarId(null);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save vehicle.', 'error');
    }
  };

  const handleDeleteCar = async (id: string, carName: string) => {
    if (!confirm(`Are you sure you want to remove "${carName}" from the active fleet?`)) return;
    try {
      await api.admin.deleteCar(id);
      showToast(`Car "${carName}" removed from fleet.`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete car.', 'error');
    }
  };

  // Quick Inline Status Toggler
  const handleQuickStatusChange = async (carId: string, newStatus: string) => {
    try {
      await api.admin.updateCarAvailability(carId, { status: newStatus });
      setCars(prev => prev.map(c => c.id === carId ? { ...c, status: newStatus as any } : c));
      showToast(`Status updated to: ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update availability status', 'error');
    }
  };

  // Quick Slot Adjustment
  const handleQuickSlotDelta = async (carId: string, delta: number) => {
    try {
      const res = await api.admin.updateCarSlots(carId, { delta });
      setCars(prev => prev.map(c => c.id === carId ? res.car : c));
      showToast(`Available slots updated to ${res.car.available_slots}/${res.car.total_slots}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to adjust slots', 'error');
    }
  };

  // Dedicated Image Modal Handlers
  const handleOpenImageManager = (car: CarType) => {
    setActiveCarForImages(car);
    setNewGalleryImageUrl('');
    setIsImageModalOpen(true);
  };

  const handleSetCoverImage = async (imgIndex: number) => {
    if (!activeCarForImages) return;
    const currentImgs = [...activeCarForImages.images];
    const [selected] = currentImgs.splice(imgIndex, 1);
    currentImgs.unshift(selected);

    setImageModalLoading(true);
    try {
      const res = await api.admin.updateCarImages(activeCarForImages.id, currentImgs);
      setActiveCarForImages(res.car);
      setCars(prev => prev.map(c => c.id === activeCarForImages.id ? res.car : c));
      showToast('Cover photo set successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update cover photo', 'error');
    } finally {
      setImageModalLoading(false);
    }
  };

  const handleRemoveImage = async (imgIndex: number) => {
    if (!activeCarForImages) return;
    if (activeCarForImages.images.length <= 1) {
      showToast('A vehicle must have at least one photo.', 'error');
      return;
    }
    const currentImgs = activeCarForImages.images.filter((_, idx) => idx !== imgIndex);

    setImageModalLoading(true);
    try {
      const res = await api.admin.updateCarImages(activeCarForImages.id, currentImgs);
      setActiveCarForImages(res.car);
      setCars(prev => prev.map(c => c.id === activeCarForImages.id ? res.car : c));
      showToast('Image removed from gallery.');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove image', 'error');
    } finally {
      setImageModalLoading(false);
    }
  };

  const handleAddImageToCar = async (imageUrl: string) => {
    if (!activeCarForImages || !imageUrl.trim()) return;
    const currentImgs = [...activeCarForImages.images, imageUrl.trim()];

    setImageModalLoading(true);
    try {
      const res = await api.admin.updateCarImages(activeCarForImages.id, currentImgs);
      setActiveCarForImages(res.car);
      setCars(prev => prev.map(c => c.id === activeCarForImages.id ? res.car : c));
      setNewGalleryImageUrl('');
      showToast('New photo added to vehicle!');
    } catch (err: any) {
      showToast(err.message || 'Failed to add image', 'error');
    } finally {
      setImageModalLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (id: string, booking_status: string, payment_status: string) => {
    try {
      await api.admin.updateBookingStatus(id, { booking_status, payment_status });
      loadAdminData();
      showToast('Booking status updated!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update booking.', 'error');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(settingsForm);
      showToast('Settings updated successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings.', 'error');
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white gap-3">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Authenticating & loading control room...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Top Admin Header */}
      <div className="py-6 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                Admin Console
              </span>
              <h1 className="text-xl font-bold text-white">AR Tours &amp; Travel Control Room</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">Logged in as {user?.email}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/10 backdrop-blur-md transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative z-10">
        {/* Navigation Tabs */}
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-2 flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('cars')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'cars' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Fleet ({cars.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'tours' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>Tours ({tours.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pilgrimage')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'pilgrimage' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Hajj &amp; Umrah ({pilgrimPackages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Car Bookings ({bookings.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'enquiries' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquiries ({tourEnquiries.length + pilgrimEnquiries.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'settings' ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Business Settings</span>
          </button>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-slate-400 text-xs font-bold uppercase">Car Slot Bookings</div>
                <div className="text-3xl font-black text-white mt-1">{stats?.totalBookings || bookings.length}</div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">₹99 Slot Pre-booking active</div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-slate-400 text-xs font-bold uppercase">Active Vehicle Fleet</div>
                <div className="text-3xl font-black text-white mt-1">{stats?.totalCars || cars.length} Cars</div>
                <div className="text-xs text-slate-400 mt-1">SUVs, MUVs &amp; Sedans</div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-slate-400 text-xs font-bold uppercase">Holiday Tour Packages</div>
                <div className="text-3xl font-black text-white mt-1">{stats?.totalTours || tours.length}</div>
                <div className="text-xs text-slate-400 mt-1">Kashmir, Kerala, Dubai, etc.</div>
              </div>

              <div className="bg-white/[0.03] backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl">
                <div className="text-slate-400 text-xs font-bold uppercase">Pending Leads &amp; Enquiries</div>
                <div className="text-3xl font-black text-amber-400 mt-1">
                  {tourEnquiries.length + pilgrimEnquiries.length}
                </div>
                <div className="text-xs text-slate-400 mt-1">Requires follow-up</div>
              </div>
            </div>

            {/* Quick Recent Activity */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl">
              <h3 className="font-bold text-white text-base mb-4">Recent ₹99 Car Slot Bookings</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase rounded-xl">
                    <tr>
                      <th className="p-3">Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Dates</th>
                      <th className="p-3">Slot Fee</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">{b.booking_number}</td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{b.customer_name}</div>
                          <div className="text-slate-400 text-[11px]">{b.customer_phone}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-200">{b.car?.brand} {b.car?.name}</td>
                        <td className="p-3 text-slate-400">{b.pickup_date} to {b.return_date}</td>
                        <td className="p-3 font-bold text-emerald-400">₹{b.booking_fee} PAID</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            {b.booking_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. FLEET MANAGEMENT TAB */}
        {activeTab === 'cars' && (
          <div className="space-y-6">
            {/* Header & Quick Action */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Car Rental Fleet &amp; Slot Management</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                    {cars.length} Vehicles
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add, update or delete car slots, live availability status, and photo galleries.
                </p>
              </div>

              <button
                onClick={handleOpenAddCar}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Fleet Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Available Cars</div>
                  <div className="text-lg font-black text-emerald-400">
                    {cars.filter(c => (c.status || 'available') === 'available').length}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Slots Full / Booked</div>
                  <div className="text-lg font-black text-amber-400">
                    {cars.filter(c => c.status === 'booked' || c.available_slots === 0).length}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">In Maintenance</div>
                  <div className="text-lg font-black text-purple-400">
                    {cars.filter(c => c.status === 'maintenance').length}
                  </div>
                </div>
              </div>

              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Total Open Slots</div>
                  <div className="text-lg font-black text-cyan-400">
                    {cars.reduce((acc, c) => acc + (c.available_slots || 0), 0)} Slots
                  </div>
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={carSearch}
                  onChange={e => setCarSearch(e.target.value)}
                  placeholder="Search by car name, brand, registration..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={carStatusFilter}
                  onChange={e => setCarStatusFilter(e.target.value as any)}
                  className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="all">All Availability Statuses</option>
                  <option value="available">Available Only</option>
                  <option value="booked">Slots Full / Booked</option>
                  <option value="maintenance">Under Maintenance</option>
                  <option value="inactive">Inactive / Hidden</option>
                </select>

                <select
                  value={carCategoryFilter}
                  onChange={e => setCarCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-950/60 border border-white/10 rounded-xl text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="SUV">SUV</option>
                  <option value="MUV">MUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Hatchback">Hatchback</option>
                </select>
              </div>
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cars
                .filter(c => {
                  const matchSearch =
                    !carSearch ||
                    c.name.toLowerCase().includes(carSearch.toLowerCase()) ||
                    c.brand.toLowerCase().includes(carSearch.toLowerCase()) ||
                    (c.registration_number && c.registration_number.toLowerCase().includes(carSearch.toLowerCase()));
                  const matchStatus = carStatusFilter === 'all' || (c.status || 'available') === carStatusFilter;
                  const matchCategory = carCategoryFilter === 'all' || c.category === carCategoryFilter;
                  return matchSearch && matchStatus && matchCategory;
                })
                .map(c => {
                  const isAvailable = (c.status || 'available') === 'available';
                  const isMaintenance = c.status === 'maintenance';
                  const isBooked = c.status === 'booked' || c.available_slots === 0;
                  const isInactive = c.status === 'inactive';

                  return (
                    <div
                      key={c.id}
                      className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col justify-between hover:border-amber-400/40 transition duration-300 group"
                    >
                      <div>
                        {/* Car Image Banner */}
                        <div className="h-48 bg-slate-950 relative overflow-hidden">
                          <img
                            src={Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80'}
                            alt={c.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            referrerPolicy="no-referrer"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-2 left-2 flex items-center gap-1.5">
                            <span className="bg-slate-950/80 backdrop-blur-md border border-white/10 text-amber-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                              {c.category}
                            </span>
                            {c.registration_number && (
                              <span className="bg-black/70 backdrop-blur-md border border-white/10 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                                {c.registration_number}
                              </span>
                            )}
                          </div>

                          <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
                            ₹{c.price_per_day}/day
                          </div>

                          {/* Fast Image Manager Trigger Button on Banner */}
                          <button
                            onClick={() => handleOpenImageManager(c)}
                            className="absolute bottom-2 right-2 bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-white text-[11px] font-medium px-2.5 py-1 rounded-xl backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer shadow-lg"
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>{Array.isArray(c.images) ? c.images.length : 1} Photos</span>
                          </button>
                        </div>

                        {/* Details */}
                        <div className="p-4 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">{c.brand}</div>
                              <h4 className="font-bold text-white text-base leading-tight">{c.name}</h4>
                            </div>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
                              ₹{c.booking_amount || 99} Slot Fee
                            </span>
                          </div>

                          {/* Quick Slot Controller */}
                          <div className="bg-slate-950/60 p-3 rounded-2xl border border-white/5 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-300 flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5 text-amber-400" />
                                <span>Slots Availability:</span>
                              </span>
                              <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                                (c.available_slots || 0) > 0
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-red-500/20 text-red-300'
                              }`}>
                                {c.available_slots || 0} / {c.total_slots || 5} Open
                              </span>
                            </div>

                            {/* Slot Quick Steppers */}
                            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                              <span className="text-[11px] text-slate-400">Quick Adjust Slots:</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuickSlotDelta(c.id, -1)}
                                  disabled={(c.available_slots || 0) <= 0}
                                  title="Decrease available slot (-1)"
                                  className="w-7 h-7 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-lg border border-white/10 flex items-center justify-center text-xs transition cursor-pointer"
                                >
                                  -1
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickSlotDelta(c.id, 1)}
                                  disabled={(c.available_slots || 0) >= (c.total_slots || 5)}
                                  title="Increase available slot (+1)"
                                  className="w-7 h-7 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-lg border border-white/10 flex items-center justify-center text-xs transition cursor-pointer"
                                >
                                  +1
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Quick Availability Status Dropdown */}
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-[11px] text-slate-400 font-medium">Fleet Status:</span>
                            <select
                              value={c.status || 'available'}
                              onChange={e => handleQuickStatusChange(c.id, e.target.value)}
                              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none transition cursor-pointer ${
                                isAvailable
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                  : isMaintenance
                                  ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
                                  : isBooked
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                                  : 'bg-slate-800 border-slate-700 text-slate-400'
                              }`}
                            >
                              <option value="available" className="bg-slate-900 text-emerald-300">● Available</option>
                              <option value="booked" className="bg-slate-900 text-amber-300">● Booked / Slots Full</option>
                              <option value="maintenance" className="bg-slate-900 text-purple-300">● Maintenance</option>
                              <option value="inactive" className="bg-slate-900 text-slate-400">● Inactive</option>
                            </select>
                          </div>

                          <div className="text-[11px] text-slate-400 font-medium">
                            {c.seating_capacity} Seats • {c.transmission} • {c.fuel_type} • Deposit ₹{c.security_deposit || 3000}
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="p-3 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs gap-2">
                        <button
                          onClick={() => handleOpenImageManager(c)}
                          className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl border border-white/10 flex items-center gap-1 font-semibold transition cursor-pointer"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>Photos</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEditCar(c)}
                            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => handleDeleteCar(c.id, c.name)}
                            className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-xl border border-transparent hover:border-red-500/20 transition cursor-pointer"
                            title="Delete car"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. BOOKINGS MANAGEMENT TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-white">All Car Rental Reservations (Razorpay ₹99 Slots)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Renter Info</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Pickup Location / Dates</th>
                    <th className="p-3">Slot Paid</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-white/5 transition">
                      <td className="p-3 font-mono font-bold text-amber-400">{b.booking_number}</td>
                      <td className="p-3">
                        <div className="font-bold text-white">{b.customer_name}</div>
                        <div className="text-slate-400 text-[11px]">{b.customer_phone}</div>
                        <div className="text-slate-400 text-[11px]">{b.customer_email}</div>
                      </td>
                      <td className="p-3 font-medium text-slate-200">{b.car?.brand} {b.car?.name}</td>
                      <td className="p-3">
                        <div className="font-semibold text-white">{b.pickup_location}</div>
                        <div className="text-slate-400 text-[11px]">{b.pickup_date} to {b.return_date} ({b.rental_days} days)</div>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">₹{b.booking_fee} (PAID)</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          b.booking_status === 'confirmed' ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-white/10 text-slate-300'
                        }`}>
                          {b.booking_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'completed', 'paid')}
                            className="px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500/30 transition cursor-pointer"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(b.id, 'cancelled', 'refunded')}
                            className="px-2.5 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-bold hover:bg-red-500/30 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. ENQUIRIES TAB */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="font-bold text-white text-base">Tour Enquiries Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Tour Package</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Travel Date</th>
                      <th className="p-3">Pax</th>
                      <th className="p-3">Notes</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {tourEnquiries.map(te => (
                      <tr key={te.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-bold text-white">{te.tour_title}</td>
                        <td className="p-3">
                          <div className="font-medium text-white">{te.full_name}</div>
                          <div className="text-slate-400">{te.phone} • {te.email}</div>
                        </td>
                        <td className="p-3 text-slate-300">{te.travel_date}</td>
                        <td className="p-3 text-slate-300">{te.number_of_adults}A, {te.number_of_children}C</td>
                        <td className="p-3 text-slate-400 max-w-xs">{te.special_requests || '—'}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                            {te.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="font-bold text-white text-base">Hajj &amp; Umrah Consultation Leads</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase">
                    <tr>
                      <th className="p-3">Package Title</th>
                      <th className="p-3">Pilgrim Name</th>
                      <th className="p-3">Preferred Month</th>
                      <th className="p-3">Departure City</th>
                      <th className="p-3">Sharing</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {pilgrimEnquiries.map(pe => (
                      <tr key={pe.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-bold text-white">{pe.package_title}</td>
                        <td className="p-3">
                          <div className="font-medium text-white">{pe.full_name}</div>
                          <div className="text-slate-400">{pe.phone} • {pe.email}</div>
                        </td>
                        <td className="p-3 text-slate-300">{pe.preferred_month}</td>
                        <td className="p-3 text-slate-300">{pe.departure_city}</td>
                        <td className="p-3 text-slate-300">{pe.room_sharing}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase">
                            {pe.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Business &amp; Reservation Settings</h2>
              <p className="text-xs text-slate-400">
                Update public contact details, WhatsApp integration numbers, and default slot fee parameters.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Name</label>
                <input
                  type="text"
                  value={settingsForm.company_name || ''}
                  onChange={e => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number (Call Desk)</label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">WhatsApp Number (Direct Chat)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Support Email</label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Physical Office Address</label>
                  <input
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Car Pre-Booking Slot Fee (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.booking_slot_fee ?? 99}
                    onChange={e => setSettingsForm({ ...settingsForm, booking_slot_fee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Default Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={settingsForm.standard_security_deposit ?? 3000}
                    onChange={e => setSettingsForm({ ...settingsForm, standard_security_deposit: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                Save Business Settings
              </button>
            </form>
          </div>
        )}
      </div>

      {/* TOAST NOTIFICATION POPUP */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2 text-xs font-bold ${
            actionToast.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30'
              : 'bg-red-950/90 text-red-300 border-red-500/30'
          }`}>
            {actionToast.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
            <span>{actionToast.message}</span>
          </div>
        </div>
      )}

      {/* 1. CAR CREATE / EDIT MODAL */}
      {isCarModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-3xl w-full rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base">
                  {editingCarId ? `Edit Vehicle: ${carForm.brand} ${carForm.name}` : 'Add New Vehicle to Fleet'}
                </h3>
                <p className="text-xs text-slate-400">
                  Configure slot availability, pricing, photos, and rental specifications.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCarModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveCar} className="space-y-4 text-xs">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={carForm.brand || ''}
                    onChange={e => setCarForm({ ...carForm, brand: e.target.value })}
                    placeholder="e.g. Toyota"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Model / Trim *</label>
                  <input
                    type="text"
                    required
                    value={carForm.name || ''}
                    onChange={e => setCarForm({ ...carForm, name: e.target.value, model: e.target.value })}
                    placeholder="e.g. Innova Crysta ZX"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Registration Plate</label>
                  <input
                    type="text"
                    value={carForm.registration_number || ''}
                    onChange={e => setCarForm({ ...carForm, registration_number: e.target.value })}
                    placeholder="e.g. MH 02 CZ 4401"
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Category</label>
                  <select
                    value={carForm.category || 'SUV'}
                    onChange={e => setCarForm({ ...carForm, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="SUV">SUV</option>
                    <option value="MUV">MUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Luxury">Luxury</option>
                    <option value="Hatchback">Hatchback</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    min="2"
                    max="15"
                    required
                    value={carForm.seating_capacity ?? 7}
                    onChange={e => setCarForm({ ...carForm, seating_capacity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Transmission</label>
                  <select
                    value={carForm.transmission || 'Automatic'}
                    onChange={e => setCarForm({ ...carForm, transmission: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Fuel Type</label>
                  <select
                    value={carForm.fuel_type || 'Diesel'}
                    onChange={e => setCarForm({ ...carForm, fuel_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              {/* Slot & Availability Controls */}
              <div className="p-3.5 bg-white/[0.02] border border-amber-500/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white text-xs">Slot Allocation &amp; Availability Status</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Total Daily Slots</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      required
                      value={carForm.total_slots ?? 5}
                      onChange={e => setCarForm({ ...carForm, total_slots: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Currently Available Slots</label>
                    <input
                      type="number"
                      min="0"
                      max={carForm.total_slots}
                      required
                      value={carForm.available_slots ?? 0}
                      onChange={e => setCarForm({ ...carForm, available_slots: Number(e.target.value) })}
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-emerald-400 focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 mb-1">Fleet Availability Status</label>
                    <select
                      value={carForm.status || 'available'}
                      onChange={e => setCarForm({ ...carForm, status: e.target.value as any })}
                      className="w-full p-2.5 bg-slate-950 border border-white/10 rounded-xl text-amber-300 font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="available">● Available for Booking</option>
                      <option value="booked">● Booked / Slots Full</option>
                      <option value="maintenance">● In Maintenance Workshop</option>
                      <option value="inactive">● Inactive / Unlisted</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Pricing & Deposit */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Price Per Day (₹) *</label>
                  <input
                    type="number"
                    required
                    value={carForm.price_per_day ?? 0}
                    onChange={e => setCarForm({ ...carForm, price_per_day: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Slot Pre-Booking Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={carForm.booking_amount ?? 99}
                    onChange={e => setCarForm({ ...carForm, booking_amount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-amber-400 font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">Refundable Deposit (₹)</label>
                  <input
                    type="number"
                    required
                    value={carForm.security_deposit ?? 3000}
                    onChange={e => setCarForm({ ...carForm, security_deposit: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Photos Manager in Form */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-300">Vehicle Photos Gallery ({carForm.imagesList.length} photos)</label>
                
                {/* Thumbnails list */}
                <div className="flex flex-wrap gap-2">
                  {carForm.imagesList.map((imgUrl, idx) => (
                    <div key={idx} className="relative group w-20 h-16 rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                      <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCarForm({ ...carForm, imagesList: carForm.imagesList.filter((_, i) => i !== idx) })}
                        className="absolute inset-0 bg-red-950/80 text-red-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add image URL bar */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={carForm.newModalImageUrl || ''}
                    onChange={e => setCarForm({ ...carForm, newModalImageUrl: e.target.value })}
                    placeholder="Paste image URL (https://...)"
                    className="flex-1 p-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (carForm.newModalImageUrl.trim()) {
                        setCarForm({
                          ...carForm,
                          imagesList: [...carForm.imagesList, carForm.newModalImageUrl.trim()],
                          newModalImageUrl: ''
                        });
                      }
                    }}
                    className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Photo</span>
                  </button>
                </div>
              </div>

              {/* Features & Description */}
              <div>
                <label className="block font-bold text-slate-300 mb-1">Vehicle Features (comma separated)</label>
                <input
                  type="text"
                  value={carForm.features || ''}
                  onChange={e => setCarForm({ ...carForm, features: e.target.value })}
                  placeholder="e.g. AC, Dual Airbags, Bluetooth, GPS, Power Steering, 24/7 Roadside Assistance"
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">Description &amp; Highlights</label>
                <textarea
                  rows={2}
                  value={carForm.description || ''}
                  onChange={e => setCarForm({ ...carForm, description: e.target.value })}
                  placeholder="Brief description of the vehicle condition, ideal uses, and rental terms."
                  className="w-full p-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCarModalOpen(false)}
                  className="px-4 py-2 border border-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  {editingCarId ? 'Update Vehicle' : 'Add to Fleet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. DEDICATED FAST IMAGE MANAGER MODAL */}
      {isImageModalOpen && activeCarForImages && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-white/10 max-w-3xl w-full rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                  <span>Manage Photo Gallery: {activeCarForImages.brand} {activeCarForImages.name}</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Set cover photos, add new high-res image URLs, or pick from popular vehicle presets.
                </p>
              </div>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Current Images Grid */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300 text-xs">
                Current Photos ({activeCarForImages.images.length})
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeCarForImages.images.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    className={`relative group rounded-2xl overflow-hidden border bg-slate-950 shadow-md ${
                      idx === 0 ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-white/10'
                    }`}
                  >
                    <div className="h-28 w-full overflow-hidden">
                      <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        ★ Cover Photo
                      </span>
                    )}

                    <div className="p-2 bg-slate-950/90 flex items-center justify-between gap-1 text-[11px]">
                      {idx !== 0 ? (
                        <button
                          type="button"
                          disabled={imageModalLoading}
                          onClick={() => handleSetCoverImage(idx)}
                          className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5" />
                          <span>Make Cover</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[10px]">Primary</span>
                      )}

                      <button
                        type="button"
                        disabled={imageModalLoading || activeCarForImages.images.length <= 1}
                        onClick={() => handleRemoveImage(idx)}
                        className="text-red-400 hover:text-red-300 p-1 hover:bg-red-500/10 rounded-lg transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Custom Image URL */}
            <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2">
              <label className="block font-bold text-slate-300 text-xs">Add Photo by Web URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newGalleryImageUrl}
                  onChange={e => setNewGalleryImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 p-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                />
                <button
                  type="button"
                  disabled={!newGalleryImageUrl.trim() || imageModalLoading}
                  onClick={() => handleAddImageToCar(newGalleryImageUrl)}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>

            {/* 1-Click Curated Presets */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-300 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>1-Click Curated Vehicle Photo Presets</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {PRESET_CAR_IMAGES.map((preset, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    disabled={imageModalLoading}
                    onClick={() => handleAddImageToCar(preset.url)}
                    className="p-2 bg-white/[0.02] hover:bg-white/[0.08] border border-white/10 rounded-xl flex items-center gap-2 text-left text-[11px] text-slate-200 transition cursor-pointer group"
                  >
                    <img src={preset.url} alt={preset.label} className="w-10 h-8 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <span className="flex-1 truncate font-medium group-hover:text-amber-400">{preset.label}</span>
                    <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* Close */}
            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
