// src/pages/buyer/BuyerDashboard.js
import React, { useEffect, useState } from 'react';
import { ShoppingCart, Package, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { PageHeader, StatCard, Card, CardHeader, Table, Tr, Td, Badge, Spinner, currency, Button } from '../../components/UI';

const BuyerDashboard = () => {
  const { user }  = useAuth();
  const { items } = useCart();
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    api.get('/orders').then(r=>setOrders(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const active    = orders.filter(o=>!['delivered','cancelled'].includes(o.status)).length;
  const delivered = orders.filter(o=>o.status==='delivered').length;
  const totalSpent= orders.filter(o=>o.status!=='cancelled').reduce((s,o)=>s+parseFloat(o.final_amount||0),0);

  return (
    <div>
      <PageHeader title={`Hello, ${user?.name}!`}
                  subtitle={`${user?.role?.charAt(0).toUpperCase()+user?.role?.slice(1)} account`}
                  action={<Link to="/shop/products"><Button>Browse Products</Button></Link>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingCart} color="emerald" value={items.length}      label="Items in Cart"    />
        <StatCard icon={Clock}        color="orange"  value={active}            label="Active Orders"    loading={loading} />
        <StatCard icon={Truck}        color="blue"    value={delivered}         label="Delivered Orders" loading={loading} />
        <StatCard icon={Package}      color="purple"  value={currency(totalSpent)} label="Total Spent"   loading={loading} />
      </div>
      <Card>
        <CardHeader title="Recent Orders" action={<Link to="/shop/orders" className="text-xs text-emerald-600 font-medium">View all →</Link>} />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Items','Amount','Payment','Status']}>
            {orders.slice(0,6).map(o=>(
              <Tr key={o.id}>
                <Td className="text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</Td>
                <Td className="text-xs">{o.item_count} item(s)</Td>
                <Td className="font-semibold text-xs">{currency(o.final_amount)}</Td>
                <Td className="text-xs uppercase">{o.payment_method}</Td>
                <Td><Badge status={o.status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
export default BuyerDashboard;
