import type {ManagedCandidate,Evidence,Assessment} from './types';
import {evidenceAllowed,recent} from './policy';
export function assessPortfolio(c:ManagedCandidate,category:string,now:string):Assessment{
 const usable=c.evidence.filter(e=>evidenceAllowed(e,c,category,now)),reasons:string[]=[],warnings=[...(c.advisories||[])];
 const product=usable.filter(e=>e.kind==='independent'&&e.role==='product-review'&&e.productName&&e.publishedAt&&recent(e.publishedAt,now,e.claimScope==='brand'?365:1095)&&(!e.experienceAt||Date.parse(e.experienceAt)<=Date.parse(e.publishedAt))&&Date.parse(e.publishedAt)<=Date.parse(e.checkedAt));
 const branch=product.filter(e=>e.claimScope==='branch'),menu=usable.some(e=>e.kind==='operator'&&e.role==='menu');
 const operator=usable.some(e=>e.kind==='operator'&&e.role==='address'),mapRecent=recent(c.researchProfile?.mapObservedAt||null,now,30);
 const activity=operator||(mapRecent&&branch.some(e=>recent(e.publishedAt,now,365)));
 const scope=branch.length?'branch':'brand',applicable=branch.length?branch:menu&&operator?product:[];
 if(!c.categoryIds.includes(category))reasons.push('Kategoriye özgü kayıt yok.');
 if(!c.researchProfile?.areaMatch)reasons.push('İstenen semtteki fiziksel şube kesinleşmedi veya kapsam dışında.');
 if(!c.identityVerified||!c.address||!c.coordinates)reasons.push('Şube/adres/harita noktası kanıtı eksik.');
 if(c.operation==='confirmed-closed'||c.operation==='closure-signal'||!activity)reasons.push('Güvenilir faaliyet/listelenme kanıtı eksik veya kapanış sinyali var.');
 if(c.conflicts.length)reasons.push('Çözülmemiş önemli şube/kimlik çelişkisi var.');
 if(!applicable.length)reasons.push('Şubeye özgü bağımsız ürün anlatısı veya menüyle desteklenen bağımsız marka ürün kanıtı yok.');
 if(!operator&&activity)warnings.push('Faaliyet yalnız yakın harita kaydı ve 2026 bağımsız yayınla destekli; güncel işletme beyanı yok. Gitmeden teyit edin.');
 if(!menu)warnings.push('Güncel resmî içecek menüsü bulunamadı; kaynakta geçen ürünün bugünkü servisi bilinmiyor.');
 if(scope==='brand')warnings.push('Ürün değerlendirmesi marka düzeyinde; bu fiziksel şubenin bağımsız tadımı doğrulanmadı.');
 const publicationClass=applicable.some(e=>recent(e.publishedAt,now,365))?'recent-publication':'historical-publication';
 if(publicationClass==='historical-publication')warnings.push('Ürün anlatısı tarihsel yayına dayanıyor; güncel tadım gibi okunmamalı.');
 warnings.push('Kesin tarihli yeni tadım yok; sıralama kanıt uygunluğu ve ziyaret seçenekleri içindir, kesin tat üstünlüğü değildir.');
 const families=Array.from(new Set(applicable.map(e=>e.family)));
 const explanation=[scope==='branch'?'Şubeye özgü bağımsız ürün anlatısı var.':'Bağımsız marka ürün anlatısı resmî şube ve menü kaydıyla eşleşiyor.',publicationClass==='recent-publication'?'Son 365 gün içinde ürün yayını var; ziyaret tarihi ayrı ve bilinmiyor.':'Son üç yıl içindeki ürün yayını tarihsel bağlamıyla kullanıldı.',menu?'Resmî menü ile sipariş seçenekleri destekleniyor; menü lezzet kanıtı sayılmadı.':'Sipariş önerisi eski kaynakta bildirilen üründür; güncel servis teyidi gerekli.',families.length+' bağımsız ürün kaynağı ailesi.'];
 return {id:c.id,name:c.name,eligible:!reasons.length,reasons,familyCount:families.length,latestExperience:null,evidence:usable,conflicts:c.conflicts,manual:null,origin:'research',warnings:[...explanation,...warnings],selectionBasis:{productScope:scope,publicationClass,menu,explanation}};
}
export function compareAssessments(a:Assessment,b:Assessment){
 if(a.selectionBasis&&b.selectionBasis){const x=a.selectionBasis,y=b.selectionBasis;return Number(x.productScope==='brand')-Number(y.productScope==='brand')||Number(x.publicationClass==='historical-publication')-Number(y.publicationClass==='historical-publication')||Number(!x.menu)-Number(!y.menu)||b.familyCount-a.familyCount||a.id.localeCompare(b.id);}
 return b.familyCount-a.familyCount||(b.latestExperience||'').localeCompare(a.latestExperience||'')||a.id.localeCompare(b.id);
}
