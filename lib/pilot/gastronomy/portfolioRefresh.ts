import {promises as fs} from 'node:fs';
import path from 'node:path';
import {runFocusedResearch} from '../research/focused/runner';
import {runSourceAccessPilot} from '../research/focused/sourceAccess';
export async function refreshPortfolioEvidence():Promise<string[]>{
 try{const config=JSON.parse(await fs.readFile(path.join(process.cwd(),'work/first-selection/activation.json'),'utf8'));if(config.policy!=='portfolio-v2')return [];}catch(e){if((e as NodeJS.ErrnoException).code==='ENOENT')return [];throw e;}
 const focused=await runFocusedResearch(),search=await runSourceAccessPilot();
 return [`Gerçek ürün/kimlik kaynakları yenilendi veya tarihleri korunarak önbellekten alındı; ${focused.stats.supportedClaims} destekli olgu.`,`Sınırlı keşif: ${search.search.status}; bu işte ${search.search.usage.thisRunReported} Tavily kredisi, günlük ayrılan ${search.search.usage.dayAllocated}.`,`Yeni bağımsız URL için erişim/haklar/şube adaptörü eksikse kalite iddiası üretilmez.`];
}
