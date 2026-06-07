// src/pages/agent/AgentDeliveries.js
import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Table, Tr, Td,
  Badge, Spinner, Button, Select, Modal, currency
} from '../../components/UI';

const STATUSES = ['picked_up','in_transit','delivered','failed','returned'];

const AgentDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [selected,   setSelected]   = useState(null);
  const [newStatus,  setNewStatus]  = useState('');
  const [proof,      setProof]      = useState('');
  const [busy,       setBusy]       = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.get('/deliveries').then(r => setDeliveries(r.data))
      .catch(() => toast.error('Failed'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openDetail = async (d) => {
    const { data } = await api.get(`/deliveries/${d.id}`);
    setSelected(data);
    setNewStatus(data.status);
  };

  const updateStatus = async () => {
    setBusy(true);
    try {
      await api.put(`/deliveries/${selected.id}/status`, {
        status: newStatus, delivery_proof: proof
      });
      toast.success('Status updated');
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader title="My Deliveries" />
      <Card>
        <CardHeader title={`Deliveries (${deliveries.length})`} />
        {loading ? <Spinner /> : (
          <Table headers={['Order', 'Buyer', 'Address', 'Amount', 'Pay Type', 'Status', 'Action']}>
            {deliveries.map(d => (
              <Tr key={d.id}>
                <Td className="font-mono text-xs">{d.order_id?.slice(0,8)}…</Td>
                <Td>
                  <p className="font-medium text-xs">{d.buyer_name}</p>
                  <p className="text-xs text-gray-400">{d.buyer_phone}</p>
                </Td>
                <Td className="text-xs max-w-40 truncate">{d.delivery_address}</Td>
                <Td className="font-semibold text-xs">{currency(d.final_amount)}</Td>
                <Td className="text-xs uppercase">{d.payment_method}</Td>
                <Td><Badge status={d.status} /></Td>
                <Td>
                  <Button size="sm" variant="ghost" onClick={() => openDetail(d)}>Update</Button>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Update Delivery">
        {selected && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="font-semibold">{selected.buyer_name}</p>
              <p className="text-gray-500 text-xs mt-1">{selected.delivery_address}</p>
              <p className="text-emerald-700 font-bold mt-1">{currency(selected.final_amount)}</p>
            </div>

            {selected.items?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-700 mb-2">Items</p>
                {selected.items.map(i => (
                  <p key={i.id} className="text-xs text-gray-600">
                    {i.product_name} × {i.quantity} {i.unit}
                  </p>
                ))}
              </div>
            )}

            <Select label="New Status" value={newStatus} onChange={e => setNewStatus(e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_',' ').toUpperCase()}</option>)}
            </Select>

            {newStatus === 'delivered' && (
              <div>
                <label className="text-xs font-medium text-gray-700">Delivery Proof / OTP</label>
                <input value={proof} onChange={e => setProof(e.target.value)}
                       placeholder="OTP or photo URL"
                       className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm
                                  focus:outline-none focus:border-emerald-500 mt-1" />
              </div>
            )}

            <Button onClick={updateStatus} loading={busy} className="w-full">
              Update Status
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AgentDeliveries;

// ── Farmer Dashboard ──────────────────────────────────────────
// src/pages/farmer/FarmerDashboard.js
export const FarmerDashboard = () => {
  const [collections, setCollections] = React.useState([]);
  const [loading,     setLoading]     = React.useState(true);
  const { user } = require('../../context/AuthContext').useAuth();
  const { Milk, CreditCard, TrendingUp, Calendar } = require('lucide-react');

  React.useEffect(() => {
    api.get('/collections/my').then(r => setCollections(r.data))
       .catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const totalLiters  = collections.reduce((s,c) => s + parseFloat(c.quantity_liters||0), 0);
  const totalEarned  = collections.reduce((s,c) => s + parseFloat(c.amount||0), 0);
  const pending      = collections.filter(c => c.payment_status !== 'paid')
                                  .reduce((s,c) => s + parseFloat(c.amount||0), 0);

  return (
    <div>
      <PageHeader title={`Welcome, ${user?.name}!`} subtitle="Your milk supply dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Milk}       color="emerald" value={`${totalLiters.toFixed(0)} L`} label="Total Milk Supplied" loading={loading} />
        <StatCard icon={TrendingUp} color="blue"    value={currency(totalEarned)}         label="Total Earnings"     loading={loading} />
        <StatCard icon={CreditCard} color="orange"  value={currency(pending)}              label="Pending Payment"    loading={loading} />
        <StatCard icon={Calendar}   color="purple"  value={collections.length}             label="Collection Records" loading={loading} />
      </div>
      <Card>
        <CardHeader title="Recent Collections" />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Shift','Qty (L)','Fat%','Rate','Amount','Payment']}>
            {collections.slice(0,10).map(c => (
              <Tr key={c.id}>
                <Td className="text-xs">{new Date(c.collection_date).toLocaleDateString('en-IN')}</Td>
                <Td><span className={`text-xs font-bold px-2 py-0.5 rounded ${c.shift==='AM'?'bg-yellow-100 text-yellow-700':'bg-indigo-100 text-indigo-700'}`}>{c.shift}</span></Td>
                <Td className="font-semibold">{parseFloat(c.quantity_liters).toFixed(2)}</Td>
                <Td>{c.fat_percentage ? `${parseFloat(c.fat_percentage).toFixed(1)}%` : '—'}</Td>
                <Td>{currency(c.rate_per_liter)}</Td>
                <Td className="font-semibold text-emerald-700">{currency(c.amount)}</Td>
                <Td><Badge status={c.payment_status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

// Named re-exports for App.js imports
export { AgentDeliveries as default };
