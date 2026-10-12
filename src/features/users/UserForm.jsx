import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/utils/constants';
import { getFormErrors } from '@/utils/errors';

const createSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'agent', 'customer']),
});

const editSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
  role: z.enum(['admin', 'agent', 'customer']),
});

export function UserForm({ initial, isEdit = false, isSubmitting, serverError, onSubmit, onCancel }) {
  const schema = isEdit ? editSchema : createSchema;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      email: initial?.email ?? '',
      password: '',
      role: initial?.role.slug ?? 'customer',
    },
  });

  useEffect(() => {
    const fieldErrors = getFormErrors(serverError);
    for (const key of Object.keys(fieldErrors)) {
      setError(key, { message: fieldErrors[key] });
    }
  }, [serverError, setError]);

  function handleSave(values) {
    const formData = {
      name: values.name,
      email: values.email,
      role: values.role,
    };
    if (values.password) {
      formData.password = values.password;
    }
    onSubmit(formData);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSave)} noValidate>
      <Input label="Name" error={errors.name?.message} {...register('name')} />
      <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
      <Input
        label={isEdit ? 'New password (optional)' : 'Password'}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Select
        label="Role"
        options={ROLES.map((role) => ({ value: role, label: role }))}
        error={errors.role?.message}
        {...register('role')}
      />
      <div className="flex justify-end gap-2 pt-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" isLoading={isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
