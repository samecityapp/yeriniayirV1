'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const Header=dynamic(()=>import('@/components/Header').then(m=>m.Header));
const CookieBanner=dynamic(()=>import('@/components/ui/CookieBanner').then(m=>m.CookieBanner));

interface PublicLayoutWrapperProps {
  preview:boolean;
  children: React.ReactNode;
  footer: React.ReactNode;
  lang: 'tr' | 'en';
  dict: any;
}

export function PublicLayoutWrapper({
  preview,
  children,
  footer,
  lang,
  dict,
}: PublicLayoutWrapperProps) {
  const pathname = usePathname();

  // Ana sayfa veya dil kök sayfası ise gastronomi görünümü geçerlidir
  const isGastronomyHome = preview && (
    pathname === `/${lang}` ||
    pathname === `/${lang}/` ||
    pathname === '/' ||
    pathname === '');

  return (
    <>
      {!isGastronomyHome && <Header lang={lang} />}
      <div className="min-h-[100dvh]">{children}</div>
      {!isGastronomyHome && footer}
      {!preview && <CookieBanner dict={dict} />}
    </>
  );
}
