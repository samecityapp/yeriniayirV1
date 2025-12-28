import { LOCATIONS } from '@/lib/constants';
import { LocationCard } from '@/components/LocationCard';

export const revalidate = 0;

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Türkiye’de Gezilecek Yerler & Gizli Keşif Rotaları
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Türkiye'nin en özel köşeleri, yerel lezzetleri ve gizli cennetleri.
            <br className="hidden md:inline" /> Nereyi keşfetmek istersiniz?
          </p>
          <div className="mt-8 h-px w-24 bg-border mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {LOCATIONS.map((location) => (
            <LocationCard
              key={location.slug}
              slug={location.slug}
              title={location.title}
              image={location.image}
              description={location.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
