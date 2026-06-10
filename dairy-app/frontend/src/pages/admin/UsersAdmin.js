import React, { useEffect, useState, useCallback } from 'react';
import { User, ShieldOff, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import {
  PageHeader, Card, CardHeader, Table, Tr, Td, Badge, Spinner, Empty
} from '../../components/UI';

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-700',
  farmer: 'bg-green-100 text-green-700',
  wholesaler: 'bg-blue-100 text-blue-700',
  retailer: 'bg-orange-100 text-orange-700',
  consumer: 'bg-teal-100 text-teal-700',
  delivery_agent: 'bg-yellow-100 text-yellow-700'
};

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const toggleActive = async (id, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) return;
    try {
      await api.put(`/users/${id}/toggle`);
      toast.success('User status updated');
      loadUsers();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Manage all system users, roles, and access"
      />

      <Card>
        <CardHeader title={`All Users (${users.length})`} />
        {loading ? <Spinner /> : users.length === 0 ? <Empty title="No users found" /> : (
          <Table headers={['User', 'Role', 'Contact', 'Location', 'Joined', 'Status', 'Action']}>
            {users.map(u => (
              <Tr key={u.id}>
                <Td>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs uppercase">
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{u.name}</p>
                      <p className="text-[10px] text-gray-400">ID: {u.id.slice(0,8)}</p>
                    </div>
                  </div>
                </Td>
                <Td>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-700'}`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </Td>
                <Td>
                  <p className="text-xs">{u.email}</p>
                  <p className="text-xs text-gray-500">{u.phone || '—'}</p>
                </Td>
                <Td>
                  <p className="text-xs">{u.city || '—'}</p>
                  <p className="text-[10px] text-gray-500">{u.state || ''}</p>
                </Td>
                <Td className="text-xs text-gray-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </Td>
                <Td>
                  {u.is_active ? <Badge text="Active" status="paid" /> : <Badge text="Inactive" status="cancelled" />}
                </Td>
                <Td>
                  <button 
                    onClick={() => toggleActive(u.id, u.is_active)}
                    className={`p-1.5 rounded flex items-center gap-1 text-xs font-semibold transition ${u.is_active ? 'text-red-600 hover:bg-red-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
                  >
                    {u.is_active ? <><ShieldOff size={14} /> Disable</> : <><ShieldCheck size={14} /> Enable</>}
                  </button>
                </Td>
              </Tr>
            ))}
          </Table>
        )}
      </Card>
    </div>
  );
};

export default UsersAdmin;
