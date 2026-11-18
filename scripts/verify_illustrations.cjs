require('./research-ts-loader.cjs');
const assert=require('node:assert/strict'),fs=require('node:fs'),crypto=require('node:crypto');
const {CATEGORY_ILLUSTRATIONS,illustrationCategory,categoryIllustration,assignVenueIllustrations}=require('../lib/food/illustrations.ts');
const manifest=require('../lib/pilot/images/illustration-assets.json');
let passed=0;const test=(name,fn)=>{fn();passed++;console.log('PASS '+name);};
test('six requested category families, four coffee compositions, and a generic fallback exist',()=>{
 assert.equal(Object.keys(CATEGORY_ILLUSTRATIONS).length,7);assert.equal(CATEGORY_ILLUSTRATIONS.coffee.length,4);assert.equal(manifest.assets.length,10);for(const c of ['coffee','burger','pizza','breakfast','dessert','regional'])assert.ok(CATEGORY_ILLUSTRATIONS[c].length>0);
});
test('all original assets are lightweight responsive vectors with recorded provenance and matching hashes',()=>{
 let total=0;for(const a of manifest.assets){const bytes=fs.readFileSync('public'+a.url),s=bytes.toString();assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),a.sha256);assert.equal(bytes.length,a.bytes);assert.ok(bytes.length<4096);total+=bytes.length;assert.match(s,/viewBox="0 0 960 600"/);assert.ok(s.includes('Temsili görsel'));assert.ok(!/<image|<script|href=|https?:\/\/(?!www.w3.org)/.test(s));assert.equal(a.sourceType,'project-authored-svg');assert.ok(a.creationRecord);assert.equal(a.attributionRequired,false);assert.equal(a.venueMatch,'not-a-venue-depiction');assert.equal(a.productMatch,'not-a-specific-product-depiction');}assert.ok(total<20000);
});
test('Turkish and English category aliases resolve correctly, unknown categories remain generic',()=>{
 for(const [input,expected]of [['Kahve','coffee'],['hamburger','burger'],['pizza','pizza'],['Kahvaltı','breakfast'],['Tatlı/Pastane','dessert'],['Yöresel Yemek','regional'],['dessert','dessert'],['unknown','gastronomy']])assert.equal(illustrationCategory(input),expected);
 assert.match(categoryIllustration('../../not-an-asset','../id'),/^\/images\/gastronomy\/gastronomy\.svg$/);
});
test('four actual branch images differ and remain stable after manual reordering',()=>{
 const venues=['osm-node-5764070654','osm-node-6124757286','osm-node-8017443297','osm-node-9375785317'].map(id=>({id,categoryId:'coffee'}));const a=assignVenueIllustrations(venues),b=assignVenueIllustrations(venues.reverse());assert.equal(new Set(a.values()).size,4);for(const [id,url]of a){assert.equal(b.get(id),url);assert.ok(fs.existsSync('public'+url));}
});
test('larger candidate pools reuse valid category art without infinite collision searches',()=>{
 const venues=Array.from({length:100},(_,i)=>({id:'fixture-'+i,categoryId:i%2?'coffee':'burger'}));const assigned=assignVenueIllustrations(venues);assert.equal(assigned.size,100);for(const url of assigned.values())assert.ok(fs.existsSync('public'+url));
});
test('legacy illustration and historical real-photo audit are retained',()=>{
 for(const a of manifest.legacyAssets){assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public'+a.url)).digest('hex'),a.sha256);}const audit=require('../lib/pilot/images/moda-image-audit.json');assert.equal(audit.candidates.length,5);assert.ok(audit.candidates.every(a=>a.visitorEligible===false));
});
console.log(`${passed}/${passed} illustration policy checks passed. No API calls or external visual input.`);
