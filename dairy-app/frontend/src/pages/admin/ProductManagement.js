import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Package, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Button, Input, Select,
  Modal, Table, Tr, Td, Badge, Spinner, currency, Empty
} from '../../components/UI';

const CATEGORY_MAP = {
  1: 'Milk', 2: 'Ghee', 3: 'Paneer', 4: 'Yogurt',
  5: 'Butter', 6: 'Cream', 7: 'Ice Cream', 8: 'Cheese'
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy]         = useState(false);
  const [editId, setEditId]     = useState(null);

  const defaultForm = {
    category_id: 1, name: '', sku: '', description: '', unit: 'litre',
    consumer_price: '', retailer_price: '', wholesaler_price: '', image_url: '', is_active: true
  };
  const [form, setForm] = useState(defaultForm);

  const set = (f) => (e) => setForm(prev => ({ ...prev, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleEdit = async (id) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setForm({
        category_id: data.category_id,
        name: data.name,
        sku: data.sku || '',
        description: data.description || '',
        unit: data.unit,
        consumer_price: data.consumer_price,
        retailer_price: data.retailer_price,
        wholesaler_price: data.wholesaler_price,
        image_url: data.image_url || '',
        is_active: data.is_active
      });
      setEditId(id);
      setShowModal(true);
    } catch {
      toast.error('Failed to load product details');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deactivated');
      loadProducts();
    } catch {
      toast.error('Failed to deactivate product');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editId) {
        await api.put(`/products/${editId}`, form);
        toast.success('Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('Product created!');
      }
      setShowModal(false);
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save product');
    } finally {
      setBusy(false);
    }
  };

  const openNew = () => {
    setForm(defaultForm);
    setEditId(null);
    setShowModal(true);
  };

  return (
    <div>
      <PageHeader
        title="Product Catalog"
        subtitle="Manage available products and role-based pricing"
        action={<Button icon={Plus} onClick={openNew}>New Product</Button>}
      />

      <Card>
        <CardHeader title={`All Products (${products.length})`} />
        {loading ? <Spinner /> : products.length === 0 ? <Empty title="No products found" /> : (
          <Table headers={['Product', 'Category', 'SKU', 'Unit', 'MRP', 'Stock', 'Actions']}>
            {products.map(p => (
              <Tr key={p.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Package size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{p.name}</p>
                    </div>
                  </div>
                </Td>
                <Td><Badge text={p.category} status="paid" /></Td>
                <Td className="text-xs text-gray-500">{p.sku || '—'}</Td>
                <Td className="text-xs">{p.unit}</Td>
                <Td className="font-semibold">{currency(p.mrp)}</Td>
                <Td>
                  <Badge text={`${parseFloat(p.stock).toFixed(0)} left`} status={p.stock > 10 ? 'paid' : 'cancelled'} />
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editId ? "Edit Product" : "New Product"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Product Name *" value={form.name} onChange={set('name')} required className="col-span-2" />
            <Select label="Category *" value={form.category_id} onChange={set('category_id')}>
              {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </Select>
            <Input label="SKU" value={form.sku} onChange={set('sku')} />
            <Select label="Unit *" value={form.unit} onChange={set('unit')}>
              <option value="litre">Litre (L)</option>
              <option value="kg">Kilogram (kg)</option>
              <option value="gm">Gram (gm)</option>
              <option value="pcs">Pieces (pcs)</option>
            </Select>
            <Input label="Image URL" value={form.image_url} onChange={set('image_url')} />
            
            <div className="col-span-2 border-t pt-3 mt-2 grid grid-cols-3 gap-3">
              <Input label="Consumer Price (MRP) *" type="number" step="0.01" value={form.consumer_price} onChange={set('consumer_price')} required />
              <Input label="Retailer Price *" type="number" step="0.01" value={form.retailer_price} onChange={set('retailer_price')} required />
              <Input label="Wholesaler Price *" type="number" step="0.01" value={form.wholesaler_price} onChange={set('wholesaler_price')} required />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-700">Description</label>
              <textarea rows={2} value={form.description} onChange={set('description')}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 mt-1" />
            </div>

            {editId && (
              <div className="col-span-2 flex items-center gap-2 mt-2">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={set('is_active')} className="w-4 h-4 text-emerald-600 rounded" />
                <label htmlFor="is_active" className="text-sm text-gray-700">Product is active and visible in catalog</label>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" loading={busy} className="flex-1">{editId ? 'Save Changes' : 'Create Product'}</Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
