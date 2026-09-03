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
  CheckCircle,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  SlidersHorizontal,
  QrCode,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { api } from '../services/api';
import {
  Car as CarType,
  Tour,
  PilgrimagePackage,
  CarBooking,
  TourEnquiry,
  PilgrimageEnquiry,
  ContactMessage,
  Review,
} from '../types';

import { AdminCarsTab } from '../components/admin/AdminCarsTab';
import { AdminToursTab } from '../components/admin/AdminToursTab';
import { AdminPilgrimageTab } from '../components/admin/AdminPilgrimageTab';
import { AdminBookingsTab } from '../components/admin/AdminBookingsTab';
import { AdminEnquiriesTab } from '../components/admin/AdminEnquiriesTab';
import { AdminReviewsTab } from '../components/admin/AdminReviewsTab';

export const AdminDashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const { settings, updateSettings } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'cars' | 'tours' | 'pilgrimage' | 'bookings' | 'enquiries' | 'reviews' | 'settings'
  >('overview');

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
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Settings State Form
  const [settingsForm, setSettingsForm] = useState({
    company_name: settings?.company_name || 'AR Tours & Travel',
    phone: settings?.phone || '+91 81214 34741',
    whatsapp: settings?.whatsapp || '+918121434741',
    email: settings?.email || 'contact@artours.com',
    address: settings?.address || 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
    booking_slot_fee: settings?.booking_slot_fee ?? 499,
    standard_security_deposit: settings?.standard_security_deposit ?? 3000,
    upi_id: settings?.upi_id || 'mosinquadri1911@ybl',
    payee_name: settings?.payee_name || 'AR Tours & Travel',
    upi_qr_image: settings?.upi_qr_image || '',
  });

  // Sync settings when settings context loads
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        company_name: settings.company_name || 'AR Tours & Travel',
        phone: settings.phone || '+91 81214 34741',
        whatsapp: settings.whatsapp || '+918121434741',
        email: settings.email || 'contact@artours.com',
        address: settings.address || 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
        booking_slot_fee: settings.booking_slot_fee ?? 499,
        standard_security_deposit: settings.standard_security_deposit ?? 3000,
        upi_id: settings.upi_id || 'mosinquadri1911@ybl',
        payee_name: settings.payee_name || 'AR Tours & Travel',
        upi_qr_image: settings.upi_qr_image || '',
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
      setCars(carsRes.cars || []);
      setTours(toursRes.tours || []);
      setPilgrimPackages(pilgRes.packages || []);
      setBookings(bookRes.bookings || []);
      setTourEnquiries(enqRes.tourEnquiries || []);
      setPilgrimEnquiries(enqRes.pilgrimageEnquiries || []);
      setContactMessages(enqRes.contactMessages || []);
      setReviews(revsRes.reviews || []);
    } catch (err) {
      console.error('Admin fetch error:', err);
      showToast('Error refreshing administrative records.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.admin.updateSettings(settingsForm);
      if (updateSettings) {
        updateSettings(settingsForm as any);
      }
      showToast('Business configurations and booking fee saved successfully!');
    } catch (err: any) {
      showToast(err.message || 'Failed to update business parameters', 'error');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-bold tracking-wider uppercase">
            Loading AR Tours Operations Portal...
          </p>
        </div>
      </div>
    );
  }

  const totalLeads = tourEnquiries.length + pilgrimEnquiries.length + contactMessages.length;
  const totalSlotRevenue = bookings.reduce(
    (sum, b) => sum + (b.payment_status === 'paid' ? (b.booking_fee || 99) : 0),
    0
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {actionToast && (
        <div
          className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-bold transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
            actionToast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
          }`}
        >
          {actionToast.type === 'error' ? (
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
          ) : (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          )}
          <span>{actionToast.message}</span>
        </div>
      )}

      {/* Top Welcome Header */}
      <div className="bg-white/[0.03] backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              Operations Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">AR Tours Management Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Logged in as <span className="text-amber-400 font-semibold">{user?.full_name || 'Administrator'}</span> ({user?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAdminData}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white rounded-xl border border-white/10 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Sync Live Data</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-white/10 text-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('cars')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'cars'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Vehicle Fleet ({cars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tours')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'tours'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Palmtree className="w-4 h-4" />
          <span>Holiday Tours ({tours.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pilgrimage')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'pilgrimage'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Hajj &amp; Umrah ({pilgrimPackages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Car Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'enquiries'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Leads &amp; Enquiries ({totalLeads})</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reviews'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'text-slate-300 hover:bg-white/5'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveTab('bookings')}
              className="bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Car Reservations</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-3xl font-black text-white mt-1">{bookings.length}</div>
              <div className="text-xs text-emerald-400 font-semibold mt-1">
                ₹{totalSlotRevenue.toLocaleString('en-IN')} Slot Fee Collected
              </div>
            </div>

            <div
              onClick={() => setActiveTab('cars')}
              className="bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Fleet Vehicles</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-3xl font-black text-white mt-1">{cars.length} Cars</div>
              <div className="text-xs text-slate-400 mt-1">
                {cars.reduce((sum, c) => sum + (c.available_slots || 0), 0)} Open Daily Slots
              </div>
            </div>

            <div
              onClick={() => setActiveTab('tours')}
              className="bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Holiday Tours</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-3xl font-black text-white mt-1">{tours.length} Packages</div>
              <div className="text-xs text-slate-400 mt-1">Domestic &amp; International</div>
            </div>

            <div
              onClick={() => setActiveTab('enquiries')}
              className="bg-white/[0.03] hover:bg-white/[0.05] cursor-pointer transition backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl group"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                <span>Pending Leads</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-3xl font-black text-amber-400 mt-1">{totalLeads}</div>
              <div className="text-xs text-slate-400 mt-1">Direct WhatsApp &amp; Phone followup</div>
            </div>
          </div>

          {/* Quick Recent Reservations & Activity */}
          <div className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Recent Car Slot Reservations</h3>
                <p className="text-xs text-slate-400">Direct UPI bookings awaiting or verified with UTR transaction IDs.</p>
              </div>
              <button
                onClick={() => setActiveTab('bookings')}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-slate-400 uppercase rounded-xl text-[11px]">
                  <tr>
                    <th className="p-3">Ref &amp; Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Pickup Location / Dates</th>
                    <th className="p-3">Slot Fee</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-slate-500">
                        No reservations recorded yet.
                      </td>
                    </tr>
                  ) : (
                    bookings.slice(0, 5).map(b => (
                      <tr key={b.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-bold text-amber-400">
                          <div>#{b.booking_number}</div>
                          <div className="text-[10px] text-slate-400 font-sans font-normal">
                            {new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-white">{b.customer_name}</div>
                          <div className="text-slate-400 text-[11px]">{b.customer_phone}</div>
                        </td>
                        <td className="p-3 font-medium text-slate-200">
                          {b.car?.brand} {b.car?.name}
                        </td>
                        <td className="p-3 text-slate-300">
                          <div className="font-medium text-white">{b.pickup_location}</div>
                          <div className="text-slate-400 text-[11px]">
                            {b.pickup_date} to {b.return_date} ({b.rental_days}d)
                          </div>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">
                          <div>₹{b.booking_fee}</div>
                          <span className="text-[9px] uppercase tracking-wider text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {b.payment_status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              b.booking_status === 'confirmed'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : b.booking_status === 'completed'
                                ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {b.booking_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. FLEET CARS TAB */}
      {activeTab === 'cars' && (
        <AdminCarsTab cars={cars} onRefresh={loadAdminData} showToast={showToast} />
      )}

      {/* 3. HOLIDAY TOURS TAB */}
      {activeTab === 'tours' && (
        <AdminToursTab tours={tours} onRefresh={loadAdminData} showToast={showToast} />
      )}

      {/* 4. HAJJ & UMRAH PILGRIMAGE TAB */}
      {activeTab === 'pilgrimage' && (
        <AdminPilgrimageTab packages={pilgrimPackages} onRefresh={loadAdminData} showToast={showToast} />
      )}

      {/* 5. CAR BOOKINGS & VOUCHERS TAB */}
      {activeTab === 'bookings' && (
        <AdminBookingsTab bookings={bookings} onRefresh={loadAdminData} showToast={showToast} />
      )}

      {/* 6. ENQUIRIES & LEADS TAB */}
      {activeTab === 'enquiries' && (
        <AdminEnquiriesTab
          tourEnquiries={tourEnquiries}
          pilgrimEnquiries={pilgrimEnquiries}
          contactMessages={contactMessages}
          onRefresh={loadAdminData}
          showToast={showToast}
        />
      )}

      {/* 7. REVIEWS & TESTIMONIALS TAB */}
      {activeTab === 'reviews' && (
        <AdminReviewsTab reviews={reviews} onRefresh={loadAdminData} showToast={showToast} />
      )}

      {/* 8. BUSINESS SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-amber-400" />
              <span>Business &amp; Reservation Parameters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Update company branding, contact desk details, WhatsApp notification numbers, and default slot fee parameters.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Brand Name</label>
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

            {/* DIRECT UPI & SLOT PRICING SECTION */}
            <div className="p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <QrCode className="w-4 h-4" />
                    <span>Direct UPI &amp; Slot Lock Configuration</span>
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure your business UPI VPA, QR code, and custom slot lock token amount (minimum ₹1).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Car Pre-Booking Slot Fee (₹) <span className="text-amber-400">* (Min ₹1)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={settingsForm.booking_slot_fee ?? 499}
                    onChange={e =>
                      setSettingsForm({
                        ...settingsForm,
                        booking_slot_fee: Math.max(1, Number(e.target.value) || 1),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-amber-500/40 rounded-xl text-amber-300 font-mono font-bold focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Customers pay this exact token fee to hold their car slot. You can set it to ₹1 for live testing.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Business UPI ID / VPA <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. mosinquadri1911@ybl"
                    value={settingsForm.upi_id || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, upi_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-white/15 rounded-xl text-white font-mono focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Used for automatic QR generation and 1-click mobile deep-links.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Payee / Account Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AR Tours & Travel"
                    value={settingsForm.payee_name || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, payee_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    Default Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={settingsForm.standard_security_deposit ?? 3000}
                    onChange={e =>
                      setSettingsForm({
                        ...settingsForm,
                        standard_security_deposit: Math.max(0, Number(e.target.value) || 0),
                      })
                    }
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-950/80 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Custom QR Code Image (URL or File Upload) */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Custom UPI QR Code Image (Optional - Auto-generates if empty)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="https://... or upload image"
                    value={settingsForm.upi_qr_image || ''}
                    onChange={e => setSettingsForm({ ...settingsForm, upi_qr_image: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-950/80 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                  />
                  <label className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition">
                    Upload QR Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setSettingsForm({ ...settingsForm, upi_qr_image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {settingsForm.upi_qr_image && (
                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={settingsForm.upi_qr_image}
                      alt="Custom QR Preview"
                      className="w-16 h-16 object-contain rounded-lg border border-white/20 bg-white p-1"
                    />
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, upi_qr_image: '' })}
                      className="text-xs text-rose-400 hover:underline"
                    >
                      Clear custom QR image
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                Save Business Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
