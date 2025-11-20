'use client';

import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LocationCardProps {
  latitude?: number;
  longitude?: number;
  hotelName: string;
  address?: string;
}

export function LocationCard({ latitude, longitude, hotelName, address }: LocationCardProps) {
  if (!latitude || !longitude) {
    return null;
  }

  const embedMapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=tr&z=15&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

  return (
    <Card className="overflow-hidden h-full flex flex-col shadow-sm border-border/50">
      <CardHeader className="pb-3 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg font-medium tracking-tight">
          <MapPin className="h-5 w-5 text-primary" />
          Konum
        </CardTitle>
      </CardHeader>

      <div className="relative w-full h-[250px] bg-muted">
        <iframe
          title={`${hotelName} Konumu`}
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={embedMapUrl}
          className="grayscale-[30%] hover:grayscale-0 transition-all duration-300"
        />
      </div>

      <CardContent className="flex-grow flex flex-col justify-between pt-4 pb-5 gap-4 bg-card">
        {address && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-medium text-foreground block mb-1">Adres:</span>
            {address}
          </div>
        )}

        <Button asChild className="w-full font-semibold tracking-wide shadow-sm" size="lg">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 justify-center"
          >
            <MapPin className="h-4 w-4" />
            YOL TARİFİ AL
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
