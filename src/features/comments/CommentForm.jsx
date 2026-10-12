import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  body: z.string().min(1, 'Comment is required'),
});

export function CommentForm({ initialBody = '', submitLabel = 'Add comment', isLoading, onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { body: initialBody },
  });

  function handleSave(values) {
    onSubmit(values.body);
    if (!initialBody) {
      reset({ body: '' });
    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit(handleSave)}>
      <Textarea label="Comment" error={errors.body?.message} {...register('body')} />
      <div className="flex justify-end gap-2">
        {onCancel ? (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
        <Button type="submit" isLoading={isLoading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
