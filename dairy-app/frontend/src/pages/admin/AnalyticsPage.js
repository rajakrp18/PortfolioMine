import React, { useEffect, useState, useCallback } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { PageHeader, Card, CardHeader, CardBody, Spinner, currency } from '../../components/UI';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    revenue: [],
    topProducts: [],
    buyers: [],
    milkTrend: []
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [revRes, prodRes, buyerRes, milkRes] = await Promise.all([
        api.get('/analytics/revenue?period=daily&days=14'),
        api.get('/analytics/top-products?limit=5'),
        api.get('/analytics/buyers'),
        api.get('/analytics/milk-trend?days=14')
      ]);

      setData({
        revenue: revRes.data.map(d => ({
          ...d, 
          date: new Date(d.period).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: parseFloat(d.revenue)
        })),
        topProducts: prodRes.data.map(d => ({
          ...d,
          revenue: parseFloat(d.total_revenue),
          sold: parseInt(d.total_sold)
        })),
        buyers: buyerRes.data.map(d => ({
          name: d.buyer_role.replace('_', ' ').toUpperCase(),
          value: parseFloat(d.total_revenue)
        })),
        milkTrend: milkRes.data.map(d => ({
          ...d,
          date: new Date(d.collection_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          am: parseFloat(d.am_liters),
          pm: parseFloat(d.pm_liters)
        }))
      });
    } catch {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (loading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Business Analytics" 
        subtitle="Deep dive into sales, inventory, and supply chain metrics"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Revenue Trend ── */}
        <Card>
          <CardHeader title="Revenue Trend (Last 14 Days)" icon={<TrendingUp size={18} className="text-emerald-600" />} />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  formatter={(value) => [currency(value), "Revenue"]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ── Milk Collection Trend ── */}
        <Card>
          <CardHeader title="Milk Sourcing (AM vs PM)" icon={<Package size={18} className="text-blue-600" />} />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.milkTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="am" name="AM Shift (L)" stackId="a" fill="#fcd34d" radius={[0, 0, 4, 4]} />
                <Bar dataKey="pm" name="PM Shift (L)" stackId="a" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ── Top Selling Products ── */}
        <Card>
          <CardHeader title="Top 5 Products by Revenue" icon={<DollarSign size={18} className="text-amber-600" />} />
          <CardBody className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topProducts} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `₹${val}`} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  formatter={(value) => [currency(value), "Revenue"]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* ── Revenue by Buyer Segment ── */}
        <Card>
          <CardHeader title="Revenue by Customer Segment" icon={<Users size={18} className="text-purple-600" />} />
          <CardBody className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.buyers}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.buyers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
