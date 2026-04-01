const express = require('express');
const router = express.Router();
const paymentHandler = require('../handlers/payment');

// Stripe requires raw body for signature verification
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['stripe-signature'];

  try {
    const result = await paymentHandler.handleStripeWebhook(req.body, signature);
    res.json(result);
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
