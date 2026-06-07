// src/pages/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const LoginPage = () => {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center
                          justify-center text-3xl mx-auto mb-3">🥛</div>
          <h1 className="text-2xl font-bold text-gray-900">DairyFresh</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={form.email} onChange={set('email')}
                   placeholder="you@example.com"
                   className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                              focus:outline-none focus:border-emerald-500 focus:ring-2
                              focus:ring-emerald-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <input type="password" required value={form.password} onChange={set('password')}
                   placeholder="••••••••"
                   className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm
                              focus:outline-none focus:border-emerald-500 focus:ring-2
                              focus:ring-emerald-100 transition-all" />
          </div>
          <button type="submit" disabled={busy}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white
                             font-semibold py-2.5 rounded-xl text-sm transition-colors
                             disabled:opacity-60">
            {busy ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          No account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
          <p className="font-semibold text-gray-700 mb-1">Demo Login</p>
          <p>Admin: admin@dairyfresh.com / Admin@1234</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
