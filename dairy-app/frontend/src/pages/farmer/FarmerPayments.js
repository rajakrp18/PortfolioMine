// src/pages/farmer/FarmerPayments.js
import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import { PageHeader, Card, CardHeader, Table, Tr, Td, Badge, Spinner, currency } from '../../components/UI';

const FarmerPayments = () => {
  const [data,    setData]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState([]);

  useEffect(()=>{
    api.get('/collections/my').then(r=>{
      const pen = r.data.filter(c=>c.payment_status!=='paid');
      setPending(pen);
      setData(r.data.filter(c=>c.payment_status==='paid'));
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const pendingTotal = pending.reduce((s,c)=>s+parseFloat(c.amount||0),0);
  const paidTotal    = data.reduce((s,c)=>s+parseFloat(c.amount||0),0);

  return (
    <div>
      <PageHeader title="Payments" subtitle="Track your earnings and payment status" />
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
          <p className="text-xs text-orange-600 font-medium">Pending Payout</p>
          <p className="text-3xl font-bold text-orange-700 mt-1">{currency(pendingTotal)}</p>
          <p className="text-xs text-orange-500 mt-1">{pending.length} collection(s) unpaid</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
          <p className="text-xs text-emerald-600 font-medium">Total Received</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">{currency(paidTotal)}</p>
          <p className="text-xs text-emerald-500 mt-1">{data.length} paid entries</p>
        </div>
      </div>
      <Card>
        <CardHeader title="Pending Collections" />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Shift','Qty (L)','Amount','Status']}>
            {pending.map(c=>(
              <Tr key={c.id}>
                <Td className="text-xs">{new Date(c.collection_date).toLocaleDateString('en-IN')}</Td>
                <Td><span className={`text-xs font-bold px-2 py-0.5 rounded ${c.shift==='AM'?'bg-yellow-100 text-yellow-700':'bg-indigo-100 text-indigo-700'}`}>{c.shift}</span></Td>
                <Td>{parseFloat(c.quantity_liters).toFixed(2)}</Td>
                <Td className="font-semibold text-orange-700">{currency(c.amount)}</Td>
                <Td><Badge status="pending" /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
export default FarmerPayments;
