import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { register as registerUser } from '@/api/authApi';
import { useAuthStore } from '@/features/auth/authStore';
import { getError, getFormErrors } from '@/utils/errors';
import { queryClient } from '@/app/queryClient';
import { queryKeys } from '@/app/queryKeys';

const schema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const registerAction = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
      toast.success('Account created');
      navigate('/', { replace: true });
    },
    onError: (error) => {
      const formErrors = getFormErrors(error);
      for (const key of Object.keys(formErrors)) {
        setError(key, { message: formErrors[key] });
      }
      toast.error(getError(error, 'Registration failed'));
    },
  });

  return (
    <Card className="p-6 shadow-md">
      <h1 className="text-xl font-semibold text-slate-900">Create account</h1>
      <p className="mt-1 text-sm text-slate-600">Register as a customer</p>
      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit((data) => registerAction.mutate(data))}
        noValidate
      >
        <Input label="Name" autoComplete="name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />
        <Button type="submit" className="w-full" isLoading={registerAction.isPending}>
          Register
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
