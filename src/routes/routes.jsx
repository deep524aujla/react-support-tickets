import { lazy } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { AuthShell } from '@/components/layout/AuthShell';
import { NeedLogin } from '@/routes/NeedLogin';
import { GuestOnly } from '@/routes/GuestOnly';
import { NeedRole } from '@/routes/NeedRole';
import { NotFound } from '@/routes/NotFound';

const Login = lazy(() => import('@/features/auth/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/features/auth/Register').then((m) => ({ default: m.Register })));
const Dashboard = lazy(() => import('@/features/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const TicketList = lazy(() => import('@/features/tickets/TicketList').then((m) => ({ default: m.TicketList })));
const TicketDetail = lazy(() =>
  import('@/features/tickets/TicketDetail').then((m) => ({ default: m.TicketDetail })),
);
const UserList = lazy(() => import('@/features/users/UserList').then((m) => ({ default: m.UserList })));

export const routes = [
  {
    element: <GuestOnly />,
    children: [
      {
        element: <AuthShell />,
        children: [
          { path: '/login', element: <Login /> },
          { path: '/register', element: <Register /> },
        ],
      },
    ],
  },
  {
    element: <NeedLogin />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'tickets', element: <TicketList /> },
          { path: 'tickets/:id', element: <TicketDetail /> },
          {
            element: <NeedRole roles={['admin']} />,
            children: [{ path: 'users', element: <UserList /> }],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFound /> },
];
