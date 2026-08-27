import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Compass,
  Car,
  Palmtree,
  Moon,
  Menu,
  X,
  User,
  Shield,
  LogOut,
  CalendarCheck,
  ChevronDown,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 text-sm font-medium transition-all rounded-lg ${
      isActive
        ? 'text-amber-400 font-semibold bg-white/10 backdrop-blur-md shadow-inner border border-amber-400/20'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-all ${
      isActive
        ? 'text-amber-400 bg-white/10 backdrop-blur-md border border-amber-400/20 font-semibold'
        : 'text-slate-300 hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#020617]/75 backdrop-blur-2xl text-white border-b border-white/10 shadow-2xl">
      {/* Top Banner with Quick Contact */}
      <div className="bg-[#020617]/90 px-4 py-1.5 text-xs text-slate-300 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-normal">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{settings.phone || '+91 81214 34741'}</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300 font-normal">
              24/7 Car Rentals &amp; Hajj / Umrah Support
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-[11px] text-amber-400 font-semibold bg-amber-400/10 border border-amber-400/20 px-3 py-0.5 rounded-full">
              ₹99 Slot Booking Available
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>AR TOURS</span>
                <span className="text-amber-400 font-semibold">&amp; TRAVEL</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium">
                Your Journey. Our Responsibility.
              </div>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/tours" className={navLinkClass}>
              Tours
            </NavLink>
            <NavLink to="/cars" className={navLinkClass}>
              Car Rentals
            </NavLink>
            <NavLink to="/hajj-umrah" className={navLinkClass}>
              <span className="flex items-center gap-1">
                <span>Hajj &amp; Umrah</span>
                <Moon className="w-3 h-3 text-amber-400" />
              </span>
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About Us
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
            {user && (
              <NavLink to="/dashboard" className={navLinkClass}>
                My Bookings
              </NavLink>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAdmin && (
              <Link
                id="nav-admin-link"
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold border border-amber-500/30 backdrop-blur-md transition shadow-sm"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-md text-slate-100 text-sm font-medium border border-white/10 transition shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-900 font-bold flex items-center justify-center text-xs shadow-sm">
                    {user.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate">{user.full_name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-white/10">
                      <p className="text-sm font-semibold text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition"
                    >
                      <CalendarCheck className="w-4 h-4 text-amber-400" />
                      <span>My Bookings &amp; Enquiries</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 border-t border-white/10 mt-1 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  id="nav-login-btn"
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  id="nav-register-btn"
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="p-2 rounded-xl text-amber-400 hover:bg-white/10"
                title="Admin Panel"
              >
                <Shield className="w-5 h-5" />
              </Link>
            )}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#020617]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-3 pb-6 space-y-2 shadow-2xl">
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              end
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass className="w-5 h-5 text-amber-400" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/tours"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Palmtree className="w-5 h-5 text-amber-400" />
              <span>Tour Packages</span>
            </NavLink>
            <NavLink
              to="/cars"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Car className="w-5 h-5 text-amber-400" />
              <span>Car Rentals (₹99 Slot)</span>
            </NavLink>
            <NavLink
              to="/hajj-umrah"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Moon className="w-5 h-5 text-amber-400" />
              <span>Hajj &amp; Umrah Packages</span>
            </NavLink>
            <NavLink
              to="/about"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>About Us</span>
            </NavLink>
            <NavLink
              to="/services"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Our Services</span>
            </NavLink>
            <NavLink
              to="/contact"
              className={mobileNavLinkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Contact Us</span>
            </NavLink>
            {user && (
              <NavLink
                to="/dashboard"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarCheck className="w-5 h-5 text-amber-400" />
                <span>My Bookings &amp; Enquiries</span>
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Shield className="w-5 h-5 text-amber-400" />
                <span>Admin Dashboard</span>
              </NavLink>
            )}
          </nav>

          <div className="pt-4 border-t border-white/10 space-y-2">
            {user ? (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 backdrop-blur-md p-3 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{user.full_name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-400 hover:bg-white/10 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl backdrop-blur-md transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
