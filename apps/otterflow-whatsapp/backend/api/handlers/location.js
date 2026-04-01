const axios = require('axios');

const mapboxClient = axios.create({
  baseURL: 'https://api.mapbox.com',
  timeout: 8000,
});

const TOKEN = () => process.env.MAPBOX_ACCESS_TOKEN;

// ─── Geocoding ────────────────────────────────────────────────

async function geocodeAddress(address, city = '') {
  const query = encodeURIComponent(`${address}, ${city}, France`);

  const response = await mapboxClient.get(
    `/geocoding/v5/mapbox.places/${query}.json`,
    {
      params: {
        access_token: TOKEN(),
        country: 'fr',
        types: 'address',
        limit: 1,
      },
    }
  );

  const features = response.data.features;
  if (!features || features.length === 0) return null;

  const feature = features[0];
  const [lng, lat] = feature.center;

  return {
    latitude: lat,
    longitude: lng,
    formattedAddress: feature.place_name,
    street: feature.text,
    city: getContextValue(feature.context, 'place'),
    postalCode: getContextValue(feature.context, 'postcode'),
    country: getContextValue(feature.context, 'country'),
  };
}

// ─── Distance Calculation ─────────────────────────────────────

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

async function isInDeliveryZone(deliveryLat, deliveryLon, restaurant) {
  if (!restaurant.latitude || !restaurant.longitude) return true;

  const distance = calculateDistance(
    restaurant.latitude,
    restaurant.longitude,
    deliveryLat,
    deliveryLon
  );

  return distance <= (restaurant.delivery_radius_km || 5.0);
}

// ─── Directions ───────────────────────────────────────────────

async function getDeliveryTime(fromLat, fromLon, toLat, toLon) {
  try {
    const response = await mapboxClient.get(
      `/directions/v5/mapbox/driving/${fromLon},${fromLat};${toLon},${toLat}`,
      {
        params: {
          access_token: TOKEN(),
          overview: false,
        },
      }
    );

    const route = response.data.routes?.[0];
    if (!route) return null;

    return {
      distanceKm: Math.round(route.distance / 100) / 10,
      durationMinutes: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}

// ─── Address Validation ───────────────────────────────────────

async function validateAndFormatAddress(rawAddress, restaurant) {
  const geocoded = await geocodeAddress(rawAddress);

  if (!geocoded) {
    return {
      valid: false,
      error: "Adresse introuvable. Merci de préciser l'adresse complète.",
    };
  }

  const inZone = await isInDeliveryZone(
    geocoded.latitude,
    geocoded.longitude,
    restaurant
  );

  if (!inZone) {
    const maxKm = restaurant.delivery_radius_km || 5;
    return {
      valid: false,
      error: `Désolé, nous ne livrons pas à cette adresse (rayon max: ${maxKm}km).`,
    };
  }

  return {
    valid: true,
    address: geocoded,
  };
}

// ─── Helpers ──────────────────────────────────────────────────

function getContextValue(context, type) {
  const item = context?.find(c => c.id.startsWith(type));
  return item?.text || '';
}

module.exports = {
  geocodeAddress,
  calculateDistance,
  isInDeliveryZone,
  getDeliveryTime,
  validateAndFormatAddress,
};
