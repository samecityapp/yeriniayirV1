'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const HOTEL_DETAIL_UUID_REGEX =
  /^\/(?:tr|en|el)\/(?:otel|hotel)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})(?:\/|$)/i;

const trackedHotelsInMemory = new Set<string>();

export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const match = pathname.match(HOTEL_DETAIL_UUID_REGEX);
    if (!match) return;

    const hotelId = match[1].toLowerCase();
    const storageKey = `ya_pv_tracked:${hotelId}`;

    if (trackedHotelsInMemory.has(hotelId)) {
      return;
    }

    try {
      if (window.sessionStorage.getItem(storageKey) === '1') {
        trackedHotelsInMemory.add(hotelId);
        return;
      }
      window.sessionStorage.setItem(storageKey, '1');
    } catch {
      // sessionStorage may be blocked in restricted contexts; in-memory Set still guards StrictMode
    }

    trackedHotelsInMemory.add(hotelId);

    void fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_type: 'page_view',
        hotel_id: hotelId,
        metadata: {
          path: pathname,
        },
      }),
    }).catch(() => {
      // Analytics failures must never disrupt visitor navigation
    });
  }, [pathname]);

  return null;
}
