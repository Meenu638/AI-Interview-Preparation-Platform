import { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, Skeleton } from '../components/ui/Shared';
import { formatDate } from '../utils/helpers';

const AdminPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [statsRes, usersRes, interviewsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/users', { params: { limit: 10 } }),
        api.get('/admin/interviews', { params: { limit: 10 } }),
      ]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data.users);
      setInterviews(interviewsRes.data.data.interviews);
      setLoading(false);
    };
    load();
  }, []);

  const toggleActive = async (id) => {
    const { data } = await api.patch(`/admin/users/${id}/toggle-active`);
    setUsers((prev) => prev.map((u) => (u._id === id ? data.data.user : u)));
  };

  if (loading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Admin Panel</h1>

      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.totalUsers },
          { label: 'Completed Interviews', value: stats.totalInterviews },
          { label: 'Active Today', value: stats.activeToday },
          { label: 'Platform Avg Score', value: `${stats.platformAverageScore}%` },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className="text-2xl font-display font-bold mt-1">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Recent Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-left">
              <tr><th className="pb-2">Name</th><th className="pb-2">Email</th><th className="pb-2">Joined</th><th className="pb-2">Status</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t border-surface-border">
                  <td className="py-2">{u.name}</td>
                  <td className="py-2 text-gray-400">{u.email}</td>
                  <td className="py-2 text-gray-400">{formatDate(u.createdAt)}</td>
                  <td className="py-2">
                    <span className={u.isActive ? 'text-emerald-400' : 'text-rose-400'}>{u.isActive ? 'Active' : 'Deactivated'}</span>
                  </td>
                  <td className="py-2">
                    <button onClick={() => toggleActive(u._id)} className="text-primary-400 hover:text-primary-300 text-xs">
                      {u.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Recent Interviews</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-gray-500 text-left">
              <tr><th className="pb-2">User</th><th className="pb-2">Role</th><th className="pb-2">Type</th><th className="pb-2">Score</th><th className="pb-2">Date</th></tr>
            </thead>
            <tbody>
              {interviews.map((iv) => (
                <tr key={iv._id} className="border-t border-surface-border">
                  <td className="py-2">{iv.user?.name}</td>
                  <td className="py-2">{iv.role}</td>
                  <td className="py-2 capitalize text-gray-400">{iv.type}</td>
                  <td className="py-2">{iv.overallScore != null ? `${iv.overallScore}%` : '—'}</td>
                  <td className="py-2 text-gray-400">{formatDate(iv.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminPage;
