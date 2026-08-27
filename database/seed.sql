-- ==============================================================================
-- AR TOURS & TRAVEL - SEED DATA FOR SUPABASE / POSTGRESQL
-- ==============================================================================

-- 1. SETTINGS
INSERT INTO public.settings (key, value) VALUES
('company_info', '{
  "company_name": "AR Tours & Travel",
  "tagline": "Your Journey. Our Responsibility.",
  "phone": "+91 98765 43210",
  "alt_phone": "+91 98765 43211",
  "whatsapp": "+919876543210",
  "email": "bookings@artoursandtravel.com",
  "support_email": "support@artoursandtravel.com",
  "address": "AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099, India",
  "business_hours": "Monday – Sunday: 8:00 AM – 10:00 PM (24/7 Roadside Assistance)",
  "booking_slot_fee": 99,
  "currency": "INR",
  "currency_symbol": "₹",
  "standard_security_deposit": 3000,
  "tax_rate_percent": 5,
  "free_cancellation_hours": 24
}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. CARS
INSERT INTO public.cars (id, name, brand, model, category, registration_number, seating_capacity, transmission, fuel_type, price_per_day, security_deposit, booking_amount, description, features, images, location, status) VALUES
(
  'a1111111-1111-1111-1111-111111111111',
  'Toyota Innova Crysta ZX',
  'Toyota',
  'Crysta ZX 2.4 Automatic',
  'MUV',
  'MH 02 CZ 4401',
  7,
  'Automatic',
  'Diesel',
  3499.00,
  4000.00,
  99.00,
  'The gold standard for comfortable long-distance travel and family journeys. High ground clearance, plush captain seats, multi-zone climate control, and supreme reliability.',
  '["7 Captain Seats", "Dual AC & Rear Vents", "Cruise Control", "Apple CarPlay & Android Auto", "7 Airbags", "Ample Luggage Boot", "24/7 Roadside Support"]'::jsonb,
  '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Mumbai Central & Airport Hub',
  'available'
),
(
  'a2222222-2222-2222-2222-222222222222',
  'Mahindra XUV700 AX7 Luxury',
  'Mahindra',
  'AX7 Luxury AWD',
  'SUV',
  'MH 01 DX 8892',
  7,
  'Automatic',
  'Diesel',
  3899.00,
  5000.00,
  99.00,
  'Next-gen luxury SUV equipped with ADAS Level 2 safety, panoramic Skyroof, Sony 12-speaker audio system, and commanding highway presence for high-end tours.',
  '["7 Seats AWD", "Panoramic Skyroof", "Wireless Charging", "Sony 3D Surround Audio", "Ventilated Front Seats", "360-Degree Camera", "ADAS Safety"]'::jsonb,
  '["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Airport Terminal 2 / Pickup Hub',
  'available'
),
(
  'a3333333-3333-3333-3333-333333333333',
  'Hyundai Creta SX (O)',
  'Hyundai',
  'SX(O) 1.5 Turbo',
  'SUV',
  'MH 03 EA 1284',
  5,
  'Automatic',
  'Petrol',
  2499.00,
  3000.00,
  99.00,
  'Spacious 5-seater compact SUV perfect for city travel and scenic highway getaways. Great fuel economy, connected tech, and smooth suspension.',
  '["5 Seater", "Panoramic Sunroof", "Ventilated Seats", "Bose Premium Audio", "Air Purifier", "Connected Car Tech"]'::jsonb,
  '["https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Suburban Hub & Airport',
  'available'
),
(
  'a4444444-4444-4444-4444-444444444444',
  'Honda City ZX V-TEC',
  'Honda',
  'City ZX 5th Gen',
  'Sedan',
  'MH 04 BK 5521',
  5,
  'Automatic',
  'Petrol',
  2199.00,
  2500.00,
  99.00,
  'Executive comfort with ultra-smooth CVT transmission, class-leading rear legroom, soft leather upholstery, and superior refinement for business or leisure.',
  '["5 Seater Executive Sedan", "Leatherette Upholstery", "Electric Sunroof", "LaneWatch Camera", "Huge 506L Trunk", "Keyless Entry"]'::jsonb,
  '["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Downtown Central Hub',
  'available'
),
(
  'a5555555-5555-5555-5555-555555555555',
  'Toyota Fortuner 4x4 Legender',
  'Toyota',
  'Legender 4x4 Auto',
  'SUV',
  'MH 02 FT 9009',
  7,
  'Automatic',
  'Diesel',
  5999.00,
  8000.00,
  99.00,
  'Dominant 4x4 road presence with heavy-duty performance for mountain trips, outstation journeys, and VIP travel. Top-tier luxury and bulletproof reliability.',
  '["7 Seater 4x4", "Black & Maroon Leather", "Kick-Sensor Tailgate", "JBL 11-Speaker Audio", "Hill Assist Control", "High Ground Clearance"]'::jsonb,
  '["https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'Airport VIP Parking / Main Hub',
  'available'
),
(
  'a6666666-6666-6666-6666-666666666666',
  'Maruti Suzuki Ertiga ZXi Plus',
  'Maruti',
  'Ertiga Smart Hybrid',
  'MUV',
  'MH 05 EN 3319',
  7,
  'Manual',
  'CNG',
  1899.00,
  2000.00,
  99.00,
  'Most economical 7-seater MUV with dual CNG/Petrol power. Ideal for budget family road trips and city transport.',
  '["7 Seater", "CNG Eco-Friendly", "Roof-Mounted AC", "Touchscreen Infotainment", "Dual Airbags", "Foldable Rear Seats"]'::jsonb,
  '["https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  'East Hub & Airport Terminal',
  'available'
)
ON CONFLICT (id) DO NOTHING;

-- 3. TOURS
INSERT INTO public.tours (id, title, slug, destination, category, short_description, description, duration, starting_price, itinerary, inclusions, exclusions, important_info, images, available, featured, rating, reviews_count) VALUES
(
  'b1111111-1111-1111-1111-111111111111',
  'Kashmir Heaven on Earth: Srinagar, Gulmarg & Pahalgam',
  'kashmir-heaven-on-earth-srinagar-gulmarg-pahalgam',
  'Kashmir, India',
  'Honeymoon & Family',
  'Experience the crown jewel of India with Shikara rides on Dal Lake, Gondola rides in snowy Gulmarg, and lush Betaab Valley.',
  'Immerse yourself in breathtaking snow-capped valleys, traditional houseboat stays on tranquil Dal Lake, pine-carpeted alpine meadows of Pahalgam, and the world-famous Gulmarg Gondola. Crafted with private chauffeured transfers, 4-star boutique hotels, and authentic Kashmiri Wazwan experiences.',
  '6 Days / 5 Nights',
  24999.00,
  '[
    {"day": 1, "title": "Arrival in Srinagar & Dal Lake Shikara Ride", "description": "Airport pickup, check-in to luxury traditional Houseboat on Dal Lake, followed by sunset 2-hour Shikara ride covering floating markets and Char Chinar."},
    {"day": 2, "title": "Srinagar Heritage & Mughal Gardens", "description": "Explore Shalimar Bagh, Nishat Bagh, Chashme Shahi, and Shankaracharya Temple with panoramic city views."},
    {"day": 3, "title": "Day Excursion to Gulmarg Meadow of Flowers", "description": "Scenic drive to Gulmarg. Experience Phase 1 and Phase 2 Gondola ride up to Apharwat Peak for snow activities."},
    {"day": 4, "title": "Srinagar to Pahalgam Valley of Shepherds", "description": "Drive through saffron fields of Pampore. Check into riverside hotel in Pahalgam. Explore Betaab Valley and Aru Valley."},
    {"day": 5, "title": "Pahalgam Leisure & Baisaran Valley (Mini Switzerland)", "description": "Pony ride or hike to Baisaran meadow, riverside trout fishing, and local handicraft shopping."},
    {"day": 6, "title": "Departure from Srinagar Airport", "description": "Breakfast, souvenir shopping in Srinagar Lal Chowk, and drop-off at Srinagar International Airport with fond memories."}
  ]'::jsonb,
  '["5 Nights Stay in 4-Star Hotels & Luxury Houseboat", "Daily Gourmet Breakfast and Dinner (MAP Plan)", "Dedicated AC Vehicle for all transfers and sightseeing", "2-Hour Sunset Shikara Ride on Dal Lake", "Union Tolls, Driver Allowances, and Fuel Charges", "24/7 On-Ground Support Concierge"]'::jsonb,
  '["Airfare / Train tickets to and from Srinagar", "Gulmarg Gondola Phase 1 & 2 tickets (can be pre-booked)", "Pony rides / local union cabs in Pahalgam", "Personal laundry, beverages, and tips", "Entry fees to Mughal gardens and monuments"]'::jsonb,
  '["Valid Government Photo ID required for all travelers.", "Warm clothing recommended even during summer evenings.", "Pre-booking of Gulmarg Gondola online is strongly advised."]'::jsonb,
  '["https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  4.9,
  128
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Golden Triangle Royale: Delhi, Agra & Jaipur',
  'golden-triangle-royale-delhi-agra-jaipur',
  'Delhi, Agra, Jaipur',
  'Heritage & Culture',
  'Witness the architectural majesty of Taj Mahal, majestic Amber Fort, Qutub Minar, and colorful bazaars of the Pink City.',
  'Discover the rich history and grand palaces of India’s most celebrated cultural circuit. Travel in a private luxury car with English-speaking expert guides, stay in heritage properties, and experience sunrise at the world-renowned Taj Mahal.',
  '5 Days / 4 Nights',
  18499.00,
  '[
    {"day": 1, "title": "Arrival in Delhi & Capital City Sightseeing", "description": "Pickup from Delhi Airport/Railway Station. Tour India Gate, Rashtrapati Bhavan, Qutub Minar, and Humayun Tomb."},
    {"day": 2, "title": "Delhi to Agra & Agra Fort", "description": "Expressway drive to Agra. Check into hotel. Afternoon tour of the majestic red sandstone Agra Fort and Mehtab Bagh sunset Taj view."},
    {"day": 3, "title": "Sunrise Taj Mahal & Fatehpur Sikri to Jaipur", "description": "Early morning sunrise visit to Taj Mahal. Breakfast at hotel. En-route drive to Jaipur via UNESCO World Heritage site Fatehpur Sikri and Chand Baori stepwell."},
    {"day": 4, "title": "Jaipur Forts, Palaces & Pink City Bazaars", "description": "Elephant or Jeep ride to Amber Fort. Visit City Palace, Jantar Mantar, and photo stop at Hawa Mahal and Jal Mahal."},
    {"day": 5, "title": "Jaipur to Delhi Departure", "description": "Morning block-printing workshop or jewelry market shopping, followed by expressway transfer to Delhi Airport for departure."}
  ]'::jsonb,
  '["4 Nights in 4-Star Heritage & Luxury Hotels", "Daily Buffet Breakfast", "All Intercity & Local transfers in Private AC Sedan/SUV", "Licensed Monument Tour Guides in Agra and Jaipur", "All Tolls, Parking, Inter-State Taxes, Driver Allowances"]'::jsonb,
  '["Monument entry tickets", "Lunch and personal expenses", "Tips to guides and drivers"]'::jsonb,
  '["Taj Mahal remains closed on Fridays.", "Carry valid original passport or Aadhaar card for monument entries."]'::jsonb,
  '["https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  4.8,
  94
),
(
  'b3333333-3333-3333-3333-333333333333',
  'Kerala God’s Own Country: Munnar, Thekkady & Alleppey Houseboat',
  'kerala-gods-own-country-munnar-thekkady-alleppey',
  'Kerala, India',
  'Nature & Wellness',
  'Lush tea plantations in Munnar, spice gardens and wildlife in Thekkady, and overnight cruise in Alleppey backwaters.',
  'Escape to pristine greenery, misty mountain hills, fragrant cardamom hills, and serene palm-fringed lagoons. Enjoy personalized Ayurvedic wellness therapies and freshly cooked Kerala delicacies aboard a private luxury houseboat.',
  '6 Days / 5 Nights',
  21999.00,
  '[
    {"day": 1, "title": "Arrival in Kochi & Drive to Munnar Hills", "description": "Pickup from Cochin Airport. Scenic 4-hour drive to Munnar passing Cheeyappara and Valara waterfalls. Check in to resort."},
    {"day": 2, "title": "Munnar Tea Estates & Eravikulam National Park", "description": "Visit Mattupetty Dam, Echo Point, Tea Museum with tea-tasting, and Nilgiri Tahr habitat in Eravikulam."},
    {"day": 3, "title": "Munnar to Thekkady Spice Plantations", "description": "Drive through cardamom hills. Spice plantation guided walk, evening Kathakali dance and Kalaripayattu martial arts show."},
    {"day": 4, "title": "Thekkady to Alleppey Luxury Houseboat Cruise", "description": "Board private traditional Kerala Houseboat at 12:00 PM. Cruise through serene canals, paddy fields, with onboard chef preparing traditional meals."},
    {"day": 5, "title": "Alleppey to Marari Beach Resort", "description": "Disembark houseboat at 9:00 AM. Transfer to tranquil coastal resort in Marari/Kochi. Relax on sandy beach."},
    {"day": 6, "title": "Fort Kochi Tour & Airport Drop", "description": "Visit Chinese Fishing Nets, Mattancherry Palace, and Jew Town before drop-off at Cochin International Airport."}
  ]'::jsonb,
  '["2 Nights Munnar, 1 Night Thekkady, 1 Night Private Alleppey Houseboat, 1 Night Kochi/Marari", "All Meals onboard Houseboat (Lunch, Evening Tea, Dinner, Breakfast)", "Daily Buffet Breakfast at Hotels", "Private AC Chauffeur Driven Vehicle throughout", "Spice Plantation Entry and Cultural Show tickets"]'::jsonb,
  '["Airfare / Train tickets", "Ayurvedic massage charges (optional)", "Personal expenses and boat ride in Periyar lake"]'::jsonb,
  '["Houseboat AC operates from 9 PM to 6 AM in standard Deluxe, and 24 hours in Premium tier."]'::jsonb,
  '["https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  4.9,
  112
)
ON CONFLICT (id) DO NOTHING;

-- 4. PILGRIMAGE PACKAGES (HAJJ & UMRAH)
INSERT INTO public.pilgrimage_packages (id, package_type, title, slug, duration, starting_price, hotel_details, makkah_hotel, makkah_distance, madinah_hotel, madinah_distance, transport_details, food_details, ziyarat_details, inclusions, exclusions, itinerary, images, available, featured, rating) VALUES
(
  'c1111111-1111-1111-1111-111111111111',
  'Umrah',
  '15-Day Deluxe Umrah Package (5-Star Proximity)',
  '15-day-deluxe-umrah-package-5-star-proximity',
  '15 Days / 14 Nights',
  89999.00,
  'Premium 5-Star hotels directly in the Haram courtyard and walking distance in Madinah.',
  'Swissôtel Al Maqam / Pullman Zamzam (Makkah Clock Tower)',
  '0-50 meters (Direct Haram Courtyard)',
  'Anwar Al Madinah Mövenpick / Pullman Zamzam Madinah',
  '100 meters to Masjid An-Nabawi ladies & gents gate',
  'VIP AC Luxury Buses for all Airport transfers, Makkah-Madinah route, and Historical Ziyarat excursions.',
  'Full Board 3-times Indian / Continental Buffet catering prepared by experienced Indian chefs.',
  'Comprehensive guided Ziyarat in Makkah (Jabal Al-Noor/Ghar Hira, Cave Thawr, Mina, Muzdalifah, Arafat, Jabal Al-Rahmah) and Madinah (Masjid Quba, Masjid Al-Qiblatayn, Mount Uhud & Martyrs Cemetery, Seven Mosques, Date Farm).',
  '["Direct Flight Tickets from Mumbai/Delhi (Round Trip)", "Umrah E-Visa with Comprehensive Medical Insurance", "7 Nights Makkah 5-Star Hotel Stay with Haram View options", "7 Nights Madinah 5-Star Hotel Stay near Gate 15-20", "Buffet Breakfast, Lunch & Dinner Daily", "Free 5-Litre Zamzam Canister per pilgrim", "Complimentary Umrah Kit (Ihram/Abaya, Shoulder Bag, Tawaf Counter, Dua Guide)", "Experienced Islamic Scholar & Guide throughout"]'::jsonb,
  '["Room service and laundry expenses", "Excess luggage beyond airline allowance (typically 30kg + 7kg hand bag)", "Wheelchair assistance fees if required at Haram"]'::jsonb,
  '[
    {"day": "1-7", "title": "Makkah Al-Mukarramah (7 Nights)", "description": "Arrival at Jeddah Airport, transfer to Makkah hotel, assisted performance of first Umrah under guidance of scholar, daily prayers in Masjid Al-Haram, guided historical Ziyarat tour."},
    {"day": "8", "title": "Haramain High-Speed Train to Madinah", "description": "Check out from Makkah, board high-speed Haramain bullet train to Madinah Al-Munawwarah in 2 hours, check into hotel."},
    {"day": "8-14", "title": "Madinah Al-Munawwarah (7 Nights)", "description": "Peaceful prayers in Masjid An-Nabawi, Rawdah Shareef booking assistance (via Nusuk), historic Ziyarat including Masjid Quba and Mount Uhud."},
    {"day": "15", "title": "Departure via Madinah / Jeddah Airport", "description": "Final prayers, distribution of Zamzam cans, and airport transfer for return flight home."}
  ]'::jsonb,
  '["https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  5.0
),
(
  'c2222222-2222-2222-2222-222222222222',
  'Ramadan Umrah',
  'Last 15 Days of Ramadan Umrah with Laylatul Qadr & Eid in Haram',
  'last-15-days-ramadan-umrah-laylatul-qadr-eid',
  '15 Days / 14 Nights',
  124999.00,
  'Deluxe properties equipped with dedicated Sahur and Iftar buffet arrangements.',
  'Fairmont Clock Royal Tower / Makarem Ajyad',
  '150 meters to Haram Gate',
  'Dar Al Taqwa / Al Aqeeq Madinah',
  '150 meters to Masjid An-Nabawi',
  'Luxury air-conditioned coaches throughout the sacred journey.',
  'Daily Delicious Iftar Buffets and hearty early-morning Sahur meals.',
  'Complete guided Ziyarat of Makkah and Madinah holy monuments.',
  '["Direct Flights & Ramadan Umrah Visa", "Experience Laylatul Qadr & Eid prayers in Haramain", "Sahur & Iftar Meals Included", "All transfers and Ziyarat by AC Coach", "5L Zamzam Water packed for flight", "24/7 Group Leader & Muallim Support"]'::jsonb,
  '["Personal shopping, laundry, and local roaming SIM"]'::jsonb,
  '[
    {"day": "1-8", "title": "Makkah during Ramadan", "description": "Experience the spiritual bliss of Taraweeh, Qiyam-ul-Layl, and Iftar inside Masjid Al-Haram."},
    {"day": "9-15", "title": "Madinah & Eid Al-Fitr", "description": "Peaceful stay in the Prophet city with Eid celebrations in Masjid An-Nabawi."}
  ]'::jsonb,
  '["https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  5.0
),
(
  'c3333333-3333-3333-3333-333333333333',
  'Hajj',
  'Executive Non-Shifting Hajj Package 2026 / 1447H',
  'executive-non-shifting-hajj-package-2026',
  '21 Days / 20 Nights',
  485000.00,
  'Non-shifting package with continuous hotel access during all days of Manasik.',
  'Makkah Clock Royal Tower / Raffles Makkah',
  'Direct Courtyard Haram',
  'Oberoi Madinah / Dar Al Taqwa',
  'Steps away from Prophet Mosque',
  'VIP Private Mashair train passes, European air-conditioned Mina tents with sofa-cum-beds.',
  'Full Board 3-course buffet dining by leading international chefs in Mina, Arafat, and Hotels.',
  'In-depth Ziyarat under prominent scholars and historical guides.',
  '["Full Hajj Visa Processing & Ministry Quota Facilitation", "VIP Air-Conditioned Mina & Arafat Camps", "Non-Shifting 5-Star Hotel accommodations", "Qurbani / Hady sacrificial offering included", "Executive Doctor and medical team on standby 24/7", "Comprehensive logistics, luggage handling, and scholar lectures"]'::jsonb,
  '["Personal emergency medical treatments outside standard coverage", "Excess baggage fees"]'::jsonb,
  '[
    {"day": "1-4", "title": "Arrival in Makkah & Preparation", "description": "Welcome orientation, scholar guidance, Ihram briefings."},
    {"day": "5-9", "title": "The Days of Hajj (8th to 12th Dhul Hijjah)", "description": "Mina camp, Day of Arafah in VIP tents, Muzdalifah night under the stars, Rami Jamarat, Tawaf Al-Ifadah."},
    {"day": "10-14", "title": "Rest & Final Tawaf in Makkah", "description": "Spiritual contemplation and farewell Tawaf."},
    {"day": "15-21", "title": "Madinah Al-Munawwarah", "description": "Salutations at Rawdah and peaceful prayers before return flight."}
  ]'::jsonb,
  '["https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
  true,
  true,
  5.0
)
ON CONFLICT (id) DO NOTHING;

-- 5. REVIEWS
INSERT INTO public.reviews (id, user_name, user_location, service_type, rating, title, comment, approved) VALUES
(
  'd1111111-1111-1111-1111-111111111111',
  'Mohammed Farhan & Family',
  'Hyderabad, India',
  'Umrah Package',
  5,
  'Flawless 15-Day Umrah Experience',
  'Alhamdulillah, AR Tours & Travel made our family Umrah journey completely hassle-free. The hotel in Makkah was right in front of the clock tower, and in Madinah, it was less than 2 minutes to the ladies gate. The scholar explained every ritual with immense patience. May Allah bless the entire AR team!',
  true
),
(
  'd2222222-2222-2222-2222-222222222222',
  'Vikram Malhotra',
  'Mumbai, India',
  'Car Rental',
  5,
  'Transparent ₹99 Slot Booking & Pristine Innova Crysta',
  'Booked an Innova Crysta for a 5-day outstation family trip to Mahabaleshwar. The ₹99 slot booking on the website was instantaneous and gave me peace of mind. Car was spotlessly clean, fully sanitized, and the security deposit was refunded back into my account within 4 hours of return. Highly recommended!',
  true
),
(
  'd3333333-3333-3333-3333-333333333333',
  'Ananya Deshmukh',
  'Pune, India',
  'Tour Package',
  5,
  'Magical Kashmir Family Tour',
  'Everything from the houseboat on Dal Lake to the snow in Gulmarg was meticulously arranged. Our driver was polite, punctual, and knew all the scenic photo spots without rushing us. AR Tours & Travel truly lived up to "Your Journey. Our Responsibility."',
  true
),
(
  'd4444444-4444-4444-4444-444444444444',
  'Syed Zeeshan Ali',
  'Bangalore, India',
  'Car Rental',
  5,
  'Great Airport Pickup & Instant Booking Confirmation',
  'Rented the XUV700 from the airport. Booking online took 2 minutes, the ₹99 fee is genuine, and there were no hidden charges. Vehicle performed brilliantly on the expressway.',
  true
)
ON CONFLICT (id) DO NOTHING;
