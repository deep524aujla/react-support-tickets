import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CommentForm } from '@/features/comments/CommentForm';
import { formatDate } from '@/utils/formatDate';

export function CommentItem({ comment, canEdit, canDelete, onUpdate, onDelete, isUpdating, isDeleting }) {
  const [editing, setEditing] = useState(false);

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-900">{comment.user?.name ?? 'User'}</p>
          <p className="text-xs text-slate-500">{formatDate(comment.created_at)}</p>
        </div>
        <div className="flex gap-1">
          {canEdit ? (
            <Button variant="ghost" aria-label="Edit comment" onClick={() => setEditing(!editing)}>
              <Pencil className="h-4 w-4" />
            </Button>
          ) : null}
          {canDelete ? (
            <Button variant="ghost" aria-label="Delete comment" onClick={onDelete} isLoading={isDeleting}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          ) : null}
        </div>
      </div>
      {editing ? (
        <div className="mt-3">
          <CommentForm
            initialBody={comment.body}
            submitLabel="Save"
            isLoading={isUpdating}
            onSubmit={(body) => {
              onUpdate(body);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{comment.body}</p>
      )}
    </article>
  );
}
