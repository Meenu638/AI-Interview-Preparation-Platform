import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';
import { FiCheckCircle, FiAlertCircle, FiTrendingUp, FiRepeat } from 'react-icons/fi';
import { interviewService } from '../services/interview.service';
import { Card, Skeleton } from '../components/ui/Shared';
import { scoreColor } from '../utils/helpers';
import Button from '../components/ui/Button';

const InterviewResultsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [interview, setInterview] = useState(location.state?.interview || null);
  const [loading, setLoading] = useState(!location.state?.interview);

  useEffect(() => {
    if (interview) return;
    const load = async () => {
      const { data } = await interviewService.getById(id);
      setInterview(data.data.interview);
      setLoading(false);
    };
    load();
  }, [id, interview]);

  const handleRetake = async () => {
    const { data } = await interviewService.retake(id);
    window.location.href = `/interview/${data.data.interview._id}`;
  };

  if (loading || !interview) {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  const fb = interview.overallFeedback || {};
  const radarData = [
    { subject: 'Technical', value: fb.technicalScore || 0 },
    { subject: 'Communication', value: fb.communicationScore || 0 },
    { subject: 'Grammar', value: fb.grammarScore || 0 },
    { subject: 'Confidence', value: fb.confidenceScore || 0 },
    { subject: 'Problem Solving', value: fb.problemSolvingScore || 0 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="text-center">
        <p className="text-sm text-gray-400 mb-2">Overall Score</p>
        <p className={`text-6xl font-display font-extrabold ${scoreColor(interview.overallScore)}`}>
          {interview.overallScore}%
        </p>
        <p className="text-lg font-semibold mt-2">{fb.overallRating}</p>
        <p className="text-sm text-gray-500 mt-1">
          {interview.role} • <span className="capitalize">{interview.type}</span> interview
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold mb-4">Score Breakdown</h2>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="#232946" />
            <PolarAngleAxis dataKey="subject" stroke="#9ca3af" fontSize={12} />
            <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-emerald-400 mb-3">
            <FiCheckCircle /> Strengths
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {(fb.strengths || []).map((s, i) => <li key={i}>• {s}</li>)}
          </ul>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 font-semibold text-amber-400 mb-3">
            <FiAlertCircle /> Areas to Improve
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {(fb.weaknesses || []).map((w, i) => <li key={i}>• {w}</li>)}
          </ul>
        </Card>
      </div>

      <Card>
        <h3 className="flex items-center gap-2 font-semibold text-primary-400 mb-3">
          <FiTrendingUp /> Suggestions
        </h3>
        <ul className="space-y-2 text-sm text-gray-300">
          {(fb.suggestions || []).map((s, i) => <li key={i}>• {s}</li>)}
        </ul>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <Button variant="secondary" onClick={handleRetake}>
          <FiRepeat /> Retake Interview
        </Button>
        <Link to="/history"><Button>View All History</Button></Link>
      </div>
    </div>
  );
};

export default InterviewResultsPage;
