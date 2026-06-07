// Remaining page files — each is a proper page component

// ── src/pages/farmer/FarmerDashboard.js ──────────────────────
import React, { useEffect, useState } from 'react';
import { Milk, CreditCard, TrendingUp, Calendar } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import {
  PageHeader, StatCard, Card, CardHeader, Table, Tr, Td,
  Badge, Spinner, currency
} from '../../components/UI';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/collections/my').then(r => setCollections(r.data))
       .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const totalLiters = collections.reduce((s,c) => s+parseFloat(c.quantity_liters||0), 0);
  const totalEarned = collections.reduce((s,c) => s+parseFloat(c.amount||0), 0);
  const pending     = collections.filter(c=>c.payment_status!=='paid')
                                 .reduce((s,c)=>s+parseFloat(c.amount||0),0);

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}!`} subtitle="Your milk supply dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Milk}       color="emerald" value={`${totalLiters.toFixed(0)} L`} label="Total Milk Supplied" loading={loading} />
        <StatCard icon={TrendingUp} color="blue"    value={currency(totalEarned)}         label="Total Earnings"     loading={loading} />
        <StatCard icon={CreditCard} color="orange"  value={currency(pending)}              label="Pending Payment"    loading={loading} />
        <StatCard icon={Calendar}   color="purple"  value={collections.length}             label="Total Entries"      loading={loading} />
      </div>
      <Card>
        <CardHeader title="Recent Collections" />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Shift','Qty (L)','Fat%','Amount','Grade','Payment']}>
            {collections.slice(0,15).map(c => (
              <Tr key={c.id}>
                <Td className="text-xs">{new Date(c.collection_date).toLocaleDateString('en-IN')}</Td>
                <Td><span className={`text-xs font-bold px-2 py-0.5 rounded ${c.shift==='AM'?'bg-yellow-100 text-yellow-700':'bg-indigo-100 text-indigo-700'}`}>{c.shift}</span></Td>
                <Td className="font-semibold">{parseFloat(c.quantity_liters).toFixed(2)}</Td>
                <Td>{c.fat_percentage?`${parseFloat(c.fat_percentage).toFixed(1)}%`:'—'}</Td>
                <Td className="font-semibold text-emerald-700">{currency(c.amount)}</Td>
                <Td>{c.quality_grade?<span className={`text-xs font-bold px-2 py-0.5 rounded ${c.quality_grade==='A'?'bg-emerald-100 text-emerald-700':c.quality_grade==='B'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>Grade {c.quality_grade}</span>:'—'}</Td>
                <Td><Badge status={c.payment_status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default FarmerDashboard;
