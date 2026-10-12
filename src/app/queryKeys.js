export const queryKeys = {
  auth: {
    me: ['auth', 'me'],
  },
  dashboard: {
    all: ['dashboard'],
  },
  tickets: {
    all: ['tickets'],
    list: (filters) => ['tickets', 'list', filters],
    detail: (id) => ['tickets', 'detail', id],
  },
  comments: {
    list: (ticketId) => ['comments', ticketId],
  },
  attachments: {
    list: (ticketId) => ['attachments', ticketId],
  },
  users: {
    all: ['users'],
    list: (filters) => ['users', 'list', filters],
    detail: (id) => ['users', 'detail', id],
  },
};
