import Link from 'next/link';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          GNK
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/search" className="text-gray-600 hover:text-primary transition font-medium">Oteller</Link>
          <Link href="/rehber" className="text-gray-600 hover:text-primary transition font-medium">Rehber</Link>
          <Link href="/hakkimizda" className="text-gray-600 hover:text-primary transition font-medium">Hakkımızda</Link>
          <Link href="#" className="text-gray-600 hover:text-primary transition font-medium">İletişim</Link>
        </div>
        <div>
          <Button asChild>
            <Link href="/admin">Panel</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}