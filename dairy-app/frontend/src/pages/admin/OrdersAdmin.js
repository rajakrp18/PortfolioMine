// src/pages/admin/OrdersAdmin.js
// View all orders, filter by status, update order status, assign delivery agents

import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, CardBody, Button, Select,
  Modal, Table, Tr, Td, Badge, Spinner, currency, Empty
} from '../../components/UI';
import { Eye, Truck } from 'lucide-react';

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'cancelled'];

const OrdersAdmin = () => {
  const [orders,   setOrders]  = useState([]);
  const [agents,   setAgents]  = useState([]);
  const [loading,  setLoading] = useState(true);
  const [selected, setSelected]= useState(null);   // order for detail modal
  const [filter,   setFilter]  = useState('');      // status filter
  const [busy,     setBusy]    = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [agentId,  setAgentId] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const { data } = await api.get(`/orders${params}`);
      setOrders(data);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.get('/deliveries/agents/list').then(r => setAgents(r.data)).catch(() => {});
  }, []);

  const openDetail = async (order) => {
    try {
      const { data } = await api.get(`/orders/${order.id}`);
      setSelected(data);
      setNewStatus(data.status);
      setAgentId(data.delivery?.agent_id || '');
    } catch { toast.error('Could not load order detail'); }
  };

  const updateStatus = async () => {
    if (!newStatus) return;
    setBusy(true);
    try {
      await api.put(`/orders/${selected.id}/status`, {
        status: newStatus,
        agent_id: newStatus === 'dispatched' ? agentId : undefined,
      });
      toast.success('Order updated');
      setSelected(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="Manage all buyer orders" />

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {STATUS_OPTIONS.map(s => (
          <button key={s}
                  onClick={() => setFilter(s)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors
                               ${filter === s
                                 ? 'bg-emerald-600 text-white'
                                 : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title={`Orders (${orders.length})`} />
        {loading ? <Spinner /> : orders.length === 0
          ? <Empty title="No orders found" />
          : (
            <Table headers={['Order ID', 'Buyer', 'Type', 'Items', 'Amount', 'Payment', 'Status', 'Actions']}>
              {orders.map(o => (
                <Tr key={o.id}>
                  <Td className="text-xs font-mono text-gray-500">{o.id.slice(0, 8)}…</Td>
                  <Td>
                    <p className="font-medium text-xs">{o.buyer_name}</p>
                    <p className="text-gray-400 text-xs">{o.buyer_phone}</p>
                  </Td>
                  <Td><Badge text={o.buyer_role} status={o.buyer_role} /></Td>
                  <Td className="text-xs">{o.item_count} item(s)</Td>
                  <Td className="font-semibold text-xs">{currency(o.final_amount)}</Td>
                  <Td>
                    <Badge status={o.payment_status} />
                    <p className="text-gray-400 text-xs mt-0.5">{o.payment_method}</p>
                  </Td>
                  <Td><Badge status={o.status} /></Td>
                  <Td>
                    <Button size="sm" variant="ghost" icon={Eye}
                            onClick={() => openDetail(o)}>
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Table>
          )
        }
      </Card>

      {/* ── Order Detail Modal ──────────────────────────────── */}
      <Modal open={!!selected} onClose={() => setSelected(null)}
             title={`Order — ${selected?.id?.slice(0,8)}…`} width="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            {/* Buyer info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Buyer</p>
                <p className="font-semibold text-sm">{selected.buyer_name}</p>
                <p className="text-xs text-gray-500">{selected.email}</p>
                <p className="text-xs text-gray-500">{selected.phone}</p>
                <Badge text={selected.buyer_role} className="mt-1" />
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="text-sm">{selected.delivery_address}</p>
                {selected.delivery_date && (
                  <p className="text-xs text-gray-500 mt-1">
                    Expected: {new Date(selected.delivery_date).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Order Items</p>
              <div className="space-y-2">
                {selected.items?.map(item => (
                  <div key={item.id} className="flex justify-between items-center
                                                 border border-gray-100 rounded-lg p-2.5">
                    <div>
                      <p className="text-sm font-medium">{item.product_name}</p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} {item.unit} × {currency(item.unit_price)}
                      </p>
                    </div>
                    <p className="font-semibold text-sm">{currency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="bg-emerald-50 rounded-xl p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{currency(selected.total_amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (GST 5%)</span>
                <span>{currency(selected.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-emerald-200 pt-1 mt-1">
                <span>Total</span>
                <span className="text-emerald-700">{currency(selected.final_amount)}</span>
              </div>
            </div>

            {/* Update status */}
            <div className="border-t pt-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">Update Order Status</p>
              <div className="flex gap-3 flex-wrap">
                <Select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="flex-1">
                  {['confirmed','processing','dispatched','delivered','cancelled'].map(s => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </Select>
                {newStatus === 'dispatched' && (
                  <Select value={agentId} onChange={e => setAgentId(e.target.value)} className="flex-1">
                    <option value="">Assign agent (optional)</option>
                    {agents.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.active_deliveries} active)
                      </option>
                    ))}
                  </Select>
                )}
                <Button icon={Truck} onClick={updateStatus} loading={busy}>
                  Update
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersAdmin;
