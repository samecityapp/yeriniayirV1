import {refreshPortfolioEvidence} from './portfolioRefresh';
import { executeResearch } from '../research/store';
import { buildQualityReport } from '../quality/report';
import type { QualityLedger } from '../quality/report';
import { saveQualityReport } from '../quality/store';
import ledger from '../quality/evidence-ledger.json';
import { discoverCategory } from './discovery';
import { readManagementView,changeManagement } from './store';
import type { ManagementAction } from './types';
import { ManagementError } from './state';
export async function runResearchCycle(action:Extract<ManagementAction,{type:'run'}>,actor:'admin'|'engine'='engine'){
 if(process.env.VERCEL||process.env.NODE_ENV==='production')throw new ManagementError('Yerel geliştirme dışında otonom iş çalıştırılamaz.',403);
 const view=await readManagementView();if(view.revision!==action.revision)throw new ManagementError('Yönetim verisi değişti; yenileyin.',409);
 const scope=view.scopes.find(s=>s.key===action.regionId+'/'+action.categoryId);if(!scope)throw new ManagementError('Bölge/kategori bulunamadı.');
 const warnings:string[]=[];
 if(action.regionId==='moda-kadikoy'&&action.categoryId==='coffee'){
  try{
   const {run,reused}=await executeResearch();
   warnings.push(reused?'Keşif isteği kaynak koruma aralığı nedeniyle son kaydı kullandı.':'Gerçek kahve keşfi yeniden çalıştırıldı.');
   if(run.lastAttempt)warnings.push('Son kaynak hatası nedeniyle eski keşif havuzu kendi tarihleriyle korundu.');
   await saveQualityReport(buildQualityReport(run,ledger as QualityLedger));
  }catch{warnings.push('Keşif/kimlik eşleştirmesi yenilenemedi; son kanıt dosyası kendi tarihleriyle korunuyor.');}
 }else{
  try{warnings.push(...await discoverCategory(action.regionId,action.categoryId));}catch{warnings.push('Canlı keşif kaynağı erişilemedi; önceki kayıtlar korundu.');}
 }
 if(action.regionId==='moda-kadikoy'&&action.categoryId==='coffee')try{warnings.push(...await refreshPortfolioEvidence());}catch{warnings.push('Ek kaynak yenilemesi tamamlanamadı; son kanıtlar kendi tarihleriyle korunuyor.');}
 warnings.push('Seçki kaynak portföyüne dayanır; güncel tarihli tadım bulunmayan alanlar ayrıca belirsiz gösterilir. Yeni bölgeler kaynak/coğrafya adaptörü olmadan taranmaz.');
 return changeManagement(action,actor,warnings);
}
export async function runDueReview(){
 const view=await readManagementView(),now=Date.now();
 const due=view.scopes.find(s=>!s.lastRunAt||!s.nextReviewAt||Date.parse(s.nextReviewAt)<=now);
 if(!due)return {ran:false,nextDue:view.scopes.map(s=>s.nextReviewAt).filter(Boolean).sort()[0]||null};
 const result=await runResearchCycle({type:'run',regionId:due.region.id,categoryId:due.category.id,reason:'Haftalık otomatik kaynak ve kanıt yeniden değerlendirmesi',revision:view.revision},'engine');
 return {ran:true,scope:due.key,revision:result.revision};
}
