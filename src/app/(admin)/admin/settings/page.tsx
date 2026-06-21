import { auth } from '@/lib/auth';
import { SettingsForm } from './SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-brand-900">
          Settings
        </h1>
        <p className="text-sm text-brand-500 mt-1">
          Manage your account settings
        </p>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-lg border border-brand-200 p-6">
        <h2 className="text-lg font-semibold text-brand-800 mb-4">
          Account Information
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-brand-500">Name:</span>
            <p className="text-sm font-medium text-brand-800">
              {session?.user?.name || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-sm text-brand-500">Email:</span>
            <p className="text-sm font-medium text-brand-800">
              {session?.user?.email || 'N/A'}
            </p>
          </div>
          <div>
            <span className="text-sm text-brand-500">Role:</span>
            <p className="text-sm font-medium text-brand-800 capitalize">
              {session?.user?.role || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <SettingsForm />
    </div>
  );
}
