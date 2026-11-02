export interface RegionGeoDefinition {
  id: string;
  name: string;
  path: [string, string, string, string];
  bbox: [number, number, number, number];
}

export const TURKEY_REGIONS: Record<string, RegionGeoDefinition> = {
  'moda-kadikoy': {
    id: 'moda-kadikoy',
    name: 'Moda–Kadıköy',
    path: ['Türkiye', 'İstanbul', 'Kadıköy', 'Moda'],
    bbox: [40.978, 29.018, 40.992, 29.037],
  },
  'kadikoy-merkez': {
    id: 'kadikoy-merkez',
    name: 'Kadıköy Merkez',
    path: ['Türkiye', 'İstanbul', 'Kadıköy', 'Merkez'],
    bbox: [40.985, 29.015, 40.998, 29.038],
  },
  'etiler-besiktas': {
    id: 'etiler-besiktas',
    name: 'Etiler–Beşiktaş',
    path: ['Türkiye', 'İstanbul', 'Beşiktaş', 'Etiler'],
    bbox: [41.075, 29.025, 41.090, 29.045],
  },
  'karakoy-beyoglu': {
    id: 'karakoy-beyoglu',
    name: 'Karaköy–Beyoğlu',
    path: ['Türkiye', 'İstanbul', 'Beyoğlu', 'Karaköy'],
    bbox: [41.020, 28.970, 41.030, 28.985],
  },
  'alsancak-konak': {
    id: 'alsancak-konak',
    name: 'Alsancak–Konak',
    path: ['Türkiye', 'İzmir', 'Konak', 'Alsancak'],
    bbox: [38.430, 27.135, 38.445, 27.150],
  },
  'alacati-cesme': {
    id: 'alacati-cesme',
    name: 'Alaçatı–Çeşme',
    path: ['Türkiye', 'İzmir', 'Çeşme', 'Alaçatı'],
    bbox: [38.275, 26.365, 38.295, 26.390],
  },
  'sahinbey-gaziantep': {
    id: 'sahinbey-gaziantep',
    name: 'Şahinbey–Gaziantep',
    path: ['Türkiye', 'Gaziantep', 'Şahinbey', 'Merkez'],
    bbox: [37.050, 37.360, 37.075, 37.390],
  },
  'urgup-nevsehir': {
    id: 'urgup-nevsehir',
    name: 'Ürgüp–Nevşehir',
    path: ['Türkiye', 'Nevşehir', 'Ürgüp', 'Merkez'],
    bbox: [38.625, 34.900, 38.640, 34.925],
  },
  'fethiye-mugla': {
    id: 'fethiye-mugla',
    name: 'Fethiye–Muğla',
    path: ['Türkiye', 'Muğla', 'Fethiye', 'Merkez'],
    bbox: [36.615, 29.105, 36.635, 29.130],
  },
};

export function getRegionBBox(regionId: string): [number, number, number, number] | null {
  return TURKEY_REGIONS[regionId]?.bbox || null;
}
