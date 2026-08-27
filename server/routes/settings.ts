import { Router, Request, Response } from 'express';
import { db } from '../db.js';

const router = Router();

// GET public business configuration
router.get('/', (req: Request, res: Response) => {
  try {
    const info = db.settings.company_info || {
      company_name: 'AR Tours & Travel',
      tagline: 'Your Journey. Our Responsibility.',
      phone: '+91 81214 34741',
      whatsapp: '+918121434741',
      email: 'contact@artours.com',
      support_email: 'support@artours.com',
      address: 'AR House, Suite 402, Airline Road, Near International Airport, Mumbai, MH 400099',
      business_hours: 'Monday – Sunday: 8:00 AM – 10:00 PM (24/7 Roadside Assistance)',
      booking_slot_fee: 99,
      currency: 'INR',
      currency_symbol: '₹',
      standard_security_deposit: 3000,
    };
    res.json({ settings: info });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

export default router;
