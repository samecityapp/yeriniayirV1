'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationCardProps {
  latitude?: number;
  longitude?: number;
  hotelName: string;
}

export function LocationCard({ latitude, longitude, hotelName }: LocationCardProps) {
  if (!latitude || !longitude) {
    return null;
  }

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY'}&q=${latitude},${longitude}&zoom=15`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative w-full h-[300px] md:h-[400px]">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${hotelName} konumu`}
            className="rounded-t-lg"
          />
        </div>
        <div className="p-4">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full" size="lg">
              <MapPin className="mr-2 h-5 w-5" />
              YOL TARİFİ AL
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
