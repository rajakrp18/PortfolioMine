// src/pages/buyer/ProductCatalog.js
// Displays products with role-based pricing, category filter, search, add to cart

import React, { useEffect, useState, useCallback } from 'react';
import { ShoppingCart, Search, Plus, Minus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { PageHeader, Spinner, Badge, currency, Input, Empty } from '../../components/UI';

const CATEGORY_ICONS = { Milk:'🥛', Ghee:'🫙', Paneer:'🧀', Yogurt:'🍦',
                          Butter:'🧈', Cream:'🥣', 'Ice Cream':'🍨', Cheese:'🧀' };

const ProductCatalog = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [search,   setSearch]     = useState('');
  const [catFilter,setCatFilter]  = useState('');
  const { items, addItem, updateQty, removeItem } = useCart();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search)    params.append('search',      search);
      if (catFilter) params.append('category_id', catFilter);
      const { data } = await api.get(`/products?${params}`);
      setProducts(data);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [search, catFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.get('/products').then(r => {
      // Extract unique categories
      const cats = [...new Map(
        r.data.map(p => [p.category, { name: p.category }])
      ).values()];
      setCategories(cats);
    }).catch(() => {});
  }, []);

  const cartQty = (id) => items.find(i => i.id === id)?.quantity || 0;

  const handleAdd = (product) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div>
      <PageHeader title="Product Catalog"
                  subtitle="Browse and order dairy products" />

      {/* Search + filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-2 text-sm
                       focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCatFilter('')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                         ${!catFilter ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            All
          </button>
          {categories.map(c => (
            <button key={c.name}
                    onClick={() => setCatFilter(c.name)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                                 ${catFilter === c.name ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
              {CATEGORY_ICONS[c.name] || '📦'} {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {loading ? <Spinner /> : products.length === 0
        ? <Empty title="No products found" />
        : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(p => {
              const qty = cartQty(p.id);
              const outOfStock = parseFloat(p.stock) < 1;

              return (
                <div key={p.id}
                     className="bg-white rounded-2xl border border-gray-200 shadow-sm
                                overflow-hidden hover:shadow-md transition-shadow">
                  {/* Product image / icon */}
                  <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-100
                                  flex items-center justify-center text-5xl">
                    {CATEGORY_ICONS[p.category] || '📦'}
                  </div>

                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-800 leading-tight">{p.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.category} · per {p.unit}</p>

                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <p className="text-lg font-bold text-emerald-700">{currency(p.price)}</p>
                        {p.mrp !== p.price && (
                          <p className="text-xs text-gray-400 line-through">MRP {currency(p.mrp)}</p>
                        )}
                      </div>
                      {outOfStock
                        ? <Badge text="Out of stock" status="cancelled" />
                        : <p className="text-xs text-gray-400">{parseFloat(p.stock).toFixed(0)} left</p>
                      }
                    </div>

                    {/* Cart controls */}
                    <div className="mt-3">
                      {qty === 0
                        ? (
                          <button
                            disabled={outOfStock}
                            onClick={() => handleAdd(p)}
                            className="w-full flex items-center justify-center gap-1.5
                                       bg-emerald-600 hover:bg-emerald-700 text-white
                                       text-xs font-semibold py-2 rounded-xl transition-colors
                                       disabled:opacity-40 disabled:cursor-not-allowed">
                            <ShoppingCart size={13} /> Add to Cart
                          </button>
                        )
                        : (
                          <div className="flex items-center justify-between bg-emerald-50
                                           rounded-xl px-2 py-1">
                            <button onClick={() => updateQty(p.id, qty - 1)}
                                    className="w-7 h-7 rounded-lg bg-white border border-gray-200
                                               flex items-center justify-center hover:bg-gray-50">
                              <Minus size={12} />
                            </button>
                            <span className="font-bold text-sm text-emerald-700">{qty}</span>
                            <button onClick={() => addItem(p, 1)}
                                    className="w-7 h-7 rounded-lg bg-emerald-600 text-white
                                               flex items-center justify-center hover:bg-emerald-700">
                              <Plus size={12} />
                            </button>
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};

export default ProductCatalog;
