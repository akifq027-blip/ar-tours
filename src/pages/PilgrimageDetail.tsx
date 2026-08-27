import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Moon,
  Clock,
  Building2,
  Utensils,
  Bus,
  ShieldCheck,
  Send,
  CheckCircle,
  AlertCircle,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { PilgrimagePackage } from '../types';
import { useAuth } from '../context/AuthContext';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const PilgrimageDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [packageData, setPackageData] = useState<PilgrimagePackage | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Consultation Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [numberOfPeople, setNumberOfPeople] = useState('2');
  const [preferredMonth, setPreferredMonth] = useState('October 2026');
  const [departureCity, setDepartureCity] = useState('Mumbai');
  const [roomSharing, setRoomSharing] = useState('Quad Sharing (4 in a room)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function loadPackage() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getPilgrimageBySlug(slug);
        setPackageData(res.package);
      } catch (err: any) {
        setError(err.message || 'Package not found.');
      } finally {
        setLoading(false);
      }
    }
    loadPackage();
  }, [slug]);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name || '');
      if (!email) setEmail(user.email || '');
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await api.submitPilgrimageEnquiry({
        package_id: packageData.id,
        package_title: packageData.title,
        pilgrimage_type: packageData.package_type,
        full_name: fullName,
        email,
        phone,
        number_of_people: Number(numberOfPeople) || 1,
        preferred_month: preferredMonth,
        departure_city: departureCity,
        room_sharing: roomSharing,
        message,
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen py-20 px-4 text-center relative z-10">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Pilgrimage Package Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested package does not exist.'}</p>
        <Link
          to="/hajj-umrah"
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl shadow transition inline-block"
        >
          View All Pilgrimage Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Header Breadcrumb */}
      <div className="py-6 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <span>/</span>
            <Link to="/hajj-umrah" className="hover:text-amber-400 transition">Hajj &amp; Umrah</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">{packageData.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Full Package Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Showcase */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <img
                  src={packageData.images[activeImage] || packageData.images[0]}
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow">
                  {packageData.package_type}
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{packageData.duration}</span>
                </div>
              </div>

              {packageData.images.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                  {packageData.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition cursor-pointer ${
                        activeImage === idx ? 'border-amber-400 ring-2 ring-amber-400/30' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Package Specifications Card */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <Moon className="w-3.5 h-3.5" />
                    <span>Sacred Pilgrimage Package</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{packageData.title}</h1>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">All-Inclusive Starting</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    ₹{packageData.starting_price.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400"> / person</span>
                  </div>
                </div>
              </div>

              {/* Hotel & Proximity Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>Makkah Al-Mukarramah Hotel</span>
                  </div>
                  <div className="font-semibold text-white text-sm">{packageData.makkah_hotel}</div>
                  <div className="text-xs text-emerald-400 font-bold">{packageData.makkah_distance}</div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl space-y-1">
                  <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span>Al-Madinah Al-Munawwarah Hotel</span>
                  </div>
                  <div className="font-semibold text-white text-sm">{packageData.madinah_hotel}</div>
                  <div className="text-xs text-emerald-400 font-bold">{packageData.madinah_distance}</div>
                </div>
              </div>

              {/* Transport, Food, Ziyarat */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Bus className="w-4 h-4 text-amber-400" />
                    <span>Ground Transport</span>
                  </div>
                  <p className="text-slate-300">{packageData.transport_details}</p>
                </div>

                <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span>Meals &amp; Catering</span>
                  </div>
                  <p className="text-slate-300">{packageData.food_details}</p>
                </div>

                <div className="bg-white/[0.02] p-3.5 rounded-2xl border border-white/10">
                  <div className="font-bold text-white mb-1 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-amber-400" />
                    <span>Ziyarat Guide</span>
                  </div>
                  <p className="text-slate-300">{packageData.ziyarat_details}</p>
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Package Inclusions</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {packageData.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>Exclusions &amp; Notes</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {packageData.exclusions.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Free Consultation Request Form */}
          <div>
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl sticky top-24">
              <div className="border-b border-white/10 pb-4 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Spiritual Desk</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Request Consultation</h3>
                <p className="text-xs text-slate-400">
                  Speak directly with an Umrah &amp; Hajj travel coordinator for room sharing options and visa guidance.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-white text-base">Request Submitted!</h4>
                  <p className="text-xs text-slate-300">
                    May Allah bless your intentions. Our certified pilgrimage coordinator will contact you via phone/WhatsApp within 2 hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-semibold text-amber-400 underline mt-2 cursor-pointer"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleConsultationSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Mohammed Farhan"
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number (WhatsApp) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. farhan@example.com"
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Number of People</label>
                      <select
                        value={numberOfPeople}
                        onChange={e => setNumberOfPeople(e.target.value)}
                        className="w-full px-2 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md"
                      >
                        <option value="1" className="bg-slate-900 text-white">1 Person</option>
                        <option value="2" className="bg-slate-900 text-white">2 Persons</option>
                        <option value="3" className="bg-slate-900 text-white">3 Persons</option>
                        <option value="4" className="bg-slate-900 text-white">4 Persons</option>
                        <option value="6" className="bg-slate-900 text-white">6+ Persons</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Departure City</label>
                      <select
                        value={departureCity}
                        onChange={e => setDepartureCity(e.target.value)}
                        className="w-full px-2 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md"
                      >
                        <option value="Mumbai" className="bg-slate-900 text-white">Mumbai</option>
                        <option value="Delhi" className="bg-slate-900 text-white">Delhi</option>
                        <option value="Hyderabad" className="bg-slate-900 text-white">Hyderabad</option>
                        <option value="Bangalore" className="bg-slate-900 text-white">Bangalore</option>
                        <option value="Ahmedabad" className="bg-slate-900 text-white">Ahmedabad</option>
                        <option value="Chennai" className="bg-slate-900 text-white">Chennai</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Room Sharing Preference</label>
                    <select
                      value={roomSharing}
                      onChange={e => setRoomSharing(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md"
                    >
                      <option value="Quad Sharing (4 in a room)" className="bg-slate-900 text-white">Quad Sharing (Economical)</option>
                      <option value="Triple Sharing (3 in a room)" className="bg-slate-900 text-white">Triple Sharing</option>
                      <option value="Double / Twin Sharing (Private Couple Room)" className="bg-slate-900 text-white">Double / Twin Sharing (Private Room)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Specific Questions / Senior Citizen Assistance</label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="e.g. Wheelchair assistance needed for mother, passport status..."
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 backdrop-blur-md"
                    />
                  </div>

                  {submitError && (
                    <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-300 text-xs rounded-xl flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    id="btn-submit-pilgrim-enquiry"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Submitting...' : 'Request Free Consultation'}</span>
                  </button>
                </form>
              )}

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <WhatsAppButton
                  variant="inline"
                  label="Direct WhatsApp Consultation"
                  message={`As-salamu alaykum AR Tours, I am inquiring about the "${packageData.title}" package.`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};
