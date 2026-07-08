import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMic, FiMicOff, FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi';
import { interviewService } from '../services/interview.service';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { useElapsedTimer } from '../hooks/useTimer';
import { formatDuration } from '../utils/helpers';
import WebcamPanel from '../components/interview/WebcamPanel';
import CodingPanel from '../components/interview/CodingPanel';
import { Card, Skeleton } from '../components/ui/Shared';
import Button from '../components/ui/Button';

const InterviewScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [codeAnswer, setCodeAnswer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const { isListening, transcript, isSupported, startListening, stopListening, resetTranscript } = useSpeechToText();
  const { elapsed, start, stop, reset } = useElapsedTimer();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await interviewService.getById(id);
        setInterview(data.data.interview);
        if (data.data.interview.status === 'pending') {
          await interviewService.start(id);
        }
        start();
      } catch {
        toast.error('Could not load interview.');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const questions = interview?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSubmitAnswer = useCallback(async () => {
    if (!currentQuestion) return;
    setSubmitting(true);
    try {
      const timeTakenSeconds = stop();
      await interviewService.submitAnswer(id, {
        questionId: currentQuestion._id,
        textAnswer,
        transcribedAnswer: transcript,
        codeAnswer: currentQuestion.type === 'coding' ? codeAnswer : undefined,
        timeTakenSeconds,
      });
      toast.success('Answer submitted!');

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1);
        setTextAnswer('');
        resetTranscript();
        reset();
        start();
      } else {
        const { data } = await interviewService.complete(id);
        navigate(`/interview/${id}/results`, { state: { interview: data.data.interview } });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  }, [currentQuestion, currentIndex, questions.length, textAnswer, transcript, codeAnswer, id, navigate, resetTranscript, reset, start, stop]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-gray-400">
            Question {currentIndex + 1} of {questions.length} • <span className="capitalize">{currentQuestion.type}</span>
          </p>
          <div className="w-64 h-1.5 bg-surface-border rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className="glass-card !py-2 !px-4 flex items-center gap-2 text-sm font-mono">
          ⏱ {formatDuration(elapsed)}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <span className="text-xs uppercase tracking-wide text-primary-400 font-semibold">{currentQuestion.topic}</span>
            <h2 className="text-xl font-display font-semibold mt-2">{currentQuestion.text}</h2>
          </Card>

          {currentQuestion.type === 'coding' ? (
            <CodingPanel starterCode={currentQuestion.codingMeta?.starterCode} onChange={setCodeAnswer} />
          ) : (
            <Card>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-400">Your Answer</label>
                {isSupported && (
                  <button
                    onClick={() => (isListening ? stopListening() : startListening())}
                    className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${
                      isListening ? 'bg-rose-600 text-white' : 'bg-surface-light text-gray-300'
                    }`}
                  >
                    {isListening ? <FiMicOff /> : <FiMic />}
                    {isListening ? 'Stop Recording' : 'Speak Answer'}
                  </button>
                )}
              </div>
              <textarea
                className="input-field min-h-[180px] resize-none"
                placeholder="Type your answer, or use the mic to speak it..."
                value={textAnswer || transcript}
                onChange={(e) => setTextAnswer(e.target.value)}
              />
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button variant="ghost" disabled={currentIndex === 0} onClick={() => setCurrentIndex((i) => i - 1)}>
              <FiChevronLeft /> Previous
            </Button>
            <Button onClick={handleSubmitAnswer} loading={submitting}>
              {currentIndex < questions.length - 1 ? (
                <>Next <FiChevronRight /></>
              ) : (
                <>Finish Interview <FiCheckCircle /></>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <WebcamPanel />
          <Card>
            <h3 className="text-sm font-semibold mb-2">Interview Details</h3>
            <dl className="text-sm space-y-1.5 text-gray-400">
              <div className="flex justify-between"><dt>Role</dt><dd className="text-white">{interview.role}</dd></div>
              <div className="flex justify-between"><dt>Difficulty</dt><dd className="text-white capitalize">{interview.difficulty}</dd></div>
              <div className="flex justify-between"><dt>Type</dt><dd className="text-white capitalize">{interview.type}</dd></div>
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewScreen;
