import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Boxes } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Button, Input, Select,
  Modal, Table, Tr, Td, Badge, Spinner, Empty
} from '../../components/UI';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy]         = useState(false);

  const [form, setForm] = useState({
    product_id: '', quantity: '', batch_no: '', manufacture_date: '', expiry_date: '', location: ''
  });

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.value }));

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post(`/products/${form.product_id}/inventory`, form);
      toast.success('Stock added successfully!');
      setShowModal(false);
      setForm({ product_id: '', quantity: '', batch_no: '', manufacture_date: '', expiry_date: '', location: '' });
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add stock');
    } finally {
      setBusy(false);
    }
  };

  const openAddStock = (productId = '') => {
    setForm(prev => ({ ...prev, product_id: productId }));
    setShowModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Inventory Tracking"
        subtitle="Manage warehouse stock levels and batches"
        action={<Button icon={Plus} onClick={() => openAddStock()}>Add Stock Batch</Button>}
      />

      <Card>
        <CardHeader title={`Warehouse Overview (${products.length} Items)`} />
        {loading ? <Spinner /> : products.length === 0 ? <Empty title="No products found" /> : (
          <Table headers={['Product', 'SKU', 'Available Stock', 'Status', 'Action']}>
            {products.map(p => {
              const stock = parseFloat(p.stock);
              let status = 'paid';
              let statusText = 'In Stock';
              if (stock === 0) { status = 'cancelled'; statusText = 'Out of Stock'; }
              else if (stock < 20) { status = 'pending'; statusText = 'Low Stock'; }

              return (
                <Tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500">
                        <Boxes size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.category}</p>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-xs text-gray-500">{p.sku || '—'}</Td>
                  <Td className="font-bold text-gray-900">{stock.toFixed(1)} {p.unit}</Td>
                  <Td><Badge text={statusText} status={status} /></Td>
                  <Td>
                    <Button variant="secondary" onClick={() => openAddStock(p.id)}>
                      + Add Stock
                    </Button>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Stock Batch">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Select label="Product *" value={form.product_id} onChange={set('product_id')} required className="col-span-2">
              <option value="">Select a product...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (Current: {parseFloat(p.stock).toFixed(0)} {p.unit})</option>
              ))}
            </Select>
            <Input label="Quantity *" type="number" step="0.1" min="0.1" value={form.quantity} onChange={set('quantity')} required />
            <Input label="Batch Number" value={form.batch_no} onChange={set('batch_no')} />
            <Input label="Manufacture Date" type="date" value={form.manufacture_date} onChange={set('manufacture_date')} />
            <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={set('expiry_date')} />
            <Input label="Warehouse Location" value={form.location} onChange={set('location')} className="col-span-2" placeholder="e.g. Shelf A4" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={busy} className="flex-1">Save Stock</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
