"use client";

import "leaflet/dist/leaflet.css";
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapComponentProps {
  latitude: number;
  longitude: number;
  address?: string;
}

export default function MapComponent({ latitude, longitude, address }: MapComponentProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
    if ((el as any)._leaflet_id) {
      delete (el as any)._leaflet_id;
    }

    const customIcon = L.divIcon({
      className: 'custom-hotel-pin',
      html: `<div style="width:32px;height:32px;border-radius:9999px;background:#FF385C;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;">📍</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const map = L.map(el, {
      center: [latitude, longitude],
      zoom: 14,
      scrollWheelZoom: false,
      attributionControl: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
    if (address) {
      marker.bindPopup(`<div style="font-size:13px;font-weight:600;">${address}</div>`);
    }

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [latitude, longitude, address]);

  return <div ref={containerRef} className="w-full h-full bg-gray-100" />;
}
