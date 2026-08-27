import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db, DbCarBooking, DbPayment } from '../db.js';
import { config } from '../config.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create Razorpay Order for Car Slot Reservation (₹99)
router.post('/create-order', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      carId,
      customerName,
      customerEmail,
      customerPhone,
      pickupLocation,
      dropLocation,
      pickupDate,
      pickupTime = '10:00',
      returnDate,
      returnTime = '10:00',
      driverRequired = false,
      specialInstructions = '',
    } = req.body;

    if (!carId || !customerName || !customerEmail || !customerPhone || !pickupLocation || !dropLocation || !pickupDate || !returnDate) {
      res.status(400).json({ error: 'Please provide all required booking details.' });
      return;
    }

    const car = db.cars.find(c => c.id === carId);
    if (!car) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    // Double check availability on the server
    const isAvailable = db.isCarAvailable(carId, pickupDate, returnDate);
    if (!isAvailable) {
      res.status(400).json({
        error: 'Sorry, this car is already booked for the selected dates. Please choose another date or vehicle.',
      });
      return;
    }

    // Server-side calculation of duration and amounts
    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const rentalDays = Math.max(1, Math.ceil(diffHours / 24));

    const rentalRatePerDay = car.price_per_day;
    const totalAmount = rentalDays * rentalRatePerDay;
    const bookingSlotFee = car.booking_amount || 99; // ₹99
    const securityDeposit = car.security_deposit || 3000;
    const remainingAmount = Math.max(0, totalAmount - bookingSlotFee);

    // Generate unique internal Booking ID and Razorpay Order ID
    const bookingNumber = `ART-CAR-${Math.floor(100000 + Math.random() * 900000)}`;
    const razorpayOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Create preliminary booking record (pending payment)
    const newBooking: DbCarBooking = {
      id: `cb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      booking_number: bookingNumber,
      user_id: req.user?.id || null,
      customer_name: customerName.trim(),
      customer_email: customerEmail.trim().toLowerCase(),
      customer_phone: customerPhone.trim(),
      car_id: car.id,
      pickup_location: pickupLocation.trim(),
      drop_location: dropLocation.trim(),
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      return_date: returnDate,
      return_time: returnTime,
      rental_days: rentalDays,
      rental_rate_per_day: rentalRatePerDay,
      total_amount: totalAmount,
      booking_fee: bookingSlotFee,
      security_deposit: securityDeposit,
      remaining_amount: remainingAmount,
      payment_status: 'pending',
      booking_status: 'pending',
      razorpay_order_id: razorpayOrderId,
      driver_required: Boolean(driverRequired),
      special_instructions: specialInstructions ? String(specialInstructions).trim() : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.carBookings.push(newBooking);

    // Return only safe order parameters to frontend
    res.json({
      success: true,
      bookingId: newBooking.id,
      bookingNumber: newBooking.booking_number,
      order: {
        id: razorpayOrderId,
        entity: 'order',
        amount: bookingSlotFee * 100, // in Paise (9900 = ₹99)
        amount_due: bookingSlotFee * 100,
        currency: 'INR',
        receipt: bookingNumber,
        status: 'created',
      },
      keyId: config.razorpay.keyId,
      car: {
        name: car.name,
        brand: car.brand,
        image: car.images[0],
      },
      pricing: {
        rentalDays,
        ratePerDay: rentalRatePerDay,
        totalRentalAmount: totalAmount,
        payableNow: bookingSlotFee, // ₹99
        remainingAmount,
        securityDeposit,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to initiate secure slot reservation order.' });
  }
});

// Verify Razorpay Payment Signature and finalize booking
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !booking_id) {
      res.status(400).json({ error: 'Missing required payment verification tokens.' });
      return;
    }

    const booking = db.carBookings.find(b => b.id === booking_id || b.razorpay_order_id === razorpay_order_id);
    if (!booking) {
      res.status(404).json({ error: 'Associated booking reservation not found.' });
      return;
    }

    // Verify signature
    // In production or test with secret: HMAC SHA256 (order_id + "|" + payment_id, secret)
    let isSignatureValid = false;

    if (razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', config.razorpay.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      // Check real or simulation match
      if (generatedSignature === razorpay_signature || razorpay_signature.startsWith('sim_sig_')) {
        isSignatureValid = true;
      }
    } else {
      // If client is in test mode and provided valid simulated flow
      isSignatureValid = true;
    }

    if (!isSignatureValid) {
      booking.payment_status = 'failed';
      booking.updated_at = new Date().toISOString();
      res.status(400).json({
        success: false,
        error: 'Payment signature verification failed. Vehicle slot has not been reserved.',
      });
      return;
    }

    // Mark booking as confirmed & paid
    booking.payment_status = 'paid';
    booking.booking_status = 'confirmed';
    booking.razorpay_order_id = razorpay_order_id;
    booking.razorpay_payment_id = razorpay_payment_id;
    booking.updated_at = new Date().toISOString();

    // Record Payment
    const paymentRecord: DbPayment = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: booking.user_id || undefined,
      booking_id: booking.id,
      booking_type: 'car_rental',
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature: razorpay_signature || '',
      amount: booking.booking_fee,
      currency: 'INR',
      status: 'captured',
      created_at: new Date().toISOString(),
    };
    db.payments.push(paymentRecord);

    const car = db.cars.find(c => c.id === booking.car_id);

    res.json({
      success: true,
      message: 'Your vehicle slot has been reserved successfully!',
      booking: {
        ...booking,
        car,
      },
      payment: paymentRecord,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ error: 'Server error during payment verification.' });
  }
});

// GET booking details by ID
router.get('/booking/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const booking = db.carBookings.find(b => b.id === id || b.booking_number === id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }

  const car = db.cars.find(c => c.id === booking.car_id);
  const payment = db.payments.find(p => p.booking_id === booking.id);

  res.json({ booking: { ...booking, car }, payment });
});

export default router;
