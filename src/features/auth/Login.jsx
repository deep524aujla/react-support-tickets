import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { login } from '@/api/authApi';
import { useAuthStore } from '@/features/auth/authStore';
import { getError, getFormErrors } from '@/utils/errors';
import { queryClient } from '@/app/queryClient';
import { queryKeys } from '@/app/queryKeys';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const from = location.state?.from?.pathname ?? '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const loginAction = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
     
      setAuth(data.user, data.token);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      toast.success('Welcome back');
      navigate(from, { replace: true });
    },
    onError: (error) => {
      const formErrors = getFormErrors(error);
      if (formErrors.email) {
        setError('email', { message: formErrors.email });
      }
      if (formErrors.password) {
        setError('password', { message: formErrors.password });
      }
      toast.error(getError(error, 'Login failed'));
    },
  });

  return (
    <Card className="p-6 shadow-md">
      <h1 className="text-xl font-semibold text-slate-900">Sign in</h1>
      <p className="mt-1 text-sm text-slate-600">Access your support tickets</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit((data) => loginAction.mutate(data))} noValidate>
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Button type="submit" className="w-full" isLoading={loginAction.isPending}>
          Sign in
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        No account?{' '}
        <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">
          Register
        </Link>
      </p>
    </Card>
  );
}
