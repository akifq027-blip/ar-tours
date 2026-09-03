import { Router, Request, Response } from 'express';
import { db } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET all cars with filters
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, transmission, fuel, minSeats, maxPrice, search } = req.query;

    let results = db.cars.filter(c => c.status !== 'inactive');

    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (transmission && typeof transmission === 'string' && transmission !== 'All') {
      results = results.filter(c => c.transmission.toLowerCase() === transmission.toLowerCase());
    }

    if (fuel && typeof fuel === 'string' && fuel !== 'All') {
      results = results.filter(c => c.fuel_type.toLowerCase() === fuel.toLowerCase());
    }

    if (minSeats && !isNaN(Number(minSeats))) {
      results = results.filter(c => c.seating_capacity >= Number(minSeats));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      results = results.filter(c => c.price_per_day <= Number(maxPrice));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.brand.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q)
      );
    }

    res.json({ cars: results, total: results.length });
  } catch (error) {
    console.error('Fetch cars error:', error);
    res.status(500).json({ error: 'Failed to retrieve vehicle fleet.' });
  }
});

// GET single car by ID
router.get('/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const car = db.cars.find(c => c.id === id);

  if (!car) {
    res.status(404).json({ error: 'Vehicle not found.' });
    return;
  }

  res.json({ car });
});

// Check car availability for specific dates & calculate server verified pricing
router.post('/check-availability', (req: Request, res: Response): void => {
  try {
    const { carId, pickupDate, returnDate, pickupTime = '10:00', returnTime = '10:00' } = req.body;

    if (!carId || !pickupDate || !returnDate) {
      res.status(400).json({ error: 'Car ID, pickup date, and return date are required.' });
      return;
    }

    const car = db.cars.find(c => c.id === carId);
    if (!car) {
      res.status(404).json({ error: 'Vehicle not found.' });
      return;
    }

    const start = new Date(`${pickupDate}T${pickupTime}`);
    const end = new Date(`${returnDate}T${returnTime}`);
    const now = new Date();

    // Start must be in future / today
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Invalid dates or times provided.' });
      return;
    }

    if (end.getTime() <= start.getTime()) {
      res.status(400).json({ error: 'Return date and time must be after pickup date and time.' });
      return;
    }

    // Calculate rental days (minimum 1 day)
    const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    const rentalDays = Math.max(1, Math.ceil(diffHours / 24));

    const isAvailable = db.isCarAvailable(carId, pickupDate, returnDate);

    if (!isAvailable) {
      res.status(200).json({
        available: false,
        message: 'Sorry, this car is already booked for the selected dates. Please choose another date or vehicle.',
      });
      return;
    }

    const rentalTotal = rentalDays * car.price_per_day;
    const bookingSlotFee = car.booking_amount || 499;
    const securityDeposit = car.security_deposit || 3000;
    const remainingAmount = rentalTotal - bookingSlotFee;

    res.json({
      available: true,
      message: 'Vehicle is available for the selected dates!',
      car: {
        id: car.id,
        name: car.name,
        brand: car.brand,
        model: car.model,
        category: car.category,
        price_per_day: car.price_per_day,
        security_deposit: car.security_deposit,
        booking_amount: car.booking_amount,
        image: car.images[0] || '',
      },
      pricing: {
        rentalDays,
        ratePerDay: car.price_per_day,
        rentalTotal,
        bookingSlotFee, // ₹499
        securityDeposit, // Refundable
        remainingPayableAtPickup: Math.max(0, remainingAmount),
        currency: 'INR',
        currencySymbol: '₹',
      },
      dates: {
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
      },
    });
  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ error: 'Error checking vehicle availability.' });
  }
});

// GET current user's car bookings
router.get('/user/bookings', optionalAuth, (req: AuthRequest, res: Response) => {
  const email = req.query.email as string;
  const userId = req.user?.id;

  let bookings = db.carBookings;

  if (userId) {
    bookings = bookings.filter(b => b.user_id === userId || (email && b.customer_email.toLowerCase() === email.toLowerCase()));
  } else if (email) {
    bookings = bookings.filter(b => b.customer_email.toLowerCase() === email.toLowerCase());
  } else {
    bookings = [];
  }

  // Populate car object
  const populated = bookings.map(b => ({
    ...b,
    car: db.cars.find(c => c.id === b.car_id),
  }));

  res.json({ bookings: populated });
});

export default router;
