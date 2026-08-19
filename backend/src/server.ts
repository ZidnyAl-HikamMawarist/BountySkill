import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { errorHandler } from './middlewares/error.middleware';
import { initWebSocket } from './lib/websocket';
import { startBackgroundWorkers } from './lib/cron-worker';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Reverse Proxy Configuration (Cloudflare, Render, Nginx)
app.set('trust proxy', 1);

// Security Middleware: Helmet HTTP headers (configured for API & CORS)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
  })
);

// CORS Policy
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL || ''
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(express.json({ limit: '10mb' }));

// Global API Rate Limiter: Protect against DDoS & Scraping
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max 300 requests per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak permintaan API. Silakan coba lagi nanti.'
  }
});
app.use('/api', globalApiLimiter);

// Strict Rate Limiting on Login (Prevent Credential Stuffing & Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 attempts per IP per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login gagal dari IP ini. Silakan tunggu 15 menit sebelum mencoba kembali.'
  }
});
app.use('/api/auth/login', loginLimiter);

// Register Rate Limiting (Prevent Bot Account Creation)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Max 10 registrations per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Batas pendaftaran akun dari IP ini telah tercapai. Silakan coba lagi setelah 1 jam.'
  }
});
app.use('/api/auth/register', registerLimiter);

// Health check endpoint (Render / DevOps ping)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    service: 'SkillBounty Enterprise Backend REST API',
    database: 'PostgreSQL Active',
    websocket: 'ws://localhost:5000/ws Active',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api', apiRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

// Initialize WebSocket Server on the same HTTP server
initWebSocket(server);

// Start Background Escrow Auto-Release Workers
startBackgroundWorkers();

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 SkillBounty Backend Server listening on http://localhost:${PORT}`);
  console.log(`📡 REST API Base URL: http://localhost:${PORT}/api`);
  console.log(`⚡ Realtime WebSocket URL: ws://localhost:${PORT}/ws`);
});

export default app;
