// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const ROLES = [
  { value: 'farmer',         label: '🌾 Farmer',          desc: 'Supply milk to dairy'       },
  { value: 'wholesaler',     label: '🏭 Wholesaler',       desc: 'Buy in bulk quantity'       },
  { value: 'retailer',       label: '🏪 Retailer',         desc: 'Buy for shop resale'        },
  { value: 'consumer',       label: '🏠 Consumer',          desc: 'Buy for home delivery'      },
  { value: 'delivery_agent', label: '🚚 Delivery Agent',   desc: 'Handle order deliveries'    },
];

const RegisterPage = () => {
  const { login }       = useAuth();
  const { items }       = useCart();
  const navigate        = useNavigate();
  const [step, setStep] = useState(1);   // 1 = choose role, 2 = fill form
  const [role, setRole] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    address: '', city: '', state: '', pincode: '',
  });

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/register', { ...form, role });
      login(data.token, data.user);
      toast.success('Account created!');
      
      // Route smartly based on role
      if (['consumer', 'retailer', 'wholesaler'].includes(role)) {
        if (items.length > 0) {
          navigate('/shop/cart');
        } else {
          navigate('/shop/products');
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  const inputClass = `w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                      focus:outline-none focus:border-emerald-500 focus:ring-2
                      focus:ring-emerald-100 transition-all`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-emerald-600 p-6 text-center text-white">
          <div className="text-3xl mb-2">🥛</div>
          <h1 className="text-xl font-bold">Create Account</h1>
          <p className="text-emerald-100 text-sm mt-1">Join DairyFresh Management System</p>
        </div>

        <div className="p-6">
          {/* Step 1 — choose role */}
          {step === 1 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-4">I am a…</p>
              <div className="grid grid-cols-1 gap-2">
                {ROLES.map((r) => (
                  <button key={r.value} type="button"
                          onClick={() => { setRole(r.value); setStep(2); }}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2
                                      text-left transition-all
                                      ${role === r.value
                                        ? 'border-emerald-500 bg-emerald-50'
                                        : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                                      }`}>
                    <span className="text-xl">{r.label.split(' ')[0]}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-800">
                        {r.label.split(' ').slice(1).join(' ')}
                      </p>
                      <p className="text-xs text-gray-500">{r.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — fill form */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <button type="button" onClick={() => setStep(1)}
                      className="text-xs text-emerald-600 font-medium mb-2 flex items-center gap-1">
                ← Back to role selection
              </button>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700">Full Name *</label>
                  <input required value={form.name} onChange={set('name')}
                         placeholder="Your full name" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700">Email *</label>
                  <input type="email" required value={form.email} onChange={set('email')}
                         placeholder="you@example.com" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Password *</label>
                  <input type="password" required minLength={6} value={form.password}
                         onChange={set('password')} placeholder="Min 6 chars" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Phone</label>
                  <input value={form.phone} onChange={set('phone')}
                         placeholder="10-digit number" className={inputClass} />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-700">Address</label>
                  <input value={form.address} onChange={set('address')}
                         placeholder="Street address" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">City</label>
                  <input value={form.city} onChange={set('city')}
                         placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Pincode</label>
                  <input value={form.pincode} onChange={set('pincode')}
                         placeholder="6 digits" className={inputClass} />
                </div>
              </div>

              <button type="submit" disabled={busy}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
                                 font-semibold py-2.5 rounded-xl text-sm transition-colors
                                 disabled:opacity-60 mt-2">
                {busy ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
