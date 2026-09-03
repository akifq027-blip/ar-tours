import { Router, Request, Response } from 'express';
import { db, DbCarBooking, DbPayment } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET UPI configuration for client
router.get('/upi-config', (req: Request, res: Response): void => {
  const info = db.settings.company_info || {};
  res.json({
    upi_id: info.upi_id || '8121434741@upi',
    payee_name: info.payee_name || 'AR Tours & Travel',
    booking_slot_fee: info.booking_slot_fee || 499,
    upi_qr_image: info.upi_qr_image || '',
    phone: info.phone || '+91 81214 34741',
    whatsapp: info.whatsapp || '+918121434741',
  });
});

// SUBMIT DIRECT UPI CAR PRE-BOOKING WITH MANUAL UTR VERIFICATION
router.post('/submit-upi-booking', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
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
      utrNumber,
      paymentScreenshot = '',
    } = req.body;

    if (!carId || !customerName || !customerEmail || !customerPhone || !pickupLocation || !dropLocation || !pickupDate || !returnDate) {
      res.status(400).json({ error: 'Please provide all required booking details.' });
      return;
    }

    if (!utrNumber || typeof utrNumber !== 'string' || utrNumber.trim().length < 6) {
      res.status(400).json({ error: 'Please provide a valid 12-digit UPI Reference / UTR Number from your payment app.' });
      return;
    }

    const cleanUtr = utrNumber.trim().toUpperCase();

    // Check if this UTR has already been submitted on another booking
    const duplicateUtr = db.carBookings.find(b => b.utr_number === cleanUtr && b.booking_status !== 'rejected');
    if (duplicateUtr) {
      res.status(400).json({
        error: `UTR Number ${cleanUtr} has already been registered for booking #${duplicateUtr.booking_number}. Please verify your transaction receipt.`,
      });
      return;
    }

    const car = db.cars.find(c => c.id === carId);
    if (!car) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    // Double check availability on the server (holding pending verification bookings)
    const isAvailable = db.isCarAvailable(carId, pickupDate, returnDate);
    if (!isAvailable) {
      res.status(400).json({
        error: 'Sorry, this car is already booked or slot held for the selected dates. Please choose another date or vehicle.',
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

    // Slot booking fee from settings (or car fallback, default ₹499)
    const settingsSlotFee = Number(db.settings?.company_info?.booking_slot_fee);
    const bookingSlotFee = !isNaN(settingsSlotFee) && settingsSlotFee >= 1 ? settingsSlotFee : (car.booking_amount || 499);
    const securityDeposit = car.security_deposit || 3000;
    const remainingAmount = Math.max(0, totalAmount - bookingSlotFee);

    // Generate unique internal Booking Reference ID
    const bookingNumber = `ART-CAR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create booking record with status: pending_verification & awaiting_approval
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
      payment_method: 'UPI',
      utr_number: cleanUtr,
      payment_screenshot: paymentScreenshot ? String(paymentScreenshot) : undefined,
      payment_status: 'awaiting_approval',
      booking_status: 'pending_verification',
      driver_required: Boolean(driverRequired),
      special_instructions: specialInstructions ? String(specialInstructions).trim() : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.carBookings.unshift(newBooking);

    // Record initial pending payment log
    const paymentRecord: DbPayment = {
      id: `pay-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: newBooking.user_id || undefined,
      booking_id: newBooking.id,
      booking_type: 'car_rental',
      razorpay_order_id: cleanUtr,
      razorpay_payment_id: cleanUtr,
      razorpay_signature: 'MANUAL_UTR_VERIFICATION',
      amount: bookingSlotFee,
      currency: 'INR',
      status: 'created',
      created_at: new Date().toISOString(),
    };
    db.payments.push(paymentRecord);

    res.status(201).json({
      success: true,
      message: 'Booking Submitted! Verification in Progress. Your slot is held pending admin UTR confirmation.',
      booking: {
        ...newBooking,
        car,
      },
      payment: paymentRecord,
    });
  } catch (error) {
    console.error('UPI booking creation error:', error);
    res.status(500).json({ error: 'Failed to submit booking reservation with UPI verification.' });
  }
});

// GET booking details by ID or booking number
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
