import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Car,
  Palmtree,
  Moon,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Star,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { SearchBookingWidget } from '../components/SearchBookingWidget';
import { CarCard } from '../components/CarCard';
import { TourCard } from '../components/TourCard';
import { PilgrimageCard } from '../components/PilgrimageCard';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { ReviewCard } from '../components/ReviewCard';
import { FAQSection } from '../components/FAQSection';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { api } from '../services/api';
import { Car as CarType, Tour, PilgrimagePackage, Review } from '../types';
import { useSettings } from '../context/SettingsContext';

export const Home: React.FC = () => {
  const { settings } = useSettings();
  const [featuredCars, setFeaturedCars] = useState<CarType[]>([]);
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [featuredPilgrimage, setFeaturedPilgrimage] = useState<PilgrimagePackage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [carsRes, toursRes, pilgRes, revsRes] = await Promise.all([
          api.getCars({ limit: 4 }),
          api.getTours({ featured: true }),
          api.getPilgrimagePackages({ featured: true }),
          api.getReviews(),
        ]);

        setFeaturedCars(carsRes.cars.slice(0, 3));
        setFeaturedTours(toursRes.tours.slice(0, 3));
        setFeaturedPilgrimage(pilgRes.packages.slice(0, 3));
        setReviews(revsRes.reviews.slice(0, 3));
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen text-slate-100 relative">
      {/* 1. HERO SECTION */}
      <section className="relative text-white pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:28px_28px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Full-Stack Travel Agency</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Explore the World, <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Travel with Absolute Peace.
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Curated holiday tours, verified car rentals with <strong className="text-amber-400">₹499 slot reservation</strong>, and spiritually enriching 5-star Hajj &amp; Umrah journeys.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                <span>Reserve Car Slot for ₹499</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Certified Hajj &amp; Umrah Scholars</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Insured Fleet</span>
              </div>
            </div>
          </div>

          {/* Interactive Search & Booking Widget */}
          <div className="mt-8">
            <SearchBookingWidget />
          </div>
        </div>
      </section>

      {/* 2. THREE CORE SERVICES OVERVIEW */}
      <section className="py-16 relative z-10 border-y border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Car Rentals */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-7 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between group text-slate-200">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-5 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform">
                  <Car className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                  Self-Drive &amp; Chauffeur
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Car Rentals with Direct UPI Slot Pre-Booking
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Lock in sanitized SUVs, MUVs (Innova Crysta, Ertiga), and luxury sedans with a quick UPI slot reservation verified directly by admin.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">From ₹2,499/day</span>
                <Link
                  to="/cars"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  <span>Browse Fleet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Box 2: Tour Packages */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-7 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between group text-slate-200">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform">
                  <Palmtree className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
                  Domestic &amp; International
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  Curated Tour Packages
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Immerse yourself in Kashmir valleys, Kerala backwaters, Royal Rajasthan, and exotic Dubai with custom itineraries and dedicated guides.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">All-Inclusive Plans</span>
                <Link
                  to="/tours"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                >
                  <span>Explore Tours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Box 3: Hajj & Umrah */}
            <div className="bg-white/[0.03] backdrop-blur-xl p-7 rounded-2xl sm:rounded-3xl border border-white/10 shadow-xl hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between group text-slate-200">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 backdrop-blur-md shadow-sm group-hover:scale-110 transition-transform">
                  <Moon className="w-6 h-6" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  Sacred Pilgrimages
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Hajj &amp; Umrah Packages
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Experience blessed journeys with 5-star hotels directly facing Masjid Al-Haram and Masjid An-Nabawi, visa support, and certified scholar guidance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">5-Star Proximity</span>
                <Link
                  to="/hajj-umrah"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition"
                >
                  <span>View Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CARS FLEET WITH ₹499 PRE-BOOKING */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                <span>Verified Fleet</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Premium Car Rentals
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Choose from our sanitized fleet. Pay only <strong className="text-amber-400">₹499</strong> online today to lock in your booking slot; pay the rest at pickup.
              </p>
            </div>
            <Link
              to="/cars"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold shadow backdrop-blur-md transition"
            >
              <span>View All Fleet ({featuredCars.length}+)</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED TOUR PACKAGES */}
      <section className="py-16 sm:py-24 relative z-10 border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                <span>Trending Holidays</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Curated Holiday Packages
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Handcrafted itineraries with premium hotels, transfers, sightseeing, and dedicated destination managers.
              </p>
            </div>
            <Link
              to="/tours"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold shadow backdrop-blur-md transition"
            >
              <span>Explore All Tours</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. HAJJ & UMRAH PILGRIMAGE SHOWCASE */}
      <section className="py-16 sm:py-24 relative z-10 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
                <Moon className="w-3.5 h-3.5" />
                <span>Sacred Journeys</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Hajj &amp; Umrah Packages
              </h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Experience spiritual peace with our certified pilgrimage packages, 50-meter Haram proximity, scholar guidance, and complete Ziyarat.
              </p>
            </div>
            <Link
              to="/hajj-umrah"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <span>Consult Pilgrimage Expert</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPilgrimage.map(pkg => (
              <PilgrimageCard key={pkg.id} packageData={pkg} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 7. HOW IT WORKS */}
      <HowItWorks />

      {/* 8. CUSTOMER REVIEWS */}
      <section className="py-16 sm:py-24 relative z-10 border-t border-white/10 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
              <span>Customer Experiences</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trusted by Hundreds of Travelers
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-400">
              Read real feedback from families, corporate renters, and pilgrims who traveled with AR Tours &amp; Travel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(rev => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQ SECTION */}
      <FAQSection />

      {/* 10. BOTTOM BANNER CALL TO ACTION */}
      <section className="py-16 sm:py-24 relative z-10 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-slate-900/60 backdrop-blur-2xl p-10 sm:p-14 rounded-3xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
            Ready to Plan Your Next Journey?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 leading-relaxed">
            Whether you need a car rental for the weekend, a customized family vacation, or guidance on upcoming Hajj &amp; Umrah seasons, our travel specialists are at your service 24/7.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/cars"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              Reserve a Car Slot (₹499)
            </Link>
            <WhatsAppButton
              variant="button"
              label="Chat on WhatsApp"
              className="py-3.5 px-6 rounded-xl"
            />
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 backdrop-blur-md transition"
            >
              Contact Travel Desk
            </Link>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Quick Contact Button */}
      <WhatsAppButton />
    </div>
  );
};
