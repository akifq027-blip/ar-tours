import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the ₹99 car rental slot booking work?',
      a: 'When booking a car online, you pay a nominal reservation token fee of ₹99 through our secure Razorpay gateway. This reserves your vehicle slot for the chosen dates. The remaining daily rental amount along with the refundable security deposit is payable upon vehicle pickup/handover.',
    },
    {
      q: 'What documents are required to rent a self-drive car?',
      a: 'You must present an original valid Indian Driving License (minimum 1-year driving experience), an Aadhaar card / Passport for identity and address verification, and standard KYC verification during vehicle handover.',
    },
    {
      q: 'What is included in the Hajj and Umrah packages?',
      a: 'Our comprehensive pilgrimage packages typically include return flights, verified Saudi Umrah/Hajj visas, luxury 4/5-star hotel accommodation in close proximity to Masjid Al-Haram in Makkah and Masjid An-Nabawi in Madinah, daily buffet meals, AC transport, complete Ziyarat tours, and spiritual guidance by certified scholars.',
    },
    {
      q: 'Can I customize a tour package for my family or private group?',
      a: 'Yes! We specialize in tailored itineraries. Simply use our Tour Enquiry form or message our travel consultants on WhatsApp with your desired destination, dates, and group size, and we will craft a bespoke itinerary.',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Car rental slot pre-bookings canceled at least 24 hours prior to the scheduled pickup time are eligible for full refund or credit. Detailed refund timelines for tours, airfares, and pilgrimage packages are outlined in our Refund Policy page.',
    },
    {
      q: 'Is roadside assistance provided with car rentals?',
      a: 'Yes, 24/7 emergency roadside assistance is included with every rental vehicle across major transit corridors and state highways.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-md">
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            Clear answers about our fleet bookings, pilgrimage assistance, and travel guarantees.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-white hover:text-amber-400 transition"
                >
                  <span className="text-sm sm:text-base">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/10 bg-white/[0.01]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
