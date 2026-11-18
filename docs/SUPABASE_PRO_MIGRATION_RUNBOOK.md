# Yerini Ayır — Supabase Pro Veri Bağlantısı ve Kalıcı Güvenli Yayın Kılavuzu
**Proje: `jerkkxwgddujigsbeqwo` (Frankfurt, Pro) · PostgreSQL 17.6**

---

## 1. Yönetici Özeti ve Güvenlik Durumu

Yerini Ayır gastronomi projesinin canlıya (Vercel Preview & Production) geçişi için Supabase Pro veritabanı bağlantısı ve kalıcı güvenli yayın mekanizması hazırlanmış, yerel izole ortamlarda simüle edilmiş ve doğrulanmıştır.

### Doğrulanan Üretim Durumu (Salt Okunur Denetim):
- **Proje:** `jerkkxwgddujigsbeqwo` (Supabase Pro, Frankfurt)
- **Veritabanı Motoru:** PostgreSQL 17.6 on aarch64-unknown-linux-gnu
- **Bağlantı & TLS:** `verify-full` TLS el sıkışması (`prod-ca-2021.crt`), `default_transaction_read_only=on`
- **Mevcut Politikalar:** Tam 87 politika (45 eski izin kuralı + 42 acil durum geçici yazma engeli `ya_v1_hold_*`)
- **Eklenti Durumu:** `pg_cron` eklentisi veritabanında mevcut ve kullanılabilir durumda
- **Kullanıcı Verileri & Depolama:** 4,9 MB mantıksal veritabanı yedeği ve 662,8 MB (358 nesne) Storage arşivi güvenle korunuyor; 0 silme/değişiklik yapıldı.

---

## 2. Kalıcı Güvenlik Mimarisi: Kalıcı Yazma Sınırı (Permanent Write Boundary)

Eski sistemdeki geniş yetkili 19 anonim yazma kuralını durdurmak için daha önce uygulanan 42 geçici `ya_v1_hold_*` engeli, kalıcı aşamada **REVOKE + RESTRICTIVE** mimarisiyle standartlaştırılmıştır:

1. **Katı İzin İptali (REVOKE):**
   - 13 public tablo (`restaurants`, `hotels`, `articles`, `offers`, `analytics_events`, vb.) ve `storage.objects` üzerindeki `INSERT`, `UPDATE`, `DELETE` yetkileri `PUBLIC`, `anon` ve `authenticated` rollerinden geri alınır.
2. **Kalıcı Kısıtlayıcı Politikalar (RESTRICTIVE Policies):**
   - 14 tabloda her işlem türü için `USING (false) / WITH CHECK (false)` kuralları eklenir. PostgreSQL RLS motoru `OR(PERMISSIVE) AND AND(RESTRICTIVE)` kuralını işlettiğinden, eski permissive kurallar yürürlükte kalsa dahi hiçbir istemci doğrudan DML yazamaz.
3. **Ziyaretçi Okumaları Kesintisiz:**
   - Mevcut 45 permissive okuma politikası aynen korunur; ziyaretçiler eski otel, restoran ve makale içeriklerini okumaya devam eder.
4. **Yerel Doğrulama:**
   - `python3 scripts/cloud/verify_permanent_boundary.py` aracılığıyla yerel izole PostgreSQL 17 üzerinde 288 senaryo test edilmiş ve tüm yetkisiz yazmaların %100 engellendiği kanıtlanmıştır.

---

## 3. Gastronomi Yayın Pipeline'ı & Otomatik Lease Yenileme

Gastronomi verilerinin canlı yayını doğrudan tablo yazmalarıyla değil, **korumalı RPC ve ayrık şema** üzerinden yürütülür:

- **Şemalar:**
  - `ya_private`: Dış dünyaya kapalı şema (`admin_members`, `workspaces`, `publication_inputs`, `publication_jobs`, `decisions`).
  - `public`: Ziyaretçiye açık `ya_read_publication(scope)` ve MFA yöneticisine açık `ya_publish_order(...)`.
- **Otomasyon (pg_cron):**
  - Her 5 dakikada bir çalışan `ya_private.publication_tick()` fonksiyonu:
    - Kanıt geçerlilik süresini (`evidence_until`) denetler. (Mevcut kanıt sınırı: **5 Kasım 2026 20:10:28 UTC**).
    - İnsan yöneticinin belirlediği sıralamayı ve çıkarmaları korur.
    - Kanıt değişmemişse mükerrer yayın üretmez (`UNCHANGED`).
    - Süresi dolan veriyi ziyaretçiye göstermez (`needs-research`).
- **Simülasyon Başarısı:**
  - `python3 scripts/cloud/simulate_pro_publication_pipeline.py` ile Pro veritabanı simülasyonu çalıştırılmış, 12/12 kontrol başarıyla geçmiştir.

---

## 4. İki Anahtarlı Uygulama Güvenlik Kilidi (Application Two-Key Gate)

Uygulama katmanında (`lib/cloud/config.ts`) üretim veritabanına kazara bağlanılmasını önleyen iki anahtarlı kilit mekanizması devreye alınmıştır:

```ts
if (ref === 'jerkkxwgddujigsbeqwo') {
  if (env !== 'production' || process.env.GASTRONOMY_PRODUCTION_AUTHORIZED !== '1') {
    throw new Error('Production cloud activation requires explicit authorization');
  }
} else {
  if (env !== 'staging') throw new Error('Isolated cloud environment required');
}
```

Bu sayede:
- Staging modunda veya yerel testlerde production referansı verilse dahi sistem derhal hata fırlatarak kapanır (`fail-closed`).
- Production'a geçiş yalnızca bilinçli olarak `GASTRONOMY_CLOUD_ENV=production` ve `GASTRONOMY_PRODUCTION_AUTHORIZED=1` tanımlandığında mümkün olur.

---

## 5. Üretim Geçiş Planı (Production Migration Steps — Onay Sonrası)

Canlı veritabanına geçiş yapılmak istendiğinde izlenecek adımlar:

1. **Ön Denetim (Pre-flight):**
   ```bash
   python3 scripts/cloud/verify_production_readiness.py
   ```
2. **Kişisel Yönetici Hesabı Açılışı:**
   - Kullanıcı Supabase Pro Dashboard üzerinden kendi e-postasıyla hesap açar.
   - Kullanıcı UUID'si `ya_private.admin_members` tablosuna eklenir (parola asla ajana verilmez).
3. **Şema ve Kalıcı Sınır Uygulaması:**
   - `supabase/proposed/20261101_gastronomy_cloud_admin.sql`
   - `supabase/proposed/20261101_publication_pipeline.sql`
   - `supabase/proposed/20261101_publication_cron.sql`
   - `supabase/proposed/20261101_permanent_write_boundary.sql`
4. **Veri Yükleme ve Yayınlama:**
   - `work/release-system/pipeline-input.private.sql` tek transaction ile uygulanır.
   - `SELECT ya_private.publication_tick();` tetiklenir.
5. **Doğrulama ve Geri Alma (Rollback):**
   - Herhangi bir aksaklık durumunda `20261031_emergency_write_hold.rollback.sql` veya `ya_private` kaldırma scripti hazırdır; eski otel/restoran verileri etkilenmez.
