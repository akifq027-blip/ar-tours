import { Router, Request, Response } from 'express';
import { db, DbReview } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET approved reviews
router.get('/', (req: Request, res: Response) => {
  try {
    const { service_type } = req.query;
    let list = db.reviews.filter(r => r.approved);

    if (service_type && typeof service_type === 'string' && service_type !== 'All') {
      list = list.filter(r => r.service_type.toLowerCase() === service_type.toLowerCase());
    }

    res.json({ reviews: list, total: list.length });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    res.status(500).json({ error: 'Failed to retrieve reviews.' });
  }
});

// POST new customer review
router.post('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { user_name, user_location, service_type, rating, title, comment } = req.body;

    if (!user_name || !service_type || !rating || !comment) {
      res.status(400).json({ error: 'Please provide your name, service type, rating, and feedback.' });
      return;
    }

    const numericRating = Math.max(1, Math.min(5, Number(rating) || 5));

    const newReview: DbReview = {
      id: `rev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: req.user?.id,
      user_name: user_name.trim(),
      user_location: (user_location || 'Customer').trim(),
      service_type: service_type.trim(),
      rating: numericRating,
      title: (title || '').trim(),
      comment: comment.trim(),
      approved: false, // Pending moderation by default
      created_at: new Date().toISOString(),
    };

    db.reviews.unshift(newReview);

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable review! It has been submitted for moderation.',
      review: newReview,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

export default router;
