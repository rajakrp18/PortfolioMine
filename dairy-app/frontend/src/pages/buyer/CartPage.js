// src/pages/buyer/CartPage.js
// Shopping cart review + checkout form + place order

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  PageHeader, Card, CardHeader, CardBody, Button, Input,
  Select, currency, Empty
} from '../../components/UI';

const CartPage = () => {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy,  setBusy]  = useState(false);
  const [form,  setForm]  = useState({
    delivery_address: user?.address || '',
    delivery_date: '',
    payment_method: 'cod',
    notes: '',
  });
  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const tax   = parseFloat((total * 0.05).toFixed(2));
  const grand = parseFloat((total + tax).toFixed(2));

  const handleOrder = async () => {
    if (!items.length) return toast.error('Cart is empty');
    if (!form.delivery_address) return toast.error('Enter delivery address');
    setBusy(true);
    try {
      await api.post('/orders', {
        ...form,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
      });
      clearCart();
      toast.success('🎉 Order placed successfully!');
      navigate('/shop/orders');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    } finally { setBusy(false); }
  };

  if (items.length === 0) {
    return (
      <div>
        <PageHeader title="Cart" />
        <Empty icon={ShoppingCart} title="Your cart is empty"
               description="Browse the catalog to add products" />
        <div className="text-center mt-4">
          <Button onClick={() => navigate('/shop/products')}>Browse Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={`Cart (${items.length} items)`} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <CardBody className="flex items-center gap-4">
                <div className="text-3xl w-12 h-12 bg-emerald-50 rounded-xl
                                flex items-center justify-center flex-shrink-0">
                  🥛
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">{currency(item.price)} per {item.unit}</p>
                </div>
                {/* Qty controls */}
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg border border-gray-200 flex items-center
                                     justify-center hover:bg-gray-50">
                    <Minus size={12} />
                  </button>
                  <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center
                                     justify-center hover:bg-emerald-700">
                    <Plus size={12} />
                  </button>
                </div>
                <p className="font-bold text-sm w-24 text-right">
                  {currency(item.price * item.quantity)}
                </p>
                <button onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Checkout panel */}
        <div className="space-y-4">
          {/* Order summary */}
          <Card>
            <CardHeader title="Order Summary" />
            <CardBody className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span><span>{currency(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (5%)</span><span>{currency(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base
                              border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span className="text-emerald-700">{currency(grand)}</span>
              </div>
            </CardBody>
          </Card>

          {/* Checkout form */}
          <Card>
            <CardHeader title="Delivery Details" />
            <CardBody className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700">Delivery Address *</label>
                <textarea rows={3} value={form.delivery_address}
                          onChange={set('delivery_address')}
                          placeholder="Full delivery address"
                          className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                                     focus:outline-none focus:border-emerald-500 mt-1" />
              </div>
              <Input label="Preferred Delivery Date" type="date"
                     value={form.delivery_date} onChange={set('delivery_date')} />
              <Select label="Payment Method" value={form.payment_method}
                      onChange={set('payment_method')}>
                <option value="cod">Cash on Delivery</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
                {(user?.role === 'wholesaler' || user?.role === 'retailer') && (
                  <option value="credit_line">Credit Line</option>
                )}
              </Select>
              <Button onClick={handleOrder} loading={busy} className="w-full" size="lg">
                Place Order — {currency(grand)}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
