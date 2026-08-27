import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  CreditCard,
  MessageSquare,
  Shield,
  Lock,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const { user, isAdmin } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020617]/85 backdrop-blur-2xl text-slate-300 border-t border-white/10 relative z-10">
      {/* Trust Badges Bar */}
      <div className="border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-md flex items-center justify-center text-amber-400 shadow-sm">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">₹99 Slot Pre-Booking</h4>
                <p className="text-xs text-slate-400">Reserve your car vehicle slot with minimal token fee.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-md flex items-center justify-center text-blue-400 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Trusted Hajj &amp; Umrah Guidance</h4>
                <p className="text-xs text-slate-400">5-Star Haram proximity, scholar assistance &amp; luxury buses.</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Transparent &amp; Verified Fleet</h4>
                <p className="text-xs text-slate-400">Sanitized, fully insured vehicles with 24/7 roadside aid.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
                <Compass className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                AR TOURS <span className="text-amber-400">&amp; TRAVEL</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Your premier full-stack travel partner for all-inclusive domestic &amp; international tour packages, transparent car rentals with instant ₹99 reservation, and sacred Hajj &amp; Umrah journeys.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address || 'AR House, Suite 402, Airline Road, Near Airport, Mumbai, MH'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.phone || '+91 81214 34741'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.email || 'support@artours.com'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.business_hours || 'Mon - Sun: 8:00 AM - 10:00 PM (24/7 Roadside Assistance)'}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Services & Fleet */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Services &amp; Fleet
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/tours" className="text-slate-400 hover:text-amber-400 transition">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/cars" className="text-slate-400 hover:text-amber-400 transition">
                  Car Rentals (Self/Chauffeur)
                </Link>
              </li>
              <li>
                <Link to="/hajj-umrah" className="text-slate-400 hover:text-amber-400 transition">
                  Hajj &amp; Umrah Packages
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-amber-400 transition">
                  Airport / Intercity Transfers
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-400 hover:text-amber-400 transition">
                  Custom Group &amp; Private Tours
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-amber-400 transition">
                  Corporate Car Hire
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Support */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-slate-400 hover:text-amber-400 transition">
                  About AR Tours
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-400 hover:text-amber-400 transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-amber-400 transition">
                  My Bookings
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/${(settings.whatsapp || '918121434741').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Consultant</span>
                </a>
              </li>
              <li>
                <Link to="/login" className="text-slate-400 hover:text-amber-400 transition">
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link
                  id="link-footer-admin"
                  to={isAdmin ? '/admin' : '/login?from=/admin'}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Policies */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Legal &amp; Policies
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/terms-and-conditions" className="text-slate-400 hover:text-amber-400 transition">
                  General Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link to="/car-rental-terms" className="text-slate-400 hover:text-amber-400 transition">
                  Car Rental Terms
                </Link>
              </li>
              <li>
                <Link to="/tour-terms" className="text-slate-400 hover:text-amber-400 transition">
                  Tour Package Terms
                </Link>
              </li>
              <li>
                <Link to="/pilgrimage-terms" className="text-slate-400 hover:text-amber-400 transition">
                  Pilgrimage (Hajj/Umrah) Terms
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-slate-400 hover:text-amber-400 transition">
                  Refund &amp; Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-amber-400 transition">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Dedicated Admin Panel Access Box */}
        <div className="mt-10 p-4 sm:p-5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-amber-400/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <span>Executive Admin Panel</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold border border-amber-500/30">
                  Single User Access
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restricted access point for authorized portal administrators.
              </p>
            </div>
          </div>
          <Link
            id="btn-footer-admin-portal"
            to={isAdmin ? '/admin' : '/login?from=/admin'}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Shield className="w-4 h-4" />
            <span>{isAdmin ? 'Open Admin Console' : 'Admin Panel Login'}</span>
          </Link>
        </div>

        {/* Discreet Legal Notice Banner in Frosted Glass */}
        <div className="mt-8 p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 text-[11px] text-slate-400 leading-relaxed shadow-inner">
          <p className="font-semibold text-slate-300 mb-1">Important Legal &amp; Regulatory Notice:</p>
          <p>
            These terms and conditions are provided as a general business template and should be reviewed and customized by qualified legal counsel before being used as the company's final legal terms. All Hajj and Umrah services are strictly subject to Saudi Ministry of Hajj and Umrah regulations, visa issuance guidelines, airline schedules, and hotel availability. Car rental slot reservations are governed by our verified vehicle rental agreement and valid driver licensing rules.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            &copy; {currentYear} AR Tours &amp; Travel. All rights reserved. Registered Travel &amp; Mobility Company.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-200 transition">Privacy</Link>
            <Link to="/terms-and-conditions" className="hover:text-slate-200 transition">Terms</Link>
            <Link to="/refund-policy" className="hover:text-slate-200 transition">Refunds</Link>
            <span className="text-amber-400 font-medium bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">Razorpay 256-bit Encrypted</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
