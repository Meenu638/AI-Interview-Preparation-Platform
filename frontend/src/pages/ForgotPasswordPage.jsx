import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/auth.service';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await authService.forgotPassword(values.email);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Check your inbox</h1>
        <p className="text-sm text-gray-400 mb-6">
          If an account exists with that email, we've sent a password reset link.
        </p>
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium text-sm">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-center mb-1">Forgot password?</h1>
      <p className="text-sm text-gray-400 text-center mb-6">Enter your email and we'll send you a reset link</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
          {...register('email', { required: 'Email is required' })}
        />
        <Button type="submit" loading={loading} className="w-full">
          Send Reset Link
        </Button>
      </form>

      <p className="text-sm text-gray-400 text-center mt-6">
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
          Back to login
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
