import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { db, DbUser } from '../db.js';

export interface AuthRequest extends Request {
  user?: DbUser;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Authentication required. Please login.' });
    return;
  }

  jwt.verify(token, config.jwtSecret, (err, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ error: 'Invalid or expired authentication session.' });
      return;
    }

    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) {
      res.status(404).json({ error: 'User account not found.' });
      return;
    }

    req.user = user;
    next();
  });
};

export const optionalAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded: any = jwt.verify(token, config.jwtSecret);
      const user = db.users.find(u => u.id === decoded.userId);
      if (user) {
        req.user = user;
      }
    } catch {
      // ignore optional auth errors
    }
  }
  next();
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({
      error: 'Access denied: Restricted to authorized portal administrators.',
    });
    return;
  }
  next();
};
