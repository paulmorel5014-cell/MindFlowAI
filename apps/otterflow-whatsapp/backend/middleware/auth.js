const twilio = require('twilio');

function validateTwilioSignature(req, res, next) {
  // Skip in development
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  const signature = req.headers['x-twilio-signature'];
  const url = `${process.env.BASE_URL || `https://${req.hostname}`}${req.originalUrl}`;

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    req.body
  );

  if (!isValid) {
    return res.status(403).json({ error: 'Invalid Twilio signature' });
  }

  next();
}

module.exports = { validateTwilioSignature };
