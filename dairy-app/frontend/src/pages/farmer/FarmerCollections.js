// src/pages/farmer/FarmerCollections.js — farmer's full collection history with filters
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../utils/api';
import { PageHeader, Card, CardHeader, Table, Tr, Td, Badge, Spinner, Input, Button, currency } from '../../components/UI';

const FarmerCollections = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];
  const monthStart = today.slice(0,8)+'01';
  const [from, setFrom] = useState(monthStart);
  const [to,   setTo]   = useState(today);

  const load = useCallback(()=>{
    setLoading(true);
    api.get(`/collections/my?from=${from}&to=${to}`).then(r=>setData(r.data)).catch(()=>{}).finally(()=>setLoading(false));
  },[from,to]);

  useEffect(()=>{ load(); },[load]);

  const totalL = data.reduce((s,c)=>s+parseFloat(c.quantity_liters||0),0);
  const totalA = data.reduce((s,c)=>s+parseFloat(c.amount||0),0);

  return (
    <div>
      <PageHeader title="My Collection Records" subtitle="All AM & PM milk deliveries" />
      <div className="flex flex-wrap gap-3 items-end mb-4">
        <Input label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} className="w-36" />
        <Input label="To"   type="date" value={to}   onChange={e=>setTo(e.target.value)}   className="w-36" />
        <Button onClick={load} variant="secondary">Filter</Button>
        <div className="ml-auto text-right">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-bold text-emerald-700">{totalL.toFixed(2)} L → {currency(totalA)}</p>
        </div>
      </div>
      <Card>
        <CardHeader title={`${data.length} records`} />
        {loading ? <Spinner /> : (
          <Table headers={['Date','Shift','Qty (L)','Fat%','SNF%','Rate/L','Amount','Grade','Payment']}>
            {data.map(c=>(
              <Tr key={c.id}>
                <Td className="text-xs">{new Date(c.collection_date).toLocaleDateString('en-IN')}</Td>
                <Td><span className={`text-xs font-bold px-2 py-0.5 rounded ${c.shift==='AM'?'bg-yellow-100 text-yellow-700':'bg-indigo-100 text-indigo-700'}`}>{c.shift}</span></Td>
                <Td className="font-semibold">{parseFloat(c.quantity_liters).toFixed(2)}</Td>
                <Td>{c.fat_percentage?`${parseFloat(c.fat_percentage).toFixed(1)}%`:'—'}</Td>
                <Td>{c.snf_percentage?`${parseFloat(c.snf_percentage).toFixed(1)}%`:'—'}</Td>
                <Td>{currency(c.rate_per_liter)}</Td>
                <Td className="font-semibold text-emerald-700">{currency(c.amount)}</Td>
                <Td>{c.quality_grade||'—'}</Td>
                <Td><Badge status={c.payment_status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};
export default FarmerCollections;
