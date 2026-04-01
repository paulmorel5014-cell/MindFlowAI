const net = require('net');

// Star Micronics ESC/POS printing over TCP
const PRINTER_HOST = () => process.env.STAR_PRINTER_HOST;
const PRINTER_PORT = () => parseInt(process.env.STAR_PRINTER_PORT || '9100');

// ESC/POS Commands
const ESC = '\x1b';
const GS = '\x1d';
const INIT = `${ESC}@`;
const BOLD_ON = `${ESC}E\x01`;
const BOLD_OFF = `${ESC}E\x00`;
const ALIGN_CENTER = `${ESC}a\x01`;
const ALIGN_LEFT = `${ESC}a\x00`;
const ALIGN_RIGHT = `${ESC}a\x02`;
const FONT_LARGE = `${GS}!\x11`;
const FONT_NORMAL = `${GS}!\x00`;
const LINE_FEED = '\n';
const CUT = `${GS}V\x41\x03`;
const DIVIDER = '--------------------------------\n';

// ─── Print Order ──────────────────────────────────────────────

async function printOrder(order, restaurant) {
  if (!PRINTER_HOST()) {
    console.log('Printer not configured, skipping print');
    return false;
  }

  const receipt = buildOrderReceipt(order, restaurant);
  await sendToPrinter(receipt);

  // Mark as printed
  await require('../services/database').supabase
    .from('orders')
    .update({ printed_at: new Date().toISOString() })
    .eq('id', order.id);

  return true;
}

function buildOrderReceipt(order, restaurant) {
  const now = new Date();
  const timeStr = now.toLocaleString('fr-FR', {
    timeZone: restaurant.timezone || 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  let receipt = INIT;

  // Header
  receipt += ALIGN_CENTER;
  receipt += BOLD_ON + FONT_LARGE;
  receipt += `${restaurant.name || 'RESTAURANT'}\n`;
  receipt += FONT_NORMAL + BOLD_OFF;
  receipt += `${timeStr}\n`;
  receipt += DIVIDER;

  // Order info
  receipt += BOLD_ON;
  receipt += `COMMANDE: ${order.order_number}\n`;
  receipt += BOLD_OFF;
  receipt += ALIGN_LEFT;

  const typeLabel = {
    delivery: '🚚 LIVRAISON',
    takeaway: '🏃 A EMPORTER',
    dine_in: '🍽️ SUR PLACE',
  };
  receipt += `Type: ${typeLabel[order.order_type] || order.order_type}\n`;

  if (order.customer?.whatsapp_number) {
    receipt += `Client: ${order.customer.whatsapp_number}\n`;
  }
  if (order.customer?.display_name) {
    receipt += `Nom: ${order.customer.display_name}\n`;
  }

  receipt += DIVIDER;

  // Items
  receipt += BOLD_ON + 'ARTICLES\n' + BOLD_OFF;
  receipt += LINE_FEED;

  for (const item of order.items) {
    receipt += BOLD_ON;
    receipt += `${item.quantity}x ${item.name}`;
    receipt += BOLD_OFF;
    receipt += `  ${formatPrice(item.price * item.quantity)}\n`;

    // Modifiers
    if (item.selectedModifiers?.length > 0) {
      item.selectedModifiers.forEach(mod => {
        mod.selectedChoices.forEach(choice => {
          receipt += `  + ${choice.name}`;
          if (choice.price > 0) receipt += ` (+${formatPrice(choice.price)})`;
          receipt += '\n';
        });
      });
    }

    if (item.note) {
      receipt += `  Note: ${item.note}\n`;
    }
  }

  receipt += LINE_FEED + DIVIDER;

  // Totals
  receipt += ALIGN_RIGHT;
  receipt += `Sous-total: ${formatPrice(order.subtotal)}\n`;

  if (order.delivery_fee > 0) {
    receipt += `Livraison: ${formatPrice(order.delivery_fee)}\n`;
  }

  if (order.discount_amount > 0) {
    receipt += `Remise: -${formatPrice(order.discount_amount)}\n`;
  }

  receipt += BOLD_ON + FONT_LARGE;
  receipt += `TOTAL: ${formatPrice(order.total)}\n`;
  receipt += FONT_NORMAL + BOLD_OFF;

  receipt += LINE_FEED;
  receipt += `Paiement: ${order.payment_status === 'paid' ? 'PAYE' : 'EN ATTENTE'}\n`;

  // Delivery address
  if (order.order_type === 'delivery' && order.delivery_address) {
    receipt += ALIGN_LEFT + DIVIDER;
    receipt += BOLD_ON + 'ADRESSE DE LIVRAISON\n' + BOLD_OFF;
    const addr = order.delivery_address;
    if (addr.street) receipt += `${addr.street}\n`;
    if (addr.floor) receipt += `Etage/Digicode: ${addr.floor}\n`;
    if (addr.postal_code || addr.city) {
      receipt += `${addr.postal_code || ''} ${addr.city || ''}\n`.trim() + '\n';
    }
    if (addr.notes) receipt += `Note: ${addr.notes}\n`;
  }

  // Notes
  if (order.customer_notes) {
    receipt += ALIGN_LEFT + DIVIDER;
    receipt += BOLD_ON + 'NOTES CLIENT\n' + BOLD_OFF;
    receipt += `${order.customer_notes}\n`;
  }

  // Footer
  receipt += ALIGN_CENTER + LINE_FEED;
  receipt += DIVIDER;
  receipt += 'Merci pour votre commande !\n';
  receipt += LINE_FEED + LINE_FEED + LINE_FEED;
  receipt += CUT;

  return receipt;
}

// ─── TCP Printer Communication ────────────────────────────────

function sendToPrinter(data) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    const timeout = setTimeout(() => {
      client.destroy();
      reject(new Error('Printer connection timeout'));
    }, 5000);

    client.connect(PRINTER_PORT(), PRINTER_HOST(), () => {
      client.write(Buffer.from(data, 'binary'), () => {
        clearTimeout(timeout);
        client.destroy();
        resolve();
      });
    });

    client.on('error', err => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function formatPrice(cents) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

module.exports = { printOrder, buildOrderReceipt };
