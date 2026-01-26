import { IncludedItem } from './types';
import { getLocativeSuffix, getAblativeSuffix } from '@/lib/turkish-grammar';

export const getDefaultIncludedItems = (region: string): IncludedItem[] => {
    return [
        {
            id: 'feat1',
            title: "12 + 2 Ay Üyelik",
            description: "Toplam 14 ay boyunca platformda aktif ve görünür listelenme",
            isActive: true
        },
        {
            id: 'feat2',
            title: "Sosyal Medya Tanıtımı",
            description: "@TurkeyandHotels ve @GeceliğiNeKadar hesaplarında 2'şer adet özel hikâye paylaşımı",
            isActive: true
        },
        {
            id: 'feat3',
            title: "Bölgenize Ait Makalelerde Önerilme",
            description: `“${region}${getLocativeSuffix(region)} Nerede Kalınır?” gibi rehber içeriklerde otelinizin önerilmesi`,
            isActive: true
        },
        {
            id: 'feat4',
            title: "Liste & “En İyiler” Önerileri",
            description: "Yıl boyunca aralıklarla otelinizi tanıtan sosyal medya paylaşımları.",
            isActive: true
        },
        {
            id: 'feat5',
            title: "OTA Görsel Düzenleme Desteği",
            description: "Mevcut OTA (Booking vb.) görsellerinizin daha etkili hale getirilmesi için düzenleme önerileri",
            isActive: true
        },
        {
            id: 'feat6',
            title: "Otelinizin Instagram hesabı analizi ve iyileştirme önerileri",
            description: "Otelinizin Instagram hesabı için içerik ve görünürlük analizi",
            isActive: true
        },
        {
            id: 'feat7',
            title: `${region}${getAblativeSuffix(region)} Sınırlı Sayıda Seçilmiş Otel`,
            description: "Her bölgeden yalnızca çok az sayıda otel kabul edilir (herkese açık bir liste değildir)",
            isActive: true
        },
        {
            id: 'feat8',
            title: "“YeriniAyir Seçilmiş Oteli” Rozeti",
            description: "Web sitenizde ve tanıtımlarınızda kullanabileceğiniz prestij rozeti",
            isActive: true
        }
    ];
};
