// src/context/CartContext.js
// Global shopping cart — stored in localStorage, role-aware pricing is set by API

import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dairy_cart') || '[]');
    } catch { return []; }
  });

  // Sync to localStorage on every change
  useEffect(() => {
    localStorage.setItem('dairy_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const removeItem = (productId) =>
    setItems(prev => prev.filter(i => i.id !== productId));

  const updateQty = (productId, qty) => {
    if (qty <= 0) return removeItem(productId);
    setItems(prev =>
      prev.map(i => i.id === productId ? { ...i, quantity: qty } : i)
    );
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
