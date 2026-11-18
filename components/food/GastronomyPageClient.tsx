'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  MapPin, 
  Search, 
  Sparkles, 
  ChevronRight,
  Info
} from 'lucide-react';

import { FoodLocation, VisitorFoodVenue as FoodVenue, VisitorFoodDiscovery } from '@/lib/food/types';
import { createRealFoodProvider } from '@/lib/food/realProvider';
import { FOOD_DISCOVERY } from '@/lib/food/config';
import { GastronomyHeader } from './GastronomyHeader';
import { CategoryBar } from './CategoryBar';
import { LocationPickerModal } from './LocationPickerModal';

import { PremiumRestaurantCard } from '@/components/nearby-places/PremiumRestaurantCard';
import { VariantABottomSheet } from '@/components/mobile-detail-variants/VariantABottomSheet';

const REGION_CURATED_CARDS: Record<string, {image:string;badge:string;headline:string;vibe:string}> = {
  'moda-kadikoy': {
    image: '/images/gastronomy/coffee-pour-over.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Moda, Kadıköy',
    vibe: 'Nitelikli kahve, ekşi maya fırınlar, odun fırını pizzacılar ve mahalle mutfağı',
  },
  'carsi-osmanaga-kadikoy': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kadıköy, İstanbul',
    vibe: 'Tarihi Çarşı, Bahariye, Osmanağa ve Yoğurtçu Parkı hattında köklü klasikler ve seçkin duraklar',
  },
  'yeldegirmeni-kadikoy': {
    image: '/images/gastronomy/pizza.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Yeldeğirmeni, Kadıköy',
    vibe: 'Tarihi apartman sokaklarında Napoli pizzacıları, kurukahveci ve esnaf lokantaları',
  },
  'feneryolu-kadikoy': {
    image: '/images/gastronomy/pizza.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Feneryolu, Kadıköy',
    vibe: 'Hatboyu, Kuyubaşı ve Bağdat Caddesi arasındaki sokaklarda Napoli pizzası, butik kahve ve mahalle mutfakları',
  },
  'fenerbahce-kalamis-kadikoy': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Fenerbahçe & Kalamış, Kadıköy',
    vibe: 'Kalamış Marina ve Dalyan sahil balıkçılarından Fener Kalamış ile Faruk Ayanoğlu sokaklarındaki şef lokantaları, ocakbaşıları, atalık buğday fırınları ve butik kahvecilerine uzanan seçki',
  },
  'caddebostan-kadikoy': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Caddebostan, Kadıköy',
    vibe: 'Sahil yürüyüş hattında artizan gelato, şef bistroları ve butik burger durakları',
  },
  'suadiye-kadikoy': {
    image: '/images/gastronomy/breakfast.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Suadiye, Kadıköy',
    vibe: 'Şaşkınbakkal’dan Suadiye’ye akşam brasserie’leri, Napoli pizzaları ve profiterol klasikleri',
  },
  'bostanci-kadikoy': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bostancı, Kadıköy',
    vibe: 'İskele ve Koy Yolu’ndaki köklü balıkçılardan Çatalçeşme bistrolarına, Vukela esnaf lokantalarından gece kokoreç ritüellerine uzanan seçki',
  },
  'kusadasi-aydin': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kuşadası · Merkez, Davutlar & Güzelçamlı',
    vibe: 'Merkez, Çarşı ve Setur Marina’dan Kirazlı, Caferli, Yaylaköy, Davutlar ve Güzelçamlı sahiline uzanan seçki',
  },
  'gaziantep-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Gaziantep · Şahinbey & Şehitkamil',
    vibe: 'Tarihi hanlar ve Kalealtı çarşılarından Gazimuhtar ile İbrahimli’ye uzanan küşleme, sabah beyranı, taş fırın baklava ve katmer durakları',
  },
  'kaleici-muratpasa-antalya': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kaleiçi, Antalya',
    vibe: 'Tarihi Kaleiçi, Yat Limanı, Üçkapılar ve Kalekapısı aksında odun fırını pizzacılar, yerel burgerler, nitelikli kahve, meyhane sofraları, tahinli piyaz ve serpme börek',
  },
  'lara-muratpasa-antalya': {
    image: '/images/gastronomy/pizza.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Lara, Antalya',
    vibe: 'Eski Lara falezlerinden Şirinyalı, Yeşilbahçe, Fener, Çağlayan ve Güzeloba sokaklarına uzanan odun fırını pizzalar, yerel burgerler, nitelikli kahve ve deniz ürünleri',
  },
  'konyaalti-antalya': {
    image: '/images/gastronomy/coffee-pour-over.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Konyaaltı Sahil, Antalya',
    vibe: 'Atatürk Kültür Parkı ve Akdeniz Bulvarı sahil hattında özel gün klasikleri, kruvasan-pastane durakları, nitelikli kahveciler, Napoli pizzaları ve taze deniz ürünleri',
  },
  'kas-merkez-antalya': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kaş Merkez, Antalya',
    vibe: 'Uzun Çarşı ve Andifli ara sokaklarından Liman ile Küçük ve Büyük Çakıl kıyılarına uzanan taş fırın pizzacılar, smash burgerler, üçüncü dalga kahveciler ve akşam meyhaneleri',
  },
  'kalkan-merkez-antalya': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kalkan Merkez, Antalya',
    vibe: 'Köyiçi Çarşısı, Yalıboyu ve yat limanında gün batımı çatı terasları, tencere yemekleri, odun fırını ocakbaşılar, bağımsız kahveciler ve taze balık sofraları',
  },
  'alanya-merkez-antalya': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Alanya Merkez, Antalya',
    vibe: 'Alanya İskele, Çarşı ve Şekerhane sokaklarından Damlataş ve Kleopatra sahiline uzanan taş fırın pizzacılar, smash burgerler, nitelikli kahveciler ve yerel klasikler',
  },
  'side-manavgat-antalya': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Side, Antalya',
    vibe: 'Antik Side taş sokakları ve Liman çevresinden Side Bulvarı hattına uzanan odun fırını pizzacılar, antik kent kahvecileri, gün batımı sofraları ve yerel balıkçılar',
  },
  'kemer-antalya': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kemer, Antalya',
    vibe: 'Idyros Antik Kenti, Ayışığı Koyu ve Kemer Marina kıyısından Liman Caddesi ile Arslanbucak hattına uzanan odun fırını pizzacılar, özel kahve kavurucuları, kahvaltı noktaları ve yerel balıkçılar',
  },
  'akyaka-ula-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Akyaka & Akçapınar, Ula, Muğla',
    vibe: 'Kadın Azmağı ve Akçapınar Azmağı kıyısındaki su üstü balıkçılar ile kahvaltı iskelelerinden Akyaka sokaklarına, Aşıklar Yolu tost ritüeline, Kite Plajı ve Gökova fırınlarına uzanan seçki',
  },
  'yaniklar-fethiye-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Yanıklar, Fethiye, Muğla',
    vibe: 'Yanıklar sığla ormanından Sağlık ve Esenli sokak bahçelerine, Karaot ile Katrancı hattına uzanan köy kahvaltıları, el açması gözleme durakları ve yerel lezzetler',
  },
  'gocek-fethiye-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Göcek, Fethiye, Muğla',
    vibe: 'Göcek Çarşı Yolu, Turgut Özal Caddesi, İskele Meydanı ve marinalar hattında taş fırın pizzalar, artizan fırın-kahvaltılar, gurme burgerler, akşam sofraları ve deniz ürünleri',
  },
  'fethiye-merkez-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Fethiye Merkez, Muğla',
    vibe: 'Paspatur Çarşısı, Balık Pazarı, Karagözler Yat Limanı, Kordon Boyu ve Akarca hattında taş fırın Napoli pizzaları, smash burgerciler, kavurucu kahveciler ve körfez balıkçıları',
  },
  'calis-fethiye-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çalış, Fethiye, Muğla',
    vibe: 'Çalış Plajı 1054. Sokak kordonundan Barış Manço Bulvarı ve Yerguzlar Caddesi’ne uzanan odun fırını İtalyan mutfağı, sahil kahvecileri, gün batımı meyhaneleri ve taze deniz ürünleri',
  },
  'oludeniz-fethiye-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ölüdeniz, Fethiye, Muğla',
    vibe: 'Belcekız sahili, Denizpark & Çarşı Caddesi, Kumburnu Lagünü ve Kıdrak hattında zeytin ağaçlı gün batımı terasları, nitelikli kahve, plaj kahvaltıları ve kıyı deniz ürünleri',
  },
  'bodrum-merkez-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bodrum Merkez, Muğla',
    vibe: 'Çarşı ve Kumbahçe sokaklarından Eskiçeşme ve Neyzen Tevfik Marina hattına uzanan odun fırını Napoli pizzaları, bağımsız kahveciler, tarihi esnaf mutfağı ve kıyı deniz ürünleri',
  },
  'yalikavak-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Yalıkavak, Bodrum, Muğla',
    vibe: 'Yalıkavak Marina, Çökertme Caddesi ve Çarşı’dan Küdür-Dirmil sırtlarına yayılan köy bahçesi kahvaltıları, taş fırın pizzaları, gurme burgerler ve Ege balık restoranları',
  },
  'gumusluk-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Gümüşlük, Bodrum, Muğla',
    vibe: 'Tavşan Adası ve Yalı Mevkii kıyı masasından Köy İçi ve Koyunbaba tepelerine yayılan gün batımı restoranları, taş fırın lezzetleri ve yerel balıkçı sofraları',
  },
  'turkbuku-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Türkbükü, Bodrum, Muğla',
    vibe: 'Liman ve İnönü Caddesi iskelelerinden Gölköy sahili ve Cennet Koyu hattına uzanan İtalyan mutfağı, ev yemekleri durakları, pastane-kahvaltılar ve kıyı balıkları',
  },
  'bitez-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bitez, Bodrum, Muğla',
    vibe: 'Bitez Yalısı ve Çökertme Caddesi kıyılarından mandalina bahçeli Köy İçi sokaklarına uzanan taş fırın pizzalar, smash burgerler, üçüncü nesil kahveciler ve deniz ürünleri',
  },
  'turgutreis-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Turgutreis, Bodrum, Muğla',
    vibe: 'D-Marin ve Balıkçılar Sokağından Gazi Mustafa Kemal Bulvarı, Bahçelievler, Karabağ ve Akçaalan hattına uzanan nitelikli kahveciler, bahçe kahvaltıları ve kıyı balıkçıları',
  },
  'ortakent-yahsi-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ortakent & Yahşi, Bodrum, Muğla',
    vibe: 'Ortakent Köy İçi zeytinyağı fabrikasından Yahşi Yalısı, Hortma ve Kargı Koyu kıyılarına yayılan odun ateşi pizzaları, butik burgerciler, fırın kahvaltıları ve sahil balıkçıları',
  },
  'gundogan-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Gündoğan, Bodrum, Muğla',
    vibe: 'Gündoğan sahil şeridi ile Balıkçı Barınağından Farilya, Küçükbük ve Kızılburun koylarına uzanan aile fırınları, ev yemekleri durakları, Japon mutfağı, meyhane bahçeleri ve Ege balıkçıları',
  },
  'gumbet-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Gümbet, Bodrum, Muğla',
    vibe: 'Gümbet Koyu ve Asarlık hattı boyunca sahil akşam yemeklerinden Uzak Doğu mutfağına, taş fırın ocakbaşı sofralarından artizan burger ve et döner duraklarına uzanan seçki',
  },
  'torba-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Torba, Bodrum, Muğla',
    vibe: 'Torba Koyu, Zeytinlikahve ve Usuluk hattında iskele balıkçılarından sahil kahvaltısına, yöresel ev yemekleri ve Adana kebabından gece kokoreç duraklarına uzanan seçki',
  },
  'akyarlar-bodrum-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Akyarlar, Bodrum, Muğla',
    vibe: 'Fenerburnu ve Çamlıburnu fenerinden Akyarlar Limanı, Karaincir ve Aspat (Anthaven) hattına uzanan taş fırın pizza, bağımsız burger, sahil kokteyl barları, koy manzaralı gözleme-kruvasan kahvaltıları, ev yemekleri ile köklü kıyı balıkçıları',
  },
  'marmaris-merkez-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Marmaris Merkez, Muğla',
    vibe: 'Kaleiçi, Yat Limanı, Kordon ve Netsel Marina’dan Kemeraltı çarşısı ile Uzunyalı kıyı hattına uzanan taş fırın pizzacıları, el yapımı burgerciler, üçüncü nesil kahveciler, sahil kahvaltıları, köklü esnaf sofraları ve kıyı balıkçıları',
  },
  'datca-merkez-mugla': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Datça Merkez, Muğla',
    vibe: 'İskele Mahallesi ve Atatürk Caddesi’nden Kumluk ile Taşlık sahiline uzanan taş fırın pizzacıları, smash burgerciler, üçüncü nesil kahveciler, bademli ve otlu ev yemekleri sofraları, Kumluk balıkçıları ve meyhane avluları',
  },
  'alsancak-konak-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Alsancak, Konak, İzmir',
    vibe: 'Gül Sokak ve Mimar Sinan’dan 1. Kordon ile Kıbrıs Şehitleri ara sokaklarına uzanan taş fırın ve Napoli pizzacıları, tek şubeli burgerciler, kavurma atölyeleri, tarihi boyoz-gevrek fırınları, söğüş-kumru durakları ve Kordon balıkçıları',
  },
  'bostanli-karsiyaka-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bostanlı, Karşıyaka, İzmir',
    vibe: 'Cemal Gürsel sahil bandından Nalkesen ve 1811 Sokak ara arterlerine uzanan odun fırını pizzacılar, tek şubeli smash burgerciler, kavurma barlı kahveciler, brunch mutfakları, gelato-vegan klasikleri ve Bostanlı balıkçıları',
  },
  'karsiyaka-carsi-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Karşıyaka, İzmir',
    vibe: 'Karşıyaka Çarşı, Donanmacı, Tuna, Aksoy, Bahariye, Alaybey ve Bahriye Üçok sokaklarına yayılan taş fırın pizzacılar, tek şubeli smash burgerciler, üçüncü nesil mahalle kahvecileri, tarihi konak avluları, İzmir kumrusu-ev yemekleri ve semt balıkçıları',
  },
  'bornova-merkez-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bornova, İzmir',
    vibe: 'Küçükpark ve Süvari Caddesi ara sokaklarından Kazımdirik kavşaklarına, Erzene ile Ergene çarşılarına uzanan ekşi mayalı Napoli pizzacılar, tek şubeli burgerciler, kavurma barlı kahveciler, bahçeli artisan kruvasan fırınları, kokteyl publar, Edirne tava ciğeri ve İzmir söğüşçüleri',
  },
  'goztepe-guzelyali-konak-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Göztepe & Güzelyalı, İzmir',
    vibe: 'Mithatpaşa ve Mustafa Kemal Sahil Bulvarı arasındaki ara sokaklara yayılan uzun mayalı pizzacılar, tek şubeli burger noktaları, nitelikli kahve barları, mahalle meyhaneleri, fırın kahvaltıcıları, esnaf lokantası ile İzmir söğüşçüleri ve sahil balık pişiricileri',
  },
  'mavisehir-karsiyaka-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Mavişehir, İzmir',
    vibe: 'Yalı Mahallesi ara sokaklarından Caher Dudayev ve Aziz Nesin bulvarlarına uzanan taze makarna ve Napoli pizzacıları, tek şubeli burgerci, mikro kavurucu kahveciler, uzun brunch fırınları, Ege zeytinyağlı mezecileri, söğüşçü ve kıyı balıkçısı',
  },
  'alacati-cesme-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Alaçatı, İzmir',
    vibe: 'Hacımemiş taş avlularından Kemalpaşa Caddesi meyhanelerine, Tokoğlu burger ve nitelikli kahve duraklarından Sakızlar fırınlarına ve Alaçatı Port balıkçı rıhtımına uzanan seçki',
  },
  'urla-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Urla, İzmir',
    vibe: 'Sanat Sokağı ve Malgaca Pazarı taş dükkanlarından Kuşçular Bağ Yolu ve Özbek şef masalarına, Arasta pizzacılarından üçüncü dalga kavuruculara, İskele balık ekmek büfesinden Özbek liman balıkçılarına uzanan seçki',
  },
  'sigacik-seferihisar-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Sığacık, İzmir',
    vibe: 'Kaleiçi taş sokaklarının meyhaneleri ve nitelikli kahve duraklarından Teos Marina ve Akkum hattındaki ince hamur pizza, smash burger, köy kahvaltısı ve liman balıkçılarına uzanan seçki',
  },
  'foca-izmir': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Foça, İzmir',
    vibe: 'Eski Foça Küçükdeniz ve Büyükdeniz sahil balıkçılarından ara sokak pizzacı ve burgercilerine, tasarım odaklı kahvecilerden Yeni Foça sahil duraklarına ve Kozbeyli köy kahvaltı ile taş dibek kahvesine uzanan seçki',
  },
  'sanliurfa-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Şanlıurfa Merkez · Eyyübiye, Haliliye & Karaköprü',
    vibe: 'Balıklıgöl, Haşimiye ve 1563 Gümrük Hanı avlusundan Bahçelievler, Şutim ve Karaköprü’ye uzanan sabah ciğeri ocakları, zırh ve haşhaş kebabı, sabah tiridi, şıllık tatlısı, taş konak sofraları ve mırra durakları',
  },
  'mardin-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Mardin Merkez · Artuklu (Eski Mardin & Yenişehir)',
    vibe: 'Birinci Cadde taş konaklarından Savurkapı ve Yenişehir’e uzanan kaburga dolması, dobo, sembusek, Süryani şarabı evleri, kahiye tatlısı, tarihî çarşı kahvaltıları ve kakuleli Süryani kahvesi durakları',
  },
  'diyarbakir-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Diyarbakır Merkez · Sur, Yenişehir, Kayapınar & Bağlar',
    vibe: 'Suriçi taş avlularından Dağkapı mangallarına, Ofis sokaklarından Cadde 75’e uzanan sabah ciğeri, taş fırın lahmacun, parmak kebabı, kelle paça, 1907 mirası burma kadayıf ve nitelikli kahve durakları',
  },
  'hatay-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Hatay Merkez · Antakya & Defne',
    vibe: 'Antakya’dan Defne ve Harbiye’ye uzanan tepsi ve kağıt kebabı, sıcak tahinli humus, bakla ezmesi, közde peynirli künefe, 1913 mirası süvari kahvesi ve yayla köy kahvaltısı durakları',
  },
  'iskenderun-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'İskenderun Merkez · Savaş, Yenişehir, Çay & Mustafa Kemal',
    vibe: 'Savaş ve Yenişehir sokaklarından Paç Meydanı, Muradiye ve sahil hattına uzanan özel soslu İskenderun döneri, tereyağlı sıcak humus, ciğer-kebap, Körfez balıkları, közde künefe ve mahalle kahvecileri',
  },
  'adana-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Adana Merkez · Seyhan, Çukurova & Yüreğir',
    vibe: 'Büyüksaat, Kazancılar Çarşısı ve Ziyapaşa’dan Turgut Özal ve Seyhan Gölü hattına uzanan zırh kebabı, sabah ciğeri, şırdan, bici bici ve nitelikli kahve durakları',
  },
  'mersin-merkez': {
    image: '/images/gastronomy/regional.svg',
    badge: 'Yöresel Miras Seçkisi',
    headline: 'Mersin Merkez · Yenişehir, Mezitli & Akdeniz',
    vibe: 'Cami Şerif ve Kushimoto Sokağı’ndan Mersin Marina, Viranşehir ve Mezitli sahil bandına uzanan pamuk yağlı tantuni, körfez balıkları, çöven köpüklü kerebiç, sıkma ve kahve durakları',
  },
  'ankara-cankaya-kizilay': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kızılay, Çankaya, Ankara',
    vibe: 'Necatibey’den Konur, Karanfil, Selanik ve Bayındır sokaklarına uzanan taş fırın pizza ve tek şubeli burger noktaları, nitelikli kahve kavurucuları, 1945–1984 mirası esnaf lokantaları, kömürde yaprak döner ve gece işkembecisi',
  },
  'ankara-cankaya-tunali': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Tunalı Hilmi, Çankaya, Ankara',
    vibe: 'Bestekâr, Bülten, Büklüm ve Tunus sokaklarından Kuğulu Park’a uzanan ekşi mayalı Napoli pizzacıları, sokak burgercileri, mikro kavurucu kahve barları, mahzen şarap evleri, artizan fırınlar ve 1970–1995 mirası Ankara klasikleri',
  },
  'ankara-cankaya-bahcelievler': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bahçelievler & 7. Cadde, Çankaya, Ankara',
    vibe: 'Aşkabat (7. Cadde), Taşkent ve Azerbaycan sokaklarına yayılan butik pizzacılar, tek şubeli burger noktaları, ara sokak kahve kavurucuları, gözleme ve kruvasan kahvaltıcıları ile mantı, Uygur mutfağı ve gece kokoreç klasikleri',
  },
  'ankara-cankaya-gaziosmanpasa': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Gaziosmanpaşa, Çankaya, Ankara',
    vibe: 'Rabat, Kuleli, Kırlangıç ve Nenehatun sokaklarından Arjantin, Filistin ve Uğur Mumcu caddelerine uzanan odun fırını Napoli pizzacısı, üçüncü dalga kavurucular, Ankara’nın köklü balık sofraları, artizan kruvasan fırını ve meyhane seçkisi',
  },
  'ankara-cankaya-cayyolu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çayyolu & Park Caddesi, Çankaya, Ankara',
    vibe: 'Park Caddesi ve Onyx’ten Koru Çarşısı, Ankaralılar Caddesi ve Konutkent’e uzanan ekşi mayalı Napoli pizzacıları, smash burger ve pub durakları, matcha-kahve barı, modern meyhaneler, artizan fırınlar ve Konutkent deniz ürünleri seçkisi',
  },
  'ankara-cankaya-umitkoy-beysukent': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ümitköy & Beysukent, Çankaya, Ankara',
    vibe: 'Galleria arkasındaki 1943–1964. sokaklardan Angora Bulvarı ve Beysukent’e yayılan smash ve Cajun burger noktaları, bahçeli üçüncü dalga kahveciler, orman dokulu şef restoranı, şarap evi, Karadeniz serpme-ekşi maya fırınları ve modern meyhaneler',
  },
  'ankara-cankaya-ayranci': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ayrancı, Çankaya, Ankara',
    vibe: 'Hoşdere ve Güvenlik caddelerinden Kuzgun ve Mesnevi sokaklarına uzanan Napoli pizzacısı, butik burgerciler, bahçeli üçüncü dalga kahveciler, bahçe meyhaneleri, ekşi mayalı artizan fırınlar ve Hatay-Lübnan tatlısı',
  },
  'ankara-cankaya-cukurambar': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çukurambar, Çankaya, Ankara',
    vibe: 'Muhsin Yazıcıoğlu ve Ufuk Üniversitesi caddelerinden 1071 ve Cubes aksına yayılan ince hamurlu pizza, tütsülenmiş BBQ & burger, özel kahveciler, serpme kahvaltı, esnaf kebapçısı ve et lokantası',
  },
  'aydin-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Aydın Merkez (Efeler)',
    vibe: 'Atatürk Bulvarı, Sevgi Yolu ve Tarihi Filibeli Hanı’ndan Mimar Sinan ile Girne mahallelerine uzanan taş fırın kıymalı ve tahinli Aydın pidesi, cevizli kabak tatlısı, yuvarlama esnaf lokantaları, üçüncü dalga kahveciler ve İtalyan mutfağı durakları',
  },
  'balikesir-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Balıkesir Merkez (Karesi & Altıeylül)',
    vibe: 'Zağnos Paşa Meydanı ve Eski Kuyumcular çarşısından Bahçelievler, Plevne ve Paşaalanı’na uzanan Balıkesir köftesi, kömürde süt kokoreç, peynirli höşmerim, uzun fermantasyon Napoli pizzaları, butik burgerciler, serpme Ege kahvaltıları ve üçüncü dalga kahveciler',
  },
  'balikesir-ayvalik-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ayvalık Merkez, Balıkesir',
    vibe: 'Fevzipaşa-Vehbibey, Bedesten ve Macaron taş sokaklarından kıyıda sıralanan balıkçılara, zeytinyağlı ev yemekleri lokantalarına, odun fırınlı pizzacılara, üçüncü dalga kahve kavurucularına, koruk suyu kahvehanesine ve gerçek Ayvalık tostu duraklarına uzanan seçki',
  },
  'balikesir-ayvalik-cunda': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Cunda (Alibey Adası), Ayvalık',
    vibe: 'Namık Kemal ve Mithatpaşa tarihî taş sokaklarında çağdaş Girit-Ege mutfağından kıyı balıkçılarına, 1885 mirası taş kahvehaneden taş avlu kokteyl ve şarap barlarına, üçüncü dalga kahvecilerden ada pizzacılarına uzanan seçki',
  },
  'bursa-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bursa Merkez (Osmangazi, Nilüfer & Yıldırım)',
    vibe: 'Heykel ve Kayhan Çarşısı’ndan Çekirge, FSM Bulvarı, Özlüce ve Balat’a uzanan Bursa İskender kebabı, Kayhan pideli köftesi, taş fırın tahinli pide ve süt helvası duraklarıyla odun ateşinde Napoli pizzaları, kömür ızgara burgerler, nitelikli kahve kavurucuları ve akşam sofraları',
  },
  'canakkale-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çanakkale Merkez (Kordon & Kepez)',
    vibe: 'Tarihî Çarşı, İskele ve Kordon’dan Yeni Kordon ve Kepez sahiline uzanan Boğaz sardalyesi ve deniz ürünleri sofraları, 1912–1979 mirası fırın peynir helvacıları, taş fırın Napoli pizzaları, butik burgerciler, üçüncü dalga kahveciler ve Kuzey Ege şarap akşamları',
  },
  'edirne-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Edirne Merkez (Kaleiçi, Saraçlar & Karaağaç)',
    vibe: 'Saraçlar ve Kaleiçi’nden Karaağaç ile Şükrüpaşa’ya uzanan yaprak tava ciğer ustaları, 1946–1967 mirası badem ezmesi ve tarihî meyhane geleneğiyle odun ateşinde ekşi maya pizzalar, burger dükkanları, üçüncü nesil kahveciler ve Karaağaç bahçe kahvaltıları',
  },
  'eskisehir-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Eskişehir Merkez (Odunpazarı & Tepebaşı)',
    vibe: 'Tarihî Odunpazarı ve Köprübaşı’ndan Hoşnudiye, Eskibağlar, Vişnelik ile Batıkent’e uzanan Kırım çiböreği, Eskişehir balaban kebabı, 1875 helva ve 1925 boza mirasıyla odun ateşinde Napoli pizzaları, smash burgerler, bağımsız kahve kavurucuları ve akşam sofraları',
  },
  'denizli-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Denizli Merkez (Merkezefendi & Çamlık)',
    vibe: 'Bayramyeri ve Kaleiçi çarşısından Çamlık, Yenişehir ve Selçukbey’e uzanan sakız odunu ateşinde tescilli Denizli kebabı, tahinli pide ve 1945–1953 esnaf ustalarıyla taş fırın Napoli pizzaları, smash burgerler, üçüncü nesil kahveciler ve akşam sofraları',
  },
  'rize-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Rize Merkez (Çarşı, Ziraat & Sahil)',
    vibe: 'Çarşı ve Piriçelebi’den Ziraat yamaçları ile sahil bandına uzanan 1968 mirası Rize kavurması ve kuzinede kuru fasulye, taş fırın Rize pidesi, günlük Karadeniz deniz balıkları, ekşi mayalı Napoliten pizzalar ve nitelikli kahve durakları',
  },
  'trabzon-merkez': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Trabzon Merkez (Ortahisar & Beşirli)',
    vibe: 'Pazarkapı ve Uzun Sokak’tan Boztepe ile Beşirli sahiline uzanan 1856 Kalkanoğlu pilavı, 1948 Beton Helva ve Karadeniz deniz balıklarıyla gurme burgerler, üçüncü nesil kahve durakları, kuymak kahvaltıları ve akşam sofraları',
  },
  'kosuyolu-acibadem': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Koşuyolu & Acıbadem, İstanbul',
    vibe: 'Validebağ komşuluğundaki ağaçlıklı Koşuyolu sokaklarından Acıbadem Caddesi’nin köklü kebap, pastane ve kahve duraklarına uzanan seçki',
  },
  'merkez-uskudar': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Üsküdar, İstanbul',
    vibe: '1933 mirası esnaf lokantalarından Salacak ve Çamlıca balıkçılarına, Mimar Sinan çarşısı ve Bağlarbaşı kahvecilerinden Doğancılar ile Murat Reis ocakbaşılarına uzanan seçki',
  },
  'kuzguncuk-uskudar': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Kuzguncuk, Üsküdar',
    vibe: 'İcadiye Caddesi’nin tarihi fırın, közde döner ve kitabevi-kafelerinden Boğaz kıyısındaki 1951 mirası sofraya uzanan semt seçkisi',
  },
  'cengelkoy-uskudar': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çengelköy, Üsküdar',
    vibe: 'Asırlık Tarihi Çınaraltı ve börek ritüelinden Kuleli kıyısındaki taş yalı balıkçılarına ve çarşı sokak lezzetlerine uzanan Boğaz seçkisi',
  },
  'karakoy-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Karaköy, Beyoğlu',
    vibe: 'Tarihi fıstıklı baklava ve esnaf lokantası klasiklerinden Kemankeş üçüncü dalga kahvecilerine, odun ateşi şef sofralarına ve Boğaz balıkçılarına uzanan semt seçkisi',
  },
  'cihangir-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Cihangir, Beyoğlu',
    vibe: 'Sıraselviler ve Akarsu Yokuşu’nun köklü pastane ve esnaf lezzetlerinden Defterdar Yokuşu ve Susam Sokak bistro durakları ile samimi mahalle kahvecilerine uzanan seçki',
  },
  'nisantasi-sisli': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Nişantaşı, Şişli',
    vibe: 'Teşvikiye’nin beş denizli şef mutfağından Topağacı fırın ve üçüncü dalga kahvecilerine, Abdi İpekçi bistro duraklarına ve köklü ocakbaşılarına uzanan seçki',
  },
  'galata-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Galata, Beyoğlu',
    vibe: 'Kuledibi’nin 1964–1971 kuşak klasiklerinden Serdar-ı Ekrem ve Tatar Beyi’nin üçüncü dalga kavurmacılarına, tarihi avlu İtalyan mutfaklarına ve şarap mahzenlerine uzanan semt seçkisi',
  },
  'carsi-besiktas': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Beşiktaş Çarşı, Beşiktaş',
    vibe: 'Köyiçi’nin odun ateşi döner ustası, Kahvaltıcılar Sokağı ve Balık Pazarı sofralarından Sinanpaşa ve Türkali’nin artizan pizzacılarına, mantıcılarına ve yeni nesil meyhanelerine uzanan seçki',
  },
  'akaretler-besiktas': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Akaretler, Beşiktaş',
    vibe: 'Vişnezade Sıraevler aksından Süleyman Seba ve Şair Nedim yokuşuna uzanan et kavurma ve mantı durakları, nitelikli kavurmacılar, smash burgerciler, kokteyl barlar ve butik meyhaneler',
  },
  'bebek-besiktas': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Bebek, Beşiktaş',
    vibe: '1904 badem ezmesi ve sahil dondurma ritüelinden 1952 kıyı balıkçısına, Manolya Sokak gurme burger ve matcha barlarından Küçük Bebek ekşi maya fırınlarına Boğaz kıyısı seçkisi',
  },
  'etiler-besiktas': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Etiler, Beşiktaş',
    vibe: '1980’lerden kalan Tatar mantısı ve 1996 İtalyan klasiğinden Dilhayat Sokak şef mutfağına, Akatlar kavurmahaneleri ve butik ocakbaşılardan Alkent kokteyl barlarına uzanan seçki',
  },
  'ortakoy-besiktas': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Ortaköy, Beşiktaş',
    vibe: 'Feriye rıhtımı ve Cemil Topuzlu Parkı’nın köklü Boğaz sofralarından Eski Bahçe Sokak taş fırın pizzacılarına, üç kuşaklık Konya fırın kebabından sahil kumpir ritüeline uzanan seçki',
  },
  'cukurcuma-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Çukurcuma, Beyoğlu',
    vibe: 'Faik Paşa ve Turnacıbaşı antikacı yokuşlarında ekşi mayalı taş fırın pizzacılar, bağımsız kahve kavurmacıları, avlu içi şarap evleri ve mevsimsel Anadolu lokantaları',
  },
  'balat-fatih': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Balat, Fatih',
    vibe: 'Çıfıt Çarşısı’nın 1879 akide şekercisi ve 1890 mirası meyhanesinden Vodina ile Fener yokuşlarının üçüncü dalga kavurmahanelerine, taze makarna ve Haliç sofralarına uzanan seçki',
  },
  'yenikoy-sariyer': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Yeniköy, Sarıyer',
    vibe: 'Köybaşı Caddesi ve Cami Pasajı’ndaki nitelikli kahvecilerden mevsimlik Boğaz mutfağına, 1950’lerden kalma kahvaltı kurumlarına ve Kalender kıyı balıkçılarına uzanan seçki',
  },
  'gokturk-eyupsultan': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Göktürk, Eyüpsultan',
    vibe: 'İstanbul Caddesi, Arcadium ve Larus Palas hattındaki ekşi maya pizzacılardan smash burger dükkanlarına, üçüncü dalga kahvecilere ve odun ateşi ocakbaşlarına uzanan seçki',
  },
  'asmalimescit-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Asmalımescit & Pera, Beyoğlu',
    vibe: 'Tünel ile Galatasaray arasındaki köklü meyhanelerden şef mutfaklarına, şarap barlarından cezve kahvesi duraklarına uzanan seçki',
  },
  'taksim-beyoglu': {
    image: '/images/gastronomy/gastronomy.svg',
    badge: 'Doğrulanmış Seçki',
    headline: 'Taksim & İstiklal, Beyoğlu',
    vibe: 'Balık Pazarı ve Nevizade sokaklarından Gümüşsuyu teraslarına, Talimhane kahve barlarından tarihî lokantalara uzanan seçki',
  },
};

function formatLocationCategoryHeading(locative: string, categoryTitle?: string): string {
  const cleanLocative = locative.trim();
  const cleanTitle = (categoryTitle || 'Mekanlar').trim();
  if (cleanTitle.toLocaleLowerCase('tr').startsWith(cleanLocative.toLocaleLowerCase('tr'))) {
    const remainder = cleanTitle.slice(cleanLocative.length).trim();
    return remainder ? `${cleanLocative} ${remainder}` : cleanLocative;
  }
  return `${cleanLocative} ${cleanTitle}`;
}

const HOME_DISCOVERY_LIMIT = 11;

const QUICK_DISCOVERY_SLUGS: readonly string[] = [
  'moda',
  'kadikoy',
  'karakoy',
  'nisantasi',
  'besiktas-carsi',
  'alacati',
  'bodrum-merkez',
  'kas-merkez',
  'antalya-kaleici',
  'tunali-hilmi',
  'gaziantep',
];

const FEATURED_DISCOVERY_SLUGS: readonly string[] = [
  'moda',
  'kadikoy',
  'karakoy',
  'nisantasi',
  'besiktas-carsi',
  'alacati',
  'bodrum-merkez',
  'kas-merkez',
  'antalya-kaleici',
  'tunali-hilmi',
  'gaziantep',
];

function selectCappedRegions(
  regions: readonly FoodLocation[],
  preferredSlugs: readonly string[],
  limit = HOME_DISCOVERY_LIMIT
): FoodLocation[] {
  const bySlug = new Map(regions.map((r) => [r.slug, r]));
  const picked: FoodLocation[] = [];
  const seen = new Set<string>();
  for (const slug of preferredSlugs) {
    if (picked.length >= limit) break;
    const match = bySlug.get(slug);
    if (match && !seen.has(match.id)) {
      picked.push(match);
      seen.add(match.id);
    }
  }
  for (const region of regions) {
    if (picked.length >= limit) break;
    if (!seen.has(region.id)) {
      picked.push(region);
      seen.add(region.id);
    }
  }
  return picked.slice(0, limit);
}

interface GastronomyPageClientProps {
  discovery: VisitorFoodDiscovery;
  initialLocationSlug?: string;
  initialCategorySlug?: string;
  lang?: 'tr' | 'en';
  embedded?: boolean;
}

export function GastronomyPageClient({
  discovery,
  initialLocationSlug,
  initialCategorySlug,
  lang = 'tr',
  embedded = false,
}: GastronomyPageClientProps) {
  const router = useRouter();
  const foodDiscoveryProvider = useMemo(() => createRealFoodProvider(discovery), [discovery]);
  const searchParams = useSearchParams();

  // 1. Seçili Bölge Durumu
  const [selectedLocation, setSelectedLocation] = useState<FoodLocation | null>(() => {
    if (initialLocationSlug) {
      const match = foodDiscoveryProvider.getLocationBySlug(initialLocationSlug);
      if (match) return match;
    }
    return null;
  });

  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>(() => {
    if (selectedLocation) {
      const cats = foodDiscoveryProvider.getRegionCategories(selectedLocation.id);
      if (initialCategorySlug && cats.some((c) => c.slug === initialCategorySlug)) {
        return initialCategorySlug;
      }
      return cats[0]?.slug || 'kahve';
    }
    return initialCategorySlug || 'kahve';
  });

  const [activeVenueForModal, setActiveVenueForModal] = useState<FoodVenue | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // URL is the single source of truth, including Back/Forward and invalid scopes.
  const regionParam = searchParams.get('region') || initialLocationSlug;
  const categoryParam = searchParams.get('category') || initialCategorySlug;
  useEffect(() => {
    const location = regionParam ? foodDiscoveryProvider.getLocationBySlug(regionParam) || null : null;
    setSelectedLocation(location);
    setSelectedCategorySlug(categoryParam || (location ? foodDiscoveryProvider.getRegionCategories(location.id)[0]?.slug || '' : ''));
    setActiveVenueForModal(null);
  }, [regionParam, categoryParam, foodDiscoveryProvider]);

  // Konum seçimi değiştiğinde
  const handleSelectLocation = useCallback(
    (loc: FoodLocation) => {
      try {
        localStorage.setItem(FOOD_DISCOVERY.storage.lastRegionKey, loc.slug);
      } catch {}

      if (!selectedLocation || loc.id !== selectedLocation.id) {
        router.push(`/${lang}?region=${loc.slug}`);
        return;
      }

      setSelectedLocation(loc);

      // Yeni bölgenin kategorilerini al
      const newCats = foodDiscoveryProvider.getRegionCategories(loc.id);

      // Kural: Eski kategorinin karşılığı yeni bölgede varsa koru, yoksa ilk kategoriye geç
      let nextCategorySlug = newCats[0]?.slug || '';
      if (newCats.some((c) => c.slug === selectedCategorySlug)) {
        nextCategorySlug = selectedCategorySlug;
      }

      setSelectedCategorySlug(nextCategorySlug);

      // URL senkronizasyonu ve sunucu tarafı bölge yüklemesi
      const newUrl = `/${lang}?region=${loc.slug}&category=${nextCategorySlug}`;
      router.push(newUrl);
    },
    [lang, selectedLocation, selectedCategorySlug, foodDiscoveryProvider, router]
  );

  // Kategori seçimi değiştiğinde
  const handleSelectCategory = useCallback(
    (catSlug: string) => {
      setSelectedCategorySlug(catSlug);
      if (selectedLocation) {
        const newUrl = `/${lang}?region=${selectedLocation.slug}&category=${catSlug}`;
        window.history.pushState(null,'',newUrl);
      }
    },
    [lang, selectedLocation, router]
  );

  // Seçili bölgenin dinamik kategorileri
  const currentCategories = useMemo(() => {
    if (!selectedLocation) return [];
    return foodDiscoveryProvider.getRegionCategories(selectedLocation.id);
  }, [selectedLocation, foodDiscoveryProvider]);

  // Seçili kategoriye ait mekan sonuçları
  const categoryResult = useMemo(() => {
    if (!selectedLocation) return undefined;
    return foodDiscoveryProvider.getCategoryResult(selectedLocation.id, selectedCategorySlug);
  }, [selectedLocation, selectedCategorySlug, foodDiscoveryProvider]);

  // Hazır tüm bölgeler
  const readyRegions = useMemo(() => {
    return foodDiscoveryProvider.getReadyRegions();
  }, [foodDiscoveryProvider]);

  const quickDiscoveryRegions = useMemo(
    () => selectCappedRegions(readyRegions, QUICK_DISCOVERY_SLUGS, HOME_DISCOVERY_LIMIT),
    [readyRegions]
  );

  const featuredDiscoveryRegions = useMemo(
    () => selectCappedRegions(readyRegions, FEATURED_DISCOVERY_SLUGS, HOME_DISCOVERY_LIMIT),
    [readyRegions]
  );

  return (
    <div className={embedded ? "w-full bg-[#fafbfc] text-slate-900 flex flex-col font-sans antialiased" : "min-h-screen bg-[#fafbfc] text-slate-900 flex flex-col font-sans antialiased"}>
      {/* 1. ORTAK HEADER */}
      <GastronomyHeader
        currentLocation={selectedLocation}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        lang={lang}
      />

      {/* ANA İÇERİK — ORİJİNAL TAM GENİŞLİK / MAX-W-2XL DÜZENİ */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-3.5 min-[375px]:px-4 sm:px-6 py-3 sm:py-5">
        {/* KOMPAKT SEKME (TAB) GEÇİŞİ: OTELLER / GASTRONOMİ KEŞFİ */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex max-w-full items-center p-1 rounded-full bg-slate-200/70 border border-slate-200/90 shadow-sm">
            <a
              href={`/${lang}`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 min-[380px]:px-4 sm:px-5 py-2 rounded-full text-slate-600 hover:text-slate-900 font-bold text-[11px] min-[375px]:text-xs sm:text-sm whitespace-nowrap transition-all"
            >
              <span>🏨</span>
              <span>{lang === 'tr' ? 'Oteller' : 'Hotels'}</span>
            </a>
            <a
              href={`/${lang}?view=gastronomi`}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 min-[380px]:px-4 sm:px-5 py-2 rounded-full bg-white text-slate-950 font-bold text-[11px] min-[375px]:text-xs sm:text-sm whitespace-nowrap shadow-sm border border-slate-200/70 transition-all"
            >
              <span>🍽️</span>
              <span>{lang === 'tr' ? 'Gastronomi Keşfi' : 'Gastronomy Discovery'}</span>
            </a>
          </div>
        </div>
        {/* =================================================================== */}
        {/* 1. DURUM: KONUM HENÜZ SEÇİLMEDİ (YENİ MODERN HERO & KONUM SEÇİMİ)   */}
        {/* =================================================================== */}
        {regionParam && !selectedLocation ? (
          <div className="py-12 px-2 text-center"><h1 className="text-xl font-bold break-words">Bu konum için rehber henüz hazır değil.</h1><button className="mt-4 text-blue-600 font-semibold" onClick={()=>router.push(`/${lang}`)}>Konum seçimine dön</button></div>
        ) : !selectedLocation ? (
          <div className="pt-2 sm:pt-4 pb-12 max-w-xl mx-auto">
            {/* BAŞLIK & METİN — İKONSUZ, HEADER'IN DİREKT BİR TIK ALTINDA */}
            <div className="text-center pt-2 sm:pt-4 pb-1">
              <h1 className="text-[clamp(1.5rem,6.5vw,2.75rem)] font-black tracking-tight text-slate-950 uppercase leading-[1.08] [text-wrap:balance]">
                CANIN NE ÇEKİYOR?
              </h1>
              <p className="text-[13px] min-[375px]:text-sm sm:text-base font-medium text-slate-600 leading-relaxed mt-2.5 sm:mt-3 max-w-md mx-auto [text-wrap:pretty] px-1">
                Konum seç! Kahvecileri, yemek mekanlarını ve yerel deneyimleri keşfet.
              </p>
            </div>

            {/* ŞIK & MODERN KONUM SEÇ ÇUBUĞU (ÖZEL HAP TASARIMI) */}
            <div className="mt-5 sm:mt-6 mb-3">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="w-full flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 bg-white hover:bg-slate-50/90 active:bg-slate-100 border border-slate-200/90 hover:border-blue-400 rounded-full shadow-[0_8px_24px_-4px_rgba(15,23,42,0.08),0_2px_6px_rgba(15,23,42,0.03)] hover:shadow-[0_16px_36px_-6px_rgba(37,99,235,0.15)] transition-all duration-200 group active:scale-[0.99] text-left"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 pl-0.5 sm:pl-1.5 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
                    <Search size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] min-[375px]:text-base sm:text-lg font-black text-slate-950 tracking-tight leading-tight">
                      Konum Seç
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
                      Taksim & İstiklal · Asmalımescit & Pera · Yeniköy · Göktürk · Balat · Çukurcuma · Etiler · Ortaköy · Akaretler · Bebek · Galata · Beşiktaş Çarşı · Karaköy · Cihangir · Nişantaşı · Üsküdar · Kuzguncuk · Çengelköy · Koşuyolu & Acıbadem · Kadıköy · Moda · Caddebostan · Suadiye · Bostancı · Kaleiçi · Konyaaltı Sahil · Lara · Kaş Merkez · Kalkan Merkez · Alanya Merkez · Side · Kemer (Antalya) · Gaziantep · Kuşadası · Akyaka & Akçapınar · Fethiye Merkez · Çalış · Ölüdeniz · Yanıklar · Göcek (Fethiye) · Bodrum Merkez · Yalıkavak · Gümüşlük · Türkbükü · Bitez · Turgutreis · Ortakent & Yahşi · Gündoğan · Gümbet · Torba · Akyarlar (Bodrum) · Marmaris Merkez · Datça Merkez · Alsancak · Bostanlı · Karşıyaka · Bornova · Göztepe & Güzelyalı · Mavişehir · Alaçatı · Urla · Sığacık · Foça (İzmir) · Şanlıurfa Merkez · Mardin Merkez · Diyarbakır Merkez · Hatay Merkez · İskenderun Merkez · Adana Merkez · Mersin Merkez · Kızılay · Tunalı Hilmi · Bahçelievler & 7. Cadde · Gaziosmanpaşa · Çayyolu & Park Caddesi · Ümitköy & Beysukent · Ayrancı · Çukurambar (Ankara) · Aydın Merkez · Balıkesir Merkez · Ayvalık Merkez · Cunda · Bursa Merkez · Çanakkale Merkez · Edirne Merkez · Eskişehir Merkez · Denizli Merkez · Rize Merkez · Trabzon Merkez
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] min-[375px]:text-xs font-bold text-white bg-slate-900 group-hover:bg-blue-600 px-3 min-[375px]:px-4 py-2 sm:py-2.5 rounded-full transition-colors duration-200 flex-shrink-0 mr-0.5 sm:mr-1 shadow-sm">
                  <span>Keşfet</span>
                  <ChevronRight size={14} />
                </div>
              </button>
            </div>

            {/* POPÜLER HIZLI SEÇİM ÇİPLERİ (11 KONUM) */}
            <div data-testid="quick-discovery-list" className="flex items-center justify-center flex-wrap gap-1.5 sm:gap-2 mb-7 sm:mb-8">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-0.5">
                Hızlı Keşif:
              </span>
              {quickDiscoveryRegions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleSelectLocation(region)}
                  className="inline-flex items-center gap-1 min-h-[34px] sm:min-h-[36px] max-w-full px-2.5 sm:px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 hover:border-blue-300 shadow-sm transition-all active:scale-95"
                >
                  <MapPin size={11} className="text-blue-600 flex-shrink-0" />
                  <span className="truncate">{region.name}</span>
                </button>
              ))}
            </div>

            {/* ÖRNEK KEŞİF BÖLGELERİ (11 BÖLGE) — ZENGİN GÖRSEL DERGİ KARTLARI */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3 px-1">
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-500">
                  Öne Çıkan Keşif Bölgeleri
                </span>
                <span className="text-[11px] font-bold text-slate-500 flex-shrink-0">
                  {readyRegions.length} Bölge Hazır
                </span>
              </div>

              <div data-testid="featured-discovery-list" className="space-y-3.5 sm:space-y-4">
                {featuredDiscoveryRegions.map((region, index) => {
                  const curated = REGION_CURATED_CARDS[region.id] || {
                    image: '/images/gastronomy/coffee-pour-over.svg',
                    badge: 'Temsili görsel',
                    headline: region.name,
                    vibe: region.characterSubtitle || region.scopeNote || 'Yerel mekanlar ve lezzetler',
                  };

                  return (
                    <div
                      key={region.id}
                      onClick={() => handleSelectLocation(region)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectLocation(region);
                        }
                      }}
                      className="group relative w-full min-h-[11.5rem] sm:min-h-[12.5rem] rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_16px_36px_-6px_rgba(0,0,0,0.22)] border border-slate-200/80 transition-all duration-300 active:scale-[0.99] select-none flex flex-col"
                    >
                      {/* Arka Plan Görseli */}
                      <Image
                        src={curated.image}
                        alt={`${curated.headline} temsili görseli`}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        fill
                        sizes="(max-width: 640px) 100vw, 640px"
                        priority={index < 2}
                        fetchPriority={index < 2 ? 'high' : undefined}
                      />

                      {/* Çok Katmanlı Karartma Gradyanı */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/45 group-hover:from-slate-950 transition-colors" />

                      {/* Kart İçi İçerik */}
                      <div className="relative flex-1 p-4 sm:p-5 flex flex-col justify-between gap-4">
                        {/* Üst Bar: Rozet ve Ok Butonu */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/45 backdrop-blur-md text-white border border-white/25 truncate">
                            {curated.badge}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>

                        {/* Alt Alan: Şehir/Semt Başlığı ve Vibe Açıklaması */}
                        <div className="min-w-0">
                          <h2 className="text-[clamp(1.125rem,4.5vw,1.5rem)] font-black text-white tracking-tight leading-snug break-words group-hover:text-blue-200 transition-colors">
                            {curated.headline}
                          </h2>
                          <p className="text-xs sm:text-[13px] text-slate-200 font-medium line-clamp-2 mt-1 leading-relaxed">
                            {curated.vibe}
                          </p>
                          <div className="flex items-center gap-1 text-[11px] font-extrabold text-blue-300 mt-2 group-hover:translate-x-1 transition-transform">
                            <span>Rehberi Keşfet</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================== */
          /* 2. DURUM: BÖLGE SEÇİLDİ (GASTRONOMİ LİSTELEME AKIŞI)                */
          /* =================================================================== */
          <div className="pt-1">
            {/* 1. BAŞLIK & AÇIKLAMA (MOCKUP İLE BİREBİR AYNI DİZİLİM) */}
            <div className="pt-1 pb-4 sm:pb-5">
              <h1 className="text-[clamp(1.25rem,5vw,1.875rem)] font-black text-slate-950 tracking-tight flex items-start sm:items-center gap-2 sm:gap-2.5 leading-snug">
                <span className="text-2xl sm:text-3xl leading-none flex-shrink-0 mt-0.5 sm:mt-0">{categoryResult?.category.emoji || '🍽️'}</span>
                <span className="min-w-0 break-words [text-wrap:balance]">{formatLocationCategoryHeading(selectedLocation.locative, categoryResult?.category.title)}</span>
              </h1>
              {selectedLocation.characterSubtitle && (
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                  {selectedLocation.characterSubtitle}
                </p>
              )}
            </div>

            {/* 2. 3 SÜTUNLU KATEGORİ IZGARASI (MOCKUPTAKİ 3x2 DÜZENİ) */}
            {currentCategories.length > 0 && (
              <div className="mb-6 sm:mb-7">
                <CategoryBar
                  categories={currentCategories}
                  activeCategorySlug={selectedCategorySlug}
                  onSelectCategory={handleSelectCategory}
                />
              </div>
            )}

            {/* 3. MEKAN KARTLARI LİSTESİ (ORİJİNAL TAM BOY KART DÜZENİ) */}
            {categoryResult && categoryResult.coreVenues.length > 0 ? (
              <div className="space-y-6 sm:space-y-7">
                <div className="grid grid-cols-1 gap-5 sm:gap-6">
                  {categoryResult.coreVenues.map((venue,index) => (
                    <PremiumRestaurantCard
                      key={venue.id}
                      restaurant={venue}
                      priority={index<2}
                      onViewDetails={() => setActiveVenueForModal(venue)}
                      lang={lang}
                    />
                  ))}
                </div>

                {categoryResult.nearbyVenues && categoryResult.nearbyVenues.length > 0 && (
                  <section
                    aria-labelledby="nearby-suggestions-heading"
                    className="pt-6 sm:pt-8 border-t border-slate-200/80 space-y-4"
                    style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 640px' }}
                  >
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-blue-700">
                        <MapPin size={12} className="text-blue-600" />
                        <span>KOMŞU SINIR · EN FAZLA 400 METRE</span>
                      </div>
                      <h2
                        id="nearby-suggestions-heading"
                        className="text-lg sm:text-xl font-black text-slate-950 tracking-tight"
                      >
                        Çok Yakındaki Diğer Öneri
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                        {selectedLocation.name} sınırının hemen dışında, yürüme mesafesindeki (maks. 400 m) tek komşu{' '}
                        {categoryResult.category.label.toLocaleLowerCase('tr')} önerisi
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:gap-6">
                      {categoryResult.nearbyVenues.map((venue) => (
                        <PremiumRestaurantCard
                          key={`nearby-${venue.id}`}
                          restaurant={venue}
                          priority={false}
                          onViewDetails={() => setActiveVenueForModal(venue)}
                          lang={lang}
                        />
                      ))}
                    </div>
                  </section>
                )}

              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs font-medium bg-white rounded-2xl border border-dashed border-slate-200">
                Bu kategoride bölgede henüz doğrulanmış mekan bulunmuyor.
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. KONUM SEÇİCİ MODAL */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={handleSelectLocation}
        provider={foodDiscoveryProvider}
        currentLocationId={selectedLocation?.id}
      />

      {/* 4. ONAYLANAN TASARIM A: PREMİUM BOTTOM SHEET DETAY EKRANI */}
      {activeVenueForModal && (
        <VariantABottomSheet
          restaurant={activeVenueForModal}
          onClose={() => setActiveVenueForModal(null)}
          lang={lang}
        />
      )}

      {/* ALT BİLGİ / FOOTER */}
      {!embedded && (
        <footer className="mt-auto border-t border-slate-200/70 bg-white py-6 px-4 text-center text-slate-500 text-xs select-none">
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 text-[11px]">
            <div className="flex items-center gap-1 font-bold text-slate-700 flex-shrink-0">
              <span>YERİNİ AYIR</span>
              <span className="text-blue-600">·</span>
              <span className="font-normal text-slate-500">Gastronomi Keşif Platformu</span>
            </div>
            <div className="text-center sm:text-right break-words max-w-full">
              {selectedLocation ? `${selectedLocation.displayName} Rehberi` : 'Doğrulanmış Yerel Gastronomi Rehberi'}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
