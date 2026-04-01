const db = require('../services/database');
const zelty = require('../services/zelty');
const twilioSvc = require('../services/twilio');
const stripeSvc = require('../services/stripe');
const printing = require('./printing');

// ─── Create Order from Cart ───────────────────────────────────

async function createOrderFromCart(session, restaurant, orderType) {
  const cart = session.cart || [];
  if (cart.length === 0) throw new Error('Cart is empty');

  const subtotal = calculateSubtotal(cart);
  const deliveryFee = orderType === 'delivery' ? restaurant.delivery_fee : 0;
  const total = subtotal + deliveryFee;

  // Create Zelty order
  let zeltyOrderId = null;
  try {
    const zeltyOrder = await zelty.createZeltyOrder(
      restaurant.zelty_restaurant_id,
      {
        orderType,
        items: cart,
        customerName: session.context?.customerName,
        whatsappNumber: session.whatsapp_number,
        deliveryAddress: session.delivery_address,
        notes: session.context?.notes,
      }
    );
    zeltyOrderId = zeltyOrder.id;
  } catch (err) {
    console.error('Zelty order creation failed (continuing):', err.message);
  }

  // Create order in DB
  const order = await db.createOrder({
    restaurant_id: restaurant.id,
    customer_id: session.customer_id,
    session_id: session.id,
    order_type: orderType,
    items: cart,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    currency: restaurant.currency || 'EUR',
    delivery_address: session.delivery_address,
    zelty_order_id: zeltyOrderId,
    payment_status: 'pending',
    status: 'pending',
  });

  return order;
}

// ─── Process Payment ──────────────────────────────────────────

async function createPaymentSession(order, restaurant) {
  const frontendUrl = process.env.FRONTEND_URL;
  const successUrl = `${frontendUrl}/pay/${order.id}/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${frontendUrl}/pay/${order.id}/cancel`;

  const fullOrder = {
    ...order,
    restaurant,
  };

  const paymentData = await stripeSvc.createPaymentLink(
    fullOrder,
    successUrl,
    cancelUrl
  );

  // Update order with payment info
  await db.updateOrderStatus(order.id, 'pending', {
    stripe_payment_intent_id: paymentData.paymentIntentId,
    stripe_payment_link: paymentData.url,
  });

  return paymentData;
}

// ─── Confirm Order ────────────────────────────────────────────

async function confirmOrder(orderId) {
  const order = await db.getOrder(orderId);
  const restaurant = await db.getRestaurant(order.restaurant_id);

  // Update status
  const updated = await db.updateOrderStatus(orderId, 'confirmed', {
    confirmed_at: new Date().toISOString(),
    payment_status: 'paid',
    paid_at: new Date().toISOString(),
  });

  // Update Zelty
  if (order.zelty_order_id) {
    try {
      await zelty.updateZeltyOrderStatus(order.zelty_order_id, 'confirmed');
    } catch (err) {
      console.error('Zelty status update failed:', err.message);
    }
  }

  // Print ticket
  try {
    await printing.printOrder(order, restaurant);
  } catch (err) {
    console.error('Printing failed (non-critical):', err.message);
  }

  // Notify customer
  if (order.customer?.whatsapp_number) {
    await twilioSvc.sendOrderStatusUpdate(
      order.customer.whatsapp_number,
      updated
    );
  }

  return updated;
}

// ─── Cancel Order ─────────────────────────────────────────────

async function cancelOrder(orderId, reason = 'Cancelled by restaurant', refund = false) {
  const order = await db.getOrder(orderId);

  const updated = await db.updateOrderStatus(orderId, 'cancelled', {
    cancelled_at: new Date().toISOString(),
    cancellation_reason: reason,
  });

  // Refund if paid
  if (refund && order.stripe_payment_intent_id && order.payment_status === 'paid') {
    try {
      await stripeSvc.refundOrder(order.stripe_payment_intent_id);
      await db.updateOrderStatus(orderId, 'cancelled', { payment_status: 'refunded' });
    } catch (err) {
      console.error('Refund failed:', err.message);
    }
  }

  // Notify customer
  if (order.customer?.whatsapp_number) {
    await twilioSvc.sendOrderStatusUpdate(
      order.customer.whatsapp_number,
      { ...updated, status: 'cancelled' }
    );
  }

  return updated;
}

// ─── Update Status ────────────────────────────────────────────

async function updateOrderStatus(orderId, status) {
  const order = await db.getOrder(orderId);
  const updated = await db.updateOrderStatus(orderId, status, {
    changed_by: 'staff',
  });

  // Notify customer for key status changes
  const notifyStatuses = ['preparing', 'ready', 'delivering', 'delivered'];
  if (notifyStatuses.includes(status) && order.customer?.whatsapp_number) {
    await twilioSvc.sendOrderStatusUpdate(
      order.customer.whatsapp_number,
      updated
    );
  }

  // Sync to Zelty
  if (order.zelty_order_id) {
    try {
      await zelty.updateZeltyOrderStatus(order.zelty_order_id, status);
    } catch (err) {
      console.error('Zelty sync failed:', err.message);
    }
  }

  return updated;
}

// ─── Cart Calculations ────────────────────────────────────────

function calculateSubtotal(cart) {
  return cart.reduce((total, item) => {
    let itemPrice = item.price * item.quantity;
    // Add modifier prices
    if (item.selectedModifiers) {
      item.selectedModifiers.forEach(mod => {
        mod.selectedChoices.forEach(choice => {
          itemPrice += (choice.price || 0) * item.quantity;
        });
      });
    }
    return total + itemPrice;
  }, 0);
}

function addToCart(cart, item, quantity = 1, selectedModifiers = []) {
  // Check if same item with same modifiers exists
  const existingIndex = cart.findIndex(
    c =>
      c.zeltyId === item.zeltyId &&
      JSON.stringify(c.selectedModifiers) === JSON.stringify(selectedModifiers)
  );

  if (existingIndex >= 0) {
    const updated = [...cart];
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: updated[existingIndex].quantity + quantity,
    };
    return updated;
  }

  return [
    ...cart,
    {
      zeltyId: item.zeltyId || item.id,
      name: item.name,
      price: item.price,
      quantity,
      selectedModifiers,
      note: '',
    },
  ];
}

function removeFromCart(cart, index) {
  return cart.filter((_, i) => i !== index);
}

function updateCartItem(cart, index, updates) {
  return cart.map((item, i) => (i === index ? { ...item, ...updates } : item));
}

module.exports = {
  createOrderFromCart,
  createPaymentSession,
  confirmOrder,
  cancelOrder,
  updateOrderStatus,
  calculateSubtotal,
  addToCart,
  removeFromCart,
  updateCartItem,
};
