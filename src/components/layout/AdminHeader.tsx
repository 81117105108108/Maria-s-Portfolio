import { logoutAction } from '@/lib/auth-actions';

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-brand-200">
      <div className="px-6 py-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-brand-800">
              {user?.name || 'Admin'}
            </p>
            <p className="text-xs text-brand-500">{user?.email}</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-brand-200 flex items-center justify-center text-brand-700 font-medium text-sm">
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs font-medium text-brand-500 hover:text-brand-700 transition-colors px-2 py-1 rounded hover:bg-brand-50"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
