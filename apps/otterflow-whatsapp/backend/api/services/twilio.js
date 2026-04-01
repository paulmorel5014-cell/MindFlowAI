const twilio = require('twilio');
const db = require('./database');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const FROM = process.env.TWILIO_WHATSAPP_FROM;

// ─── Send Messages ────────────────────────────────────────────

async function sendText(to, body, sessionId = null) {
  const toNumber = normalizeNumber(to);

  const message = await client.messages.create({
    from: FROM,
    to: toNumber,
    body,
  });

  await db.logMessage({
    session_id: sessionId,
    whatsapp_number: to,
    direction: 'outbound',
    message_sid: message.sid,
    message_type: 'text',
    body,
    status: message.status,
  });

  return message;
}

async function sendList(to, header, body, footer, sections, sessionId = null) {
  // WhatsApp List Message via Twilio ContentSid or template
  // For simplicity, format as text with numbered options
  let text = `*${header}*\n${body}\n\n`;

  let optionIndex = 1;
  for (const section of sections) {
    if (section.title) text += `_${section.title}_\n`;
    for (const item of section.items) {
      text += `${optionIndex}. ${item.title}`;
      if (item.description) text += ` - ${item.description}`;
      text += '\n';
      optionIndex++;
    }
    text += '\n';
  }

  if (footer) text += `_${footer}_`;

  return sendText(to, text.trim(), sessionId);
}

async function sendButtons(to, body, buttons, sessionId = null) {
  // Format as text with numbered buttons
  let text = `${body}\n\n`;
  buttons.forEach((btn, i) => {
    text += `${i + 1}. ${btn.title}\n`;
  });

  return sendText(to, text.trim(), sessionId);
}

async function sendMedia(to, body, mediaUrl, sessionId = null) {
  const toNumber = normalizeNumber(to);

  const message = await client.messages.create({
    from: FROM,
    to: toNumber,
    body,
    mediaUrl: [mediaUrl],
  });

  await db.logMessage({
    session_id: sessionId,
    whatsapp_number: to,
    direction: 'outbound',
    message_sid: message.sid,
    message_type: 'image',
    body,
    media_url: mediaUrl,
    status: message.status,
  });

  return message;
}

// ─── Menu Formatting ──────────────────────────────────────────

async function sendMenuCategories(to, categories, sessionId = null) {
  let text = '🍽️ *Notre Menu*\n\nChoisissez une catégorie :\n\n';
  categories.forEach((cat, i) => {
    text += `${i + 1}. ${cat.name}`;
    if (cat.description) text += ` - ${cat.description}`;
    text += '\n';
  });
  text += '\n_Répondez avec le numéro de votre choix_';
  return sendText(to, text, sessionId);
}

async function sendCategoryItems(to, category, sessionId = null) {
  let text = `*${category.name}*\n\n`;

  category.items.forEach((item, i) => {
    if (!item.available) return;
    const price = formatPrice(item.price);
    text += `${i + 1}. *${item.name}* — ${price}\n`;
    if (item.description) text += `   ${item.description}\n`;
    text += '\n';
  });

  text += `0. ⬅️ Retour aux catégories\n\n_Répondez avec le numéro pour ajouter au panier_`;
  return sendText(to, text, sessionId);
}

async function sendItemDetails(to, item, sessionId = null) {
  let text = `*${item.name}*\n`;
  text += `${formatPrice(item.price)}\n`;
  if (item.description) text += `\n${item.description}\n`;

  if (item.allergens?.length > 0) {
    text += `\n⚠️ Allergènes: ${item.allergens.join(', ')}\n`;
  }

  if (item.modifiers?.length > 0) {
    text += '\n*Options disponibles:*\n';
    item.modifiers.forEach(mod => {
      text += `• ${mod.name}${mod.required ? ' (obligatoire)' : ''}\n`;
    });
  }

  text += '\n1. ✅ Ajouter au panier\n2. ⬅️ Retour';
  return sendText(to, text, sessionId);
}

async function sendCart(to, cart, sessionId = null) {
  if (!cart || cart.length === 0) {
    return sendText(to, '🛒 Votre panier est vide.\n\n1. Voir le menu\n2. Annuler', sessionId);
  }

  let text = '🛒 *Votre panier*\n\n';
  let total = 0;

  cart.forEach((item, i) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    text += `${i + 1}. ${item.name} x${item.quantity} — ${formatPrice(itemTotal)}\n`;
    if (item.selectedModifiers?.length > 0) {
      item.selectedModifiers.forEach(mod => {
        mod.selectedChoices.forEach(choice => {
          text += `   + ${choice.name}`;
          if (choice.price > 0) text += ` (+${formatPrice(choice.price)})`;
          text += '\n';
        });
      });
    }
  });

  text += `\n*Total: ${formatPrice(total)}*\n\n`;
  text += '1. ✅ Valider la commande\n2. ➕ Continuer à commander\n3. 🗑️ Vider le panier\n4. ✏️ Modifier un article';

  return sendText(to, text, sessionId);
}

async function sendOrderConfirmation(to, order, sessionId = null) {
  let text = `✅ *Commande confirmée !*\n\n`;
  text += `Numéro: *${order.order_number}*\n`;
  text += `Type: ${order.order_type === 'delivery' ? '🚚 Livraison' : '🏪 À emporter'}\n`;
  text += `Total: *${formatPrice(order.total)}*\n\n`;

  if (order.payment_status === 'pending' && order.stripe_payment_link) {
    text += `💳 *Paiement requis:*\n${order.stripe_payment_link}\n\n`;
  }

  if (order.estimated_delivery_time) {
    const eta = new Date(order.estimated_delivery_time);
    text += `⏱️ Temps estimé: ${eta.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}\n`;
  }

  text += '\nNous vous tiendrons informé de l\'avancement de votre commande.';
  return sendText(to, text, sessionId);
}

async function sendOrderStatusUpdate(to, order, sessionId = null) {
  const statusMessages = {
    confirmed: '✅ Votre commande a été confirmée !',
    preparing: '👨‍🍳 Le restaurant prépare votre commande...',
    ready: '🔔 Votre commande est prête !',
    delivering: '🚚 Votre commande est en route !',
    delivered: '🎉 Commande livrée ! Bon appétit !',
    cancelled: '❌ Votre commande a été annulée.',
  };

  const msg = statusMessages[order.status] || `Statut: ${order.status}`;
  const text = `${msg}\n\nCommande: *${order.order_number}*`;
  return sendText(to, text, sessionId);
}

// ─── Helpers ──────────────────────────────────────────────────

function normalizeNumber(number) {
  if (number.startsWith('whatsapp:')) return number;
  return `whatsapp:${number}`;
}

function formatPrice(cents) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

// ─── Validate Twilio Signature ────────────────────────────────

function validateSignature(signature, url, params) {
  return twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    signature,
    url,
    params
  );
}

module.exports = {
  sendText,
  sendList,
  sendButtons,
  sendMedia,
  sendMenuCategories,
  sendCategoryItems,
  sendItemDetails,
  sendCart,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  validateSignature,
  formatPrice,
};
