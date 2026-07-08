import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { analyticsService } from '../services/misc.service';
import { Card, Skeleton, EmptyState } from '../components/ui/Shared';
import { formatDate } from '../utils/helpers';

const AnalyticsPage = () => {
  const [trend, setTrend] = useState([]);
  const [topics, setTopics] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [trendRes, topicsRes, breakdownRes] = await Promise.all([
        analyticsService.trend(90),
        analyticsService.topics(),
        analyticsService.breakdown(),
      ]);
      setTrend(trendRes.data.data.trend.map((t) => ({ date: formatDate(t.completedAt), score: t.overallScore })));
      setTopics(topicsRes.data.data.topics.filter((t) => t._id).map((t) => ({ topic: t._id, score: Math.round(t.avgScore) })));
      setBreakdown(breakdownRes.data.data.breakdown);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const breakdownData = breakdown
    ? [
        { name: 'Technical', score: Math.round(breakdown.technicalScore) },
        { name: 'Communication', score: Math.round(breakdown.communicationScore) },
        { name: 'Grammar', score: Math.round(breakdown.grammarScore) },
        { name: 'Confidence', score: Math.round(breakdown.confidenceScore) },
        { name: 'Problem Solving', score: Math.round(breakdown.problemSolvingScore) },
      ]
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-display font-bold">Analytics</h1>

      <Card>
        <h2 className="font-semibold mb-4">Score Trend (90 days)</h2>
        {trend.length === 0 ? (
          <EmptyState title="No data yet" description="Complete interviews to build your trend." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#151a2e', border: '1px solid #232946', borderRadius: 12 }} />
              <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold mb-4">Topic-Wise Performance</h2>
          {topics.length === 0 ? (
            <EmptyState title="No topic data yet" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topics} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="topic" type="category" width={120} stroke="#9ca3af" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#151a2e', border: '1px solid #232946', borderRadius: 12 }} />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card>
          <h2 className="font-semibold mb-4">Score Breakdown</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={breakdownData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232946" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
              <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#151a2e', border: '1px solid #232946', borderRadius: 12 }} />
              <Bar dataKey="score" fill="#fb7185" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
