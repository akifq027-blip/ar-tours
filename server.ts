import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { config } from './server/config.js';

// Route handlers
import authRoutes from './server/routes/auth.js';
import carRoutes from './server/routes/cars.js';
import paymentRoutes from './server/routes/payments.js';
import tourRoutes from './server/routes/tours.js';
import pilgrimageRoutes from './server/routes/pilgrimage.js';
import enquiryRoutes from './server/routes/enquiries.js';
import reviewRoutes from './server/routes/reviews.js';
import adminRoutes from './server/routes/admin.js';
import settingsRoutes from './server/routes/settings.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Global Middleware
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger for API routes
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.path}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'AR Tours & Travel Backend API',
      timestamp: new Date().toISOString(),
      razorpay_configured: Boolean(config.razorpay.keyId),
      supabase_configured: Boolean(config.supabase.url),
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/cars', carRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/tours', tourRoutes);
  app.use('/api/pilgrimage-packages', pilgrimageRoutes);
  app.use('/api/contact', enquiryRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/settings', settingsRoutes);

  // Fallback for unmatched API routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route ${req.method} ${req.path} not found.` });
  });

  // Vite Middleware integration for SPA
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 AR Tours & Travel Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup failure:', err);
});
