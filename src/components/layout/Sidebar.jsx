import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, X } from 'lucide-react';
import { useAuth } from '@/features/auth/useAuth';

function linkClass({ isActive }) {
  const base = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition';
  if (isActive) {
    return `${base} bg-brand-600 text-white`;
  }
  return `${base} text-slate-300 hover:bg-slate-800 hover:text-white`;
}

export function Sidebar({ open, onClose }) {
  const { can } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/50 lg:hidden ${open ? 'block' : 'hidden'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-900 text-white transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
          <span className="text-lg font-semibold">Support Desk</span>
          <button type="button" className="rounded-lg p-1 lg:hidden" onClick={onClose} aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-3">
          <NavLink to="/" end className={linkClass} onClick={onClose}>
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </NavLink>
          <NavLink to="/tickets" className={linkClass} onClick={onClose}>
            <Ticket className="h-4 w-4" />
            Tickets
          </NavLink>
          {can('users.manage') ? (
            <NavLink to="/users" className={linkClass} onClick={onClose}>
              <Users className="h-4 w-4" />
              Users
            </NavLink>
          ) : null}
        </nav>
      </aside>
    </>
  );
}
