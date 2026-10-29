# PRODUCT DECISIONS — YERİNİ AYIR ÜRÜN KARARLARI KÜTÜPHANESİ

Bu belgede, Yerini Ayır projesinde kesinleşmiş olan ürün, algoritma ve UX kararları yer almaktadır.

---

## 1. Kesinleşmiş Ürün ve Algoritma Kararları

1. **Bölge Başına Maksimum 7 Gastronomi Kategorisi:**
   - Bir semt veya bölgede sonsuz kategori listelenemez.
   - Her bölge en fazla 7 kategori slotu barındırabilir.
   - **Kural #1:** İlk sırada daima **"Mutlaka Denenmesi Gerekenler"** yer alır (kategoriler üstü semt klasikleri).
   - Kalan 6 kategori bölgenin gastronomik kimliğine göre özel seçilir (örneğin Moda için: 3. Nesil Kahve, Kruvasan/Brunch, Yeni Nesil Meyhane, Burger/Sokak Lezzeti, Çarşı Esnafı, Butik Dondurma).

2. **Yapay Birleşik Puanların Yasaklanması:**
   - 94.2 / 91.6 / 88.9 gibi yüzdelik birleşik skorlar kullanılmaz.
   - Bunun yerine 3 ayrı bağımsız boyut kullanılır:
     - **Ürün Kalitesi Bulguları:** Kendi kavurması, çekirdek izlenebilirliği, demleme standardı.
     - **Kanıt Güvenilirliği:** Bağımsız kaynak sayısı, 1. parti kayıtlar, tekilleştirilmiş bloglar, tarih tazeliği.
     - **Ziyaretçi Uygunluğu:** Hızlı kahve molası mı, uzun oturum mu, laptop/çalışma uygunluğu mu.

3. **Google Puanı Tek Başına Seçim Ölçütü Olamaz:**
   - Turistik yığılmalar, konum avantajı veya tatlı ikramları Google puanını yapay olarak yükseltebilir.
   - Seçim için bağımsız uzman rehberler (Barista Magazine, European Coffee Trip, yerel saygın gastronomi yazarları) esastır.
   - Google puanı yalnızca taban sinyali olarak izlenir, ham veri depolanmaz.

4. **Doğru Fiziksel Şube ve Rota Doğrulaması:**
   - Zincirleşmiş veya çok şubeli markaların doğru şubesi belirtilmelidir (Örn: Montag'ın Kadıköy Çarşı şubesi ile Moda Bademaltı şubesi ayrılmıştır).
   - Yürüme mesafeleri tahmini değil, OpenStreetMap/OSRM yaya profili üzerinden sokak sokak doğrulanmış değerlerdir.

5. **Kullanıcı Yalnızca Onaylar (Sıfır Manuel Araştırma):**
   - Yönetici veya kullanıcı tadım yapmaya gitmez, saatlerce menü aramaz.
   - AI ajanları araştırmayı yapar, kanıt paketini (dossier) hazırlar; yönetici tek tıkla inceler ve onaylar.

6. **Kategori İhlalinde Zorlama Listeleme Yapılamaz:**
   - Bir mekan kaliteli olsa bile o kategorinin ana uzmanlığını taşımıyorsa (Örn: Rafine Moda'nın kahve yerine brunch/fine cuisine mutfağına evrilmesi) sırf 3'e tamamlamak için listede tutulamaz; doğru kategoriye kaydırılır.

---

## 2. Restoran Detay Penceresi (Planlanan 5 Bölümlü Mimari)

Kullanıcının restoran kartına tıkladığında göreceği modalın 5 temel bölümü:

1. **Ne Sipariş Etmeli? (İmza Lezzet)**
   - Mekanın en güçlü, tescilli ve denenmesi gereken somut içeceği/yemeği.
2. **Neden Gitmeli? (Seçim Gerekçesi)**
   - Nitelikli kavurma, zanaatkâr üretim, köklü mahalle geçmişi gibi kanıtlanmış nedenler.
3. **Sana Uygun mu? (Ziyaretçi Filtresi)**
   - Hızlı kahve molası arayanlar için mi, yoksa saatlerce arkadaşıyla oturmak isteyenler için mi?
4. **Ayrıca Bunları da Dene (Yan Uzmanlıklar)**
   - Ana kahve odağının dışındaki sürpriz ürünler (Örn: Story'nin tarçınlı rulosu, Çekirdek'in ev yapımı tartları).
5. **Gitmeden Bil (Kritik İpuçları)**
   - Dar alan uyarısı, laptop yasağı/uygunluğu, şube ayrımı gibi sürpriz yaşamayı önleyen bilgiler.

---

## 3. Henüz Kesinleşmemiş / Geliştirme Aşamasındaki Konular

- **Canlı AI Tarama Sıklığı:** Web kaynaklarının haftalık mı yoksa aylık mı taranacağı konusu netleşmemiştir.
- **Dinamik Rota Origin Noktası:** Şu an referans başlangıç noktası Moda İlkokulu / Tramvay kesişimidir; gelecekte kullanıcının anlık konumuna göre dinamik rota hesaplama planlanmaktadır.
