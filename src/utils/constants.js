export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const DEFAULT_PAGE_SIZE = 10;

export const TICKET_STATUS = {
  open: 'open',
  in_progress: 'in_progress',
  resolved: 'resolved',
  closed: 'closed',
};

export const TICKET_PRIORITY = {
  low: 'low',
  medium: 'medium',
  high: 'high',
};

export const ROLE = {
  admin: 'admin',
  agent: 'agent',
  customer: 'customer',
};

export const TICKET_STATUSES = [
  TICKET_STATUS.open,
  TICKET_STATUS.in_progress,
  TICKET_STATUS.resolved,
  TICKET_STATUS.closed,
];

export const TICKET_PRIORITIES = [
  TICKET_PRIORITY.low,
  TICKET_PRIORITY.medium,
  TICKET_PRIORITY.high,
];

export const ROLES = [ROLE.admin, ROLE.agent, ROLE.customer];

export const STATUS_LABELS = {
  [TICKET_STATUS.open]: 'Open',
  [TICKET_STATUS.in_progress]: 'In Progress',
  [TICKET_STATUS.resolved]: 'Resolved',
  [TICKET_STATUS.closed]: 'Closed',
};

export const PRIORITY_LABELS = {
  [TICKET_PRIORITY.low]: 'Low',
  [TICKET_PRIORITY.medium]: 'Medium',
  [TICKET_PRIORITY.high]: 'High',
};

export const ROLE_PERMISSIONS = {
  [ROLE.admin]: [
    'dashboard.view',
    'users.manage',
    'tickets.create',
    'tickets.delete',
    'tickets.assign',
    'tickets.updateAny',
    'tickets.viewAll',
  ],
  [ROLE.agent]: [
    'dashboard.view',
    'tickets.create',
    'tickets.viewAll',
    'tickets.updateAssigned',
  ],
  [ROLE.customer]: ['dashboard.view', 'tickets.create'],
};
