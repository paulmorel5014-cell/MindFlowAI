const zelty = require('../services/zelty');
const db = require('../services/database');

// ─── Get Menu ─────────────────────────────────────────────────

async function getMenu(restaurantId) {
  const restaurant = await db.getRestaurant(restaurantId);
  if (!restaurant.zelty_restaurant_id) {
    throw new Error('Restaurant not connected to Zelty');
  }
  return zelty.getMenu(restaurantId, restaurant.zelty_restaurant_id);
}

async function refreshMenu(restaurantId) {
  // Invalidate cache by deleting it, then re-fetch
  await db.supabase
    .from('menu_cache')
    .delete()
    .eq('restaurant_id', restaurantId);

  return getMenu(restaurantId);
}

// ─── Find Item ────────────────────────────────────────────────

function findItemById(menu, itemId) {
  for (const category of menu.categories) {
    const item = category.items.find(
      i => i.id === itemId || i.zeltyId === itemId
    );
    if (item) return item;
  }
  return null;
}

function findItemByIndex(menu, categoryIndex, itemIndex) {
  const category = menu.categories[categoryIndex];
  if (!category) return null;

  const availableItems = category.items.filter(i => i.available);
  return availableItems[itemIndex] || null;
}

function getCategoryByIndex(menu, index) {
  return menu.categories[index] || null;
}

// ─── Search ───────────────────────────────────────────────────

function searchMenu(menu, query) {
  const q = query.toLowerCase();
  const results = [];

  for (const category of menu.categories) {
    for (const item of category.items) {
      if (!item.available) continue;
      if (
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      ) {
        results.push({ ...item, categoryName: category.name });
      }
    }
  }

  return results;
}

// ─── Format for WhatsApp ──────────────────────────────────────

function formatMenuText(menu) {
  let text = `🍽️ *${menu.name || 'Notre Menu'}*\n\n`;

  menu.categories.forEach((cat, i) => {
    text += `*${i + 1}. ${cat.name}*\n`;
    cat.items.filter(item => item.available).forEach(item => {
      text += `   • ${item.name} — ${formatPrice(item.price)}\n`;
    });
    text += '\n';
  });

  return text;
}

function formatPrice(cents) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

module.exports = {
  getMenu,
  refreshMenu,
  findItemById,
  findItemByIndex,
  getCategoryByIndex,
  searchMenu,
  formatMenuText,
};
