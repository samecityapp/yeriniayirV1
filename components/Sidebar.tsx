'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, List, Pencil, Tag, Star, TrendingUp } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'İstatistikler', href: '/admin/dashboard', icon: TrendingUp },
  { name: 'Otel Ekle / Düzenle', href: '/admin/otel-ekle', icon: Pencil },
  { name: 'Otel Listesi', href: '/admin/otel-listesi', icon: List },
  { name: 'Anasayfa Grupları', href: '/admin/anasayfa-yonetimi', icon: LayoutDashboard },
  { name: 'Ana Sayfa Etiketleri', href: '/admin/main-page-tags', icon: Star },
  { name: 'Etiket Yönetimi', href: '/admin/etiket-yonetimi', icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-600">GNK Panel</h1>
      </div>
      <nav className="px-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 my-1 rounded-lg transition-colors ${pathname === item.href
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
