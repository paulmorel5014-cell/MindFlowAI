const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
});

// ─── Payment Links ────────────────────────────────────────────

async function createPaymentLink(order, successUrl, cancelUrl) {
  const lineItems = order.items.map(item => ({
    price_data: {
      currency: order.currency || 'eur',
      product_data: {
        name: item.name,
        description: buildItemDescription(item),
        metadata: { zelty_id: item.zeltyId || '' },
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  // Add delivery fee if applicable
  if (order.delivery_fee > 0) {
    lineItems.push({
      price_data: {
        currency: order.currency || 'eur',
        product_data: { name: '🚚 Frais de livraison' },
        unit_amount: order.delivery_fee,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      restaurant_id: order.restaurant_id,
    },
    customer_email: order.customer?.email || undefined,
    locale: 'fr',
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
  });

  return {
    sessionId: session.id,
    url: session.url,
    paymentIntentId: session.payment_intent,
  };
}

// ─── Payment Intents ──────────────────────────────────────────

async function createPaymentIntent(amount, currency, metadata) {
  const intent = await stripe.paymentIntents.create({
    amount,
    currency: currency || 'eur',
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return intent;
}

async function retrievePaymentIntent(paymentIntentId) {
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

// ─── Refunds ──────────────────────────────────────────────────

async function refundOrder(paymentIntentId, amount = null) {
  const params = { payment_intent: paymentIntentId };
  if (amount) params.amount = amount;

  return stripe.refunds.create(params);
}

// ─── Webhook ──────────────────────────────────────────────────

function constructWebhookEvent(payload, signature) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );
}

// ─── Helpers ──────────────────────────────────────────────────

function buildItemDescription(item) {
  const parts = [];
  if (item.selectedModifiers?.length > 0) {
    item.selectedModifiers.forEach(mod => {
      const choices = mod.selectedChoices.map(c => c.name).join(', ');
      if (choices) parts.push(choices);
    });
  }
  if (item.note) parts.push(`Note: ${item.note}`);
  return parts.join(' | ') || undefined;
}

module.exports = {
  stripe,
  createPaymentLink,
  createPaymentIntent,
  retrievePaymentIntent,
  refundOrder,
  constructWebhookEvent,
};
