'use client';

import { useEffect, useState } from 'react';
import { Search, ShoppingCart, ChevronRight, MessageCircle } from 'lucide-react';
import { getMenu, formatPrice } from '../../lib/api';
import type { Menu, MenuCategory, MenuItem } from '../../lib/supabase';

export default function CatalogPage() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenu()
      .then(data => {
        setMenu(data.menu);
        if (data.menu.categories.length > 0) {
          setSelectedCategory(data.menu.categories[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = selectedCategory?.items.filter(item => {
    if (!search) return item.available;
    return (
      item.available &&
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()))
    );
  }) ?? [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Chargement du menu...</p>
        </div>
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Menu indisponible</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900">{menu.name || 'Notre Menu'}</h1>
          <div className="flex-1 max-w-xs">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <a
            href="https://wa.me/33XXXXXXXXX?text=Bonjour%20je%20souhaite%20commander"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            Commander sur WhatsApp
          </a>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
        {/* Sidebar - Categories */}
        <aside className="w-52 flex-shrink-0">
          <div className="card p-2">
            <nav className="space-y-1">
              {menu.categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat); setSearch(''); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                    selectedCategory?.id === cat.id
                      ? 'bg-green-50 text-green-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400">
                    {cat.items.filter(i => i.available).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main - Items */}
        <main className="flex-1">
          {selectedCategory && (
            <>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedCategory.name}
                {selectedCategory.description && (
                  <span className="text-sm text-gray-500 font-normal ml-2">
                    {selectedCategory.description}
                  </span>
                )}
              </h2>

              {filteredItems.length === 0 ? (
                <p className="text-gray-500 text-center py-12">
                  {search ? 'Aucun résultat' : 'Aucun article disponible'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

function MenuItemCard({ item, onClick }: { item: MenuItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="card hover:shadow-md transition-all text-left group cursor-pointer p-0 overflow-hidden"
    >
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="text-green-600 font-bold">{formatPrice(item.price)}</span>
          {item.modifiers?.length > 0 && (
            <span className="text-xs text-gray-400">Options dispo.</span>
          )}
        </div>
        {item.allergens?.length > 0 && (
          <div className="mt-2 text-xs text-amber-600">
            ⚠️ {item.allergens.join(', ')}
          </div>
        )}
      </div>
    </button>
  );
}

function ItemModal({ item, onClose }: { item: MenuItem; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
        )}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatPrice(item.price)}</p>
          {item.description && (
            <p className="text-gray-600 mt-3">{item.description}</p>
          )}
          {item.allergens?.length > 0 && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
              <strong>Allergènes:</strong> {item.allergens.join(', ')}
            </div>
          )}
          {item.modifiers?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Options disponibles:</h4>
              {item.modifiers.map(mod => (
                <div key={mod.id} className="text-sm text-gray-600 mb-1">
                  • <strong>{mod.name}</strong>{mod.required ? ' (obligatoire)' : ''}
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">Fermer</button>
            <a
              href={`https://wa.me/33XXXXXXXXX?text=Je%20souhaite%20commander%20${encodeURIComponent(item.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Commander sur WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
