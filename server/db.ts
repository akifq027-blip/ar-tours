import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './config.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Supabase client instance (if configured)
let supabaseAdmin: SupabaseClient | null = null;
if (config.supabase.url && config.supabase.serviceRoleKey) {
  try {
    supabaseAdmin = createClient(config.supabase.url, config.supabase.serviceRoleKey);
  } catch (err) {
    console.warn('Could not initialize Supabase Admin client, using internal memory store:', err);
  }
}

// Internal Initial Mock/Persistent Store
export interface DbUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  phone: string;
  role: 'customer' | 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface DbCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  category: 'Sedan' | 'SUV' | 'Luxury' | 'Hatchback' | 'MUV' | 'Van';
  registration_number: string;
  seating_capacity: number;
  transmission: 'Manual' | 'Automatic';
  fuel_type: 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';
  price_per_day: number;
  security_deposit: number;
  booking_amount: number;
  description: string;
  features: string[];
  images: string[];
  location: string;
  status: 'available' | 'booked' | 'maintenance' | 'inactive';
  total_slots: number;
  available_slots: number;
  created_at: string;
  updated_at: string;
}

export interface DbCarBooking {
  id: string;
  booking_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  car_id: string;
  car?: DbCar;
  pickup_location: string;
  drop_location: string;
  pickup_date: string; // YYYY-MM-DD
  pickup_time: string; // HH:mm
  return_date: string; // YYYY-MM-DD
  return_time: string; // HH:mm
  rental_days: number;
  rental_rate_per_day: number;
  total_amount: number;
  booking_fee: number;
  security_deposit: number;
  remaining_amount: number;
  payment_method?: string; // 'UPI'
  utr_number?: string;
  payment_screenshot?: string;
  payment_status: 'awaiting_approval' | 'pending' | 'paid' | 'failed' | 'rejected' | 'refunded';
  booking_status: 'pending_verification' | 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled' | 'rejected';
  rejection_reason?: string;
  verified_at?: string;
  verified_by?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  driver_required?: boolean;
  special_instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface DbTour {
  id: string;
  title: string;
  slug: string;
  destination: string;
  category: string;
  short_description: string;
  description: string;
  duration: string;
  starting_price: number;
  itinerary: { day: number | string; title: string; description: string }[];
  inclusions: string[];
  exclusions: string[];
  important_info: string[];
  images: string[];
  available: boolean;
  featured: boolean;
  rating: number;
  reviews_count: number;
  created_at: string;
  updated_at: string;
}

export interface DbTourEnquiry {
  id: string;
  tour_id?: string;
  tour_title: string;
  user_id?: string;
  full_name: string;
  email: string;
  phone: string;
  travel_date: string;
  number_of_adults: number;
  number_of_children: number;
  total_estimated_amount?: number;
  special_requests?: string;
  status: 'new' | 'contacted' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface DbPilgrimagePackage {
  id: string;
  package_type: 'Hajj' | 'Umrah' | 'Ramadan Umrah';
  title: string;
  slug: string;
  duration: string;
  starting_price: number;
  hotel_details: string;
  makkah_hotel: string;
  makkah_distance: string;
  madinah_hotel: string;
  madinah_distance: string;
  transport_details: string;
  food_details: string;
  ziyarat_details: string;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: string; title: string; description: string }[];
  images: string[];
  available: boolean;
  featured: boolean;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface DbPilgrimageEnquiry {
  id: string;
  user_id?: string;
  package_id?: string;
  package_title?: string;
  pilgrimage_type: 'Hajj' | 'Umrah' | 'Custom Pilgrimage';
  full_name: string;
  email: string;
  phone: string;
  number_of_people: number;
  preferred_month: string;
  departure_city: string;
  room_sharing?: string;
  message?: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'booked' | 'closed';
  created_at: string;
}

export interface DbContactMessage {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  service_interest?: string;
  message: string;
  status: 'unread' | 'in_review' | 'resolved';
  created_at: string;
}

export interface DbPayment {
  id: string;
  user_id?: string;
  booking_id: string;
  booking_type: 'car_rental' | 'tour' | 'pilgrimage';
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  created_at: string;
}

export interface DbReview {
  id: string;
  user_id?: string;
  user_name: string;
  user_location: string;
  service_type: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  created_at: string;
}

// Master memory state seeded
class DatabaseStore {
  users: DbUser[] = [
    {
      id: 'usr-admin-01',
      email: 'akifq027@gmail.com',
      password_hash: bcrypt.hashSync('mosin@786', 10),
      full_name: 'Akif Qureshi (Admin)',
      phone: '+91 81214 34741',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-admin-02',
      email: 'adminayaan@gmail.com',
      password_hash: bcrypt.hashSync('ayaan@mosin8121434741', 10),
      full_name: 'Ayaan Admin',
      phone: '+91 81214 34741',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'usr-demo-02',
      email: 'customer@example.com',
      password_hash: bcrypt.hashSync('customer123', 8),
      full_name: 'Demo Customer',
      phone: '+91 98200 12345',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  cars: DbCar[] = [
    {
      id: 'car-innova-01',
      name: 'Toyota Innova Crysta ZX',
      brand: 'Toyota',
      model: 'Crysta ZX 2.4 Automatic',
      category: 'MUV',
      registration_number: 'MH 02 CZ 4401',
      seating_capacity: 7,
      transmission: 'Automatic',
      fuel_type: 'Diesel',
      price_per_day: 3499,
      security_deposit: 4000,
      booking_amount: 99,
      description: 'The gold standard for comfortable long-distance travel and family journeys. High ground clearance, plush captain seats, multi-zone climate control, and supreme reliability.',
      features: ['7 Captain Seats', 'Dual AC & Rear Vents', 'Cruise Control', 'Apple CarPlay & Android Auto', '7 Airbags', 'Ample Luggage Boot', '24/7 Roadside Support'],
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Mumbai Central & Airport Hub',
      status: 'available',
      total_slots: 5,
      available_slots: 4,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-xuv700-02',
      name: 'Mahindra XUV700 AX7 Luxury',
      brand: 'Mahindra',
      model: 'AX7 Luxury AWD',
      category: 'SUV',
      registration_number: 'MH 01 DX 8892',
      seating_capacity: 7,
      transmission: 'Automatic',
      fuel_type: 'Diesel',
      price_per_day: 3899,
      security_deposit: 5000,
      booking_amount: 99,
      description: 'Next-gen luxury SUV equipped with ADAS Level 2 safety, panoramic Skyroof, Sony 12-speaker audio system, and commanding highway presence.',
      features: ['7 Seats AWD', 'Panoramic Skyroof', 'Wireless Phone Charger', 'Sony 3D Surround Audio', 'Ventilated Front Seats', '360-Degree Camera', 'ADAS Safety'],
      images: [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Airport Terminal 2 / Pickup Hub',
      status: 'available',
      total_slots: 4,
      available_slots: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-creta-03',
      name: 'Hyundai Creta SX (O)',
      brand: 'Hyundai',
      model: 'SX(O) 1.5 Turbo',
      category: 'SUV',
      registration_number: 'MH 03 EA 1284',
      seating_capacity: 5,
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      price_per_day: 2499,
      security_deposit: 3000,
      booking_amount: 99,
      description: 'Spacious 5-seater compact SUV perfect for city travel and scenic highway getaways. Great fuel economy, connected tech, and smooth suspension.',
      features: ['5 Seater', 'Panoramic Sunroof', 'Ventilated Seats', 'Bose Premium Audio', 'Air Purifier', 'Connected Car Tech'],
      images: [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Suburban Hub & Airport',
      status: 'available',
      total_slots: 6,
      available_slots: 5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-city-04',
      name: 'Honda City ZX V-TEC',
      brand: 'Honda',
      model: 'City ZX 5th Gen',
      category: 'Sedan',
      registration_number: 'MH 04 BK 5521',
      seating_capacity: 5,
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      price_per_day: 2199,
      security_deposit: 2500,
      booking_amount: 99,
      description: 'Executive comfort with ultra-smooth CVT transmission, class-leading rear legroom, soft leather upholstery, and superior refinement for business or leisure.',
      features: ['5 Seater Executive Sedan', 'Leatherette Upholstery', 'Electric Sunroof', 'LaneWatch Camera', 'Huge 506L Trunk', 'Keyless Entry'],
      images: [
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Downtown Central Hub',
      status: 'available',
      total_slots: 4,
      available_slots: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-fortuner-05',
      name: 'Toyota Fortuner 4x4 Legender',
      brand: 'Toyota',
      model: 'Legender 4x4 Auto',
      category: 'SUV',
      registration_number: 'MH 02 FT 9009',
      seating_capacity: 7,
      transmission: 'Automatic',
      fuel_type: 'Diesel',
      price_per_day: 5999,
      security_deposit: 8000,
      booking_amount: 99,
      description: 'Dominant 4x4 road presence with heavy-duty performance for mountain trips, outstation journeys, and VIP travel. Top-tier luxury and bulletproof reliability.',
      features: ['7 Seater 4x4', 'Black & Maroon Leather', 'Kick-Sensor Tailgate', 'JBL 11-Speaker Audio', 'Hill Assist Control', 'High Ground Clearance'],
      images: [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'Airport VIP Parking / Main Hub',
      status: 'available',
      total_slots: 3,
      available_slots: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'car-ertiga-06',
      name: 'Maruti Suzuki Ertiga ZXi Plus',
      brand: 'Maruti',
      model: 'Ertiga Smart Hybrid',
      category: 'MUV',
      registration_number: 'MH 05 EN 3319',
      seating_capacity: 7,
      transmission: 'Manual',
      fuel_type: 'CNG',
      price_per_day: 1899,
      security_deposit: 2000,
      booking_amount: 99,
      description: 'Most economical 7-seater MUV with dual CNG/Petrol power. Ideal for budget family road trips and city transport.',
      features: ['7 Seater', 'CNG Eco-Friendly', 'Roof-Mounted AC', 'Touchscreen Infotainment', 'Dual Airbags', 'Foldable Rear Seats'],
      images: [
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=80',
      ],
      location: 'East Hub & Airport Terminal',
      status: 'available',
      total_slots: 8,
      available_slots: 6,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  carBookings: DbCarBooking[] = [
    {
      id: 'cb-seed-1',
      booking_number: 'ART-CAR-849201',
      user_id: 'usr-demo-02',
      customer_name: 'Akif Qureshi',
      customer_email: 'customer@example.com',
      customer_phone: '+91 98200 12345',
      car_id: 'car-innova-01',
      pickup_location: 'Mumbai Airport Terminal 2',
      drop_location: 'Mumbai Airport Terminal 2',
      pickup_date: '2026-09-10',
      pickup_time: '10:00',
      return_date: '2026-09-14',
      return_time: '18:00',
      rental_days: 4,
      rental_rate_per_day: 3499,
      total_amount: 13996,
      booking_fee: 499,
      security_deposit: 4000,
      remaining_amount: 13497,
      payment_method: 'UPI',
      utr_number: '425983719024',
      payment_status: 'paid',
      booking_status: 'confirmed',
      verified_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      verified_by: 'Admin',
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'cb-seed-2',
      booking_number: 'ART-CAR-918234',
      user_id: null,
      customer_name: 'Rahul Sharma',
      customer_email: 'rahul.sharma@example.com',
      customer_phone: '+91 98111 22334',
      car_id: 'car-fortuner-02',
      pickup_location: 'Mumbai Airport (T2)',
      drop_location: 'Pune Station',
      pickup_date: '2026-09-12',
      pickup_time: '09:00',
      return_date: '2026-09-15',
      return_time: '20:00',
      rental_days: 3,
      rental_rate_per_day: 6499,
      total_amount: 19497,
      booking_fee: 499,
      security_deposit: 5000,
      remaining_amount: 18998,
      payment_method: 'UPI',
      utr_number: '529401826491',
      payment_screenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      payment_status: 'awaiting_approval',
      booking_status: 'pending_verification',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
  ];

  tours: DbTour[] = [
    {
      id: 'tour-kashmir-01',
      title: 'Kashmir Heaven on Earth: Srinagar, Gulmarg & Pahalgam',
      slug: 'kashmir-heaven-on-earth-srinagar-gulmarg-pahalgam',
      destination: 'Kashmir, India',
      category: 'Honeymoon & Family',
      short_description: 'Experience the crown jewel of India with Shikara rides on Dal Lake, Gondola rides in snowy Gulmarg, and lush Betaab Valley.',
      description: 'Immerse yourself in breathtaking snow-capped valleys, traditional houseboat stays on tranquil Dal Lake, pine-carpeted alpine meadows of Pahalgam, and the world-famous Gulmarg Gondola. Crafted with private chauffeured transfers, 4-star boutique hotels, and authentic Kashmiri Wazwan experiences.',
      duration: '6 Days / 5 Nights',
      starting_price: 24999,
      itinerary: [
        { day: 1, title: 'Arrival in Srinagar & Dal Lake Shikara Ride', description: 'Airport pickup, check-in to luxury traditional Houseboat on Dal Lake, followed by sunset 2-hour Shikara ride covering floating markets and Char Chinar.' },
        { day: 2, title: 'Srinagar Heritage & Mughal Gardens', description: 'Explore Shalimar Bagh, Nishat Bagh, Chashme Shahi, and Shankaracharya Temple with panoramic city views.' },
        { day: 3, title: 'Day Excursion to Gulmarg Meadow of Flowers', description: 'Scenic drive to Gulmarg. Experience Phase 1 and Phase 2 Gondola ride up to Apharwat Peak for snow activities.' },
        { day: 4, title: 'Srinagar to Pahalgam Valley of Shepherds', description: 'Drive through saffron fields of Pampore. Check into riverside hotel in Pahalgam. Explore Betaab Valley and Aru Valley.' },
        { day: 5, title: 'Pahalgam Leisure & Baisaran Valley (Mini Switzerland)', description: 'Pony ride or hike to Baisaran meadow, riverside trout fishing, and local handicraft shopping.' },
        { day: 6, title: 'Departure from Srinagar Airport', description: 'Breakfast, souvenir shopping in Srinagar Lal Chowk, and drop-off at Srinagar International Airport with fond memories.' }
      ],
      inclusions: [
        '5 Nights Stay in 4-Star Hotels & Luxury Houseboat',
        'Daily Gourmet Breakfast and Dinner (MAP Plan)',
        'Dedicated AC Vehicle for all transfers and sightseeing',
        '2-Hour Sunset Shikara Ride on Dal Lake',
        'Union Tolls, Driver Allowances, and Fuel Charges',
        '24/7 On-Ground Support Concierge'
      ],
      exclusions: [
        'Airfare / Train tickets to and from Srinagar',
        'Gulmarg Gondola Phase 1 & 2 tickets (can be pre-booked)',
        'Pony rides / local union cabs in Pahalgam',
        'Personal laundry, beverages, and tips',
        'Entry fees to Mughal gardens and monuments'
      ],
      important_info: [
        'Valid Government Photo ID required for all travelers.',
        'Warm clothing recommended even during summer evenings.',
        'Pre-booking of Gulmarg Gondola online is strongly advised.'
      ],
      images: [
        'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 4.9,
      reviews_count: 128,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tour-golden-triangle-02',
      title: 'Golden Triangle Royale: Delhi, Agra & Jaipur',
      slug: 'golden-triangle-royale-delhi-agra-jaipur',
      destination: 'Delhi, Agra, Jaipur',
      category: 'Heritage & Culture',
      short_description: 'Witness the architectural majesty of Taj Mahal, majestic Amber Fort, Qutub Minar, and colorful bazaars of the Pink City.',
      description: 'Discover the rich history and grand palaces of India’s most celebrated cultural circuit. Travel in a private luxury car with English-speaking expert guides, stay in heritage properties, and experience sunrise at the world-renowned Taj Mahal.',
      duration: '5 Days / 4 Nights',
      starting_price: 18499,
      itinerary: [
        { day: 1, title: 'Arrival in Delhi & Capital City Sightseeing', description: 'Pickup from Delhi Airport/Railway Station. Tour India Gate, Rashtrapati Bhavan, Qutub Minar, and Humayun Tomb.' },
        { day: 2, title: 'Delhi to Agra & Agra Fort', description: 'Expressway drive to Agra. Check into hotel. Afternoon tour of the majestic red sandstone Agra Fort and Mehtab Bagh sunset Taj view.' },
        { day: 3, title: 'Sunrise Taj Mahal & Fatehpur Sikri to Jaipur', description: 'Early morning sunrise visit to Taj Mahal. Breakfast at hotel. En-route drive to Jaipur via UNESCO World Heritage site Fatehpur Sikri and Chand Baori stepwell.' },
        { day: 4, title: 'Jaipur Forts, Palaces & Pink City Bazaars', description: 'Elephant or Jeep ride to Amber Fort. Visit City Palace, Jantar Mantar, and photo stop at Hawa Mahal and Jal Mahal.' },
        { day: 5, title: 'Jaipur to Delhi Departure', description: 'Morning block-printing workshop or jewelry market shopping, followed by expressway transfer to Delhi Airport for departure.' }
      ],
      inclusions: [
        '4 Nights in 4-Star Heritage & Luxury Hotels',
        'Daily Buffet Breakfast',
        'All Intercity & Local transfers in Private AC Sedan/SUV',
        'Licensed Monument Tour Guides in Agra and Jaipur',
        'All Tolls, Parking, Inter-State Taxes, Driver Allowances'
      ],
      exclusions: [
        'Monument entry tickets',
        'Lunch and personal expenses',
        'Tips to guides and drivers'
      ],
      important_info: [
        'Taj Mahal remains closed on Fridays.',
        'Carry valid original passport or Aadhaar card for monument entries.'
      ],
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 4.8,
      reviews_count: 94,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'tour-kerala-03',
      title: 'Kerala God’s Own Country: Munnar, Thekkady & Alleppey Houseboat',
      slug: 'kerala-gods-own-country-munnar-thekkady-alleppey',
      destination: 'Kerala, India',
      category: 'Nature & Wellness',
      short_description: 'Lush tea plantations in Munnar, spice gardens and wildlife in Thekkady, and overnight cruise in Alleppey backwaters.',
      description: 'Escape to pristine greenery, misty mountain hills, fragrant cardamom hills, and serene palm-fringed lagoons. Enjoy personalized Ayurvedic wellness therapies and freshly cooked Kerala delicacies aboard a private luxury houseboat.',
      duration: '6 Days / 5 Nights',
      starting_price: 21999,
      itinerary: [
        { day: 1, title: 'Arrival in Kochi & Drive to Munnar Hills', description: 'Pickup from Cochin Airport. Scenic 4-hour drive to Munnar passing Cheeyappara and Valara waterfalls. Check in to resort.' },
        { day: 2, title: 'Munnar Tea Estates & Eravikulam National Park', description: 'Visit Mattupetty Dam, Echo Point, Tea Museum with tea-tasting, and Nilgiri Tahr habitat in Eravikulam.' },
        { day: 3, title: 'Munnar to Thekkady Spice Plantations', description: 'Drive through cardamom hills. Spice plantation guided walk, evening Kathakali dance and Kalaripayattu martial arts show.' },
        { day: 4, title: 'Thekkady to Alleppey Luxury Houseboat Cruise', description: 'Board private traditional Kerala Houseboat at 12:00 PM. Cruise through serene canals, paddy fields, with onboard chef preparing traditional meals.' },
        { day: 5, title: 'Alleppey to Marari Beach Resort', description: 'Disembark houseboat at 9:00 AM. Transfer to tranquil coastal resort in Marari/Kochi. Relax on sandy beach.' },
        { day: 6, title: 'Fort Kochi Tour & Airport Drop', description: 'Visit Chinese Fishing Nets, Mattancherry Palace, and Jew Town before drop-off at Cochin International Airport.' }
      ],
      inclusions: [
        '2 Nights Munnar, 1 Night Thekkady, 1 Night Private Alleppey Houseboat, 1 Night Kochi/Marari',
        'All Meals onboard Houseboat (Lunch, Evening Tea, Dinner, Breakfast)',
        'Daily Buffet Breakfast at Hotels',
        'Private AC Chauffeur Driven Vehicle throughout',
        'Spice Plantation Entry and Cultural Show tickets'
      ],
      exclusions: [
        'Airfare / Train tickets',
        'Ayurvedic massage charges (optional)',
        'Personal expenses and boat ride in Periyar lake'
      ],
      important_info: [
        'Houseboat AC operates from 9 PM to 6 AM in standard Deluxe, and 24 hours in Premium tier.'
      ],
      images: [
        'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 4.9,
      reviews_count: 112,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  tourEnquiries: DbTourEnquiry[] = [];

  pilgrimagePackages: DbPilgrimagePackage[] = [
    {
      id: 'pilg-umrah-15d-01',
      package_type: 'Umrah',
      title: '15-Day Deluxe Umrah Package (5-Star Proximity)',
      slug: '15-day-deluxe-umrah-package-5-star-proximity',
      duration: '15 Days / 14 Nights',
      starting_price: 89999,
      hotel_details: 'Premium 5-Star hotels directly in the Haram courtyard and walking distance in Madinah.',
      makkah_hotel: 'Swissôtel Al Maqam / Pullman Zamzam (Makkah Clock Tower)',
      makkah_distance: '0-50 meters (Direct Haram Courtyard)',
      madinah_hotel: 'Anwar Al Madinah Mövenpick / Pullman Zamzam Madinah',
      madinah_distance: '100 meters to Masjid An-Nabawi ladies & gents gate',
      transport_details: 'VIP AC Luxury Buses for all Airport transfers, Makkah-Madinah route, and Historical Ziyarat excursions.',
      food_details: 'Full Board 3-times Indian / Continental Buffet catering prepared by experienced Indian chefs.',
      ziyarat_details: 'Comprehensive guided Ziyarat in Makkah (Jabal Al-Noor/Ghar Hira, Cave Thawr, Mina, Muzdalifah, Arafat, Jabal Al-Rahmah) and Madinah (Masjid Quba, Masjid Al-Qiblatayn, Mount Uhud & Martyrs Cemetery, Seven Mosques, Date Farm).',
      inclusions: [
        'Direct Flight Tickets from Mumbai/Delhi (Round Trip)',
        'Umrah E-Visa with Comprehensive Medical Insurance',
        '7 Nights Makkah 5-Star Hotel Stay with Haram View options',
        '7 Nights Madinah 5-Star Hotel Stay near Gate 15-20',
        'Buffet Breakfast, Lunch & Dinner Daily',
        'Free 5-Litre Zamzam Canister per pilgrim',
        'Complimentary Umrah Kit (Ihram/Abaya, Shoulder Bag, Tawaf Counter, Dua Guide)',
        'Experienced Islamic Scholar & Guide throughout'
      ],
      exclusions: [
        'Room service and laundry expenses',
        'Excess luggage beyond airline allowance (typically 30kg + 7kg hand bag)',
        'Wheelchair assistance fees if required at Haram'
      ],
      itinerary: [
        { day: '1-7', title: 'Makkah Al-Mukarramah (7 Nights)', description: 'Arrival at Jeddah Airport, transfer to Makkah hotel, assisted performance of first Umrah under guidance of scholar, daily prayers in Masjid Al-Haram, guided historical Ziyarat tour.' },
        { day: '8', title: 'Haramain High-Speed Train to Madinah', description: 'Check out from Makkah, board high-speed Haramain bullet train to Madinah Al-Munawwarah in 2 hours, check into hotel.' },
        { day: '8-14', title: 'Madinah Al-Munawwarah (7 Nights)', description: 'Peaceful prayers in Masjid An-Nabawi, Rawdah Shareef booking assistance (via Nusuk), historic Ziyarat including Masjid Quba and Mount Uhud.' },
        { day: '15', title: 'Departure via Madinah / Jeddah Airport', description: 'Final prayers, distribution of Zamzam cans, and airport transfer for return flight home.' }
      ],
      images: [
        'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pilg-ramadan-15d-02',
      package_type: 'Ramadan Umrah',
      title: 'Last 15 Days of Ramadan Umrah with Laylatul Qadr & Eid in Haram',
      slug: 'last-15-days-ramadan-umrah-laylatul-qadr-eid',
      duration: '15 Days / 14 Nights',
      starting_price: 124999,
      hotel_details: 'Deluxe properties equipped with dedicated Sahur and Iftar buffet arrangements.',
      makkah_hotel: 'Fairmont Clock Royal Tower / Makarem Ajyad',
      makkah_distance: '150 meters to Haram Gate',
      madinah_hotel: 'Dar Al Taqwa / Al Aqeeq Madinah',
      madinah_distance: '150 meters to Masjid An-Nabawi',
      transport_details: 'Luxury air-conditioned coaches throughout the sacred journey.',
      food_details: 'Daily Delicious Iftar Buffets and hearty early-morning Sahur meals.',
      ziyarat_details: 'Complete guided Ziyarat of Makkah and Madinah holy monuments.',
      inclusions: [
        'Direct Flights & Ramadan Umrah Visa',
        'Experience Laylatul Qadr & Eid prayers in Haramain',
        'Sahur & Iftar Meals Included',
        'All transfers and Ziyarat by AC Coach',
        '5L Zamzam Water packed for flight',
        '24/7 Group Leader & Muallim Support'
      ],
      exclusions: [
        'Personal shopping, laundry, and local roaming SIM'
      ],
      itinerary: [
        { day: '1-8', title: 'Makkah during Ramadan', description: 'Experience the spiritual bliss of Taraweeh, Qiyam-ul-Layl, and Iftar inside Masjid Al-Haram.' },
        { day: '9-15', title: 'Madinah & Eid Al-Fitr', description: 'Peaceful stay in the Prophet city with Eid celebrations in Masjid An-Nabawi.' }
      ],
      images: [
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'pilg-hajj-2026-03',
      package_type: 'Hajj',
      title: 'Executive Non-Shifting Hajj Package 2026 / 1447H',
      slug: 'executive-non-shifting-hajj-package-2026',
      duration: '21 Days / 20 Nights',
      starting_price: 485000,
      hotel_details: 'Non-shifting package with continuous hotel access during all days of Manasik.',
      makkah_hotel: 'Makkah Clock Royal Tower / Raffles Makkah',
      makkah_distance: 'Direct Courtyard Haram',
      madinah_hotel: 'Oberoi Madinah / Dar Al Taqwa',
      madinah_distance: 'Steps away from Prophet Mosque',
      transport_details: 'VIP Private Mashair train passes, European air-conditioned Mina tents with sofa-cum-beds.',
      food_details: 'Full Board 3-course buffet dining by leading international chefs in Mina, Arafat, and Hotels.',
      ziyarat_details: 'In-depth Ziyarat under prominent scholars and historical guides.',
      inclusions: [
        'Full Hajj Visa Processing & Ministry Quota Facilitation',
        'VIP Air-Conditioned Mina & Arafat Camps',
        'Non-Shifting 5-Star Hotel accommodations',
        'Qurbani / Hady sacrificial offering included',
        'Executive Doctor and medical team on standby 24/7',
        'Comprehensive logistics, luggage handling, and scholar lectures'
      ],
      exclusions: [
        'Personal emergency medical treatments outside standard coverage',
        'Excess baggage fees'
      ],
      itinerary: [
        { day: '1-4', title: 'Arrival in Makkah & Preparation', description: 'Welcome orientation, scholar guidance, Ihram briefings.' },
        { day: '5-9', title: 'The Days of Hajj (8th to 12th Dhul Hijjah)', description: 'Mina camp, Day of Arafah in VIP tents, Muzdalifah night under the stars, Rami Jamarat, Tawaf Al-Ifadah.' },
        { day: '10-14', title: 'Rest & Final Tawaf in Makkah', description: 'Spiritual contemplation and farewell Tawaf.' },
        { day: '15-21', title: 'Madinah Al-Munawwarah', description: 'Salutations at Rawdah and peaceful prayers before return flight.' }
      ],
      images: [
        'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80'
      ],
      available: true,
      featured: true,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ];

  pilgrimageEnquiries: DbPilgrimageEnquiry[] = [];

  contactMessages: DbContactMessage[] = [];

  payments: DbPayment[] = [];

  reviews: DbReview[] = [
    {
      id: 'rev-01',
      user_name: 'Mohammed Farhan & Family',
      user_location: 'Hyderabad, India',
      service_type: 'Umrah Package',
      rating: 5,
      title: 'Flawless 15-Day Umrah Experience',
      comment: 'Alhamdulillah, AR Tours & Travel made our family Umrah journey completely hassle-free. The hotel in Makkah was right in front of the clock tower, and in Madinah, it was less than 2 minutes to the ladies gate. The scholar explained every ritual with immense patience. May Allah bless the entire AR team!',
      approved: true,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: 'rev-02',
      user_name: 'Vikram Malhotra',
      user_location: 'Mumbai, India',
      service_type: 'Car Rental',
      rating: 5,
      title: 'Transparent ₹99 Slot Booking & Pristine Innova Crysta',
      comment: 'Booked an Innova Crysta for a 5-day outstation family trip to Mahabaleshwar. The ₹99 slot booking on the website was instantaneous and gave me peace of mind. Car was spotlessly clean, fully sanitized, and the security deposit was refunded back into my account within 4 hours of return. Highly recommended!',
      approved: true,
      created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    },
    {
      id: 'rev-03',
      user_name: 'Ananya Deshmukh',
      user_location: 'Pune, India',
      service_type: 'Tour Package',
      rating: 5,
      title: 'Magical Kashmir Family Tour',
      comment: 'Everything from the houseboat on Dal Lake to the snow in Gulmarg was meticulously arranged. Our driver was polite, punctual, and knew all the scenic photo spots without rushing us. AR Tours & Travel truly lived up to "Your Journey. Our Responsibility."',
      approved: true,
      created_at: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
      id: 'rev-04',
      user_name: 'Syed Zeeshan Ali',
      user_location: 'Bangalore, India',
      service_type: 'Car Rental',
      rating: 5,
      title: 'Great Airport Pickup & Instant Booking Confirmation',
      comment: 'Rented the XUV700 from the airport. Booking online took 2 minutes, the ₹99 fee is genuine, and there were no hidden charges. Vehicle performed brilliantly on the expressway.',
      approved: true,
      created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    }
  ];

  settings: Record<string, any> = {
    company_info: {
      company_name: 'AR Tours & Travel',
      tagline: 'Your Journey. Our Responsibility.',
      phone: '+91 81214 34741',
      alt_phone: '+91 81214 34741',
      whatsapp: '+918121434741',
      email: 'contact@artours.com',
      support_email: 'support@artours.com',
      address: 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
      business_hours: 'Monday – Sunday: 8:00 AM – 10:00 PM (24/7 Roadside Assistance)',
      booking_slot_fee: 499,
      currency: 'INR',
      currency_symbol: '₹',
      standard_security_deposit: 3000,
      upi_id: '8121434741@upi',
      payee_name: 'AR Tours & Travel',
      upi_qr_image: '',
      tax_rate_percent: 5,
      free_cancellation_hours: 24
    }
  };

  // Helper method: Real Overlap Date Checking with Slot Capacity
  // Two bookings overlap if (StartA <= EndB) and (EndA >= StartB)
  isCarAvailable(carId: string, pickupDate: string, returnDate: string, excludeBookingId?: string): boolean {
    const pDate = new Date(pickupDate).getTime();
    const rDate = new Date(returnDate).getTime();

    if (isNaN(pDate) || isNaN(rDate) || rDate < pDate) {
      return false;
    }

    const car = this.cars.find(c => c.id === carId);
    if (!car || car.status !== 'available') {
      return false;
    }

    if (typeof car.available_slots === 'number' && car.available_slots <= 0) {
      return false;
    }

    const totalSlots = car.total_slots || car.available_slots || 1;

    const overlappingBookings = this.carBookings.filter(b => {
      if (b.car_id !== carId) return false;
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.booking_status === 'cancelled' || b.booking_status === 'rejected') return false;
      if (b.payment_status !== 'paid' && b.booking_status !== 'confirmed' && b.booking_status !== 'pending_verification') return false;

      const existingStart = new Date(b.pickup_date).getTime();
      const existingEnd = new Date(b.return_date).getTime();

      // Check date collision
      return pDate <= existingEnd && rDate >= existingStart;
    });

    return overlappingBookings.length < totalSlots;
  }
}

export const db = new DatabaseStore();
