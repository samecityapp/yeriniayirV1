import type { CategoryId,Geography } from './types';
export const AUDIT_BUDGET={maxRequests:8,maxDurationMs:90000,maxCandidates:120,maxNewCandidates:30,maxCorrections:10,maxAttempts:3,maxConcurrent:1};
export const AUDIT_CATEGORIES:CategoryId[]=['must-try','coffee','burger','pizza','breakfast','regional','dessert'];
const slug=(name:string)=>name.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').replace(/[^a-z0-9]+/g,'-');
// Names: İstanbul İl Kültür ve Turizm Müdürlüğü, /TR-276146/ilceler.html.
const districts=['Adalar','Arnavutköy','Ataşehir','Avcılar','Bağcılar','Bahçelievler','Bakırköy','Başakşehir','Bayrampaşa','Beşiktaş','Beykoz','Beylikdüzü','Beyoğlu','Büyükçekmece','Çatalca','Çekmeköy','Esenler','Esenyurt','Eyüpsultan','Fatih','Gaziosmanpaşa','Güngören','Kadıköy','Kağıthane','Kartal','Küçükçekmece','Maltepe','Pendik','Sancaktepe','Sarıyer','Şile','Silivri','Şişli','Sultanbeyli','Sultangazi','Tuzla','Ümraniye','Üsküdar','Zeytinburnu'];
// Administrative names only; no invented polygons. Official dataset: acikveri.kadikoy.bel.tr/en/dataset/kadikoy-ilcesindeki-mahalle-sinirlari.
const neighborhoods=['19 Mayıs','Acıbadem','Bostancı','Caddebostan','Caferağa','Dumlupınar','Eğitim','Erenköy','Fenerbahçe','Feneryolu','Fikirtepe','Göztepe','Hasanpaşa','Koşuyolu','Kozyatağı','Merdivenköy','Osmanağa','Rasimpaşa','Sahrayıcedit','Suadiye','Zühtüpaşa'];
export const GEOGRAPHIES:Geography[]=[{id:'istanbul',name:'İstanbul',level:'province',parentId:null,pilot:false},...districts.map(name=>({id:'district-'+slug(name),name,level:'district' as const,parentId:'istanbul',pilot:false})),...neighborhoods.map(name=>({id:'neighborhood-'+slug(name),name,level:'neighborhood' as const,parentId:'district-kadikoy',pilot:false})),{id:'moda',name:'Moda pilot alanı',level:'neighborhood',parentId:'neighborhood-caferaga',pilot:true}];
export function planAudit(geoId:string,category:CategoryId|'all',registry:Geography[]=GEOGRAPHIES){
 const geo=registry.find(g=>g.id===geoId);if(!geo)throw new Error('Coğrafi kapsam bulunamadı; Türkiye çapında tek iş desteklenmez.');
 if(category!=='all'&&!AUDIT_CATEGORIES.includes(category))throw new Error('Kategori geçersiz.');
 const children=registry.filter(g=>g.parentId===geo.id&&(geo.level==='province'?g.level==='district':true));
 const units=geo.level==='province'||geo.level==='district'?children:[geo];
 if(!units.length)return {jobs:[],message:'Bu kapsamın alt bölge kaydı eksik; geniş alan sorgusu çalıştırılmadı.'};
 const categories=category==='all'?AUDIT_CATEGORIES:[category];
 if(units.length*categories.length>300)throw new Error('Plan en fazla 300 alt iş içerebilir; daha küçük kapsam seçin.');
 return {jobs:units.flatMap(unit=>categories.map(cat=>({geoId:unit.id,category:cat,executable:geo.id==='moda'&&unit.pilot&&cat==='coffee'}))),message:geo.id==='moda'?'Yalnızca Moda kahve işi çalıştırılabilir; diğer kategoriler plan olarak kalır.':'Alt bölgelere bölündü. Pilot dışı işler çalıştırılmadan planlandı; coğrafi adaptör gereklidir.'};
}
