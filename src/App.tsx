import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';

// Pages
import { Home } from './pages/Home';
import { Cars } from './pages/Cars';
import { CarDetail } from './pages/CarDetail';
import { CarCheckout } from './pages/CarCheckout';
import { Tours } from './pages/Tours';
import { TourDetail } from './pages/TourDetail';
import { Pilgrimage } from './pages/Pilgrimage';
import { PilgrimageDetail } from './pages/PilgrimageDetail';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { TermsAndConditions } from './pages/TermsAndConditions';
import { CarRentalTerms } from './pages/CarRentalTerms';
import { TourTerms } from './pages/TourTerms';
import { PilgrimageTerms } from './pages/PilgrimageTerms';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { RefundPolicy } from './pages/RefundPolicy';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <ScrollToTop />
          <div className="relative flex flex-col min-h-screen font-sans bg-[#020617] text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 overflow-hidden">
            {/* Ambient Background Glow Elements for Frosted Glass Effect */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-900/15 rounded-full blur-[140px]"></div>
              <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[160px]"></div>
              <div className="absolute -bottom-40 left-1/4 w-[600px] h-[600px] bg-indigo-900/15 rounded-full blur-[150px]"></div>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cars" element={<Cars />} />
                  <Route path="/cars/checkout" element={<CarCheckout />} />
                  <Route path="/cars/:id" element={<CarDetail />} />
                  <Route path="/tours" element={<Tours />} />
                  <Route path="/tours/:slug" element={<TourDetail />} />
                  <Route path="/hajj-umrah" element={<Pilgrimage />} />
                  <Route path="/hajj-umrah/:slug" element={<PilgrimageDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/car-rental-terms" element={<CarRentalTerms />} />
                  <Route path="/tour-terms" element={<TourTerms />} />
                  <Route path="/pilgrimage-terms" element={<PilgrimageTerms />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}
