// Reassesses genuine reviewed observations. Does not fetch new sources or call any API.
require('./research-ts-loader.cjs');const fs=require('node:fs'),{readAllProductResearch}=require('../lib/pilot/quality/productResearch.ts');
const report=readAllProductResearch();report.executionKind='assessment-of-reviewed-real-sources';report.networkRequests=0;report.paidApiRequests=0;
fs.mkdirSync('work/product-research',{recursive:true});fs.writeFileSync('work/product-research/latest.json',JSON.stringify(report,null,2));
const result=report.results.map(r=>({venueId:r.venueId,mainSpecialty:r.mainSpecialty.map(c=>c.categoryId),states:r.products.reduce((acc,p)=>(acc[p.state]=(acc[p.state]||0)+1,acc),{}),signatureProducts:r.signatureProducts}));
console.log(JSON.stringify({sourceRecords:require('../lib/pilot/quality/product-evidence.json').sources.length,productCandidates:report.results.reduce((n,r)=>n+r.products.length,0),results:result,networkRequests:0,paidApiRequests:0},null,2));
