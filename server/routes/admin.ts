import { Router, Response } from 'express';
import { db, DbCar, DbTour, DbPilgrimagePackage } from '../db.js';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes with authentication & admin role
router.use(authenticateToken, requireAdmin);

// 1. GET Dashboard Metrics
router.get('/dashboard', (req: AuthRequest, res: Response) => {
  try {
    const totalCars = db.cars.length;
    const activeCars = db.cars.filter(c => c.status === 'available').length;
    const totalTours = db.tours.length;
    const totalPilgrimagePackages = db.pilgrimagePackages.length;

    const carBookings = db.carBookings;
    const confirmedCarBookings = carBookings.filter(b => b.booking_status === 'confirmed' || b.payment_status === 'paid');
    const totalRevenue = carBookings
      .filter(b => b.payment_status === 'paid')
      .reduce((sum, b) => sum + (b.booking_fee || 99), 0);

    const tourEnquiries = db.tourEnquiries;
    const pilgrimageEnquiries = db.pilgrimageEnquiries;
    const contactMessages = db.contactMessages;

    const pendingEnquiries =
      tourEnquiries.filter(e => e.status === 'new').length +
      pilgrimageEnquiries.filter(e => e.status === 'new').length +
      contactMessages.filter(m => m.status === 'unread').length;

    const recentBookings = [...carBookings]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(b => ({
        ...b,
        car: db.cars.find(c => c.id === b.car_id),
      }));

    res.json({
      metrics: {
        totalRevenue,
        totalCarBookings: carBookings.length,
        confirmedCarBookings: confirmedCarBookings.length,
        totalTourEnquiries: tourEnquiries.length,
        totalPilgrimageEnquiries: pilgrimageEnquiries.length,
        pendingEnquiries,
        totalCars,
        activeCars,
        totalTours,
        totalPilgrimagePackages,
        totalReviews: db.reviews.length,
        pendingReviews: db.reviews.filter(r => !r.approved).length,
      },
      recentBookings,
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to compute dashboard metrics.' });
  }
});

// 2. CAR MANAGEMENT (CRUD + Slots + Availability + Images)
router.get('/cars', (req: AuthRequest, res: Response) => {
  res.json({ cars: db.cars });
});

router.post('/cars', (req: AuthRequest, res: Response): void => {
  try {
    const {
      name,
      brand,
      model,
      category,
      registration_number,
      seating_capacity,
      transmission,
      fuel_type,
      price_per_day,
      security_deposit = 3000,
      booking_amount = 99,
      description = '',
      features = [],
      images = [],
      location = 'Main Hub',
      status = 'available',
      total_slots = 5,
      available_slots = 5,
    } = req.body;

    if (!name || !brand || !category || !registration_number || !price_per_day) {
      res.status(400).json({ error: 'Missing required vehicle fields (Name, Brand, Category, Registration Plate, Price).' });
      return;
    }

    const initialTotalSlots = Math.max(1, Number(total_slots) || 1);
    const initialAvailSlots = typeof available_slots === 'number' 
      ? Math.max(0, Math.min(Number(available_slots), initialTotalSlots))
      : initialTotalSlots;

    const newCar: DbCar = {
      id: `car-${Date.now()}`,
      name,
      brand,
      model: model || name,
      category,
      registration_number,
      seating_capacity: Number(seating_capacity) || 5,
      transmission: transmission || 'Automatic',
      fuel_type: fuel_type || 'Petrol',
      price_per_day: Number(price_per_day),
      security_deposit: Number(security_deposit),
      booking_amount: Number(booking_amount),
      description,
      features: Array.isArray(features) ? features : (typeof features === 'string' ? (features as string).split(',').map(s => s.trim()).filter(Boolean) : []),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=80'],
      location,
      status: status || 'available',
      total_slots: initialTotalSlots,
      available_slots: initialAvailSlots,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.cars.unshift(newCar);
    res.status(201).json({ message: 'Vehicle added to fleet successfully.', car: newCar });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create car.' });
  }
});

router.put('/cars/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const car = db.cars.find(c => c.id === id);
  if (!car) {
    res.status(404).json({ error: 'Car not found.' });
    return;
  }

  const updates = { ...req.body };
  if (updates.total_slots !== undefined) {
    updates.total_slots = Math.max(1, Number(updates.total_slots));
  }
  if (updates.available_slots !== undefined) {
    const maxSlots = updates.total_slots || car.total_slots || 1;
    updates.available_slots = Math.max(0, Math.min(Number(updates.available_slots), maxSlots));
    if (updates.available_slots === 0 && car.status === 'available') {
      updates.status = 'booked';
    } else if (updates.available_slots > 0 && car.status === 'booked') {
      updates.status = 'available';
    }
  }

  Object.assign(car, updates, { updated_at: new Date().toISOString() });
  res.json({ message: 'Car details updated successfully.', car });
});

// Update car availability status directly
router.patch('/cars/:id/availability', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const car = db.cars.find(c => c.id === id);
  if (!car) {
    res.status(404).json({ error: 'Car not found.' });
    return;
  }

  const { status, available_slots, total_slots } = req.body;
  if (status && ['available', 'booked', 'maintenance', 'inactive'].includes(status)) {
    car.status = status;
  }
  if (total_slots !== undefined) {
    car.total_slots = Math.max(1, Number(total_slots));
  }
  if (available_slots !== undefined) {
    car.available_slots = Math.max(0, Math.min(Number(available_slots), car.total_slots || 1));
  }

  car.updated_at = new Date().toISOString();
  res.json({ message: `Availability status set to ${car.status} (${car.available_slots}/${car.total_slots} slots).`, car });
});

// Update car images directly
router.patch('/cars/:id/images', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const car = db.cars.find(c => c.id === id);
  if (!car) {
    res.status(404).json({ error: 'Car not found.' });
    return;
  }

  const { images } = req.body;
  if (!Array.isArray(images) || images.length === 0) {
    res.status(400).json({ error: 'Images array cannot be empty.' });
    return;
  }

  car.images = images.filter(img => typeof img === 'string' && img.trim().length > 0);
  car.updated_at = new Date().toISOString();
  res.json({ message: 'Vehicle gallery images updated successfully.', car });
});

// Update slots count (+/- delta or absolute)
router.patch('/cars/:id/slots', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const car = db.cars.find(c => c.id === id);
  if (!car) {
    res.status(404).json({ error: 'Car not found.' });
    return;
  }

  const { available_slots, total_slots, delta } = req.body;
  if (total_slots !== undefined) {
    car.total_slots = Math.max(1, Number(total_slots));
  }
  if (delta !== undefined) {
    const current = car.available_slots ?? (car.total_slots || 1);
    const updated = current + Number(delta);
    car.available_slots = Math.max(0, Math.min(updated, car.total_slots || 1));
  } else if (available_slots !== undefined) {
    car.available_slots = Math.max(0, Math.min(Number(available_slots), car.total_slots || 1));
  }

  // Auto-reflect booked vs available status
  if (car.available_slots === 0 && car.status === 'available') {
    car.status = 'booked';
  } else if (car.available_slots > 0 && car.status === 'booked') {
    car.status = 'available';
  }

  car.updated_at = new Date().toISOString();
  res.json({ message: `Updated slots for ${car.name}: ${car.available_slots}/${car.total_slots} available.`, car });
});

router.delete('/cars/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const index = db.cars.findIndex(c => c.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Car not found.' });
    return;
  }
  const deleted = db.cars.splice(index, 1)[0];
  res.json({ message: `Car "${deleted.name}" deleted from fleet successfully.` });
});

// 3. TOURS MANAGEMENT
router.get('/tours', (req: AuthRequest, res: Response) => {
  res.json({ tours: db.tours });
});

router.post('/tours', (req: AuthRequest, res: Response): void => {
  try {
    const { title, destination, category, short_description, description, duration, starting_price, itinerary = [], inclusions = [], exclusions = [], images = [] } = req.body;
    if (!title || !destination || !starting_price) {
      res.status(400).json({ error: 'Title, destination, and starting price are required.' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newTour: DbTour = {
      id: `tour-${Date.now()}`,
      title,
      slug,
      destination,
      category: category || 'Family',
      short_description: short_description || title,
      description: description || short_description || title,
      duration: duration || '3 Days / 2 Nights',
      starting_price: Number(starting_price),
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      important_info: [],
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'],
      available: true,
      featured: false,
      rating: 4.9,
      reviews_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.tours.unshift(newTour);
    res.status(201).json({ message: 'Tour package created successfully.', tour: newTour });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create tour package.' });
  }
});

router.put('/tours/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const tour = db.tours.find(t => t.id === id);
  if (!tour) {
    res.status(404).json({ error: 'Tour package not found.' });
    return;
  }
  Object.assign(tour, req.body, { updated_at: new Date().toISOString() });
  res.json({ message: 'Tour package updated successfully.', tour });
});

router.delete('/tours/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const index = db.tours.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Tour not found.' });
    return;
  }
  db.tours.splice(index, 1);
  res.json({ message: 'Tour package removed.' });
});

// 4. PILGRIMAGE PACKAGES MANAGEMENT
router.get('/pilgrimage-packages', (req: AuthRequest, res: Response) => {
  res.json({ packages: db.pilgrimagePackages });
});

router.post('/pilgrimage-packages', (req: AuthRequest, res: Response): void => {
  try {
    const { package_type, title, duration, starting_price, makkah_hotel, madinah_hotel, transport_details, food_details, ziyarat_details, inclusions = [], exclusions = [], images = [] } = req.body;
    if (!package_type || !title || !starting_price) {
      res.status(400).json({ error: 'Package type, title, and starting price are required.' });
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newPkg: DbPilgrimagePackage = {
      id: `pilg-${Date.now()}`,
      package_type,
      title,
      slug,
      duration: duration || '15 Days / 14 Nights',
      starting_price: Number(starting_price),
      hotel_details: 'Premium star hotel proximity',
      makkah_hotel: makkah_hotel || '5-Star Haram Front',
      makkah_distance: '50m to Haram',
      madinah_hotel: madinah_hotel || '5-Star Markaziyah',
      madinah_distance: '100m to Masjid Nabawi',
      transport_details: transport_details || 'Luxury AC Coaches',
      food_details: food_details || 'Full Board Buffets',
      ziyarat_details: ziyarat_details || 'Full Makkah & Madinah Ziyarat with Scholar',
      inclusions: Array.isArray(inclusions) ? inclusions : [],
      exclusions: Array.isArray(exclusions) ? exclusions : [],
      itinerary: [],
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80'],
      available: true,
      featured: false,
      rating: 5.0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.pilgrimagePackages.unshift(newPkg);
    res.status(201).json({ message: 'Pilgrimage package created.', package: newPkg });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create pilgrimage package.' });
  }
});

router.put('/pilgrimage-packages/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const pkg = db.pilgrimagePackages.find(p => p.id === id);
  if (!pkg) {
    res.status(404).json({ error: 'Package not found.' });
    return;
  }
  Object.assign(pkg, req.body, { updated_at: new Date().toISOString() });
  res.json({ message: 'Pilgrimage package updated.', package: pkg });
});

router.delete('/pilgrimage-packages/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const index = db.pilgrimagePackages.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Package not found.' });
    return;
  }
  db.pilgrimagePackages.splice(index, 1);
  res.json({ message: 'Package deleted.' });
});

// 5. BOOKINGS MANAGEMENT
router.get('/bookings', (req: AuthRequest, res: Response) => {
  const populated = db.carBookings.map(b => ({
    ...b,
    car: db.cars.find(c => c.id === b.car_id),
  }));
  res.json({ bookings: populated });
});

router.put('/bookings/:id/status', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { booking_status, payment_status } = req.body;

  const booking = db.carBookings.find(b => b.id === id || b.booking_number === id);
  if (!booking) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }

  if (booking_status) booking.booking_status = booking_status;
  if (payment_status) booking.payment_status = payment_status;
  booking.updated_at = new Date().toISOString();

  res.json({ message: 'Booking status updated.', booking });
});

// 6. ENQUIRIES & MESSAGES
router.get('/enquiries', (req: AuthRequest, res: Response) => {
  res.json({
    tourEnquiries: db.tourEnquiries,
    pilgrimageEnquiries: db.pilgrimageEnquiries,
    contactMessages: db.contactMessages,
  });
});

router.put('/enquiries/:type/:id/status', (req: AuthRequest, res: Response): void => {
  const { type, id } = req.params;
  const { status } = req.body;

  if (type === 'tour') {
    const item = db.tourEnquiries.find(e => e.id === id);
    if (item) item.status = status;
  } else if (type === 'pilgrimage') {
    const item = db.pilgrimageEnquiries.find(e => e.id === id);
    if (item) item.status = status;
  } else if (type === 'contact') {
    const item = db.contactMessages.find(m => m.id === id);
    if (item) item.status = status;
  }

  res.json({ message: 'Status updated.' });
});

// 7. REVIEWS MODERATION
router.get('/reviews', (req: AuthRequest, res: Response) => {
  res.json({ reviews: db.reviews });
});

router.put('/reviews/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const { approved } = req.body;
  const review = db.reviews.find(r => r.id === id);
  if (!review) {
    res.status(404).json({ error: 'Review not found.' });
    return;
  }
  if (approved !== undefined) review.approved = Boolean(approved);
  res.json({ message: 'Review moderation updated.', review });
});

router.delete('/reviews/:id', (req: AuthRequest, res: Response): void => {
  const { id } = req.params;
  const index = db.reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    db.reviews.splice(index, 1);
  }
  res.json({ message: 'Review deleted.' });
});

// 8. SETTINGS
router.get('/settings', (req: AuthRequest, res: Response) => {
  res.json({ settings: db.settings });
});

router.put('/settings', (req: AuthRequest, res: Response) => {
  db.settings = { ...db.settings, ...req.body };
  res.json({ message: 'Settings saved successfully.', settings: db.settings });
});

export default router;
