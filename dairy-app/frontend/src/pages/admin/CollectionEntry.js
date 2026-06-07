// src/pages/admin/CollectionEntry.js
// Record daily milk collections from farmers (AM + PM shifts)
// Also shows collection history with filtering

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Milk } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, CardBody, Button, Input, Select,
  Modal, Table, Tr, Td, Badge, Spinner, currency
} from '../../components/UI';

const CollectionEntry = () => {
  const [collections, setCollections] = useState([]);
  const [farmers,     setFarmers]     = useState([]);
  const [summary,     setSummary]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [showModal,   setShowModal]   = useState(false);
  const [busy,        setBusy]        = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const [filters, setFilters] = useState({ from: today, to: today, farmer_id: '' });

  const [form, setForm] = useState({
    farmer_id: '', collection_date: today, shift: 'AM',
    quantity_liters: '', fat_percentage: '', snf_percentage: '',
    rate_per_liter: '', quality_grade: 'A', notes: ''
  });

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));
  const setFilter = (f) => (e) => setFilters(prev => ({ ...prev, [f]: e.target.value }));

  // ── Load farmers list ────────────────────────────────────────
  useEffect(() => {
    api.get('/users?role=farmer').then(r => setFarmers(r.data)).catch(() => {});
  }, []);

  // ── Load collections ─────────────────────────────────────────
  const loadCollections = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const [col, sum] = await Promise.all([
        api.get(`/collections?${params}`),
        api.get(`/collections/summary?from=${filters.from}&to=${filters.to}`),
      ]);
      setCollections(col.data);
      setSummary(sum.data);
    } catch {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { loadCollections(); }, [loadCollections]);

  // ── Submit new collection ────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.farmer_id) return toast.error('Select a farmer');
    setBusy(true);
    try {
      await api.post('/collections', form);
      toast.success('Collection recorded!');
      setShowModal(false);
      setForm(prev => ({
        ...prev, quantity_liters: '', fat_percentage: '',
        snf_percentage: '', notes: ''
      }));
      loadCollections();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to record');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Milk Collections"
        subtitle="Daily sourcing from farmers (AM & PM shifts)"
        action={
          <Button icon={Plus} onClick={() => setShowModal(true)}>
            Record Collection
          </Button>
        }
      />

      {/* ── Filters ─────────────────────────────────────────── */}
      <Card className="mb-4">
        <CardBody>
          <div className="flex flex-wrap gap-3 items-end">
            <Input label="From" type="date" value={filters.from}
                   onChange={setFilter('from')} className="w-36" />
            <Input label="To"   type="date" value={filters.to}
                   onChange={setFilter('to')}   className="w-36" />
            <Select label="Farmer" value={filters.farmer_id}
                    onChange={setFilter('farmer_id')} className="w-48">
              <option value="">All Farmers</option>
              {farmers.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </Select>
            <Button onClick={loadCollections} variant="secondary">Filter</Button>
          </div>
        </CardBody>
      </Card>

      {/* ── Summary cards ───────────────────────────────────── */}
      {summary.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {summary.slice(0, 4).map(s => (
            <Card key={s.farmer_id}>
              <CardBody>
                <p className="font-semibold text-gray-800 text-sm truncate">{s.name}</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {parseFloat(s.total_liters || 0).toFixed(1)} L
                </p>
                <p className="text-xs text-gray-500">{currency(s.total_amount)}</p>
                <div className="flex gap-2 mt-2">
                  <Badge status={s.pending_amount > 0 ? 'pending' : 'paid'}
                         text={s.pending_amount > 0 ? 'Pending' : 'Paid'} />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ── Collection table ─────────────────────────────────── */}
      <Card>
        <CardHeader title={`Collections (${collections.length})`} />
        {loading ? <Spinner /> : (
          <Table headers={['Date', 'Farmer', 'Shift', 'Qty (L)', 'Fat%', 'Rate/L', 'Amount', 'Grade', 'Payment']}>
            {collections.map(c => (
              <Tr key={c.id}>
                <Td className="text-xs">{new Date(c.collection_date).toLocaleDateString('en-IN')}</Td>
                <Td>
                  <p className="font-medium text-xs">{c.farmer_name}</p>
                  <p className="text-gray-400 text-xs">{c.farmer_phone}</p>
                </Td>
                <Td>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded
                                    ${c.shift === 'AM'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-indigo-100 text-indigo-700'}`}>
                    {c.shift}
                  </span>
                </Td>
                <Td className="font-semibold">{parseFloat(c.quantity_liters).toFixed(2)}</Td>
                <Td>{c.fat_percentage ? `${parseFloat(c.fat_percentage).toFixed(1)}%` : '—'}</Td>
                <Td>{currency(c.rate_per_liter)}</Td>
                <Td className="font-semibold text-emerald-700">{currency(c.amount)}</Td>
                <Td>
                  {c.quality_grade
                    ? <span className={`text-xs font-bold px-2 py-0.5 rounded
                                        ${c.quality_grade==='A' ? 'bg-emerald-100 text-emerald-700'
                                          : c.quality_grade==='B' ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'}`}>
                        Grade {c.quality_grade}
                      </span>
                    : '—'
                  }
                </Td>
                <Td><Badge status={c.payment_status} /></Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      {/* ── Add Collection Modal ─────────────────────────────── */}
      <Modal open={showModal} onClose={() => setShowModal(false)}
             title="Record Milk Collection">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Farmer *" value={form.farmer_id} onChange={set('farmer_id')}
                    className="col-span-2" required>
              <option value="">Select farmer</option>
              {farmers.map(f => (
                <option key={f.id} value={f.id}>{f.name} — {f.phone}</option>
              ))}
            </Select>
            <Input label="Collection Date *" type="date" value={form.collection_date}
                   onChange={set('collection_date')} required />
            <Select label="Shift *" value={form.shift} onChange={set('shift')}>
              <option value="AM">🌅 Morning (AM)</option>
              <option value="PM">🌆 Evening (PM)</option>
            </Select>
            <Input label="Quantity (Litres) *" type="number" step="0.01" min="0.1"
                   value={form.quantity_liters} onChange={set('quantity_liters')} required />
            <Input label="Rate per Litre (₹) *" type="number" step="0.01"
                   value={form.rate_per_liter} onChange={set('rate_per_liter')} required />
            <Input label="Fat %" type="number" step="0.01" min="0" max="10"
                   value={form.fat_percentage} onChange={set('fat_percentage')} />
            <Input label="SNF %" type="number" step="0.01" min="0" max="15"
                   value={form.snf_percentage} onChange={set('snf_percentage')} />
            <Select label="Quality Grade" value={form.quality_grade} onChange={set('quality_grade')}>
              <option value="A">Grade A — Excellent</option>
              <option value="B">Grade B — Good</option>
              <option value="C">Grade C — Average</option>
            </Select>
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-700">Notes</label>
              <textarea rows={2} value={form.notes} onChange={set('notes')}
                        placeholder="Any observations..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                                   focus:outline-none focus:border-emerald-500 mt-1" />
            </div>
          </div>

          {/* Calculated preview */}
          {form.quantity_liters && form.rate_per_liter && (
            <div className="bg-emerald-50 rounded-xl p-3 text-sm">
              <p className="text-gray-600">Calculated Amount:</p>
              <p className="text-xl font-bold text-emerald-700">
                {currency(parseFloat(form.quantity_liters) * parseFloat(form.rate_per_liter))}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={busy} className="flex-1">Record Collection</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CollectionEntry;
