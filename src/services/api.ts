import {
  User,
  Car,
  CarBooking,
  Tour,
  TourEnquiry,
  PilgrimagePackage,
  PilgrimageEnquiry,
  ContactMessage,
  Review,
  CompanySettings,
  AuthLoginResponse,
  Verify2FAResponse,
  Resend2FAResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
} from '../types';

const API_BASE = '/api';

// Helper to get auth token from localStorage
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('ar_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Generic fetch wrapper with error handling and retry mechanism for transient network dropouts
async function request<T>(endpoint: string, options: RequestInit = {}, retries = 2): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const method = (options.method || 'GET').toUpperCase();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
      }

      return data as T;
    } catch (err: any) {
      const isLastAttempt = attempt === retries;
      const isGetRequest = method === 'GET';
      const isNetworkError = err instanceof TypeError || (err.message && err.message.includes('Failed to fetch'));

      if (!isLastAttempt && (isGetRequest || isNetworkError)) {
        // Wait 400ms before retrying on network failure (e.g. dev server rebooting)
        await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }

  throw new Error('Request failed after retries.');
}

export const api = {
  // Auth
  register: (body: { full_name: string; email: string; phone?: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<AuthLoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verify2FA: (body: { two_factor_session_id: string; otp: string }) =>
    request<Verify2FAResponse>('/auth/verify-2fa', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resend2FA: (body: { two_factor_session_id: string }) =>
    request<Resend2FAResponse>('/auth/resend-2fa', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  forgotPassword: (body: { email: string }) =>
    request<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resendResetOtp: (body: { reset_session_id: string }) =>
    request<ForgotPasswordResponse>('/auth/resend-reset-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyResetOtp: (body: { reset_session_id: string; otp: string }) =>
    request<{ message: string; valid: boolean }>('/auth/verify-reset-otp', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  resetPassword: (body: { reset_session_id: string; otp: string; new_password: string }) =>
    request<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),

  updateProfile: (body: { full_name?: string; phone?: string }) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  // Cars
  getCars: (params?: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    return request<{ cars: Car[]; total: number }>(`/cars?${query.toString()}`);
  },

  getCarById: (id: string) => request<{ car: Car }>(`/cars/${id}`),

  checkCarAvailability: (body: {
    carId: string;
    pickupDate: string;
    returnDate: string;
    pickupTime?: string;
    returnTime?: string;
  }) =>
    request<{
      available: boolean;
      message: string;
      car?: Partial<Car>;
      pricing?: {
        rentalDays: number;
        ratePerDay: number;
        rentalTotal: number;
        bookingSlotFee: number;
        securityDeposit: number;
        remainingPayableAtPickup: number;
        currency: string;
        currencySymbol: string;
      };
      dates?: {
        pickupDate: string;
        pickupTime: string;
        returnDate: string;
        returnTime: string;
      };
    }>('/cars/check-availability', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getUserCarBookings: (email?: string) =>
    request<{ bookings: CarBooking[] }>(`/cars/user/bookings${email ? `?email=${encodeURIComponent(email)}` : ''}`),

  // Payments / Direct UPI with UTR Verification
  getUpiConfig: () =>
    request<{
      upi_id: string;
      payee_name: string;
      booking_slot_fee: number;
      upi_qr_image?: string;
      phone: string;
      whatsapp: string;
    }>('/payments/upi-config'),

  submitUpiBooking: (body: {
    carId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime?: string;
    returnDate: string;
    returnTime?: string;
    driverRequired?: boolean;
    specialInstructions?: string;
    utrNumber: string;
    paymentScreenshot?: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      booking: CarBooking;
      payment?: any;
    }>('/payments/submit-upi-booking', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  createCarOrder: (body: {
    carId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    pickupLocation: string;
    dropLocation: string;
    pickupDate: string;
    pickupTime?: string;
    returnDate: string;
    returnTime?: string;
    driverRequired?: boolean;
    specialInstructions?: string;
  }) =>
    request<{
      success: boolean;
      bookingId: string;
      bookingNumber: string;
      order: {
        id: string;
        amount: number;
        currency: string;
        receipt: string;
        status: string;
      };
      keyId: string;
      car: { name: string; brand: string; image: string };
      pricing: {
        rentalDays: number;
        ratePerDay: number;
        totalRentalAmount: number;
        payableNow: number;
        remainingAmount: number;
        securityDeposit: number;
      };
    }>('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  verifyPayment: (body: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature?: string;
    booking_id: string;
  }) =>
    request<{
      success: boolean;
      message: string;
      booking: CarBooking;
      payment: any;
    }>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getBookingById: (id: string) => request<{ booking: CarBooking; payment?: any }>(`/payments/booking/${id}`),

  // Tours
  getTours: (params?: Record<string, string | number | boolean | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    return request<{ tours: Tour[]; total: number }>(`/tours?${query.toString()}`);
  },

  getTourBySlug: (slug: string) => request<{ tour: Tour }>(`/tours/${slug}`),

  submitTourEnquiry: (body: {
    tour_id?: string;
    tour_title?: string;
    full_name: string;
    email: string;
    phone: string;
    travel_date: string;
    number_of_adults: number;
    number_of_children?: number;
    special_requests?: string;
  }) =>
    request<{ success: boolean; message: string; enquiry: TourEnquiry }>('/tours/enquiries', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getUserTourEnquiries: (email?: string) =>
    request<{ enquiries: TourEnquiry[] }>(`/tours/user/my-enquiries${email ? `?email=${encodeURIComponent(email)}` : ''}`),

  // Pilgrimage (Hajj & Umrah)
  getPilgrimagePackages: (params?: Record<string, string | boolean | undefined>) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    return request<{ packages: PilgrimagePackage[]; total: number }>(`/pilgrimage-packages?${query.toString()}`);
  },

  getPilgrimageBySlug: (slug: string) => request<{ package: PilgrimagePackage }>(`/pilgrimage-packages/${slug}`),

  submitPilgrimageEnquiry: (body: {
    package_id?: string;
    package_title?: string;
    pilgrimage_type: string;
    full_name: string;
    email: string;
    phone: string;
    number_of_people: number;
    preferred_month: string;
    departure_city: string;
    room_sharing?: string;
    message?: string;
  }) =>
    request<{ success: boolean; message: string; enquiry: PilgrimageEnquiry }>('/pilgrimage-packages/enquiries', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getUserPilgrimageEnquiries: (email?: string) =>
    request<{ enquiries: PilgrimageEnquiry[] }>(
      `/pilgrimage-packages/user/my-enquiries${email ? `?email=${encodeURIComponent(email)}` : ''}`
    ),

  // Contact
  submitContactMessage: (body: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    service_interest?: string;
    message: string;
  }) =>
    request<{ success: boolean; message: string; messageId: string }>('/contact', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Reviews
  getReviews: (service_type?: string) =>
    request<{ reviews: Review[]; total: number }>(`/reviews${service_type ? `?service_type=${encodeURIComponent(service_type)}` : ''}`),

  submitReview: (body: {
    user_name: string;
    user_location?: string;
    service_type: string;
    rating: number;
    title?: string;
    comment: string;
  }) =>
    request<{ success: boolean; message: string; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  // Settings
  getSettings: () => request<{ settings: CompanySettings }>('/settings'),

  // Admin APIs
  admin: {
    getDashboard: () => request<{ metrics: any; recentBookings: any[] }>('/admin/dashboard'),

    // Cars
    getCars: () => request<{ cars: Car[] }>('/admin/cars'),
    createCar: (car: Partial<Car>) =>
      request<{ message: string; car: Car }>('/admin/cars', {
        method: 'POST',
        body: JSON.stringify(car),
      }),
    updateCar: (id: string, car: Partial<Car>) =>
      request<{ message: string; car: Car }>(`/admin/cars/${id}`, {
        method: 'PUT',
        body: JSON.stringify(car),
      }),
    updateCarAvailability: (id: string, payload: { status?: string; available_slots?: number; total_slots?: number }) =>
      request<{ message: string; car: Car }>(`/admin/cars/${id}/availability`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    updateCarImages: (id: string, images: string[]) =>
      request<{ message: string; car: Car }>(`/admin/cars/${id}/images`, {
        method: 'PATCH',
        body: JSON.stringify({ images }),
      }),
    updateCarSlots: (id: string, payload: { delta?: number; available_slots?: number; total_slots?: number }) =>
      request<{ message: string; car: Car }>(`/admin/cars/${id}/slots`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      }),
    deleteCar: (id: string) => request<{ message: string }>(`/admin/cars/${id}`, { method: 'DELETE' }),

    // Tours
    getTours: () => request<{ tours: Tour[] }>('/admin/tours'),
    createTour: (tour: Partial<Tour>) =>
      request<{ message: string; tour: Tour }>('/admin/tours', {
        method: 'POST',
        body: JSON.stringify(tour),
      }),
    updateTour: (id: string, tour: Partial<Tour>) =>
      request<{ message: string; tour: Tour }>(`/admin/tours/${id}`, {
        method: 'PUT',
        body: JSON.stringify(tour),
      }),
    deleteTour: (id: string) => request<{ message: string }>(`/admin/tours/${id}`, { method: 'DELETE' }),

    // Pilgrimage
    getPilgrimage: () => request<{ packages: PilgrimagePackage[] }>('/admin/pilgrimage-packages'),
    createPilgrimage: (pkg: Partial<PilgrimagePackage>) =>
      request<{ message: string; package: PilgrimagePackage }>('/admin/pilgrimage-packages', {
        method: 'POST',
        body: JSON.stringify(pkg),
      }),
    createPilgrimagePackage: (pkg: Partial<PilgrimagePackage>) =>
      request<{ message: string; package: PilgrimagePackage }>('/admin/pilgrimage-packages', {
        method: 'POST',
        body: JSON.stringify(pkg),
      }),
    updatePilgrimage: (id: string, pkg: Partial<PilgrimagePackage>) =>
      request<{ message: string; package: PilgrimagePackage }>(`/admin/pilgrimage-packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pkg),
      }),
    updatePilgrimagePackage: (id: string, pkg: Partial<PilgrimagePackage>) =>
      request<{ message: string; package: PilgrimagePackage }>(`/admin/pilgrimage-packages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pkg),
      }),
    deletePilgrimage: (id: string) =>
      request<{ message: string }>(`/admin/pilgrimage-packages/${id}`, { method: 'DELETE' }),
    deletePilgrimagePackage: (id: string) =>
      request<{ message: string }>(`/admin/pilgrimage-packages/${id}`, { method: 'DELETE' }),

    // Bookings
    getBookings: () => request<{ bookings: CarBooking[] }>('/admin/bookings'),
    verifyUtr: (id: string, body: { action: 'approve' | 'reject'; reason?: string }) =>
      request<{ message: string; booking: CarBooking; success: boolean }>(`/admin/bookings/${id}/verify-utr`, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    updateBookingStatus: (
      id: string,
      statusesOrStatus: string | { booking_status?: string; payment_status?: string },
      payment_status?: string
    ) => {
      const payload =
        typeof statusesOrStatus === 'string'
          ? { booking_status: statusesOrStatus, payment_status }
          : statusesOrStatus;
      return request<{ message: string; booking: CarBooking }>(`/admin/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
    },
    deleteBooking: (id: string) => request<{ message: string }>(`/admin/bookings/${id}`, { method: 'DELETE' }),

    // Enquiries
    getEnquiries: () =>
      request<{
        tourEnquiries: TourEnquiry[];
        pilgrimageEnquiries: PilgrimageEnquiry[];
        contactMessages: ContactMessage[];
      }>('/admin/enquiries'),
    updateEnquiryStatus: (type: 'tour' | 'pilgrimage' | 'pilgrim' | 'contact', id: string, status: string) => {
      const normalizedType = type === 'pilgrim' ? 'pilgrimage' : type;
      return request<{ message: string }>(`/admin/enquiries/${normalizedType}/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    },
    deleteEnquiry: (type: 'tour' | 'pilgrimage' | 'pilgrim' | 'contact', id: string) => {
      const normalizedType = type === 'pilgrim' ? 'pilgrimage' : type;
      return request<{ message: string }>(`/admin/enquiries/${normalizedType}/${id}`, { method: 'DELETE' });
    },

    // Reviews
    getReviews: () => request<{ reviews: Review[] }>('/admin/reviews'),
    createReview: (review: Partial<Review>) =>
      request<{ message: string; review: Review }>('/admin/reviews', {
        method: 'POST',
        body: JSON.stringify(review),
      }),
    updateReview: (id: string, approved: boolean) =>
      request<{ message: string; review: Review }>(`/admin/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ approved }),
      }),
    deleteReview: (id: string) => request<{ message: string }>(`/admin/reviews/${id}`, { method: 'DELETE' }),

    // Settings
    getSettings: () => request<{ settings: any }>('/admin/settings'),
    updateSettings: (settings: any) =>
      request<{ message: string; settings: any }>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      }),
  },
};
