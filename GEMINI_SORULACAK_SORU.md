# Gemini'a Sorulacak Soru

## Problem
Next.js 13 (App Router) projemizde, ana sayfadaki kısa yol arama tag'lerine (örn: "Aile Oteli", "Alkolsüz", "Denize Sıfır", "2000 TL Altı" vb.) tıkladığımızda sayfa çöküyor ve şu hatayı alıyoruz:

```
Objects are not valid as a React child (found: object with keys {tr}).
If you meant to render a collection of children, use an array instead.
```

## Proje Yapısı

### LocalizedString Tipi
Veritabanında bazı alanlar çoklu dil desteği için LocalizedString objesi olarak saklanıyor:
```typescript
export type LocalizedString = {
  tr: string;
  en?: string;
  de?: string;
  ru?: string;
  [key: string]: string | undefined;
};
```

### getLocalizedText Helper Fonksiyonu
```typescript
export function getLocalizedText(text: LocalizedString | string | undefined): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text.tr || text.en || Object.values(text).find(v => v) || '';
}
```

### Hotel Tipi
```typescript
export type Hotel = {
  id: string;
  name: LocalizedString;
  location: LocalizedString | string;
  gnkScore: number;
  price: number;
  // ... diğer alanlar
};
```

### Tag Tipi
```typescript
export type Tag = {
  id: string;
  name: LocalizedString;
  slug: string;
  icon?: string;
  isFeatured?: boolean;
};
```

## Kod Detayları

### Ana Sayfa Tag'leri (components/SearchFilters.tsx - çalışıyor)
```typescript
{featuredTags.slice(0, 5).map(tag => {
  const IconComponent = (tag.icon && (LucideIcons as any)[tag.icon]) || LucideIcons.Tag;
  return (
    <Link
      key={tag.id}
      href={`/search?q=${tag.slug}`}
      className="..."
    >
      <IconComponent size={12} />
      {getLocalizedText(tag.name)}  // ✅ Burada düzgün kullanılıyor
    </Link>
  );
})}
```

### Search Page (app/search/page.tsx)
Tag'e tıklayınca `/search?q=aile-oteli` gibi bir URL'e gidiliyor.

**getSearchTitle fonksiyonu (DÜZELTİLDİ):**
```typescript
const getSearchTitle = () => {
  if (locationQuery) {
    return `${locationQuery} Otelleri`;
  }

  const priceQuery = priceTags.find(pt => pt.slug === query);
  if (priceQuery) return `${priceQuery.label} Oteller`;

  const tagQuery = allTags.find(t => t.slug === query);
  if (tagQuery) return `${getLocalizedText(tagQuery.name)} Oteller`; // ✅ Düzeltildi

  if (query) {
    const decodedQuery = decodeURIComponent(query);
    return `"${decodedQuery}" için Arama Sonuçları`;
  }
  return 'Tüm Oteller';
};
```

**Veri çekme kısmı:**
```typescript
const { data: tagsData } = await supabase
  .from('tags')
  .select('*')
  .is('deleted_at', null);

if (tagsData) {
  const mappedTags = tagsData.map(t => ({
    id: t.id,
    name: t.name,  // LocalizedString olarak geliyor
    slug: t.slug,
    icon: t.icon || 'Tag',
    isFeatured: t.is_featured || false
  }));
  setAllTags(mappedTags);
}
```

**Tag render kısmı (sidebar filtrelerde):**
```typescript
{allTags.map(tag => {
  const iconName = tag.icon || 'Tag';
  const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
  const isSelected = selectedTags.includes(tag.slug);
  return (
    <label key={tag.id} className="...">
      {/* checkbox */}
      <Icon className="..." />
      <span>{getLocalizedText(tag.name)}</span> // ✅ Düzgün kullanılıyor
    </label>
  );
})}
```

**Otel listesinde tag gösterimi:**
```typescript
{hotel.tags && (
  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
    {hotel.tags.slice(0, 4).map(tagSlug => {
      const tagInfo = allTags.find(t => t.slug === tagSlug);
      if (!tagInfo) return null;
      const iconName = tagInfo.icon || 'Tag';
      const Icon = (LucideIcons as any)[iconName] || LucideIcons.Tag;
      return (
        <span key={tagSlug} className="...">
          <Icon className="..." />
          {getLocalizedText(tagInfo.name)}  // ✅ Düzgün kullanılıyor
        </span>
      )
    })}
  </div>
)}
```

## Yapılan Düzeltmeler
1. ✅ `Hotel.location` tipini `LocalizedString | string` olarak güncelledik
2. ✅ Search page'de location filtresinde `getLocalizedText(hotel.location)` kullanıyoruz
3. ✅ `getSearchTitle()` fonksiyonunda `getLocalizedText(tagQuery.name)` eklendi
4. ✅ Tüm tag.name render yerlerinde `getLocalizedText()` kullanılıyor

## Mevcut Durum
- Build başarılı (hata yok)
- Ana sayfada tag'ler görünüyor
- Tag'lere tıkladığımızda `/search?q=aile-oteli` gibi URL'e gidiliyor
- ❌ Ama sayfa hala aynı hatayı veriyor: "Objects are not valid as a React child (found: object with keys {tr})"

## Browser Hata Detayı
```
URL: https://localhost:3000/search?q=aile-oteli
Error: Objects are not valid as a React child (found: object with keys {tr}).
If you meant to render a collection of children, use an array instead.
```

## Soru
Neyi gözden kaçırıyoruz? `getLocalizedText()` fonksiyonunu tüm gerekli yerlerde kullandığımızı düşünüyoruz ama hata devam ediyor. Search sayfasında LocalizedString objesinin direkt render edildiği başka bir yer olabilir mi? Nasıl bulabiliriz ve nasıl düzeltebiliriz?

## İlgili Dosyalar
- `/tmp/cc-agent/57622105/project/app/search/page.tsx` - Search sayfası
- `/tmp/cc-agent/57622105/project/components/SearchFilters.tsx` - Ana sayfa tag'leri
- `/tmp/cc-agent/57622105/project/lib/types.ts` - Tip tanımları
- `/tmp/cc-agent/57622105/project/lib/localization.ts` - getLocalizedText fonksiyonu
