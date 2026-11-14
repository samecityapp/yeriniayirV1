# Yerini Ayır — Ortak Mekan Yönetimi Kılavuzu (Runbook)
**Admin Panel · Codex · Antigravity Ortak Çalışma Standartları**

## 1. Genel Mimari ve Sorumluluk Dağılımı

Yerini Ayır gastronomi veri hattı (gastronomy pipeline), insan editörler ile otonom geliştirici ajanların (Codex & Antigravity) aynı veri tabanı üzerinde çakışmadan çalışabilmesi için **Canonical Projection** mimarisiyle tasarlanmıştır.

```
+-------------------------------------------------------------+
|                     Canonical Veri Tabanı                   |
|  - OSM düğümleri (osm-node-*)                               |
|  - Google Places doğrulanmış şube koordinatları & puanları   |
|  - Kanıtlanmış menü & ritüel verileri (research-archive)     |
+-------------------------------------------------------------+
                              |
       +----------------------+----------------------+
       |                                             |
       v                                             v
[ İnsan Yönetici ]                          [ Codex & Antigravity ]
- /tr/gastronomi-yonetimi                   - workspace_cli.cjs status/jobs
- AAL2 TOTP korumalı panel                  - Otonom veri doğrulama
- Manuel sıralama (↑)                       - RLS ve şema denetimleri
- Mekan çıkarma / geri ekleme               - Sentetik test ve sözleşme kontrolü
       |                                             |
       +----------------------+----------------------+
                              |
                              v
             ya_private.publication_tick() / ya_publish_order()
                              |
                              v
                 [ Canlı Ziyaretçi Projeksiyonu ]
                 /api/gastronomy-public -> /tr?region=moda
```

---

## 2. Ortak Çalışma Kuralları (Collision Prevention)

1. **Manuel Kararlar Asla Ezilmez (Human-Override Supremacy):**
   - İnsan yönetici bir mekanın sırasını değiştirdiğinde veya bir mekanı listeden çıkardığında, bu durum `ya_publications` tablosuna yeni bir sürüm (`revision`) olarak yazılır.
   - Arka planda çalışan `pg_cron` / `publication_tick` döngüsü veya ajanların yapacağı güncellemeler, `old_doc->'venues'` sıralamasını ve çıkarılmış mekanları korur. Ajanlar çıkarılan mekanı zorla tekrar eklemez.

2. **Revizyon Çakışma Koruması (Optimistic Concurrency Control):**
   - Yayınlama işlemlerinde `expectedRevision` parametresi zorunludur.
   - Eğer yönetici paneli kaydederken başka bir işlem revizyonu artırmışsa `PT409 (Conflict)` hatası döner ve eski verinin üzerine yazılması engellenir.

3. **CLI ile Ajan Koordinasyonu:**
   - Codex ve Antigravity, veri durumunu sorgulamak ve test etmek için `scripts/cloud/workspace_cli.cjs` aracını kullanır:
     - `node scripts/cloud/workspace_cli.cjs status`: Aktif yayınlanan mekanları, revizyonu ve hariç tutulanları listeler.
     - `node scripts/cloud/workspace_cli.cjs jobs`: Son 10 `pg_cron` yayınlama işinin durumunu (`UNCHANGED`, `PUBLISHED`, vb.) gösterir.
     - `node scripts/cloud/workspace_cli.cjs verify-sync`: Projeksiyon, gizlilik sızıntısı ve OSM format senkronizasyonunu denetler.

4. **Sıfır Sahte Veri ve Sıfır Özel Veri Sızıntısı:**
   - Ziyaretçiye açılan `/api/gastronomy-public` endpoint'inde asla ham kaynaklar (`sources`), Google yorum sayısı (`userRatingCount`), arşiv hash'i veya iç ID'ler yer almaz.
   - Yalnızca doğrulanmış Google puanı varsa yayınlanır; doğrulanmamışsa gizlenir.

---

## 3. Doğrulama Komutları

Öncelik 1 kapsamındaki ortak mekan yönetimini test etmek için:

```bash
# 1. Gerçek headless Chrome admin paneli testi (MFA giriş, sıra değiştirme, geri alma, çıkış):
node scripts/cloud/verify_real_admin_browser.cjs

# 2. Ajan & yönetici CLI durum ve iş denetimi:
node scripts/cloud/workspace_cli.cjs status
node scripts/cloud/workspace_cli.cjs jobs
node scripts/cloud/workspace_cli.cjs verify-sync

# 3. 42 RLS ve veri izolasyonu denetimi:
python3 scripts/cloud/verify_database.py

# 4. Ziyaretçi arayüzü mobil & masaüstü duyarlılık denetimi (375px, 390px, 430px, 1440px):
PUPPETEER_EXECUTABLE_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" VERIFY_ORIGIN=http://127.0.0.1:3401 VERIFY_CLOUD_MODE=1 node scripts/verify_gastronomy_integration_browser.cjs
```
