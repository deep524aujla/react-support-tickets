import { Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/features/auth/useAuth';
import { useLogout } from '@/features/auth/useLogout';

export function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const logoutAction = useLogout();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:px-6">
      <button
        type="button"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="hidden text-sm text-slate-600 lg:block">
        Signed in as <span className="font-medium text-slate-900">{user?.name}</span>
      </div>
      <Button variant="ghost" onClick={() => logoutAction.mutate()} isLoading={logoutAction.isPending}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </header>
  );
}
