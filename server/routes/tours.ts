import { Router, Request, Response } from 'express';
import { db, DbTourEnquiry } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET all tours
router.get('/', (req: Request, res: Response) => {
  try {
    const { destination, category, maxPrice, search, featured } = req.query;

    let results = db.tours.filter(t => t.available);

    if (featured === 'true') {
      results = results.filter(t => t.featured);
    }

    if (destination && typeof destination === 'string' && destination !== 'All') {
      results = results.filter(t => t.destination.toLowerCase().includes(destination.toLowerCase()));
    }

    if (category && typeof category === 'string' && category !== 'All') {
      results = results.filter(t => t.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      results = results.filter(t => t.starting_price <= Number(maxPrice));
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.destination.toLowerCase().includes(q) ||
          t.short_description.toLowerCase().includes(q)
      );
    }

    res.json({ tours: results, total: results.length });
  } catch (error) {
    console.error('Fetch tours error:', error);
    res.status(500).json({ error: 'Failed to retrieve tour packages.' });
  }
});

// GET single tour by slug
router.get('/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const tour = db.tours.find(t => t.slug === slug || t.id === slug);

  if (!tour) {
    res.status(404).json({ error: 'Tour package not found.' });
    return;
  }

  res.json({ tour });
});

// POST Tour Booking Enquiry
router.post('/enquiries', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      tour_id,
      tour_title,
      full_name,
      email,
      phone,
      travel_date,
      number_of_adults = 1,
      number_of_children = 0,
      special_requests = '',
    } = req.body;

    if (!full_name || !email || !phone || !travel_date) {
      res.status(400).json({ error: 'Please provide full name, email, phone number, and intended travel date.' });
      return;
    }

    const tour = tour_id ? db.tours.find(t => t.id === tour_id) : null;
    const finalTourTitle = tour_title || tour?.title || 'Custom Tour Inquiry';

    const totalAdults = Math.max(1, Number(number_of_adults) || 1);
    const totalKids = Math.max(0, Number(number_of_children) || 0);
    const estimatedPrice = tour ? (totalAdults + totalKids * 0.7) * tour.starting_price : undefined;

    const newEnquiry: DbTourEnquiry = {
      id: `tenq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tour_id: tour?.id,
      tour_title: finalTourTitle,
      user_id: req.user?.id,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      travel_date,
      number_of_adults: totalAdults,
      number_of_children: totalKids,
      total_estimated_amount: estimatedPrice,
      special_requests: special_requests ? String(special_requests).trim() : '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    db.tourEnquiries.push(newEnquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your tour enquiry has been submitted. Our travel specialist will contact you shortly with a personalized itinerary.',
      enquiry: newEnquiry,
    });
  } catch (error) {
    console.error('Tour enquiry error:', error);
    res.status(500).json({ error: 'Failed to submit tour enquiry.' });
  }
});

// GET user tour enquiries
router.get('/user/my-enquiries', optionalAuth, (req: AuthRequest, res: Response) => {
  const email = req.query.email as string;
  const userId = req.user?.id;

  let list = db.tourEnquiries;
  if (userId) {
    list = list.filter(e => e.user_id === userId || (email && e.email.toLowerCase() === email.toLowerCase()));
  } else if (email) {
    list = list.filter(e => e.email.toLowerCase() === email.toLowerCase());
  } else {
    list = [];
  }

  res.json({ enquiries: list });
});

export default router;
