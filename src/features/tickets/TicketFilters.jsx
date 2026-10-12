import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PRIORITY_LABELS, STATUS_LABELS, TICKET_PRIORITIES, TICKET_STATUSES } from '@/utils/constants';

export function TicketFilters({ filters, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Input
        label="Search"
        placeholder="Search tickets..."
        value={filters.search ?? ''}
        onChange={(event) => onChange({ search: event.target.value })}
      />
      <Select
        label="Status"
        placeholder="All statuses"
        value={filters.status ?? ''}
        onChange={(event) => onChange({ status: event.target.value })}
        options={TICKET_STATUSES.map((value) => ({ value, label: STATUS_LABELS[value] }))}
      />
      <Select
        label="Priority"
        placeholder="All priorities"
        value={filters.priority ?? ''}
        onChange={(event) => onChange({ priority: event.target.value })}
        options={TICKET_PRIORITIES.map((value) => ({ value, label: PRIORITY_LABELS[value] }))}
      />
      <Select
        label="Sort"
        value={filters.sort ?? 'created_at'}
        onChange={(event) => onChange({ sort: event.target.value })}
        options={[
          { value: 'created_at', label: 'Created date' },
          { value: 'updated_at', label: 'Updated date' },
          { value: 'title', label: 'Title' },
        ]}
      />
    </div>
  );
}
