import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-64 min-h-screen bg-brand-50">
        <AdminHeader user={session.user} />
        <main className="p-6">{children}</main>
      </div>
    </>
  );
}
