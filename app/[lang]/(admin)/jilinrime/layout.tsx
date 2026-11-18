import { requireOfferAdminAccess } from '@/lib/admin/offerAdminGuard';
export const metadata = { robots: { index: false, follow: false } };
import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = await requireOfferAdminAccess({ requireSameOrigin: false });
  if (!auth.ok) return <p>Yönetici erişimi gerekli.</p>;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
