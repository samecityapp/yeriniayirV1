import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const article = {
  title: { tr: "Bodrum Plaj Rehberi 2025: Rüzgara Göre Hangi Koya Gidilir? Ücretsiz Plajlar ve Tüyolar" },
  slug: "bodrum-en-iyi-plajlar-ve-koylar-rehberi",
  location: "Bodrum",
  cover_image_url: "https://images.unsplash.com/photo-1581430872221-d8baeb6b434a?q=80&w=1000&auto=format&fit=crop",
  meta_description: "Bodrum'da denize girmek şans işi değil, matematik işidir. Poyraz'da kaçılacak limanlar, çivi gibi su sevenlere Karaincir ve giriş ücreti ödemeden yüzebileceğiniz gizli cennetler.",
  published_at: new Date().toISOString(),
  is_published: true,
  content: { tr: `
    <div class="space-y-12">
      <div class="cove-card bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Bodrum'da Denizin Altın Kuralı: Rüzgarla İnatlaşma!</h2>
        <p class="text-lg leading-relaxed text-gray-700">Bakın dostlar, Bodrum'a geldiğinizde hava durumuna bakarken sadece sıcaklığa değil, rüzgarın yönüne bakmalısınız. Çünkü burası bir yarımada; bir tarafı dalgalarla boğuşurken, diğer tarafı havuz gibi durgun olabilir. Tatilinizi kurtaracak formül şudur:</p>
      </div>

      <div class="bg-zinc-100 p-6 rounded-xl border-l-4 border-zinc-900 my-6">
        <p class="text-lg"><strong>🚩 GNK Rüzgar Formülü:</strong><br>
        Rüzgar <strong>Kuzeyden (Poyraz)</strong> esiyorsa → Rotanız <strong>GÜNEY</strong> (Akyarlar, Ortakent, Bitez, Bardakçı).<br>
        Rüzgar <strong>Güneyden (Lodos)</strong> esiyorsa → Rotanız <strong>KUZEY</strong> (Torba, Gölköy, Türkbükü, Yalıkavak).</p>
      </div>

      <img src="https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c78?auto=format&fit=crop&w=1200&q=80" alt="Bodrum durgun deniz ve tekne" class="w-full rounded-xl shadow-md my-6" />

      <hr class="my-8 border-zinc-200" />

      <div class="prose-section">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">1. Akyarlar & Karaincir: "Su Soğuk Ama Girince Alışıyorsun"</h3>
        <p class="text-lg leading-relaxed">Burası Bodrum'un tartışmasız en berrak, en turkuaz ama aynı zamanda <strong>en soğuk</strong> suyuna sahip bölgesidir. Yazın 40 derece sıcakta bile suya girerken nefesiniz kesilebilir. Ama o berraklık her şeye değer.</p>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-4">
          <li><strong>Deniz Yapısı:</strong> İncecik beyaz kum (Un gibi). Deniz metrelerce gitseniz de belinizi geçmez.</li>
          <li><strong>Kimler İçin?</strong> Çocuklu aileler ve yüzmeyi çok iyi bilmeyenler için bir numaralı tercihtir.</li>
          <li><strong>Mekan Durumu:</strong> Burada aşırı lüks ve pahalı "Beach Club"lar yerine, daha samimi aile işletmeleri vardır. Genellikle giriş ücreti almazlar, içeride yeme-içme harcaması (Minimum Spend) yapmanız yeterlidir.</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">2. Ortakent - Yahşi: Mavi Bayrak Şampiyonu</h3>
        <p class="text-lg leading-relaxed">Bodrum'un en uzun sahil şerididir. Deniz burada Akyarlar kadar sığ değildir, biraz daha çabuk derinleşir ve zemini kum-çakıl karışımıdır. Ancak suyu her daim temizdir ve Mavi Bayraklıdır.</p>
        <p class="text-lg leading-relaxed mt-4"><strong>Aktivite Sevenlere:</strong> Su sporları (Rüzgar sörfü, Jet-ski, Parasailing) yapmak istiyorsanız merkez üssü burasıdır.</p>

        <h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">3. Göltürkbükü: "Piyasa" ve Lüksün Adresi</h3>
        <p class="text-lg leading-relaxed">Eğer amacınız sadece yüzmek değil, aynı zamanda sosyalleşmek, ünlü görmek ve "Happy Hour" partilerine katılmaksa rotanız Türkbükü olmalı. Burada kumsal neredeyse yoktur; deniz üzerine kurulmuş ahşap iskeleler vardır.</p>
        <p class="text-lg leading-relaxed mt-4"><strong>Maça Kızı, Divan Palmira, No:81</strong> gibi Türkiye'nin en ikonik ve pahalı mekanları buradadır. Giriş ücretleri yüksektir, rezervasyon şarttır ve içerideki fiyatlar Avrupa standartlarındadır. Karşılığında kusursuz bir hizmet ve ambiyans alırsınız.</p>
      </div>

      <img src="https://images.unsplash.com/photo-1545167622-3a6ac156f4e8?auto=format&fit=crop&w=1200&q=80" alt="Bodrum lüks beach club ve iskele" class="w-full rounded-xl shadow-md my-6" />

      <hr class="my-8 border-zinc-200" />

      <div class="prose-section">
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">4. Ücretsiz (Halk) Plajları: Giriş Ücretine Son!</h3>
        <p class="text-lg leading-relaxed">"Ben denize girmek için servet ödemek istemiyorum, havlumu atıp yatacağım" diyorsanız, Bodrum Belediyesi'nin işlettiği harika plajlar var. Duş, tuvalet ve soyunma kabini ücretsizdir. Kafeterya fiyatları çok makuldür.</p>
        <ul class="list-disc pl-5 space-y-2 text-lg mt-4">
          <li><strong>Bitez Halk Plajı:</strong> Mandalina bahçelerinin bittiği yerde başlar. Sığ ve kumludur.</li>
          <li><strong>Kumbahçe (Merkez):</strong> Bodrum Kalesi manzaralıdır. Akşamüstü yüzmek için harikadır.</li>
          <li><strong>Yalıkavak Küdür Halk Plajı:</strong> Biraz rüzgarlıdır ama doğaldır. Akdeniz foklarının uğrak yeridir.</li>
        </ul>

        <h3 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">5. Mazı Köyü: Şehirden Kaçış Rotası</h3>
        <p class="text-lg leading-relaxed">Kalabalıktan, müzik sesinden ve vale teröründen bıktıysanız, arabanıza atlayıp yarımadanın doğusuna, Mazı'ya sürün. Yolu biraz virajlıdır ama vardığınızda göreceğiniz manzara: Zeytin ağaçları, aile pansiyonları ve turkuaz bir deniz.</p>
        <p class="text-lg leading-relaxed mt-4"><strong>İnceyalı ve Hurma Koyu:</strong> Burada lüks yok, samimiyet var. Öğle yemeğinde taze fasulye, gözleme ve köy ayranı yiyip, hamakta uyuyabileceğiniz yerdesiniz.</p>
      </div>

      <div class="bg-zinc-100 p-6 rounded-xl border-l-4 border-zinc-900 my-8">
        <p class="text-lg"><strong>Sıkça Sorulan Soru:</strong> "Deniz kestanesi var mı?"<br>
        Cevap: Kayalık bölgelerde (Gümüşlük, Yalıkavak burnu gibi) olabilir. Ancak kumlu plajlarda (Karaincir, Bitez) risk çok düşüktür. Yine de taşlık bir koya gidiyorsanız deniz ayakkabısı hayat kurtarır.</p>
      </div>

      <div class="prose-section">
        <p class="text-lg leading-relaxed">Hangi koyu seçerseniz seçin, Bodrum denizi sizi asla hayal kırıklığına uğratmaz. Yeter ki rüzgarı arkanıza alın!</p>

        <p class="text-lg leading-relaxed mt-6">Bodrum'un en güzel koylarında, denize sıfır otelleri incelemek için <a href="/search?q=bodrum" class="text-blue-600 font-semibold hover:underline">tıklayın</a>.</p>
      </div>
    </div>
  ` }
};

async function seedBodrumArticle2() {
  console.log('🏖️ Bodrum Makale 2 (Plaj Rehberi) yükleniyor...');
  const { error } = await supabase.from('articles').upsert(article, { onConflict: 'slug' });
  if (error) console.error('Hata:', error.message);
  else console.log('✅ Başarıyla eklendi!');
}

seedBodrumArticle2();
