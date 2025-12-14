'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { BrandLogo } from './ui/BrandLogo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-gray-800">
            <BrandLogo className="w-10 h-10" />
            <span>YeriniAyır</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-600 hover:text-primary transition font-medium">Oteller</Link>
            <Link href="/rehber" className="text-gray-600 hover:text-primary transition font-medium">Rehber</Link>
            <Link href="/hakkimizda" className="text-gray-600 hover:text-primary transition font-medium">Hakkımızda</Link>

          </div>

          <div className="hidden md:block">
            <Button asChild>
              <Link href="/admin/dashboard">Panel</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüyü aç/kapat"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4 flex flex-col border-t pt-4 bg-white">
            <Link
              href="/search"
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Oteller
            </Link>
            <Link
              href="/rehber"
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Rehber
            </Link>
            <Link
              href="/hakkimizda"
              className="text-gray-600 hover:text-primary transition font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Hakkımızda
            </Link>

            <div className="pt-2">
              <Button asChild className="w-full">
                <Link href="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>Panel</Link>
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}