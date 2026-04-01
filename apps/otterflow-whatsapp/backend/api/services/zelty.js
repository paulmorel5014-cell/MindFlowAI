const axios = require('axios');
const db = require('./database');

const zeltyClient = axios.create({
  baseURL: process.env.ZELTY_API_URL || 'https://api.zelty.fr/2.7',
  headers: {
    Authorization: `Bearer ${process.env.ZELTY_API_KEY}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// ─── Menu ─────────────────────────────────────────────────────

async function getMenu(restaurantId, zeltyRestaurantId) {
  // Check cache first
  const cached = await db.getCachedMenu(restaurantId);
  if (cached) return cached;

  const response = await zeltyClient.get(`/restaurants/${zeltyRestaurantId}/catalog`);
  const menu = normalizeMenu(response.data);

  await db.setCachedMenu(restaurantId, menu);
  return menu;
}

function normalizeMenu(rawMenu) {
  const categories = [];

  for (const category of rawMenu.categories || []) {
    const normalizedCategory = {
      id: category.id,
      name: category.name,
      description: category.description || '',
      position: category.position || 0,
      items: [],
    };

    for (const dish of category.dishes || []) {
      normalizedCategory.items.push(normalizeDish(dish));
    }

    if (normalizedCategory.items.length > 0) {
      categories.push(normalizedCategory);
    }
  }

  return {
    id: rawMenu.id,
    name: rawMenu.name,
    categories: categories.sort((a, b) => a.position - b.position),
    updatedAt: new Date().toISOString(),
  };
}

function normalizeDish(dish) {
  return {
    id: dish.id,
    zeltyId: dish.id,
    name: dish.name,
    description: dish.description || '',
    price: dish.price, // in cents
    category: dish.category_id,
    tags: dish.tags || [],
    allergens: dish.allergens || [],
    imageUrl: dish.picture || null,
    available: dish.available !== false,
    modifiers: normalizeModifiers(dish.options || []),
  };
}

function normalizeModifiers(options) {
  return options.map(option => ({
    id: option.id,
    name: option.name,
    type: option.max_choices === 1 ? 'single' : 'multiple',
    required: option.min_choices > 0,
    minChoices: option.min_choices || 0,
    maxChoices: option.max_choices || null,
    choices: (option.items || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price || 0, // additional price in cents
    })),
  }));
}

// ─── Orders ──────────────────────────────────────────────────

async function createZeltyOrder(zeltyRestaurantId, orderData) {
  const payload = {
    restaurant_id: zeltyRestaurantId,
    type: mapOrderType(orderData.orderType),
    items: orderData.items.map(item => ({
      dish_id: item.zeltyId,
      quantity: item.quantity,
      options: (item.selectedModifiers || []).flatMap(mod =>
        mod.selectedChoices.map(choice => ({ item_id: choice.id }))
      ),
      note: item.note || '',
    })),
    customer: {
      name: orderData.customerName || 'Client WhatsApp',
      phone: orderData.whatsappNumber,
      email: orderData.customerEmail || '',
    },
    delivery_address: orderData.deliveryAddress || null,
    note: orderData.notes || '',
    source: 'whatsapp',
  };

  const response = await zeltyClient.post('/orders', payload);
  return response.data;
}

function mapOrderType(type) {
  const mapping = {
    delivery: 'delivery',
    takeaway: 'takeaway',
    dine_in: 'on_site',
  };
  return mapping[type] || 'takeaway';
}

async function updateZeltyOrderStatus(zeltyOrderId, status) {
  const zeltyStatus = mapStatusToZelty(status);
  const response = await zeltyClient.patch(`/orders/${zeltyOrderId}`, {
    status: zeltyStatus,
  });
  return response.data;
}

function mapStatusToZelty(status) {
  const mapping = {
    confirmed: 'accepted',
    preparing: 'in_progress',
    ready: 'ready',
    delivering: 'delivered',
    delivered: 'completed',
    cancelled: 'cancelled',
  };
  return mapping[status] || status;
}

// ─── Restaurant Info ──────────────────────────────────────────

async function getRestaurantInfo(zeltyRestaurantId) {
  const response = await zeltyClient.get(`/restaurants/${zeltyRestaurantId}`);
  return response.data;
}

async function checkRestaurantOpen(zeltyRestaurantId) {
  const info = await getRestaurantInfo(zeltyRestaurantId);
  return info.is_open === true;
}

module.exports = {
  getMenu,
  normalizeMenu,
  createZeltyOrder,
  updateZeltyOrderStatus,
  getRestaurantInfo,
  checkRestaurantOpen,
};
