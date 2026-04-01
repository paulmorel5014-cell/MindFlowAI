const express = require('express');
const router = express.Router();

const db = require('../services/database');
const twilioSvc = require('../services/twilio');
const claudeSvc = require('../services/claude');
const menuHandler = require('../handlers/menu');
const orderHandler = require('../handlers/orders');
const customizationHandler = require('../handlers/customizations');
const locationHandler = require('../handlers/location');

// ─── Main Webhook ─────────────────────────────────────────────

router.post('/', async (req, res) => {
  // Respond immediately to Twilio
  res.status(200).send('<Response></Response>');

  const { From, Body, ProfileName } = req.body;
  if (!From || !Body) return;

  const whatsappNumber = From.replace('whatsapp:', '');
  const message = Body.trim();

  try {
    await processMessage(whatsappNumber, message, ProfileName);
  } catch (err) {
    console.error('Message processing error:', err);
    try {
      await twilioSvc.sendText(
        whatsappNumber,
        "Désolé, une erreur s'est produite. Tapez *MENU* pour recommencer."
      );
    } catch {}
  }
});

// ─── Message Router ───────────────────────────────────────────

async function processMessage(whatsappNumber, message, profileName) {
  const restaurant = await db.getDefaultRestaurant();
  const session = await db.getOrCreateSession(whatsappNumber, restaurant.id);

  // Log inbound message
  await db.logMessage({
    session_id: session.id,
    restaurant_id: restaurant.id,
    whatsapp_number: whatsappNumber,
    direction: 'inbound',
    message_type: 'text',
    body: message,
  });

  // Update customer name if available
  if (profileName && !session.context?.customerName) {
    await db.updateCustomer(session.customer_id, { display_name: profileName });
  }

  // Extend session
  await db.extendSession(session.id);

  // Handle global commands regardless of state
  const lowerMsg = message.toLowerCase().trim();
  if (['menu', 'start', 'bonjour', 'hello', 'salut', 'commander'].includes(lowerMsg)) {
    return handleGreeting(session, restaurant, whatsappNumber);
  }
  if (['annuler', 'cancel', 'stop'].includes(lowerMsg)) {
    return handleCancel(session, restaurant, whatsappNumber);
  }
  if (['panier', 'cart', 'mon panier'].includes(lowerMsg)) {
    return handleViewCart(session, restaurant, whatsappNumber);
  }
  if (['aide', 'help', '?'].includes(lowerMsg)) {
    return handleHelp(whatsappNumber);
  }

  // Route by current state
  const handlers = {
    greeting: handleGreeting,
    browsing_menu: handleBrowsingMenu,
    selecting_item: handleSelectingItem,
    customizing: handleCustomizing,
    reviewing_cart: handleReviewingCart,
    providing_address: handleProvidingAddress,
    selecting_delivery: handleSelectingDelivery,
    awaiting_payment: handleAwaitingPayment,
    order_confirmed: handleOrderConfirmed,
  };

  const handler = handlers[session.state] || handleGreeting;
  await handler(session, restaurant, whatsappNumber, message);
}

// ─── State Handlers ───────────────────────────────────────────

async function handleGreeting(session, restaurant, whatsappNumber, message) {
  const menu = await menuHandler.getMenu(restaurant.id);
  const isOpen = restaurant.accepts_orders;

  if (!isOpen) {
    await twilioSvc.sendText(
      whatsappNumber,
      `🔒 *${restaurant.name}* est actuellement fermé.\n\nNos horaires:\n${formatHours(restaurant.opening_hours)}`
    );
    return;
  }

  let greeting = `👋 Bonjour ! Bienvenue chez *${restaurant.name}*\n\n`;
  greeting += 'Comment souhaitez-vous commander ?\n\n';
  greeting += '1. 🚚 Livraison\n';
  greeting += '2. 🏃 À emporter\n';
  greeting += '3. 🍽️ Sur place\n\n';
  greeting += '_Répondez avec le numéro de votre choix_';

  await db.updateSession(session.id, {
    state: 'selecting_delivery',
    context: { ...session.context, menu },
    cart: [],
  });

  await twilioSvc.sendText(whatsappNumber, greeting);
}

async function handleSelectingDelivery(session, restaurant, whatsappNumber, message) {
  const choice = parseInt(message.trim());
  const orderTypes = { 1: 'delivery', 2: 'takeaway', 3: 'dine_in' };
  const orderType = orderTypes[choice];

  if (!orderType) {
    await twilioSvc.sendText(
      whatsappNumber,
      'Veuillez choisir :\n1. 🚚 Livraison\n2. 🏃 À emporter\n3. 🍽️ Sur place'
    );
    return;
  }

  const newContext = { ...session.context, orderType };

  await db.updateSession(session.id, {
    state: 'browsing_menu',
    order_type: orderType,
    context: newContext,
  });

  const menu = session.context?.menu || await menuHandler.getMenu(restaurant.id);
  await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
}

async function handleBrowsingMenu(session, restaurant, whatsappNumber, message) {
  const menu = session.context?.menu || await menuHandler.getMenu(restaurant.id);
  const input = message.trim();
  const num = parseInt(input) - 1;

  // Check if navigating categories
  if (!isNaN(num) && num >= 0 && num < menu.categories.length) {
    const category = menu.categories[num];
    await db.updateSession(session.id, {
      state: 'selecting_item',
      context: { ...session.context, currentCategoryIndex: num, menu },
    });
    await twilioSvc.sendCategoryItems(whatsappNumber, category, session.id);
    return;
  }

  // Try Claude NLP match
  const intent = await claudeSvc.parseOrderIntent(message, menu);
  if (intent.intent === 'order' && intent.items.length > 0) {
    const matches = await claudeSvc.matchMenuItems(
      intent.items[0].name,
      menu.categories.flatMap(c => c.items)
    );
    if (matches.length > 0) {
      const item = menuHandler.findItemById(menu, matches[0].id);
      if (item) {
        return handleItemSelection(session, restaurant, whatsappNumber, item, menu);
      }
    }
  }

  await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
  await twilioSvc.sendText(
    whatsappNumber,
    'Choisissez une catégorie (numéro) ou tapez le nom d\'un plat.',
    session.id
  );
}

async function handleSelectingItem(session, restaurant, whatsappNumber, message) {
  const menu = session.context?.menu || await menuHandler.getMenu(restaurant.id);
  const catIndex = session.context?.currentCategoryIndex ?? 0;
  const category = menu.categories[catIndex];

  if (!category) {
    return handleBrowsingMenu(session, restaurant, whatsappNumber, message);
  }

  const input = message.trim();
  const num = parseInt(input);

  // Back to categories
  if (input === '0') {
    await db.updateSession(session.id, {
      state: 'browsing_menu',
      context: { ...session.context, menu },
    });
    await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
    return;
  }

  const availableItems = category.items.filter(i => i.available);
  const item = availableItems[num - 1];

  if (!item) {
    await twilioSvc.sendText(
      whatsappNumber,
      `Numéro invalide. Choisissez entre 1 et ${availableItems.length}, ou 0 pour revenir.`
    );
    return;
  }

  await handleItemSelection(session, restaurant, whatsappNumber, item, menu);
}

async function handleItemSelection(session, restaurant, whatsappNumber, item, menu) {
  if (!item.modifiers || item.modifiers.length === 0) {
    // No customization needed - add directly
    const updatedCart = orderHandler.addToCart(session.cart || [], item);
    await db.updateSession(session.id, {
      state: 'reviewing_cart',
      cart: updatedCart,
      context: { ...session.context, menu },
    });
    await twilioSvc.sendText(
      whatsappNumber,
      `✅ *${item.name}* ajouté au panier !`,
      session.id
    );
    await twilioSvc.sendCart(whatsappNumber, updatedCart, session.id);
    return;
  }

  // Start customization flow
  const customizationSteps = customizationHandler.buildCustomizationFlow(item);
  await db.updateSession(session.id, {
    state: 'customizing',
    context: {
      ...session.context,
      menu,
      currentItem: item,
      customizationSteps,
      currentStepIndex: 0,
    },
  });

  const firstStep = customizationSteps[0];
  const text = customizationHandler.formatModifierStep(firstStep, item.name);
  await twilioSvc.sendText(whatsappNumber, text, session.id);
}

async function handleCustomizing(session, restaurant, whatsappNumber, message) {
  const { currentItem, customizationSteps, currentStepIndex } = session.context;

  if (!currentItem || !customizationSteps) {
    return handleBrowsingMenu(session, restaurant, whatsappNumber, message);
  }

  const currentStep = customizationSteps[currentStepIndex];
  const parseResult = customizationHandler.parseModifierChoice(message, currentStep);

  if (!parseResult.valid) {
    await twilioSvc.sendText(whatsappNumber, `❌ ${parseResult.error}`);
    const text = customizationHandler.formatModifierStep(currentStep, currentItem.name);
    await twilioSvc.sendText(whatsappNumber, text, session.id);
    return;
  }

  const updatedSteps = customizationHandler.applyModifierChoice(
    customizationSteps,
    currentStepIndex,
    parseResult.selectedChoices
  );

  // Find next step
  const nextIndex = currentStepIndex + 1;

  if (nextIndex < updatedSteps.length) {
    // Move to next modifier
    await db.updateSession(session.id, {
      context: {
        ...session.context,
        customizationSteps: updatedSteps,
        currentStepIndex: nextIndex,
      },
    });
    const nextStep = updatedSteps[nextIndex];
    const text = customizationHandler.formatModifierStep(nextStep, currentItem.name);
    await twilioSvc.sendText(whatsappNumber, text, session.id);
  } else {
    // All modifiers done - add to cart
    const selectedModifiers = customizationHandler.buildSelectedModifiers(updatedSteps);
    const updatedCart = orderHandler.addToCart(
      session.cart || [],
      currentItem,
      1,
      selectedModifiers
    );

    await db.updateSession(session.id, {
      state: 'reviewing_cart',
      cart: updatedCart,
      context: { ...session.context, menu: session.context.menu },
    });

    await twilioSvc.sendText(
      whatsappNumber,
      `✅ *${currentItem.name}* ajouté au panier !`,
      session.id
    );
    await twilioSvc.sendCart(whatsappNumber, updatedCart, session.id);
  }
}

async function handleReviewingCart(session, restaurant, whatsappNumber, message) {
  const menu = session.context?.menu || await menuHandler.getMenu(restaurant.id);
  const cart = session.cart || [];

  if (cart.length === 0) {
    await db.updateSession(session.id, {
      state: 'browsing_menu',
      context: { ...session.context, menu },
    });
    await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
    return;
  }

  const input = message.trim();

  switch (input) {
    case '1': {
      // Validate order
      if (session.order_type === 'delivery') {
        await db.updateSession(session.id, { state: 'providing_address' });
        await twilioSvc.sendText(
          whatsappNumber,
          '📍 Quelle est votre adresse de livraison ?\n\n_Ex: 12 Rue de la Paix, Paris_',
          session.id
        );
      } else {
        await initiateOrder(session, restaurant, whatsappNumber);
      }
      break;
    }
    case '2': {
      // Continue shopping
      await db.updateSession(session.id, {
        state: 'browsing_menu',
        context: { ...session.context, menu },
      });
      await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
      break;
    }
    case '3': {
      // Clear cart
      await db.updateSession(session.id, { cart: [], state: 'browsing_menu' });
      await twilioSvc.sendText(whatsappNumber, '🗑️ Panier vidé.', session.id);
      await twilioSvc.sendMenuCategories(whatsappNumber, menu.categories, session.id);
      break;
    }
    case '4': {
      // Edit - show cart again with remove options
      await twilioSvc.sendCart(whatsappNumber, cart, session.id);
      break;
    }
    default: {
      await twilioSvc.sendCart(whatsappNumber, cart, session.id);
    }
  }
}

async function handleProvidingAddress(session, restaurant, whatsappNumber, message) {
  // Parse address with Claude
  const parsed = await claudeSvc.parseDeliveryAddress(message);

  if (!parsed.street) {
    await twilioSvc.sendText(
      whatsappNumber,
      "Je n'ai pas pu identifier l'adresse. Merci de la préciser:\n\n_Ex: 12 Rue de la Paix, 75001 Paris_"
    );
    return;
  }

  // Validate with Mapbox
  const validation = await locationHandler.validateAndFormatAddress(
    `${parsed.street}, ${parsed.city || ''}`,
    restaurant
  );

  if (!validation.valid) {
    await twilioSvc.sendText(whatsappNumber, `❌ ${validation.error}`);
    return;
  }

  const address = { ...parsed, ...validation.address };

  await db.updateSession(session.id, {
    state: 'reviewing_cart',
    delivery_address: address,
  });

  await twilioSvc.sendText(
    whatsappNumber,
    `📍 Adresse confirmée:\n*${validation.address.formattedAddress}*\n\nC'est correct ?`,
    session.id
  );
  await twilioSvc.sendCart(whatsappNumber, session.cart || [], session.id);
}

async function initiateOrder(session, restaurant, whatsappNumber) {
  try {
    const order = await orderHandler.createOrderFromCart(
      session,
      restaurant,
      session.order_type || 'takeaway'
    );

    const paymentData = await orderHandler.createPaymentSession(order, restaurant);

    await db.updateSession(session.id, { state: 'awaiting_payment' });

    const updatedOrder = {
      ...order,
      stripe_payment_link: paymentData.url,
      customer: { whatsapp_number: whatsappNumber },
    };

    await twilioSvc.sendOrderConfirmation(whatsappNumber, updatedOrder, session.id);
  } catch (err) {
    console.error('Order creation error:', err);
    await twilioSvc.sendText(
      whatsappNumber,
      "❌ Erreur lors de la création de la commande. Veuillez réessayer.",
      session.id
    );
  }
}

async function handleAwaitingPayment(session, restaurant, whatsappNumber, message) {
  await twilioSvc.sendText(
    whatsappNumber,
    '⏳ En attente de votre paiement.\n\nUne fois le paiement effectué, votre commande sera automatiquement confirmée.\n\nTapez *MENU* pour faire une nouvelle commande.'
  );
}

async function handleOrderConfirmed(session, restaurant, whatsappNumber, message) {
  await twilioSvc.sendText(
    whatsappNumber,
    '✅ Votre commande est confirmée !\n\nTapez *MENU* pour passer une nouvelle commande.'
  );
}

// ─── Utility Handlers ─────────────────────────────────────────

async function handleViewCart(session, restaurant, whatsappNumber) {
  const cart = session.cart || [];
  if (cart.length === 0) {
    await twilioSvc.sendText(
      whatsappNumber,
      '🛒 Votre panier est vide.\n\nTapez *MENU* pour commander.'
    );
    return;
  }
  await db.updateSession(session.id, { state: 'reviewing_cart' });
  await twilioSvc.sendCart(whatsappNumber, cart, session.id);
}

async function handleCancel(session, restaurant, whatsappNumber) {
  await db.updateSession(session.id, {
    state: 'greeting',
    cart: [],
    context: {},
    delivery_address: null,
    order_type: null,
  });
  await twilioSvc.sendText(
    whatsappNumber,
    '❌ Commande annulée.\n\nTapez *MENU* pour recommencer.'
  );
}

async function handleHelp(whatsappNumber) {
  const help = `ℹ️ *Aide*\n\nCommandes disponibles:\n• *MENU* — Voir le menu\n• *PANIER* — Voir votre panier\n• *ANNULER* — Annuler la commande\n• *AIDE* — Afficher cette aide\n\nEn cas de problème, contactez-nous directement.`;
  await twilioSvc.sendText(whatsappNumber, help);
}

function formatHours(hours) {
  if (!hours || Object.keys(hours).length === 0) return 'Contactez-nous pour les horaires.';
  const days = { mon: 'Lundi', tue: 'Mardi', wed: 'Mercredi', thu: 'Jeudi', fri: 'Vendredi', sat: 'Samedi', sun: 'Dimanche' };
  return Object.entries(hours)
    .map(([day, times]) => `${days[day] || day}: ${times.join(' - ')}`)
    .join('\n');
}

module.exports = router;
