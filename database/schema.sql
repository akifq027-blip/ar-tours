-- ==============================================================================
-- AR TOURS & TRAVEL - SUPABASE POSTGRESQL SCHEMA & ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. CARS TABLE
CREATE TABLE IF NOT EXISTS public.cars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Sedan', 'SUV', 'Luxury', 'Hatchback', 'MUV', 'Van')),
    registration_number TEXT NOT NULL UNIQUE,
    seating_capacity INTEGER NOT NULL CHECK (seating_capacity > 0),
    transmission TEXT NOT NULL CHECK (transmission IN ('Manual', 'Automatic')),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid')),
    price_per_day NUMERIC(10, 2) NOT NULL CHECK (price_per_day >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 3000.00,
    booking_amount NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    location TEXT NOT NULL DEFAULT 'Main Hub / Airport',
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. CAR BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.car_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE RESTRICT,
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    return_date DATE NOT NULL,
    return_time TIME NOT NULL,
    rental_days INTEGER NOT NULL CHECK (rental_days > 0),
    rental_rate_per_day NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_fee NUMERIC(10, 2) NOT NULL DEFAULT 99.00,
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 3000.00,
    remaining_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    booking_status TEXT NOT NULL DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    driver_required BOOLEAN DEFAULT false,
    special_instructions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TOURS TABLE
CREATE TABLE IF NOT EXISTS public.tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    destination TEXT NOT NULL,
    category TEXT DEFAULT 'Family',
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    duration TEXT NOT NULL,
    starting_price NUMERIC(10, 2) NOT NULL CHECK (starting_price >= 0),
    itinerary JSONB DEFAULT '[]'::jsonb,
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    important_info JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    available BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TOUR ENQUIRIES & BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.tour_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID REFERENCES public.tours(id) ON DELETE SET NULL,
    tour_title TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    travel_date DATE NOT NULL,
    number_of_adults INTEGER NOT NULL DEFAULT 1 CHECK (number_of_adults > 0),
    number_of_children INTEGER NOT NULL DEFAULT 0,
    total_estimated_amount NUMERIC(10, 2),
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PILGRIMAGE PACKAGES TABLE (HAJJ & UMRAH)
CREATE TABLE IF NOT EXISTS public.pilgrimage_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_type TEXT NOT NULL CHECK (package_type IN ('Hajj', 'Umrah', 'Ramadan Umrah')),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    duration TEXT NOT NULL,
    starting_price NUMERIC(10, 2) NOT NULL CHECK (starting_price >= 0),
    hotel_details TEXT,
    makkah_hotel TEXT NOT NULL,
    makkah_distance TEXT,
    madinah_hotel TEXT NOT NULL,
    madinah_distance TEXT,
    transport_details TEXT NOT NULL,
    food_details TEXT NOT NULL,
    ziyarat_details TEXT NOT NULL,
    inclusions JSONB DEFAULT '[]'::jsonb,
    exclusions JSONB DEFAULT '[]'::jsonb,
    itinerary JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    available BOOLEAN NOT NULL DEFAULT true,
    featured BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PILGRIMAGE ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.pilgrimage_enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    package_id UUID REFERENCES public.pilgrimage_packages(id) ON DELETE SET NULL,
    package_title TEXT,
    pilgrimage_type TEXT NOT NULL CHECK (pilgrimage_type IN ('Hajj', 'Umrah', 'Custom Pilgrimage')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    number_of_people INTEGER NOT NULL CHECK (number_of_people > 0),
    preferred_month TEXT NOT NULL,
    departure_city TEXT NOT NULL,
    room_sharing TEXT DEFAULT 'Quad Sharing',
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'booked', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. GENERAL ENQUIRIES & CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    service_interest TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'in_review', 'resolved')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    booking_id UUID NOT NULL,
    booking_type TEXT NOT NULL DEFAULT 'car_rental' CHECK (booking_type IN ('car_rental', 'tour', 'pilgrimage')),
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT NOT NULL,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'captured' CHECK (status IN ('created', 'captured', 'failed', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_location TEXT DEFAULT 'India',
    service_type TEXT NOT NULL CHECK (service_type IN ('Car Rental', 'Tour Package', 'Umrah Package', 'Hajj Package', 'General Travel')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT NOT NULL,
    approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. COMPANY SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY SPEED & OVERLAP CHECKS
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_car_bookings_car_dates ON public.car_bookings(car_id, pickup_date, return_date, booking_status);
CREATE INDEX IF NOT EXISTS idx_car_bookings_user ON public.car_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_tour_enquiries_user ON public.tour_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_pilgrimage_enquiries_user ON public.pilgrimage_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_cars_status ON public.cars(status);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON public.tours(featured, available);
CREATE INDEX IF NOT EXISTS idx_pilgrimage_featured ON public.pilgrimage_packages(featured, available);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrimage_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilgrimage_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 2. CARS (Public can view available; Staff/Admin can manage)
CREATE POLICY "Public can view active cars" ON public.cars FOR SELECT USING (status != 'inactive');
CREATE POLICY "Admins manage cars" ON public.cars FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 3. CAR BOOKINGS (Customers view/insert their own, admins view all)
CREATE POLICY "Users view own car bookings" ON public.car_bookings FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
CREATE POLICY "Users insert car bookings" ON public.car_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage car bookings" ON public.car_bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 4. TOURS & PILGRIMAGE PACKAGES (Public view published, Admins manage)
CREATE POLICY "Public view tours" ON public.tours FOR SELECT USING (available = true);
CREATE POLICY "Admins manage tours" ON public.tours FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Public view pilgrimage" ON public.pilgrimage_packages FOR SELECT USING (available = true);
CREATE POLICY "Admins manage pilgrimage" ON public.pilgrimage_packages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 5. ENQUIRIES (Public/Auth can insert, user can view own, admins view all)
CREATE POLICY "Anyone can insert tour enquiries" ON public.tour_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own tour enquiries" ON public.tour_enquiries FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Anyone can insert pilgrimage enquiries" ON public.pilgrimage_enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Users view own pilgrimage enquiries" ON public.pilgrimage_enquiries FOR SELECT USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

CREATE POLICY "Anyone can insert contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view contact messages" ON public.contact_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 6. REVIEWS (Public view approved, Users insert, Admins manage)
CREATE POLICY "Public view approved reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Users insert reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- 7. SETTINGS (Public read, Admin update)
CREATE POLICY "Public read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);
