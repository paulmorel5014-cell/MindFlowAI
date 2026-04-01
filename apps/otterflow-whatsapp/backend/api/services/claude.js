const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── Parse Order Intent ───────────────────────────────────────

async function parseOrderIntent(message, menuContext) {
  const menuSummary = menuContext.categories
    .map(cat => `${cat.name}: ${cat.items.map(i => i.name).join(', ')}`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: `Tu es un assistant pour un restaurant. Analyse les messages des clients et identifie leur intention.
Menu disponible:
${menuSummary}

Réponds UNIQUEMENT avec un JSON valide, sans markdown:
{
  "intent": "order|menu|cart|help|cancel|confirm|other",
  "items": [{"name": "...", "quantity": 1}],
  "message": "message court pour guider le client"
}`,
    messages: [{ role: 'user', content: message }],
  });

  try {
    return JSON.parse(response.content[0].text);
  } catch {
    return { intent: 'other', items: [], message: '' };
  }
}

// ─── Match Menu Item ──────────────────────────────────────────

async function matchMenuItems(userInput, menuItems) {
  const itemsList = menuItems
    .map(item => `id:${item.id} name:"${item.name}" price:${item.price / 100}€`)
    .join('\n');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: `Associe la demande du client aux articles du menu. Réponds UNIQUEMENT avec un JSON:
{"matches": [{"id": "...", "confidence": 0.9}]}
Si aucun match, retourne {"matches": []}`,
    messages: [
      {
        role: 'user',
        content: `Demande: "${userInput}"\nMenu:\n${itemsList}`,
      },
    ],
  });

  try {
    const result = JSON.parse(response.content[0].text);
    return result.matches || [];
  } catch {
    return [];
  }
}

// ─── Parse Address ────────────────────────────────────────────

async function parseDeliveryAddress(message) {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    system: `Extrait l'adresse de livraison du message. Réponds UNIQUEMENT avec un JSON:
{
  "street": "...",
  "city": "...",
  "postal_code": "...",
  "floor": "...",
  "notes": "..."
}
Si aucune adresse détectée, retourne {"street": null}`,
    messages: [{ role: 'user', content: message }],
  });

  try {
    return JSON.parse(response.content[0].text);
  } catch {
    return { street: null };
  }
}

// ─── Generate Response ────────────────────────────────────────

async function generateCustomerResponse(context) {
  const { state, userMessage, restaurantName } = context;

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 200,
    system: `Tu es l'assistant WhatsApp de ${restaurantName}.
Sois amical, concis et en français.
État actuel: ${state}`,
    messages: [{ role: 'user', content: userMessage }],
  });

  return response.content[0].text;
}

module.exports = {
  parseOrderIntent,
  matchMenuItems,
  parseDeliveryAddress,
  generateCustomerResponse,
};
