import { requireOfferAdminAccess } from '@/lib/admin/offerAdminGuard';
import { offers } from '@/lib/offers';
import OfferManager from './OfferManager';

export const dynamic = 'force-dynamic';

export default async function OfferManagementPage() {
  const auth = await requireOfferAdminAccess({ requireSameOrigin: false });
  if (!auth.ok) {
    return <p>Yönetici erişimi gerekli.</p>;
  }

  const offerList = await offers.getAll(auth.capability);

  return (
    <div className="space-y-6">
      <OfferManager offers={offerList} />
    </div>
  );
}
