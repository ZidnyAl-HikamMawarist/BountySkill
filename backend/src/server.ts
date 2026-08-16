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

// Rate Limiting: Prevent Brute Force Attacks on Auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan autentikasi dari IP ini. Silakan coba lagi setelah 15 menit.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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
