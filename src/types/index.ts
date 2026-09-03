export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'staff';
  created_at: string;
  updated_at: string;
}

export interface Car {
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
  booking_amount: number; // ₹499
  description: string;
  features: string[];
  images: string[];
  location: string;
  status: 'available' | 'booked' | 'maintenance' | 'inactive';
  total_slots?: number;
  available_slots?: number;
  created_at: string;
  updated_at: string;
}

export interface CarBooking {
  id: string;
  booking_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  car_id: string;
  car?: Car;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  return_date: string;
  return_time: string;
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

export interface Tour {
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

export interface TourEnquiry {
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

export interface PilgrimagePackage {
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

export interface PilgrimageEnquiry {
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

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  service_interest?: string;
  message: string;
  status: 'unread' | 'in_review' | 'resolved';
  created_at: string;
}

export interface Review {
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

export interface CompanySettings {
  company_name: string;
  tagline: string;
  phone: string;
  alt_phone?: string;
  whatsapp: string;
  email: string;
  support_email: string;
  address: string;
  business_hours: string;
  booking_slot_fee: number;
  currency: string;
  currency_symbol: string;
  standard_security_deposit: number;
  upi_id?: string;
  payee_name?: string;
  upi_qr_image?: string;
  tax_rate_percent?: number;
  free_cancellation_hours?: number;
}

export interface AuthLoginResponse {
  message: string;
  token?: string;
  user?: User;
  requires_2fa?: boolean;
  two_factor_session_id?: string;
  masked_phone?: string;
  expires_in_seconds?: number;
}

export interface Verify2FAResponse {
  message: string;
  token: string;
  user: User;
}

export interface Resend2FAResponse {
  message: string;
  masked_phone: string;
  expires_in_seconds: number;
}

export interface ForgotPasswordResponse {
  message: string;
  reset_session_id: string;
  masked_email: string;
  masked_phone?: string;
  expires_in_seconds: number;
}

export interface ResetPasswordResponse {
  message: string;
  success: boolean;
}
