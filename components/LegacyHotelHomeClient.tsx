'use client';
import dynamic from 'next/dynamic';
// Client-side code-splitting boundaries preserve SSR for legacy pages while keeping
// their filters, full icon catalogue and Supabase client out of gastronomy startup.
export const LegacyHotelCard=dynamic(()=>import('./HotelCard'));
export const LegacySearchFilters=dynamic(()=>import('./SearchFilters'));
