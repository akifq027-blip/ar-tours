import { Router, Request, Response } from 'express';
import { db, DbPilgrimageEnquiry } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET all pilgrimage packages
router.get('/', (req: Request, res: Response) => {
  try {
    const { package_type, featured } = req.query;

    let results = db.pilgrimagePackages.filter(p => p.available);

    if (package_type && typeof package_type === 'string' && package_type !== 'All') {
      results = results.filter(p => p.package_type.toLowerCase() === package_type.toLowerCase());
    }

    if (featured === 'true') {
      results = results.filter(p => p.featured);
    }

    res.json({ packages: results, total: results.length });
  } catch (error) {
    console.error('Fetch pilgrimage error:', error);
    res.status(500).json({ error: 'Failed to retrieve pilgrimage packages.' });
  }
});

// GET single package by slug
router.get('/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const pkg = db.pilgrimagePackages.find(p => p.slug === slug || p.id === slug);

  if (!pkg) {
    res.status(404).json({ error: 'Pilgrimage package not found.' });
    return;
  }

  res.json({ package: pkg });
});

// POST Hajj & Umrah Consultation Enquiry
router.post('/enquiries', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const {
      package_id,
      package_title,
      pilgrimage_type,
      full_name,
      email,
      phone,
      number_of_people = 1,
      preferred_month,
      departure_city,
      room_sharing = 'Quad Sharing',
      message = '',
    } = req.body;

    if (!full_name || !email || !phone || !pilgrimage_type || !preferred_month || !departure_city) {
      res.status(400).json({
        error: 'Please fill all required fields: Full Name, Phone, Email, Pilgrimage Type, Preferred Month, and Departure City.',
      });
      return;
    }

    const pkg = package_id ? db.pilgrimagePackages.find(p => p.id === package_id) : null;
    const finalPackageTitle = package_title || pkg?.title || `${pilgrimage_type} Consultation`;

    const newEnquiry: DbPilgrimageEnquiry = {
      id: `penq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: req.user?.id,
      package_id: pkg?.id,
      package_title: finalPackageTitle,
      pilgrimage_type: pilgrimage_type as any,
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      number_of_people: Math.max(1, Number(number_of_people) || 1),
      preferred_month: preferred_month.trim(),
      departure_city: departure_city.trim(),
      room_sharing: room_sharing || 'Quad Sharing',
      message: message ? String(message).trim() : '',
      status: 'new',
      created_at: new Date().toISOString(),
    };

    db.pilgrimageEnquiries.push(newEnquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you. Our dedicated Hajj & Umrah travel consultant will contact you shortly to guide you through package details and visa requirements.',
      enquiry: newEnquiry,
    });
  } catch (error) {
    console.error('Pilgrimage enquiry error:', error);
    res.status(500).json({ error: 'Failed to submit pilgrimage enquiry.' });
  }
});

// GET user pilgrimage enquiries
router.get('/user/my-enquiries', optionalAuth, (req: AuthRequest, res: Response) => {
  const email = req.query.email as string;
  const userId = req.user?.id;

  let list = db.pilgrimageEnquiries;
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
