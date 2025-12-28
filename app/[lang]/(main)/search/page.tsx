import { Suspense } from 'react';
import SearchClient from './SearchClient';
import HotelListSkeleton from '@/components/skeletons/HotelListSkeleton';

export const dynamic = 'force-dynamic';

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"><div className="container mx-auto px-6 py-8"><HotelListSkeleton /></div></div>}>
      <SearchClient />
    </Suspense>
  );
}