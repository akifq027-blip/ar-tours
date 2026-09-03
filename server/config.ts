import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: 3000,
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: process.env.JWT_SECRET || 'ar-tours-travel-super-secure-jwt-key-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  mysql: {
    host: process.env.DB_HOST || process.env.MYSQL_HOST || '',
    port: parseInt(process.env.DB_PORT || process.env.MYSQL_PORT || '3306', 10),
    user: process.env.DB_USER || process.env.MYSQL_USER || '',
    password: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQL_DATABASE || '',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'adminayaan@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'ayaan@mosin8121434741',
  },
  supabase: {
    url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ARTours2026',
    keySecret: process.env.RAZORPAY_KEY_SECRET || 'secret_ar_tours_razorpay_mock',
  },
  bookingSlotFee: 499, // INR
  standardSecurityDeposit: 3000, // INR
  company: {
    name: 'AR Tours & Travel',
    tagline: 'Your Journey. Our Responsibility.',
    phone: '+91 81214 34741',
    whatsapp: '+918121434741',
    email: 'contact@artours.com',
    supportEmail: 'support@artours.com',
    address: 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
    businessHours: 'Monday – Sunday: 8:00 AM – 10:00 PM (24/7 Roadside Assistance)',
  },
};
