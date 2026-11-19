"use client";

import dynamic from 'next/dynamic';
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { isValidGeoPoint } from "@/lib/food/maps";

const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <div className="text-sm text-muted-foreground">Harita yükleniyor...</div>
    </div>
  ),
});

interface LocationCardProps {
  address: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
}

export default function LocationCard({
  address,
  latitude,
  longitude,
  dict,
}: LocationCardProps & { dict?: any }) {
  if (!latitude || !longitude) return null;

  const lat = Number(latitude);
  const lon = Number(longitude);

  if (!isValidGeoPoint(lat, lon)) return null;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  return (
    <Card className="overflow-hidden shadow-sm border-border/50">
      <CardHeader className="pb-3 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-tight">
          <MapPin className="h-5 w-5 text-primary" />
          {dict?.hotel?.location || 'Location'}
        </CardTitle>
      </CardHeader>

      <div className="relative w-full h-[300px] bg-muted">
        <MapComponent latitude={lat} longitude={lon} address={address} />
      </div>

      <CardContent className="pt-4 pb-5 space-y-4 bg-card">
        <div className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground block mb-1">{dict?.hotel?.address || 'Adres'}:</span>
          {address}
        </div>

        <Button asChild className="w-full font-semibold tracking-wide shadow-sm" size="lg">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 justify-center">
            <MapPin className="h-4 w-4" />
            {dict?.hotel?.get_directions || 'YOL TARİFİ AL'}
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
