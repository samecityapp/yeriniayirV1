import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const article = {
  title: { tr: "Bodrum Gece Hayatı Rehberi 2025: Cazdan Tekno'ya, Salaşlıktan Lükse Kim Nereye Gitmeli?" },
  slug: "bodrum-gece-hayati-eglence-rehberi",
  location: "Bodrum",
  cover_image_url: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1000&auto=format&fit=crop",
  meta_description: "Bodrum geceleri tek tip değildir. Yalıkavak'ın lüksü, Gümüşlük'ün bohemliği veya Merkezin canlı müziği... Tarzınıza en uygun eğlence haritası.",
  published_at: new Date().toISOString(),
  is_published: true,
  content: { tr: `
    <div class="space-y-12">
      <div class="cove-card bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Güneş Battığında Hayat Yeni Başlar</h2>
        <p class="text-lg leading-relaxed text-gray-700">Bodrum'da gece hayatı, sadece "yüksek sesli müzik" demek değildir. Bir yanda şampanyaların patladığı ultra lüks marinalar, diğer yanda kumların üzerinde çıplak ayakla caz dinlenen bohem köşeler... Yanlış yere giderseniz geceniz zehir olabilir.</p>
        <p class="text-lg leading-relaxed text-gray-700 mt-4">"Ben rock seviyorum" deyip Gümbet'e giderseniz kaçarak uzaklaşırsınız. Bu rehberde mekan ismi saymaktan öte, hangi bölgenin ruhunun size uygun olduğunu anlatacağız.</p>
      </div>

      <img src="https://images.unsplash.com/photo-1570642437877-62e73c932a39?auto=format&fit=crop&w=1200&q=80" alt="Bodrum gece manzarası ve ışıklar" class="w-full rounded-xl shadow-md my-6" />

      <hr class="my-8 border-zinc-200" />

      <div class="prose-section">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">1. Yalıkavak Marina: "High-Class" ve Gösterişin Zirvesi</h3>
        <p class="text-lg leading-relaxed">Eğer bavulunuzda en şık kıyafetlerinizi getirdiyseniz ve "Bütçe sorunum yok, dünya standartlarında eğlenmek istiyorum" diyorsanız rotanız belli. Burası Bodrum'un St. Tropez'sidir.</p>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-4">
          <li><strong>Ortam:</strong> Burada terlikle veya şortla (akşam saatlerinde) dolaşmak zordur. Herkes şıktır, bakımlıdır. Lüks arabalar ve devasa yatlar dekorun parçasıdır.</li>
          <li><strong>Mekanlar:</strong> <strong>Novikov</strong>, <strong>Zuma</strong> veya <strong>Fenix</strong> gibi mekanların bar kısımları, gece yarısına doğru birer kulübe dönüşür. Müzikler kalitelidir (Ethnic House, Lounge).</li>
          <li><strong>Dikkat:</strong> Rezervasyon bir tercih değil, zorunluluktur. Kapıdaki "Face Control" (Tip kontrolü) oldukça sıkıdır.</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">2. Bodrum Merkez & Marina Yacht Club: "Nezih ve Kaliteli" Klasikler</h3>
        <p class="text-lg leading-relaxed">Bodrum Kalesi manzarasına karşı, elinizde kokteylinizle kaliteli canlı müzik dinlemek istiyorsanız adresiniz burasıdır. Burası bir "mekan"dan öte, bir Bodrum kurumudur.</p>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-4">
          <li><strong>Marina Yacht Club:</strong> Yaz-kış açıktır. Fatih Erkoç, Zeynep Casalini gibi isimler buranın ev sahibi gibidir. Hem 30 yaş üstü kitleye hitap eder hem de taşkınlık göremezsiniz. "Clean" eğlence arayanlar için 1 numaradır.</li>
          <li><strong>Mandalin:</strong> Çarşı'nın içinde, denize sıfır (dalgalar bazen duvara vurur) efsanevi bir mekandır. Türkiye'nin en iyi cover grupları, rock ve blues sanatçıları burada sahne alır.</li>
        </ul>
      </div>

      <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80" alt="Canlı müzik konseri" class="w-full rounded-xl shadow-md my-6" />

      <div class="prose-section">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">3. Gümüşlük: "Gürültü İstemiyorum" Diyenlere</h3>
        <p class="text-lg leading-relaxed">Eğer yüksek sesli müzik, lazer şovları ve kalabalık sizi yoruyorsa, Gümüşlük sahilindeki mekanlar ruhunuza ilaç gibi gelecek.</p>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-4">
          <li><strong>Jazz Cafe:</strong> Kumların üzerine atılmış masalar, yıldızların altında sakin bir caz müziği... Dünyaca ünlü caz sanatçıları buraya gelir ve doğaçlama (Jam session) yaparlar.</li>
          <li><strong>Off Gümüşlük:</strong> Biraz daha hareketli ama hala bohem. Kokteylleriyle meşhurdur. Burada topuklu ayakkabı giyilmez, sandalet veya çıplak ayakla dans edilir.</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">4. Gümbet ve Barlar Sokağı: Genç, Hızlı ve Çılgın</h3>
        <p class="text-lg leading-relaxed">Açık konuşalım: Burası herkese göre değildir. Daha çok üniversite öğrencileri, yabancı turistler ve sabaha kadar durmadan dans etmek isteyenlerin tercihidir.</p>
        <p class="text-lg leading-relaxed mt-4">Müzik sesi asla kısılmaz. Köpük partileri, dansçı kızlar, lazer şovları... Enerji tavan yapar. Eğer "Nezih" bir akşam arıyorsanız, burası yanlış adres olabilir. Ama "Kurtlarımı dökeceğim" diyorsanız doğru yerdesiniz.</p>
      </div>

      <hr class="my-8 border-zinc-200" />

      <div class="bg-zinc-100 p-6 rounded-xl border-l-4 border-zinc-900 my-8">
        <h3 class="text-xl font-semibold text-gray-900 mb-3">🍸 GNK'dan "Gece Hayatı Survival" Tüyoları</h3>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-2">
          <li><strong>Ulaşım Sorunu:</strong> Gece 02:00'de Yalıkavak'tan Bodrum merkeze taksi bulmak (veya o trafiği çekmek) kabus olabilir. Eğleneceğiniz bölgeye yakın bir otelde kalmak veya önceden transfer ayarlamak hayat kurtarır.</li>
          <li><strong>Damsız Girilmez:</strong> Bodrum'daki kaliteli mekanların %90'ı, yanınızda kadın arkadaşınız yoksa (tek veya grup erkekseniz) sizi içeri almaz. Bu kural katıdır.</li>
          <li><strong>Kıyafet Kodu:</strong> Gümüşlük'e abiye ile giderseniz komik durursunuz, Yalıkavak'a şortla giderseniz içeri giremezsiniz. Bölgenin ruhuna göre giyinin.</li>
        </ul>
      </div>

      <div class="prose-section">
        <p class="text-lg leading-relaxed">Hangi tarzı seçerseniz seçin, Bodrum geceleri sabahı zor etmenize sebep olacak kadar güzeldir. İyi eğlenceler!</p>

        <p class="text-lg leading-relaxed mt-6">Eğlence mekanlarına yürüme mesafesindeki otelleri görmek için <a href="/search?q=bodrum" class="text-blue-600 font-semibold hover:underline">tıklayın</a>.</p>
      </div>
    </div>
  ` }
};

async function seedBodrumArticle3() {
  console.log('🌙 Bodrum Makale 3 (Gece Hayatı) yükleniyor...');
  const { error } = await supabase.from('articles').upsert(article, { onConflict: 'slug' });
  if (error) console.error('Hata:', error.message);
  else console.log('✅ Başarıyla eklendi!');
}

seedBodrumArticle3();
