/** Public asset catalogue only. Rights/provenance records stay on the server. */
export type IllustrationCategory='coffee'|'burger'|'pizza'|'breakfast'|'dessert'|'regional'|'gastronomy';
export const CATEGORY_ILLUSTRATIONS:Record<IllustrationCategory,readonly string[]>={
 coffee:['coffee-cup','coffee-pour-over','coffee-moka','coffee-cup-and-beans'],
 burger:['burger'],pizza:['pizza'],breakfast:['breakfast'],dessert:['dessert'],regional:['regional'],gastronomy:['gastronomy'],
};
const aliases:Record<string,IllustrationCategory>={coffee:'coffee',kahve:'coffee',burger:'burger',hamburger:'burger',pizza:'pizza',breakfast:'breakfast',kahvalti:'breakfast',dessert:'dessert',tatli:'dessert','tatli-pastane':'dessert','tatli-cikolata':'dessert',pastane:'dessert',regional:'regional',yoresel:'regional','yoresel-yemek':'regional','yoresel-lezzetler':'regional',lokanta:'regional','tarihi-lokantalar':'regional',kebap:'regional','kebap-doner':'regional',balik:'gastronomy','balik-deniz-urunleri':'gastronomy',meyhane:'gastronomy',bistro:'gastronomy','aksam-bistro':'gastronomy','bistro-dunya':'gastronomy',date:'gastronomy','date-mekanlari':'gastronomy'};
export const illustrationCategory=(category:string):IllustrationCategory=>aliases[category.toLocaleLowerCase('tr').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i').trim().replace(/[\s/]+/g,'-')]||'gastronomy';
const hash=(id:string)=>{let n=2166136261;for(let i=0;i<id.length;i++){n^=id.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0;};
export function categoryIllustration(category:string,id=''){
 const family=CATEGORY_ILLUSTRATIONS[illustrationCategory(category)];return '/images/gastronomy/'+family[hash(id)%family.length]+'.svg';
}
/** Stable across manual reordering. Avoid repeats while a category has unused variants. */
export function assignVenueIllustrations(venues:readonly {id:string;categoryId:string}[]):Map<string,string>{
 const result=new Map<string,string>(),used=new Map<IllustrationCategory,Set<number>>();
 for(const venue of [...venues].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)){
  const category=illustrationCategory(venue.categoryId),family=CATEGORY_ILLUSTRATIONS[category],taken=used.get(category)||new Set<number>();
  let index=hash(venue.id)%family.length;
  if(taken.size<family.length){while(taken.has(index))index=(index+1)%family.length;taken.add(index);used.set(category,taken);}
  result.set(venue.id,'/images/gastronomy/'+family[index]+'.svg');
 }
 return result;
}
export const illustrationLabel=(category:string)=>({coffee:'Kahve',burger:'Hamburger',pizza:'Pizza',breakfast:'Kahvaltı',dessert:'Tatlı ve pastane',regional:'Yöresel yemek',gastronomy:'Gastronomi'}[illustrationCategory(category)]);
