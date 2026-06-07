// src/pages/agent/AgentDashboard.js
import React, { useEffect, useState } from 'react';
import { Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import { StatCard, Card, CardHeader, Spinner, Table, Tr, Td, Badge, currency, PageHeader } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';

const AgentDashboard = () => {
  const { user }     = useAuth();
  const [deliveries, setDeliveries] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    api.get('/deliveries').then(r => {
      setDeliveries(r.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const assigned   = deliveries.filter(d => d.status === 'assigned').length;
  const inTransit  = deliveries.filter(d => d.status === 'in_transit').length;
  const delivered  = deliveries.filter(d => d.status === 'delivered').length;
  const failed     = deliveries.filter(d => d.status === 'failed').length;

  return (
    <div>
      <PageHeader title={`Good day, ${user?.name}!`} subtitle="Your delivery overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock}         color="yellow"  value={assigned}  label="Assigned" />
        <StatCard icon={Truck}         color="blue"    value={inTransit} label="In Transit" />
        <StatCard icon={CheckCircle}   color="emerald" value={delivered} label="Delivered Today" />
        <StatCard icon={AlertCircle}   color="red"     value={failed}    label="Failed" />
      </div>
      <Card>
        <CardHeader title="Today's Deliveries" />
        {loading ? <Spinner /> : (
          <Table headers={['Order', 'Buyer', 'Address', 'Amount', 'Payment', 'Status']}>
            {deliveries.slice(0,10).map(d => (
              <Tr key={d.id}>
                <Td className="font-mono text-xs text-gray-500">{d.order_id?.slice(0,8)}…</Td>
                <Td>
                  <p className="font-medium text-xs">{d.buyer_name}</p>
                  <p className="text-xs text-gray-400">{d.buyer_phone}</p>
                </Td>
                <Td className="text-xs max-w-32 truncate">{d.delivery_address}</Td>
                <Td className="text-xs font-semibold">{currency(d.final_amount)}</Td>
                <Td className="text-xs uppercase">{d.payment_method}</Td>
                <Td><Badge status={d.status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default AgentDashboard;
