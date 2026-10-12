import { Skeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { CommentForm } from '@/features/comments/CommentForm';
import { CommentItem } from '@/features/comments/CommentItem';
import { useComments, useCreateComment, useDeleteComment, useUpdateComment } from '@/features/comments/useComments';
import { useAuth } from '@/features/auth/useAuth';

export function CommentList({ ticketId }) {
  const { user } = useAuth();
  const { data, isLoading } = useComments(ticketId);
  const createAction = useCreateComment(ticketId);
  const updateAction = useUpdateComment(ticketId);
  const deleteAction = useDeleteComment(ticketId);

  return (
    <section className="space-y-4" aria-label="Comments">
      <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
      <CommentForm isLoading={createAction.isPending} onSubmit={(body) => createAction.mutate({ body })} />
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full" />
          ))}
        </div>
      ) : null}
      {!isLoading && (!data || data.length === 0) ? (
        <EmptyState title="No comments yet" description="Be the first to reply on this ticket." />
      ) : null}
      {!isLoading && data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((comment) => {
            const isOwner = user?.id === comment.user_id;
            return (
              <CommentItem
                key={comment.id}
                comment={comment}
                canEdit={isOwner}
                canDelete={isOwner}
                onUpdate={(body) => updateAction.mutate({ id: comment.id, body })}
                onDelete={() => deleteAction.mutate(comment.id)}
                isUpdating={updateAction.isPending}
                isDeleting={deleteAction.isPending}
              />
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
