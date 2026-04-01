const stripeSvc = require('../services/stripe');
const db = require('../services/database');
const twilioSvc = require('../services/twilio');
const orderHandler = require('./orders');

// ─── Handle Stripe Webhook ────────────────────────────────────

async function handleStripeWebhook(rawBody, signature) {
  let event;
  try {
    event = stripeSvc.constructWebhookEvent(rawBody, signature);
  } catch (err) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'checkout.session.expired':
      await handlePaymentExpired(event.data.object);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object);
      break;
    default:
      // Ignore other events
      break;
  }

  return { received: true };
}

async function handlePaymentSuccess(session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;

  await orderHandler.confirmOrder(orderId);
}

async function handlePaymentExpired(session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;

  const order = await db.getOrder(orderId);
  if (order.payment_status !== 'pending') return;

  // Notify customer that link expired
  if (order.customer?.whatsapp_number) {
    await twilioSvc.sendText(
      order.customer.whatsapp_number,
      `⏰ Le lien de paiement pour votre commande *${order.order_number}* a expiré.\n\nRépondez *COMMANDER* pour recommencer.`
    );
  }
}

async function handlePaymentFailed(paymentIntent) {
  const orderId = paymentIntent.metadata?.order_id;
  if (!orderId) return;

  const order = await db.getOrder(orderId);

  await db.updateOrderStatus(orderId, 'pending', {
    payment_status: 'failed',
  });

  if (order.customer?.whatsapp_number) {
    await twilioSvc.sendText(
      order.customer.whatsapp_number,
      `❌ Le paiement pour votre commande *${order.order_number}* a échoué.\n\nVeuillez réessayer avec le lien de paiement.`
    );
  }
}

module.exports = {
  handleStripeWebhook,
};
