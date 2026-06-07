// src/pages/admin/AdminDashboard.js
// KPI summary cards + revenue trend + top products + recent orders

import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import {
  Milk, ShoppingCart, Truck, Users,
  AlertTriangle, TrendingUp, CreditCard, Package
} from 'lucide-react';
import api from '../../utils/api';
import {
  StatCard, Card, CardHeader, CardBody, Badge, Spinner,
  Table, Tr, Td, currency, PageHeader
} from '../../components/UI';

const AdminDashboard = () => {
  const [kpi,         setKpi]         = useState(null);
  const [revenue,     setRevenue]     = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders,setRecentOrders]= useState([]);
  const [milkTrend,   setMilkTrend]  = useState([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [k, r, tp, ro, mt] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/revenue?period=daily&days=14'),
          api.get('/analytics/top-products?limit=5'),
          api.get('/orders?status=pending'),
          api.get('/analytics/milk-trend?days=7'),
        ]);
        setKpi(k.data);
        // Format revenue dates for chart
        setRevenue(r.data.map(d => ({
          ...d,
          date: new Date(d.period).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          revenue: parseFloat(d.revenue),
          orders: parseInt(d.orders),
        })));
        setTopProducts(tp.data);
        setRecentOrders(ro.data.slice(0, 8));
        setMilkTrend(mt.data.map(d => ({
          ...d,
          date: new Date(d.collection_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
          am: parseFloat(d.am_liters || 0),
          pm: parseFloat(d.pm_liters || 0),
        })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        subtitle={`Today — ${new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}`}
      />

      {/* ── KPI cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Milk}   color="emerald"
          value={kpi ? `${kpi.today_milk_liters.toFixed(0)} L` : '—'}
          label="Milk Collected Today"
          loading={loading}
        />
        <StatCard
          icon={ShoppingCart} color="blue"
          value={kpi?.pending_orders ?? '—'}
          label="Pending Orders"
          loading={loading}
        />
        <StatCard
          icon={TrendingUp} color="purple"
          value={kpi ? currency(kpi.monthly_revenue) : '—'}
          label="Revenue This Month"
          loading={loading}
        />
        <StatCard
          icon={CreditCard} color="orange"
          value={kpi ? currency(kpi.pending_farmer_payout) : '—'}
          label="Farmer Payable"
          loading={loading}
        />
        <StatCard
          icon={Truck} color="yellow"
          value={kpi?.active_agents ?? '—'}
          label="Active Delivery Agents"
          loading={loading}
        />
        <StatCard
          icon={AlertTriangle} color="red"
          value={kpi?.low_stock_products ?? '—'}
          label="Low Stock Products"
          loading={loading}
        />
        <StatCard
          icon={Users} color="blue"
          value={kpi?.new_users_week ?? '—'}
          label="New Users This Week"
          loading={loading}
        />
        <StatCard
          icon={Package} color="emerald"
          value="—"
          label="Total SKUs"
          loading={loading}
        />
      </div>

      {/* ── Charts row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

        {/* Revenue chart */}
        <Card>
          <CardHeader title="Revenue (Last 14 Days)" />
          <CardBody>
            {loading ? <Spinner /> : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenue}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#059669" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }}
                         tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
                  <Area type="monotone" dataKey="revenue"
                        stroke="#059669" fill="url(#revGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Milk collection chart */}
        <Card>
          <CardHeader title="Milk Collection Trend (Litres)" />
          <CardBody>
            {loading ? <Spinner /> : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={milkTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="am" name="Morning" fill="#34d399" stackId="a" radius={[0,0,2,2]} />
                  <Bar dataKey="pm" name="Evening" fill="#059669" stackId="a" radius={[2,2,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* ── Bottom row ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent pending orders */}
        <Card>
          <CardHeader title="Pending Orders" subtitle="Awaiting confirmation" />
          {loading ? <Spinner /> : (
            <Table headers={['Buyer', 'Role', 'Amount', 'Status']}>
              {recentOrders.map((o) => (
                <Tr key={o.id}>
                  <Td>
                    <p className="font-medium text-gray-800 text-xs">{o.buyer_name}</p>
                    <p className="text-gray-400 text-xs">{o.buyer_email}</p>
                  </Td>
                  <Td><Badge status={o.buyer_role} text={o.buyer_role} /></Td>
                  <Td className="font-semibold">{currency(o.final_amount)}</Td>
                  <Td><Badge status={o.status} /></Td>
                </Tr>
              ))}
            </Table>
          )}
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader title="Top Selling Products" subtitle="By revenue" />
          {loading ? <Spinner /> : (
            <Table headers={['Product', 'Sold', 'Revenue']}>
              {topProducts.map((p, i) => (
                <Tr key={p.name}>
                  <Td>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700
                                       text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-xs font-medium">{p.name}</span>
                    </div>
                  </Td>
                  <Td className="text-xs">{parseFloat(p.total_sold).toFixed(1)} {p.unit}</Td>
                  <Td className="font-semibold text-xs">{currency(p.total_revenue)}</Td>
                </Tr>
              ))}
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
