const express = require('express');
const router = express.Router();
const db = require('../services/database');
const orderHandler = require('../handlers/orders');
const menuHandler = require('../handlers/menu');
const printing = require('../handlers/printing');

// ─── Auth middleware for restaurant API ───────────────────────
function requireAuth(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.RESTAURANT_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Orders ──────────────────────────────────────────────────

router.get('/orders', requireAuth, async (req, res) => {
  try {
    const { restaurantId, status, date, limit } = req.query;
    const id = restaurantId || (await db.getDefaultRestaurant()).id;
    const orders = await db.getRestaurantOrders(id, {
      status,
      date,
      limit: parseInt(limit) || 50,
    });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await db.getOrder(req.params.id);
    res.json({ order });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.patch('/orders/:id/status', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await orderHandler.updateOrderStatus(req.params.id, status);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { reason, refund } = req.body;
    const order = await orderHandler.cancelOrder(req.params.id, reason, refund);
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/orders/:id/print', requireAuth, async (req, res) => {
  try {
    const order = await db.getOrder(req.params.id);
    const restaurant = await db.getRestaurant(order.restaurant_id);
    await printing.printOrder(order, restaurant);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Menu ─────────────────────────────────────────────────────

router.get('/menu', requireAuth, async (req, res) => {
  try {
    const restaurant = await db.getDefaultRestaurant();
    const menu = await menuHandler.getMenu(restaurant.id);
    res.json({ menu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/menu/refresh', requireAuth, async (req, res) => {
  try {
    const restaurant = await db.getDefaultRestaurant();
    const menu = await menuHandler.refreshMenu(restaurant.id);
    res.json({ menu, message: 'Menu cache refreshed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Restaurant Settings ──────────────────────────────────────

router.get('/settings', requireAuth, async (req, res) => {
  try {
    const restaurant = await db.getDefaultRestaurant();
    res.json({ restaurant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/settings', requireAuth, async (req, res) => {
  try {
    const restaurant = await db.getDefaultRestaurant();
    const allowed = [
      'accepts_orders', 'delivery_fee', 'min_order_amount',
      'delivery_radius_km', 'opening_hours', 'is_active',
    ];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const { data, error } = await db.supabase
      .from('restaurants')
      .update(updates)
      .eq('id', restaurant.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ restaurant: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Analytics ────────────────────────────────────────────────

router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const restaurant = await db.getDefaultRestaurant();
    const { period = '7d' } = req.query;

    const startDate = getStartDate(period);

    const { data: orders } = await db.supabase
      .from('orders')
      .select('id, total, status, order_type, created_at')
      .eq('restaurant_id', restaurant.id)
      .gte('created_at', startDate.toISOString())
      .neq('status', 'cancelled');

    const stats = {
      totalOrders: orders?.length || 0,
      totalRevenue: orders?.reduce((sum, o) => sum + o.total, 0) || 0,
      averageOrderValue: orders?.length
        ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / orders.length)
        : 0,
      byType: {
        delivery: orders?.filter(o => o.order_type === 'delivery').length || 0,
        takeaway: orders?.filter(o => o.order_type === 'takeaway').length || 0,
        dine_in: orders?.filter(o => o.order_type === 'dine_in').length || 0,
      },
    };

    res.json({ stats, period });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function getStartDate(period) {
  const now = new Date();
  switch (period) {
    case '24h': return new Date(now - 24 * 60 * 60 * 1000);
    case '7d': return new Date(now - 7 * 24 * 60 * 60 * 1000);
    case '30d': return new Date(now - 30 * 24 * 60 * 60 * 1000);
    default: return new Date(now - 7 * 24 * 60 * 60 * 1000);
  }
}

module.exports = router;
