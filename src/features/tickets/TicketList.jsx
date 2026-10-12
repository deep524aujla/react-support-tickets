import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '@/components/ui/Table';
import { TicketFilters } from '@/features/tickets/TicketFilters';
import { TicketForm } from '@/features/tickets/TicketForm';
import { PriorityBadge, StatusBadge } from '@/features/tickets/ticketBadges';
import { useTickets } from '@/features/tickets/useTickets';
import { useCreateTicket } from '@/features/tickets/useTicketActions';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';
import { formatDate } from '@/utils/formatDate';
import { getError } from '@/utils/errors';
import { useAuth } from '@/features/auth/useAuth';

export function TicketList() {
  const { can } = useAuth();
  const { page, perPage, setPage, resetPage } = usePagination();
  const [filters, setFilters] = useState({ sort: 'created_at', order: 'desc' });
  const [modalOpen, setModalOpen] = useState(false);
  const search = useDebounce(filters.search ?? '');

  const queryFilters = {
    ...filters,
    search: search || undefined,
    page,
    per_page: perPage,
  };

  const { data, isLoading, isFetching, isError, error } = useTickets(queryFilters);
  const createAction = useCreateTicket(() => setModalOpen(false));
  const tickets = data?.data ?? [];
  const meta = data?.meta;

  function handleFilterChange(patch) {
    resetPage();
    setFilters((current) => ({ ...current, ...patch }));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Tickets</h1>
          <p className="text-sm text-slate-600">Track and manage support requests</p>
        </div>
        {can('tickets.create') ? (
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        ) : null}
      </div>

      <TicketFilters filters={filters} onChange={handleFilterChange} />

      {isError ? (
        <p className="text-sm text-red-600" role="alert">
          {getError(error)}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      ) : null}

      {!isLoading && tickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="Try adjusting filters or create a new ticket."
          action={
            can('tickets.create') ? <Button onClick={() => setModalOpen(true)}>Create ticket</Button> : undefined
          }
        />
      ) : null}

      {!isLoading && tickets.length > 0 ? (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Title</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Priority</TableHeaderCell>
                  <TableHeaderCell>Updated</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <Link to={`/tickets/${ticket.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                        {ticket.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={ticket.status} />
                    </TableCell>
                    <TableCell>
                      <PriorityBadge priority={ticket.priority} />
                    </TableCell>
                    <TableCell>{formatDate(ticket.updated_at ?? ticket.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid gap-3 md:hidden">
            {tickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-medium text-slate-900">{ticket.title}</h2>
                  <StatusBadge status={ticket.status} />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <PriorityBadge priority={ticket.priority} />
                  <span className="text-xs text-slate-500">
                    {formatDate(ticket.updated_at ?? ticket.created_at)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {meta ? (
            <Pagination
              page={meta.current_page}
              lastPage={meta.last_page}
              total={meta.total}
              onPageChange={setPage}
            />
          ) : null}

          {isFetching && !isLoading ? <p className="text-xs text-slate-500">Updating...</p> : null}
        </>
      ) : null}

      <Modal open={modalOpen} title="New ticket" onClose={() => setModalOpen(false)}>
        <TicketForm
          isSubmitting={createAction.isPending}
          serverError={createAction.error}
          onSubmit={(formData) => createAction.mutate(formData)}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
