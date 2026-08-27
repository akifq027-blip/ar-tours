import { Router, Request, Response } from 'express';
import { db, DbContactMessage } from '../db.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST general contact message
router.post('/', optionalAuth, (req: AuthRequest, res: Response): void => {
  try {
    const { name, email, phone, subject, service_interest, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'Please provide name, email, subject, and your message.' });
      return;
    }

    const newMessage: DbContactMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user_id: req.user?.id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone ? String(phone).trim() : '',
      subject: subject.trim(),
      service_interest: service_interest || 'General Inquiry',
      message: message.trim(),
      status: 'unread',
      created_at: new Date().toISOString(),
    };

    db.contactMessages.push(newMessage);

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We have received your message and our team will get back to you within 24 business hours.',
      messageId: newMessage.id,
    });
  } catch (error) {
    console.error('Contact message error:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again or reach out on WhatsApp.' });
  }
});

export default router;
