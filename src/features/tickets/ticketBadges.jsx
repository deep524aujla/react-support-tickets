import { Badge } from '@/components/ui/Badge';
import { PRIORITY_LABELS, STATUS_LABELS } from '@/utils/constants';

function statusTone(status) {
  if (status === 'open') {
    return 'info';
  }
  if (status === 'in_progress') {
    return 'warning';
  }
  if (status === 'resolved') {
    return 'success';
  }
  return 'neutral';
}

function priorityTone(priority) {
  if (priority === 'low') {
    return 'neutral';
  }
  if (priority === 'medium') {
    return 'warning';
  }
  return 'danger';
}

export function StatusBadge({ status }) {
  return <Badge tone={statusTone(status)}>{STATUS_LABELS[status] ?? status}</Badge>;
}

export function PriorityBadge({ priority }) {
  return <Badge tone={priorityTone(priority)}>{PRIORITY_LABELS[priority] ?? priority}</Badge>;
}
