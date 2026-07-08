import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiPlusCircle, FiTrendingUp, FiTarget, FiZap, FiAward } from 'react-icons/fi';
import { analyticsService } from '../services/misc.service';
import { useAuth } from '../context/AuthContext';
import { Card, Skeleton, EmptyState } from '../components/ui/Shared';
import { scoreColor, formatDate } from '../utils/helpers';

const DashboardPage = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dashRes, trendRes] = await Promise.all([
          analyticsService.dashboard(),
          analyticsService.trend(30),
        ]);
        setDashboard(dashRes.data.data);
        setTrend(
          trendRes.data.data.trend.map((t) => ({
            date: formatDate(t.completedAt),
            score: t.overallScore,
          }))
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Interviews', value: dashboard?.stats?.totalInterviews || 0, icon: FiTarget, color: 'text-primary-400' },
    { label: 'Average Score', value: `${Math.round(dashboard?.stats?.averageScore || 0)}%`, icon: FiTrendingUp, color: 'text-emerald-400' },
    { label: 'Current Streak', value: `${dashboard?.streak?.current || 0} days`, icon: FiZap, color: 'text-accent-amber' },
    { label: 'Questions Answered', value: dashboard?.stats?.totalQuestionsAnswered || 0, icon: FiAward, color: 'text-accent-rose' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold">Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
          <p className="text-sm text-gray-400 mt-1">Here's how your prep is going.</p>
        </div>
        <Link to="/interview/new" className="btn-primary">
          <FiPlusCircle /> New Interview
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{label}</span>
              <Icon className={`text-xl ${color}`} />
            </div>
            <p className="text-2xl font-display font-bold">{value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="font-semibold mb-4">Performance Trend (30 days)</h2>
        {trend.length === 0 ? (
          <EmptyState title="No data yet" description="Complete an interview to see your score trend." />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#151a2e', border: '1px solid #232946', borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">Recent Interviews</h2>
          {dashboard?.recentInterviews?.length === 0 ? (
            <EmptyState title="No interviews yet" description="Start your first mock interview now." />
          ) : (
            <div className="space-y-3">
              {dashboard?.recentInterviews?.map((iv) => (
                <Link
                  key={iv._id}
                  to={`/interview/${iv._id}/results`}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-light hover:bg-surface-border transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium">{iv.role}</p>
                    <p className="text-xs text-gray-500 capitalize">{iv.type} • {formatDate(iv.completedAt)}</p>
                  </div>
                  <span className={`font-display font-bold ${scoreColor(iv.overallScore)}`}>{iv.overallScore}%</span>
                </Link>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Weak Topics to Practice</h2>
          {dashboard?.weakTopics?.length === 0 ? (
            <EmptyState title="Nothing to show yet" description="Complete more interviews to surface weak topics." />
          ) : (
            <div className="space-y-2">
              {dashboard?.weakTopics?.map((topic) => (
                <div key={topic} className="flex items-center justify-between p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-sm font-medium">{topic}</span>
                  <Link to="/interview/new" className="text-xs text-rose-400 hover:text-rose-300">Practice →</Link>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
