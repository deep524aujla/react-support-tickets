import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Skeleton } from '@/components/ui/Skeleton';
import { Select } from '@/components/ui/Select';
import { PriorityBadge, StatusBadge } from '@/features/tickets/ticketBadges';
import { TicketForm } from '@/features/tickets/TicketForm';
import { useTicket } from '@/features/tickets/useTickets';
import { useDeleteTicket, useUpdateTicket } from '@/features/tickets/useTicketActions';
import { CommentList } from '@/features/comments/CommentList';
import { AttachmentList } from '@/features/attachments/AttachmentList';
import { useAuth } from '@/features/auth/useAuth';
import { formatDate } from '@/utils/formatDate';
import { STATUS_LABELS, TICKET_STATUSES } from '@/utils/constants';
import { getError } from '@/utils/errors';

export function TicketDetail() {
  const params = useParams();
  const ticketId = Number(params.id);
  const navigate = useNavigate();
  const { user, can } = useAuth();
  const { data: ticket, isLoading, isError, error } = useTicket(ticketId);
  const updateAction = useUpdateTicket(ticketId);
  const deleteAction = useDeleteTicket(() => navigate('/tickets'));
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  let canEdit = false;
  if (ticket && user) {
    if (can('tickets.updateAny')) {
      canEdit = true;
    } else if (can('tickets.updateAssigned') && ticket.assigned_to === user.id) {
      canEdit = true;
    } else if (ticket.user_id === user.id) {
      canEdit = true;
    }
  }

  const canDelete = can('tickets.delete');

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !ticket) {
    return (
      <div className="space-y-4">
        <Link to="/tickets" className="inline-flex items-center gap-2 text-sm text-brand-600">
          <ArrowLeft className="h-4 w-4" />
          Back to tickets
        </Link>
        <p className="text-red-600" role="alert">
          {getError(error, 'Ticket not found')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/tickets" className="inline-flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700">
            <ArrowLeft className="h-4 w-4" />
            Back to tickets
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">{ticket.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <span className="text-xs text-slate-500">Updated {formatDate(ticket.updated_at)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit ? (
            <Button variant="secondary" onClick={() => setEditOpen(true)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
          ) : null}
          {canDelete ? (
            <Button variant="danger" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{ticket.description}</p>
        </div>
        {canEdit ? (
          <div className="max-w-xs">
            <Select
              label="Status"
              value={ticket.status}
              onChange={(event) => updateAction.mutate({ status: event.target.value })}
              options={TICKET_STATUSES.map((status) => ({
                value: status,
                label: STATUS_LABELS[status],
              }))}
            />
          </div>
        ) : null}
        {ticket.user ? (
          <p className="text-sm text-slate-600">
            Created by <span className="font-medium text-slate-900">{ticket.user.name}</span>
          </p>
        ) : null}
      </Card>

      <CommentList ticketId={ticketId} />
      <AttachmentList ticketId={ticketId} />

      <Modal open={editOpen} title="Edit ticket" onClose={() => setEditOpen(false)}>
        <TicketForm
          initial={ticket}
          showStatus={canEdit}
          isSubmitting={updateAction.isPending}
          serverError={updateAction.error}
          onSubmit={(formData) =>
            updateAction.mutate(formData, {
              onSuccess: () => setEditOpen(false),
            })
          }
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <ConfirmModal
        open={deleteOpen}
        title="Delete ticket"
        message="This action cannot be undone. Delete this ticket?"
        confirmLabel="Delete"
        isLoading={deleteAction.isPending}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteAction.mutate(ticketId)}
      />
    </div>
  );
}
