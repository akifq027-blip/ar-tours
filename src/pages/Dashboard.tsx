import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Car,
  Palmtree,
  Moon,
  Star,
  User,
  Phone,
  Mail,
  ShieldCheck,
  Printer,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { CarBooking, TourEnquiry, PilgrimageEnquiry } from '../types';

export const Dashboard: React.FC = () => {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'carBookings' | 'tourEnquiries' | 'pilgrimEnquiries' | 'review'>('carBookings');
  const [carBookings, setCarBookings] = useState<CarBooking[]>([]);
  const [tourEnquiries, setTourEnquiries] = useState<TourEnquiry[]>([]);
  const [pilgrimEnquiries, setPilgrimEnquiries] = useState<PilgrimageEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [editName, setEditName] = useState(user?.full_name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Update local fields when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.full_name || '');
      setEditPhone(user.phone || '');
    }
  }, [user]);

  // Review Form State
  const [reviewService, setReviewService] = useState('Car Rental');
  const [reviewRating, setReviewRating] = useState('5');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      navigate('/login?from=/dashboard', { replace: true });
      return;
    }

    async function loadUserData() {
      if (!user) return;
      setLoading(true);
      try {
        const [carsRes, toursRes, pilgRes] = await Promise.all([
          api.getUserCarBookings(user.email),
          api.getUserTourEnquiries(user.email),
          api.getUserPilgrimageEnquiries(user.email),
        ]);

        setCarBookings(carsRes.bookings || []);
        setTourEnquiries(toursRes.enquiries || []);
        setPilgrimEnquiries(pilgRes.enquiries || []);
      } catch (err) {
        console.error('User dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserData();
  }, [user, isLoading, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editName, editPhone);
      setProfileSuccess('Profile updated successfully.');
      setTimeout(() => setProfileSuccess(''), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await api.submitReview({
        user_name: user.full_name,
        user_location: 'Verified Customer',
        service_type: reviewService,
        rating: Number(reviewRating),
        title: reviewTitle,
        comment: reviewComment,
      });

      setReviewSuccess(true);
      setReviewTitle('');
      setReviewComment('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Loading your traveler profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Dashboard Top Header */}
      <div className="py-10 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white">{user?.full_name}</h1>
                  <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-white/10 text-amber-400 border border-white/10 backdrop-blur-md">
                    {user?.role}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email} • {user?.phone || 'No phone added'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        {/* Navigation Tabs */}
        <div className="bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-2 flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveTab('carBookings')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'carBookings'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Car Bookings ({carBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tourEnquiries')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'tourEnquiries'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Palmtree className="w-4 h-4" />
            <span>Tour Enquiries ({tourEnquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pilgrimEnquiries')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'pilgrimEnquiries'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Pilgrimage Requests ({pilgrimEnquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 min-w-[140px] py-3 px-4 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'review'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-300 hover:bg-white/5'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Tab 1: Car Bookings */}
        {activeTab === 'carBookings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Your Vehicle Reservations</h2>
              <Link
                to="/cars"
                className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
              >
                + Book Another Car (₹99)
              </Link>
            </div>

            {carBookings.length === 0 ? (
              <div className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center shadow-2xl">
                <Car className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Car Bookings Yet</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  Reserve an SUV, MUV, or sedan for just ₹99 online.
                </p>
                <Link
                  to="/cars"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 text-xs font-bold rounded-xl shadow backdrop-blur-md transition"
                >
                  Explore Fleet
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {carBookings.map(b => (
                  <div
                    key={b.id}
                    className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-3">
                      <div>
                        <div className="text-[11px] font-mono font-bold text-amber-400">
                          Ref #{b.booking_number}
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {b.car?.brand} {b.car?.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.booking_status === 'confirmed'
                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                        }`}>
                          {b.booking_status.toUpperCase()}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          ₹{b.booking_fee} Slot Fee PAID
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="text-slate-400 font-medium">Pickup</div>
                        <div className="font-semibold text-white">{b.pickup_location}</div>
                        <div className="text-slate-400">{b.pickup_date} at {b.pickup_time}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 font-medium">Drop-off</div>
                        <div className="font-semibold text-white">{b.drop_location}</div>
                        <div className="text-slate-400">{b.return_date} at {b.return_time}</div>
                      </div>

                      <div>
                        <div className="text-slate-400 font-medium">Financials</div>
                        <div className="font-semibold text-white">Total: ₹{b.total_amount.toLocaleString('en-IN')}</div>
                        <div className="text-amber-400 font-medium">
                          Remaining at handover: ₹{(b.remaining_amount + b.security_deposit).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-slate-400">
                        Booked on {new Date(b.created_at).toLocaleDateString('en-IN')}
                      </span>
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg flex items-center gap-1.5 backdrop-blur-md transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Voucher</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tour Enquiries */}
        {activeTab === 'tourEnquiries' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Your Holiday Tour Requests</h2>

            {tourEnquiries.length === 0 ? (
              <div className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center shadow-2xl">
                <Palmtree className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Tour Enquiries</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  Browse our Kashmir, Kerala, or Dubai packages and request a free quote.
                </p>
                <Link
                  to="/tours"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 text-xs font-bold rounded-xl shadow backdrop-blur-md transition"
                >
                  Explore Tours
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tourEnquiries.map(te => (
                  <div key={te.id} className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{te.tour_title}</h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                        {te.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div>
                        <strong className="text-white">Intended Travel:</strong> {te.travel_date}
                      </div>
                      <div>
                        <strong className="text-white">Party Size:</strong> {te.number_of_adults} Adults, {te.number_of_children} Children
                      </div>
                      <div>
                        <strong className="text-white">Submitted:</strong> {new Date(te.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    {te.special_requests && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                        <strong className="text-white">Notes:</strong> {te.special_requests}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Pilgrimage Enquiries */}
        {activeTab === 'pilgrimEnquiries' && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Your Hajj &amp; Umrah Consultations</h2>

            {pilgrimEnquiries.length === 0 ? (
              <div className="bg-white/[0.03] backdrop-blur-xl p-12 rounded-3xl border border-white/10 text-center shadow-2xl">
                <Moon className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No Pilgrimage Consultations</h3>
                <p className="text-xs text-slate-400 mt-1 mb-6">
                  Inquire about upcoming Umrah and Hajj packages with 5-star Haram proximity.
                </p>
                <Link
                  to="/hajj-umrah"
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 border border-white/10 text-xs font-bold rounded-xl shadow backdrop-blur-md transition"
                >
                  View Pilgrimage Packages
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pilgrimEnquiries.map(pe => (
                  <div key={pe.id} className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">{pe.package_title}</h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400 uppercase">
                        {pe.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div>
                        <strong className="text-white">Pilgrims:</strong> {pe.number_of_people} Persons
                      </div>
                      <div>
                        <strong className="text-white">Month:</strong> {pe.preferred_month}
                      </div>
                      <div>
                        <strong className="text-white">Departure City:</strong> {pe.departure_city}
                      </div>
                    </div>

                    {pe.room_sharing && (
                      <div className="text-xs text-slate-300">
                        <strong className="text-white">Room Sharing:</strong> {pe.room_sharing}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Leave a Review */}
        {activeTab === 'review' && (
          <div className="max-w-2xl bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-1">Share Your Travel Experience</h2>
            <p className="text-xs text-slate-400 mb-6">
              Your feedback helps us continuously elevate our fleet standards and tour experiences.
            </p>

            {reviewSuccess ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center space-y-2 backdrop-blur-md">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white text-base">Thank You for Your Review!</h4>
                <p className="text-xs text-slate-300">
                  Your review has been submitted for moderation and will appear on our verified reviews wall.
                </p>
                <button
                  onClick={() => setReviewSuccess(false)}
                  className="text-xs font-semibold text-emerald-400 underline mt-2 cursor-pointer"
                >
                  Write another review
                </button>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Service Type</label>
                    <select
                      value={reviewService}
                      onChange={e => setReviewService(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="Car Rental">Car Rental (Self-Drive / Chauffeur)</option>
                      <option value="Tour Package">Domestic / International Tour</option>
                      <option value="Hajj & Umrah">Hajj &amp; Umrah Pilgrimage</option>
                      <option value="Airport Transfer">Airport / Intercity Transfer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Star Rating</label>
                    <select
                      value={reviewRating}
                      onChange={e => setReviewRating(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-white/10 rounded-xl font-bold text-amber-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5/5 Exceptional)</option>
                      <option value="4">⭐⭐⭐⭐ (4/5 Very Good)</option>
                      <option value="3">⭐⭐⭐ (3/5 Average)</option>
                      <option value="2">⭐⭐ (2/5 Below Average)</option>
                      <option value="1">⭐ (1/5 Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Review Headline</label>
                  <input
                    type="text"
                    required
                    value={reviewTitle}
                    onChange={e => setReviewTitle(e.target.value)}
                    placeholder="e.g. Smooth Innova handover at Mumbai Airport!"
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Detailed Feedback</label>
                  <textarea
                    rows={4}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share what you loved about our service, vehicle condition, or tour arrangements..."
                    className="w-full px-3.5 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Customer Review</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
