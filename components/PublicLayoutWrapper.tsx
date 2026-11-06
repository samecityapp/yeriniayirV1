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
  return (
    <>
      <Header lang={lang} />
      <div className="min-h-[100dvh]">{children}</div>
      {footer}
      {!preview && <CookieBanner dict={dict} />}
    </>
  );
}
