'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, Clock, CheckCircle, XCircle, Banknote } from 'lucide-react';
import { getAnalytics, formatPrice } from '../../lib/api';
import { useOrders } from '../../hooks/useOrders';
import OrderCard from '../../components/dashboard/OrderCard';

type Period = '24h' | '7d' | '30d';

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('7d');
  const [stats, setStats] = useState<any>(null);
  const { activeOrders, loading } = useOrders();

  useEffect(() => {
    getAnalytics(period)
      .then(data => setStats(data.stats))
      .catch(console.error);
  }, [period]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-sm text-gray-500 mt-0.5">Tableau de bord en temps réel</p>
        </div>
        <div className="flex gap-2">
          {(['24h', '7d', '30d'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                period === p
                  ? 'bg-green-500 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Commandes"
            value={stats.totalOrders}
            Icon={ShoppingBag}
            color="blue"
          />
          <StatCard
            label="Chiffre d'affaires"
            value={formatPrice(stats.totalRevenue)}
            Icon={Banknote}
            color="green"
          />
          <StatCard
            label="Panier moyen"
            value={formatPrice(stats.averageOrderValue)}
            Icon={TrendingUp}
            color="purple"
          />
          <StatCard
            label="Livraisons"
            value={stats.byType?.delivery || 0}
            Icon={Clock}
            color="orange"
          />
        </div>
      )}

      {/* Active Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Commandes actives
            {activeOrders.length > 0 && (
              <span className="ml-2 badge bg-green-100 text-green-700">
                {activeOrders.length}
              </span>
            )}
          </h2>
          <a href="/dashboard/orders" className="text-sm text-green-600 hover:underline">
            Voir tout →
          </a>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card h-40 animate-pulse bg-gray-100" />
            ))}
          </div>
        ) : activeOrders.length === 0 ? (
          <div className="card text-center py-12">
            <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune commande active</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {activeOrders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  Icon,
  color,
}: {
  label: string;
  value: string | number;
  Icon: any;
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
  return (
    <div className="card">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}
