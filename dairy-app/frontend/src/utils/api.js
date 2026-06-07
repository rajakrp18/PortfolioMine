// src/utils/api.js
// Axios instance — auto-attaches JWT from localStorage
// Auto-redirects to /login on 401 responses

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// ── Request interceptor — attach Bearer token ─────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('dairy_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Tell server the buyer's role for pricing (products endpoint)
    const user = JSON.parse(localStorage.getItem('dairy_user') || '{}');
    if (user.role) config.headers['x-user-role'] = user.role;

    return config;
  },
  (err) => Promise.reject(err)
);

// ── Response interceptor — handle 401 ────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('dairy_token');
      localStorage.removeItem('dairy_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
