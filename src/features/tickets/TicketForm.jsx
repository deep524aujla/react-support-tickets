import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { PRIORITY_LABELS, STATUS_LABELS, TICKET_PRIORITIES, TICKET_STATUSES } from '@/utils/constants';
import { getFormErrors } from '@/utils/errors';

const schema = z.object({
  title: z.string().min(3, 'Title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']).optional(),
});

export function TicketForm({
  initial,
  showStatus = false,
  isSubmitting = false,
  serverError,
  onSubmit,
  onCancel,
}) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? '',
      description: initial?.description ?? '',
      priority: initial?.priority ?? 'medium',
      status: initial?.status ?? 'open',
    },
  });

  useEffect(() => {
    const fieldErrors = getFormErrors(serverError);
    for (const key of Object.keys(fieldErrors)) {
      setError(key, { message: fieldErrors[key] });
    }
  }, [serverError, setError]);

  function handleSave(values) {
    const data = {
      title: values.title,
      description: values.description,
      priority: values.priority,
    };
    if (showStatus && values.status) {
      data.status = values.status;
    }
    onSubmit(data);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleSave)} noValidate>
      <Input label="Title" error={errors.title?.message} {...register('title')} />
      <Textarea label="Description" error={errors.description?.message} {...register('description')} />
      <Select
        label="Priority"
        options={TICKET_PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] }))}
        error={errors.priority?.message}
        {...register('priority')}
      />
      {showStatus ? (
        <Select
          label="Status"
          options={TICKET_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }))}
          error={errors.status?.message}
          {...register('status')}
        />
      ) : null}
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
