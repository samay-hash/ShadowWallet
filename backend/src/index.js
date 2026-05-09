import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeRouter } from './routes/analyze.js';
import { reputationRouter } from './routes/reputation.js';
import { simulateRouter } from './routes/simulate.js';
import { insightRouter } from './routes/insight.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(express.json({ limit: '2mb' }));

// CORS - allow Chrome extensions and local dev
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      origin.startsWith('chrome-extension://') ||
      origin.startsWith('http://localhost') ||
      origin.startsWith('https://shadowwallet.io')
    ) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/reputation', reputationRouter);
app.use('/api/simulate', simulateRouter);
app.use('/api/site-insight', insightRouter);

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', version: '1.0.0' }));

// 404
app.use((_, res) => res.status(404).json({ error: 'Route not found' }));

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🛡️  ShadowWallet Backend running on http://localhost:${PORT}`);
  console.log(`   Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   Helius RPC: ${process.env.HELIUS_API_KEY ? '✅ Configured' : '⚠️  Using public RPC'}\n`);
});
