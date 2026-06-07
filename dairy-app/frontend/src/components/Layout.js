// src/components/Layout.js
// Shared shell: sidebar + topbar + outlet for page content
// Sidebar links change based on the logged-in user's role

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Milk, Package, ShoppingCart, Truck,
  Users, BarChart3, LogOut, Menu, X, Bell, ChevronDown,
  Boxes, Tractor, CreditCard, ClipboardList, Store
} from 'lucide-react';

// ── Nav config per role ───────────────────────────────────────
const NAV = {
  admin: [
    { to: '/admin',             icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/admin/collections', icon: Milk,            label: 'Collections' },
    { to: '/admin/farmers',     icon: Tractor,         label: 'Farmers'     },
    { to: '/admin/products',    icon: Package,         label: 'Products'    },
    { to: '/admin/inventory',   icon: Boxes,           label: 'Inventory'   },
    { to: '/admin/orders',      icon: ClipboardList,   label: 'Orders'      },
    { to: '/admin/deliveries',  icon: Truck,           label: 'Deliveries'  },
    { to: '/admin/users',       icon: Users,           label: 'Users'       },
    { to: '/admin/analytics',   icon: BarChart3,       label: 'Analytics'   },
  ],
  farmer: [
    { to: '/farmer',             icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/farmer/collections', icon: Milk,            label: 'My Milk'     },
    { to: '/farmer/payments',    icon: CreditCard,      label: 'Payments'    },
  ],
  wholesaler: [
    { to: '/shop',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/shop/products', icon: Store,           label: 'Catalog'   },
    { to: '/shop/cart',     icon: ShoppingCart,    label: 'Cart'      },
    { to: '/shop/orders',   icon: ClipboardList,   label: 'My Orders' },
  ],
  retailer: [
    { to: '/shop',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/shop/products', icon: Store,           label: 'Catalog'   },
    { to: '/shop/cart',     icon: ShoppingCart,    label: 'Cart'      },
    { to: '/shop/orders',   icon: ClipboardList,   label: 'My Orders' },
  ],
  consumer: [
    { to: '/shop',          icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/shop/products', icon: Store,           label: 'Products'  },
    { to: '/shop/cart',     icon: ShoppingCart,    label: 'Cart'      },
    { to: '/shop/orders',   icon: ClipboardList,   label: 'My Orders' },
  ],
  delivery_agent: [
    { to: '/agent',            icon: LayoutDashboard, label: 'Dashboard'   },
    { to: '/agent/deliveries', icon: Truck,           label: 'Deliveries'  },
  ],
};

// ── Role badge colour ──────────────────────────────────────────
const ROLE_COLOR = {
  admin:          'bg-purple-100 text-purple-700',
  farmer:         'bg-green-100  text-green-700',
  wholesaler:     'bg-blue-100   text-blue-700',
  retailer:       'bg-orange-100 text-orange-700',
  consumer:       'bg-teal-100   text-teal-700',
  delivery_agent: 'bg-yellow-100 text-yellow-700',
};

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate          = useNavigate();
  const [sideOpen, setSideOpen] = useState(true);

  const links = NAV[user?.role] || [];

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className={`${sideOpen ? 'w-60' : 'w-16'} flex-shrink-0
                    bg-white border-r border-gray-200 flex flex-col
                    transition-all duration-300 z-20`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center
                          justify-center text-white font-bold text-sm flex-shrink-0">
            🥛
          </div>
          {sideOpen && (
            <div>
              <p className="font-bold text-gray-800 text-sm leading-tight">DairyFresh</p>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5
                 text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-emerald-50 text-emerald-700'
                   : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                 }`
              }
            >
              <Icon size={18} className="flex-shrink-0" />
              {sideOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User card at bottom */}
        {sideOpen && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center
                              justify-center text-emerald-700 font-bold text-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 truncate">{user?.name}</p>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                                  ${ROLE_COLOR[user?.role]}`}>
                  {user?.role?.replace('_',' ')}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs text-red-500
                         hover:text-red-700 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN AREA ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 flex items-center
                           justify-between px-6 py-3 flex-shrink-0">
          <button
            onClick={() => setSideOpen(!sideOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            {sideOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500
                               rounded-full border-2 border-white" />
            </button>
            <div className="text-sm text-gray-600">
              Welcome, <span className="font-semibold text-gray-900">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
