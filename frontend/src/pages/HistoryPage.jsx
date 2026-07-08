import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiRepeat, FiBookmark, FiEye } from 'react-icons/fi';
import { interviewService } from '../services/interview.service';
import { Card, EmptyState, Skeleton } from '../components/ui/Shared';
import { scoreColor, formatDate } from '../utils/helpers';

const STATUS_FILTERS = ['all', 'completed', 'in-progress', 'abandoned'];

const HistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await interviewService.list({
        status: status === 'all' ? undefined : status,
        search: search || undefined,
      });
      setInterviews(data.data.items);
    } finally {
      setLoading(false);
    }
  }, [status, search]);

  useEffect(() => {
    const debounce = setTimeout(load, 300);
    return () => clearTimeout(debounce);
  }, [load]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this interview permanently?')) return;
    await interviewService.delete(id);
    toast.success('Interview deleted.');
    setInterviews((prev) => prev.filter((i) => i._id !== id));
  };

  const handleRetake = async (id) => {
    const { data } = await interviewService.retake(id);
    window.location.href = `/interview/${data.data.interview._id}`;
  };

  const handleBookmark = async (id) => {
    await interviewService.toggleBookmark(id);
    setInterviews((prev) => prev.map((i) => (i._id === id ? { ...i, isBookmarked: !i.isBookmarked } : i)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-display font-bold">Interview History</h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role or company..."
              className="pl-9 pr-4 py-2 rounded-xl bg-surface-light border border-surface-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field !py-2 !w-auto">
            {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>
      ) : interviews.length === 0 ? (
        <EmptyState title="No interviews found" description="Try adjusting your filters or start a new interview." />
      ) : (
        <div className="space-y-3">
          {interviews.map((iv) => (
            <Card key={iv._id} className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">{iv.role}{iv.company && ` @ ${iv.company}`}</p>
                <p className="text-xs text-gray-500 capitalize mt-0.5">
                  {iv.type} • {iv.difficulty} • {formatDate(iv.createdAt)} • <span className="capitalize">{iv.status}</span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                {iv.overallScore != null && (
                  <span className={`font-display font-bold text-lg ${scoreColor(iv.overallScore)}`}>{iv.overallScore}%</span>
                )}
                <button onClick={() => handleBookmark(iv._id)} className={iv.isBookmarked ? 'text-accent-amber' : 'text-gray-500 hover:text-white'}>
                  <FiBookmark />
                </button>
                <Link to={iv.status === 'completed' ? `/interview/${iv._id}/results` : `/interview/${iv._id}`} className="text-gray-400 hover:text-white">
                  <FiEye />
                </Link>
                <button onClick={() => handleRetake(iv._id)} className="text-gray-400 hover:text-white">
                  <FiRepeat />
                </button>
                <button onClick={() => handleDelete(iv._id)} className="text-gray-400 hover:text-rose-400">
                  <FiTrash2 />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
