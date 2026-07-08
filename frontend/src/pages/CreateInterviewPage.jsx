import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiBriefcase, FiCpu, FiUsers, FiCode, FiShuffle } from 'react-icons/fi';
import { interviewService } from '../services/interview.service';
import { Card } from '../components/ui/Shared';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const TYPES = [
  { value: 'technical', label: 'Technical', icon: FiCpu },
  { value: 'hr', label: 'HR', icon: FiUsers },
  { value: 'behavioral', label: 'Behavioral', icon: FiBriefcase },
  { value: 'coding', label: 'Coding', icon: FiCode },
  { value: 'mixed', label: 'Mixed', icon: FiShuffle },
];

const CreateInterviewPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      type: 'technical',
      difficulty: 'medium',
      experience: '1-3',
      questionCount: 5,
      skills: '',
    },
  });

  const selectedType = watch('type');

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        ...values,
        skills: values.skills.split(',').map((s) => s.trim()).filter(Boolean),
        questionCount: Number(values.questionCount),
      };
      const { data } = await interviewService.create(payload);
      toast.success('Interview generated!');
      navigate(`/interview/${data.data.interview._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate interview.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-display font-bold mb-1">Create a New Interview</h1>
      <p className="text-sm text-gray-400 mb-6">Configure your mock interview and let AI generate tailored questions.</p>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="Target Role"
              placeholder="e.g. Frontend Developer"
              error={errors.role}
              {...register('role', { required: 'Role is required' })}
            />
            <Input label="Target Company (optional)" placeholder="e.g. Google" {...register('company')} />
          </div>

          <Input
            label="Skills (comma-separated)"
            placeholder="React, Node.js, System Design"
            error={errors.skills}
            {...register('skills', { required: 'At least one skill is required' })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Interview Type</label>
            <div className="grid grid-cols-5 gap-2">
              {TYPES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setValue('type', value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${
                    selectedType === value
                      ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                      : 'bg-surface-light border-surface-border text-gray-400 hover:border-primary-500/40'
                  }`}
                >
                  <Icon />
                  <span className="text-xs">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Experience</label>
              <select {...register('experience')} className="input-field">
                <option value="fresher">Fresher</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="3-5">3-5 years</option>
                <option value="5-8">5-8 years</option>
                <option value="8+">8+ years</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Difficulty</label>
              <select {...register('difficulty')} className="input-field">
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            <Input
              label="Question Count"
              type="number"
              min={1}
              max={50}
              {...register('questionCount', { required: true, min: 1, max: 50 })}
            />
          </div>

          <Button type="submit" loading={loading} className="w-full">
            Generate Interview
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateInterviewPage;
