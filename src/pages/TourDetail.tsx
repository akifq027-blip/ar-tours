import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Calendar,
  Users,
  Send,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  Info,
} from 'lucide-react';
import { api } from '../services/api';
import { Tour } from '../types';
import { useAuth } from '../context/AuthContext';
import { WhatsAppButton } from '../components/WhatsAppButton';

export const TourDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();

  const [tour, setTour] = useState<Tour | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Enquiry Form State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [travelDate, setTravelDate] = useState('');
  const [adults, setAdults] = useState('2');
  const [children, setChildren] = useState('0');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function loadTour() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getTourBySlug(slug);
        setTour(res.tour);
      } catch (err: any) {
        setError(err.message || 'Tour package not found.');
      } finally {
        setLoading(false);
      }
    }
    loadTour();
  }, [slug]);

  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name || '');
      if (!email) setEmail(user.email || '');
      if (!phone && user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tour) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await api.submitTourEnquiry({
        tour_id: tour.id,
        tour_title: tour.title,
        full_name: fullName,
        email,
        phone,
        travel_date: travelDate,
        number_of_adults: Number(adults) || 1,
        number_of_children: Number(children) || 0,
        special_requests: specialRequests,
      });

      setSubmitSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit enquiry. Please try again or reach out on WhatsApp.');
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

  if (error || !tour) {
    return (
      <div className="min-h-screen py-20 px-4 text-center relative z-10">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Tour Not Found</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'The requested tour does not exist.'}</p>
        <Link
          to="/tours"
          className="px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs font-bold rounded-xl shadow transition inline-block"
        >
          View All Tour Packages
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-100 pb-20 relative">
      {/* Breadcrumbs */}
      <div className="py-6 border-b border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-amber-400 transition">Home</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-amber-400 transition">Tours</Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">{tour.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Tour Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Gallery */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-white/10">
                <img
                  src={tour.images[activeImage] || tour.images[0]}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                  {tour.category}
                </div>
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{tour.duration}</span>
                </div>
              </div>

              {tour.images.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
                  {tour.images.map((img, idx) => (
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

            {/* Tour Header Card */}
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{tour.destination}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{tour.title}</h1>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-400 font-medium">Starting from</div>
                  <div className="text-2xl sm:text-3xl font-black text-amber-400">
                    ₹{tour.starting_price.toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400"> / person</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-base font-bold text-white mb-2">Package Overview</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </p>
              </div>

              {/* Day-by-Day Itinerary */}
              <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Detailed Itinerary</h3>
                <div className="space-y-3">
                  {tour.itinerary.map((item, idx) => (
                    <div key={idx} className="bg-white/[0.02] p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 font-bold text-white text-sm mb-1.5">
                        <span className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs flex items-center justify-center font-black">
                          {idx + 1}
                        </span>
                        <span>Day {item.day}: {item.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-8">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inclusions & Exclusions */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Inclusions</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tour.inclusions.map((inc, i) => (
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
                    <span>Exclusions</span>
                  </h3>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {tour.exclusions.map((exc, i) => (
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

          {/* Right Column: Enquiry Form Box */}
          <div>
            <div className="bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/10 shadow-2xl sticky top-24">
              <div className="border-b border-white/10 pb-4 mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Book or Enquire</span>
                <h3 className="text-lg font-bold text-white mt-0.5">Request Custom Quote</h3>
                <p className="text-xs text-slate-400">
                  Our tour specialist will create a tailored quote with hotel options &amp; airfares.
                </p>
              </div>

              {submitSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-white text-base">Enquiry Received!</h4>
                  <p className="text-xs text-slate-300">
                    Thank you! Our destination specialist will review your requirements and contact you within 2 business hours.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-semibold text-amber-400 underline mt-2 cursor-pointer"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Ananya Patel"
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
                      placeholder="e.g. ananya@example.com"
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Expected Travel Date *</label>
                    <input
                      type="date"
                      required
                      value={travelDate}
                      onChange={e => setTravelDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none backdrop-blur-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Adults (12+ yrs)</label>
                      <select
                        value={adults}
                        onChange={e => setAdults(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md"
                      >
                        <option value="1" className="bg-slate-900 text-white">1 Adult</option>
                        <option value="2" className="bg-slate-900 text-white">2 Adults</option>
                        <option value="3" className="bg-slate-900 text-white">3 Adults</option>
                        <option value="4" className="bg-slate-900 text-white">4 Adults</option>
                        <option value="6" className="bg-slate-900 text-white">6+ Adults</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1.5">Children (under 12)</label>
                      <select
                        value={children}
                        onChange={e => setChildren(e.target.value)}
                        className="w-full px-2.5 py-2 text-xs bg-white/5 border border-white/10 rounded-xl text-white backdrop-blur-md"
                      >
                        <option value="0" className="bg-slate-900 text-white">0 Children</option>
                        <option value="1" className="bg-slate-900 text-white">1 Child</option>
                        <option value="2" className="bg-slate-900 text-white">2 Children</option>
                        <option value="3" className="bg-slate-900 text-white">3+ Children</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Custom Requests / Budget</label>
                    <textarea
                      rows={2}
                      value={specialRequests}
                      onChange={e => setSpecialRequests(e.target.value)}
                      placeholder="e.g. 5-star hotel preference, flight quotes from Mumbai"
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
                    id="btn-submit-tour-enquiry"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Request...' : 'Get Free Customized Quote'}</span>
                  </button>
                </form>
              )}

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <WhatsAppButton
                  variant="inline"
                  label="Instant Quote on WhatsApp"
                  message={`Hi AR Tours & Travel, I would like to inquire about the "${tour.title}" (${tour.duration}) package.`}
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
