'use client';

import { useEffect, useState } from 'react';
import { Save, RefreshCw, Power, Store } from 'lucide-react';
import { getSettings, updateSettings, refreshMenu } from '../../../lib/api';
import type { Restaurant } from '../../../lib/supabase';

export default function SettingsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings()
      .then(data => setRestaurant(data.restaurant))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    try {
      const data = await updateSettings({
        accepts_orders: restaurant.accepts_orders,
        delivery_fee: restaurant.delivery_fee,
        min_order_amount: restaurant.min_order_amount,
        delivery_radius_km: restaurant.delivery_radius_km,
      } as any);
      setRestaurant(data.restaurant);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRefreshMenu = async () => {
    setRefreshing(true);
    try {
      await refreshMenu();
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-2xl space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-16 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurant) return null;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saved ? 'Sauvegardé !' : saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Status */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Power className="w-4 h-4" />
            Statut du restaurant
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">
                {restaurant.accepts_orders ? '✅ Ouvert — Accepte les commandes' : '🔒 Fermé — Commandes suspendues'}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                {restaurant.accepts_orders
                  ? 'Les clients peuvent commander via WhatsApp'
                  : 'Les nouvelles commandes sont bloquées'}
              </p>
            </div>
            <button
              onClick={() => setRestaurant(r => r ? { ...r, accepts_orders: !r.accepts_orders } : r)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                restaurant.accepts_orders ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  restaurant.accepts_orders ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Store className="w-4 h-4" />
            Informations
          </h2>
          <div className="space-y-3 text-sm">
            <InfoRow label="Nom" value={restaurant.name} />
            <InfoRow label="Adresse" value={`${restaurant.address}, ${restaurant.city}`} />
            <InfoRow label="Téléphone" value={restaurant.phone || '—'} />
          </div>
        </div>

        {/* Pricing */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Tarification</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Frais de livraison (€)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={(restaurant.delivery_fee / 100).toFixed(2)}
                onChange={e =>
                  setRestaurant(r => r ? { ...r, delivery_fee: Math.round(parseFloat(e.target.value) * 100) } : r)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Commande minimum (€)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={(restaurant.min_order_amount / 100).toFixed(2)}
                onChange={e =>
                  setRestaurant(r => r ? { ...r, min_order_amount: Math.round(parseFloat(e.target.value) * 100) } : r)
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Menu Zelty</h2>
          <p className="text-sm text-gray-500 mb-4">
            Le menu est synchronisé automatiquement depuis Zelty et mis en cache pendant 1 heure.
            Cliquez pour forcer la mise à jour.
          </p>
          <button
            onClick={handleRefreshMenu}
            disabled={refreshing}
            className="btn-secondary flex items-center gap-2 text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Actualisation...' : 'Actualiser le menu'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
