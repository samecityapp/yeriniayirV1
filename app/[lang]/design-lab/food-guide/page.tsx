import React from 'react';
import { Metadata } from 'next';
import { FoodGuideDesignLab } from '@/components/design-lab/FoodGuideDesignLab';

export const metadata: Metadata = {
  title: 'Yakında Ne Yenir? — 10 Tasarımlık Canlı Karşılaştırma Laboratuvarı',
  description:
    'Yerini Ayır "Yakında Ne Yenir?" bölümü için 10 alternatif tasarımın izole, etkileşimli karşılaştırma laboratuvarı.',
  robots: {
    index: false,
    follow: false
  }
};

export default function FoodGuideDesignLabPage() {
  return <FoodGuideDesignLab />;
}
