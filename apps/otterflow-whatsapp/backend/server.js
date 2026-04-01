require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const logger = require('./api/services/logger');
const errorHandler = require('./middleware/errorHandler');
const { validateTwilioSignature } = require('./middleware/auth');

const whatsappWebhook = require('./api/webhooks/whatsapp');
const stripeWebhook = require('./api/webhooks/stripe');
const restaurantApi = require('./api/webhooks/restaurant');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Security ─────────────────────────────────────────────────

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ─── Rate Limiting ────────────────────────────────────────────

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: { error: 'Too many requests' },
});

// ─── Body Parsing ─────────────────────────────────────────────

// Stripe webhook needs raw body - mounted before express.json()
app.use('/webhooks/stripe', stripeWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ───────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// WhatsApp webhook - Twilio sends POST with urlencoded body
app.use('/webhooks/whatsapp', webhookLimiter, validateTwilioSignature, whatsappWebhook);

// Restaurant management API
app.use('/api/restaurant', apiLimiter, restaurantApi);

// ─── Error Handling ───────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(errorHandler);

// ─── Start ────────────────────────────────────────────────────

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL}`);
});

module.exports = app;
