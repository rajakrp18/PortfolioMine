import React, { useEffect, useState, useCallback } from 'react';
import { Truck, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Button, Table, Tr, Td, Badge, Spinner, Empty, Modal, Select
} from '../../components/UI';

const DeliveryAdmin = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [agents, setAgents]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [busy, setBusy]             = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [agentId, setAgentId]       = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [delReq, agentsReq] = await Promise.all([
        api.get('/deliveries'),
        api.get('/deliveries/agents/list')
      ]);
      setDeliveries(delReq.data);
      setAgents(agentsReq.data);
    } catch {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const openAssignModal = (delivery) => {
    setSelectedOrder(delivery);
    setAgentId(delivery.agent_id || '');
    setShowModal(true);
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!agentId) return toast.error('Select an agent');
    setBusy(true);
    try {
      await api.put(`/orders/${selectedOrder.order_id}/status`, {
        status: 'dispatched',
        agent_id: agentId
      });
      toast.success('Agent assigned and order dispatched!');
      setShowModal(false);
      loadData();
    } catch {
      toast.error('Failed to assign agent');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Delivery Fleet"
        subtitle="Track logistics and assign delivery agents to orders"
      />

      <Card>
        <CardHeader title={`Active Deliveries (${deliveries.length})`} />
        {loading ? <Spinner /> : deliveries.length === 0 ? <Empty title="No deliveries found" /> : (
          <Table headers={['Order ID', 'Customer', 'Destination', 'Agent Assigned', 'Status', 'Action']}>
            {deliveries.map(d => (
              <Tr key={d.id}>
                <Td className="font-semibold text-xs">#{d.order_id.slice(0,8)}</Td>
                <Td>
                  <p className="text-sm font-semibold">{d.buyer_name}</p>
                  <p className="text-[10px] font-bold uppercase text-gray-500">{d.buyer_role}</p>
                </Td>
                <Td>
                  <div className="flex items-start gap-1">
                    <MapPin size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-600 truncate w-48">{d.delivery_address}</p>
                  </div>
                </Td>
                <Td>
                  {d.agent_name ? (
                    <div>
                      <p className="text-xs font-semibold text-emerald-700">{d.agent_name}</p>
                      <p className="text-[10px] text-gray-500">{d.agent_phone}</p>
                    </div>
                  ) : (
                    <span className="text-xs italic text-gray-400">Unassigned</span>
                  )}
                </Td>
                <Td><Badge text={d.status.replace('_', ' ')} status={d.status === 'delivered' ? 'paid' : d.status === 'failed' ? 'cancelled' : 'pending'} /></Td>
                <Td>
                  {d.status !== 'delivered' && d.status !== 'failed' && d.status !== 'returned' && (
                    <Button variant="secondary" onClick={() => openAssignModal(d)}>
                      <Truck size={14} className="mr-1" /> Reassign
                    </Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* Agents Overview */}
      <div className="mt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Fleet Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
                <Truck size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{a.name}</p>
                <p className="text-xs text-gray-500">{a.phone}</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {a.active_deliveries} Active
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
                    {a.completed_deliveries} Done
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Assign Delivery Agent">
        <form onSubmit={handleAssign} className="space-y-4">
          <p className="text-sm text-gray-600">Assigning agent to order <span className="font-bold">#{selectedOrder?.order_id.slice(0,8)}</span> for <span className="font-bold">{selectedOrder?.buyer_name}</span>.</p>
          
          <Select label="Select Agent *" value={agentId} onChange={e => setAgentId(e.target.value)} required>
            <option value="">Choose an agent...</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.active_deliveries} active deliveries)</option>
            ))}
          </Select>

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={busy} className="flex-1">Confirm Assignment</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeliveryAdmin;
