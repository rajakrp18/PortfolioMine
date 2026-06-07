// src/pages/buyer/BuyerOrders.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { PageHeader, Card, CardHeader, Table, Tr, Td, Badge, Spinner, currency, Button } from '../../components/UI';
import toast from 'react-hot-toast';

const BuyerOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  const load = ()=>{
    setLoading(true);
    api.get('/orders').then(r=>setOrders(r.data)).catch(()=>toast.error('Failed')).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const cancel = async (id)=>{
    if(!window.confirm('Cancel this order?')) return;
    try { await api.delete(`/orders/${id}`); toast.success('Order cancelled'); load(); }
    catch(err){ toast.error(err.response?.data?.error||'Cannot cancel'); }
  };

  return (
    <div>
      <PageHeader title="My Orders" subtitle="Track all your orders" />
      <Card>
        <CardHeader title={`${orders.length} orders`} />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Items','Amount','Delivery Address','Payment','Status','Action']}>
            {orders.map(o=>(
              <Tr key={o.id}>
                <Td className="text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</Td>
                <Td className="text-xs">{o.item_count} item(s)</Td>
                <Td className="font-semibold text-xs">{currency(o.final_amount)}</Td>
                <Td className="text-xs max-w-32 truncate">{o.delivery_address}</Td>
                <Td>
                  <Badge status={o.payment_status} />
                  <p className="text-xs text-gray-400 mt-0.5">{o.payment_method}</p>
                </Td>
                <Td><Badge status={o.status} /></Td>
                <Td>
                  {['pending','confirmed'].includes(o.status) && (
                    <Button size="sm" variant="danger" onClick={()=>cancel(o.id)}>Cancel</Button>
                  )}
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
export default BuyerOrders;
