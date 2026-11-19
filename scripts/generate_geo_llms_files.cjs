// Deterministic generator for public/llms.txt and public/llms-full.txt
// Zero DB, zero external API calls, strict visitor-copy compliance.
const fs = require('node:fs');
const path = require('node:path');
const loadTs = require('./security/load-ts.cjs');

const root = process.cwd();
const {
  TR_SITE_ORIGIN,
  EN_SITE_ORIGIN,
  getGeoCities,
} = loadTs('lib/gastronomy-v3/geoCatalog.ts');
const { PILOT_VENUE_IDS, resolveGeoPilotVenue } = loadTs('lib/gastronomy-v3/geoPilot.ts');
const { getPublishedV3Snapshot, V3_LOCATIONS } = loadTs('lib/gastronomy-v3/registry.ts');
const { FORBIDDEN_VISITOR_COPY_REGEX } = loadTs('lib/gastronomy-v3/policy.ts');

async function main() {
  const cities = getGeoCities();
  const pilotResolved = (
    await Promise.all(PILOT_VENUE_IDS.map((id) => resolveGeoPilotVenue(id)))
  ).filter(Boolean);

  const llmsSummaryLines = [
    '# Yerini Ayır — Doğrulanmış Yerel Gastronomi Rehberi',
    '',
    `> Türkiye genelinde ${cities.length} il ve ${V3_LOCATIONS.length} yayınlı bölgede bağımsız kahve kavurmahaneleri, odun fırını pizzacılar, butik burgerciler, akşam yemeği durakları, kahvaltıcılar ve tarihi mutfak kurumlarını derleyen yerel gastronomi rehberi.`,
    '',
    '## Kapsam ve Doğrulama İlkeleri',
    '- Tüm mekanlar canlı operasyonel durum, sıkı İl > İlçe > Semt coğrafi sınır kontrolü ve sıfır zincir/franchise politikasından geçirilir.',
    '- Kahve kategorisi yalnız saf kahve uzmanlarına ayrılmıştır; nitelikli aday bulunmayan kategoriler dolgu yapılmadan gizlenir.',
    '- Her mekan sokak seviyesi konum tarifi, ne sipariş edileceği, ayrıca denenecek ürünler, Gitmeden Bil notları ve resmi `https://maps.google.com/?cid=...` bağlantısıyla sunulur.',
    '- Türkçe alan adı: ' + TR_SITE_ORIGIN + ' · İngilizce alan adı: ' + EN_SITE_ORIGIN,
    '',
    '## Ana Dizin ve Pilot Seçkiler (Moda & Kadıköy)',
    `- [Türkiye Gastronomi Dizini (${V3_LOCATIONS.length} Bölge)](${TR_SITE_ORIGIN}/gastronomi)`,
    `- [Turkey Gastronomy Guide EN (${V3_LOCATIONS.length} Neighborhoods)](${EN_SITE_ORIGIN}/gastronomy)`,
    `- [Moda, Kadıköy Gastronomi Seçkisi (29 Doğrulanmış Mekân)](${TR_SITE_ORIGIN}/gastronomi/istanbul/kadikoy/moda)`,
    `- [Moda, Kadikoy Food Guide EN](${EN_SITE_ORIGIN}/gastronomy/istanbul/kadikoy/moda)`,
    `- [Kadıköy Merkez, Tarihi Çarşı & Bahariye Seçkisi (32 Doğrulanmış Mekân)](${TR_SITE_ORIGIN}/gastronomi/istanbul/kadikoy)`,
    `- [Kadikoy Center Food Guide EN](${EN_SITE_ORIGIN}/gastronomy/istanbul/kadikoy)`,
    `- [Tam LLM Referans Dosyası (llms-full.txt)](${TR_SITE_ORIGIN}/llms-full.txt)`,
    '',
    '## Moda & Kadıköy Pilot Kategori Sayfaları',
  ];

  for (const slug of ['moda', 'kadikoy']) {
    const loc = V3_LOCATIONS.find((l) => l.slug === slug);
    const snap = getPublishedV3Snapshot(slug);
    if (!loc || !snap) continue;
    for (const cat of snap.categories) {
      const count = snap.venues.filter(
        (v) => v.categoryId === cat.id || (v.secondaryCategoryIds || []).includes(cat.id)
      ).length;
      if (count === 0) continue;
      llmsSummaryLines.push(
        `- [${loc.name} — ${cat.title} (${count} mekan)](${TR_SITE_ORIGIN}/gastronomi/${loc.path.join('/')}/${cat.slug})`
      );
    }
  }

  llmsSummaryLines.push('', '## Moda & Kadıköy 18 Seçkin Pilot Mekân Sayfası');
  for (const pv of pilotResolved) {
    llmsSummaryLines.push(
      `- [${pv.snapshotVenue.name} (${pv.snapshotVenue.neighborhood})](${TR_SITE_ORIGIN}/gastronomi/mekan/${pv.venueId}): ${pv.snapshotVenue.description}`
    );
  }

  llmsSummaryLines.push('', `## Yayınlı 21 İl (${V3_LOCATIONS.length} Bölge)`);
  for (const c of cities) {
    llmsSummaryLines.push(
      `- [${c.cityName} (${c.regions.length} seçki)](${TR_SITE_ORIGIN}/gastronomi/${c.citySlug})`
    );
  }

  const llmsFullLines = [
    '# Yerini Ayır — Tam Gastronomi ve Pilot Mekân Referansı (llms-full.txt)',
    '',
    `> Bu dosya Yerini Ayır (${TR_SITE_ORIGIN} / ${EN_SITE_ORIGIN}) üzerindeki ${V3_LOCATIONS.length} yayınlı bölgenin URL dizinini ve Moda / Kadıköy pilot bölgesindeki ${pilotResolved.length} seçkin mekân dahil tüm doğrulanmış mekanların tam yapısal özetini içerir.`,
    '',
    '## 1. Moda & Kadıköy Pilot Bölge Tam Listesi',
  ];

  for (const slug of ['moda', 'kadikoy']) {
    const loc = V3_LOCATIONS.find((l) => l.slug === slug);
    const snap = getPublishedV3Snapshot(slug);
    if (!loc || !snap) continue;
    llmsFullLines.push(
      '',
      `### ${loc.displayName} (${TR_SITE_ORIGIN}/gastronomi/${loc.path.join('/')})`,
      `- Kapsam: ${loc.scopeNote}`,
      `- Karakter: ${loc.characterSubtitle}`,
      ''
    );

    for (const v of snap.venues) {
      const pilotUrl = PILOT_VENUE_IDS.includes(v.id)
        ? ` · Detay: ${TR_SITE_ORIGIN}/gastronomi/mekan/${v.id}`
        : '';
      llmsFullLines.push(
        `#### ${v.name} (${v.neighborhood})`,
        `- Kategori: ${v.categoryId} · Google Puanı: ${Number(v.rating).toFixed(1)}`,
        `- Adres: ${v.address}`,
        `- Harita: ${v.mapsUri}${pilotUrl}`,
        `- Özet: ${v.description}`,
        `- Ne Sipariş Etmeli?: ${v.whatToOrder.join(', ')}`,
        ...(v.alsoTry && v.alsoTry.length ? [`- Ayrıca Dene: ${v.alsoTry.join(' | ')}`] : []),
        ...(v.beforeYouGo && v.beforeYouGo.length
          ? [`- Gitmeden Bil: ${v.beforeYouGo.join(' | ')}`]
          : []),
        ''
      );
    }
  }

  llmsFullLines.push('## 2. Moda & Kadıköy 18 Pilot Mekân Özgün Rehber Bağlamları');
  for (const pv of pilotResolved) {
    llmsFullLines.push(
      '',
      `### ${pv.snapshotVenue.name} (${TR_SITE_ORIGIN}/gastronomi/mekan/${pv.venueId} | ${EN_SITE_ORIGIN}/gastronomy/venue/${pv.venueId})`,
      `- Mutfak Kimliği: ${pv.editorial.culinaryIdentity.tr}`,
      `- Sipariş Rehberi: ${pv.editorial.orderingGuide.tr}`,
      `- Konum ve Ulaşım: ${pv.editorial.microLocationContext.tr}`,
      `- Seçki İçi Ayrım: ${pv.editorial.selectionComparison.tr}`
    );
  }

  llmsFullLines.push('', `## 3. Yayınlı ${V3_LOCATIONS.length} Semt ve İlçe Seçkisi (21 İl)`);
  for (const loc of V3_LOCATIONS) {
    llmsFullLines.push(
      `- [${loc.displayName}](${TR_SITE_ORIGIN}/gastronomi/${loc.path.join('/')}): ${loc.characterSubtitle || loc.scopeNote || loc.name}`
    );
  }

  const llmsText = llmsSummaryLines.join('\n') + '\n';
  const llmsFullText = llmsFullLines.join('\n') + '\n';

  for (const [label, body] of [
    ['llms.txt', llmsText],
    ['llms-full.txt', llmsFullText],
  ]) {
    if (FORBIDDEN_VISITOR_COPY_REGEX.test(body)) {
      const m = body.match(FORBIDDEN_VISITOR_COPY_REGEX);
      throw new Error(`FORBIDDEN_VISITOR_COPY_REGEX matched in ${label}: ${m?.[0]}`);
    }
    if (/userRatingCount|reviewCount|sourcePageUrl|dossiers/i.test(body)) {
      throw new Error(`Forbidden internal metadata matched in ${label}`);
    }
  }

  fs.writeFileSync(path.join(root, 'public/llms.txt'), llmsText, 'utf8');
  fs.writeFileSync(path.join(root, 'public/llms-full.txt'), llmsFullText, 'utf8');
  console.log(
    `Generated public/llms.txt (${Buffer.byteLength(llmsText)} B) and public/llms-full.txt (${Buffer.byteLength(llmsFullText)} B)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
