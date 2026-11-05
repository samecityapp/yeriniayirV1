import {headers} from 'next/headers';
import {checkPilotAdmin} from '@/lib/pilot/adminAuth';
export const metadata={robots:{index:false,follow:false}};
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth=await checkPilotAdmin((await headers()).get('authorization'));
  if(!auth.ok)return <p>Yönetici erişimi gerekli.</p>;
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-gray-50">
        {children}
      </main>
    </div>
  );
}