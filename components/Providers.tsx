'use client';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import {useToast} from '@/hooks/use-toast';

import dynamic from 'next/dynamic';
const Toaster=dynamic(()=>import('@/components/ui/toaster').then(m=>m.Toaster),{ssr:false});
const PageViewTracker=dynamic(()=>import('@/components/PageViewTracker').then(m=>m.PageViewTracker),{ssr:false});

export function Providers({ children, disableTracking=false }: { children: React.ReactNode; disableTracking?:boolean }) {
  const {toasts}=useToast();
  return (
    <ErrorBoundary>
      {children}
      {!disableTracking && <PageViewTracker />}
      {toasts.length>0&&<Toaster />}
    </ErrorBoundary>
  );
}
