import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, ShieldAlert, Tractor } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Button, Table, Tr, Td, Badge, Spinner, Empty
} from '../../components/UI';

const FarmerManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFarmers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users?role=farmer');
      // Fetch details for each farmer to get verification status
      const details = await Promise.all(
        data.map(f => api.get(`/users/${f.id}`).then(r => r.data).catch(() => f))
      );
      setFarmers(details);
    } catch {
      toast.error('Failed to load farmers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadFarmers(); }, [loadFarmers]);

  const verifyFarmer = async (id) => {
    if (!window.confirm('Mark this farmer as verified?')) return;
    try {
      await api.put(`/users/${id}/verify-farmer`);
      toast.success('Farmer verified!');
      loadFarmers();
    } catch {
      toast.error('Verification failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Farmer Profiles"
        subtitle="Manage and verify milk suppliers"
      />

      <Card>
        <CardHeader title={`Registered Farmers (${farmers.length})`} />
        {loading ? <Spinner /> : farmers.length === 0 ? <Empty title="No farmers found" /> : (
          <Table headers={['Farmer', 'Contact', 'Farm Details', 'Capacity', 'Verification', 'Action']}>
            {farmers.map(f => (
              <Tr key={f.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700">
                      <Tractor size={16} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{f.name}</p>
                      <p className="text-xs text-gray-500">ID: {f.id.slice(0,8)}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <p className="text-xs">{f.phone || '—'}</p>
                  <p className="text-xs text-gray-400">{f.email}</p>
                </Td>
                <Td>
                  <p className="text-xs font-semibold">{f.farm_name || '—'}</p>
                  <p className="text-xs text-gray-500 truncate w-32">{f.farm_location || f.city || '—'}</p>
                </Td>
                <Td>
                  <p className="text-xs">{f.cattle_count ? `${f.cattle_count} Cattle` : '—'}</p>
                  <p className="text-xs text-gray-500">{f.land_acres ? `${f.land_acres} Acres` : '—'}</p>
                </Td>
                <Td>
                  {f.farmer_verified ? (
                    <Badge text="Verified" status="paid" />
                  ) : (
                    <Badge text="Pending" status="pending" />
                  )}
                </Td>
                <Td>
                  {!f.farmer_verified ? (
                    <Button variant="secondary" onClick={() => verifyFarmer(f.id)}>
                      <CheckCircle size={14} className="mr-1" /> Verify
                    </Button>
                  ) : (
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ShieldAlert size={14} /> Verified
                    </span>
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

export default FarmerManagement;
