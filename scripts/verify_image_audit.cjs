// Audit validation only: this script performs no discovery, downloads or publication.
require('./research-ts-loader.cjs');
const assert = require('node:assert/strict');
const audit = require('../lib/pilot/images/moda-image-audit.json');
const {readVisitorVenueSelection} = require('../lib/pilot/gastronomy/selectionReader.ts');
let checks=0;
const check=(label,fn)=>{fn();checks++;console.log('PASS '+label);};
(async()=>{
 check('audit contains exactly four selected branches and five distinct source candidates',()=>{
  assert.equal(audit.venues.length,4);assert.equal(audit.candidates.length,5);
  assert.equal(new Set(audit.candidates.map(c=>c.id)).size,5);
  for(const v of audit.venues)assert.ok(audit.candidates.some(c=>c.venueId===v.venueId));
 });
 check('source availability never counts as a redistribution license',()=>{
  for(const c of audit.candidates){assert.equal(c.visitorEligible,false);assert.equal(c.assetUrl,null);assert.equal(c.rights.permissionProof,null);assert.equal(c.rights.license,null);assert.equal(c.rights.commercialRedistributionVerified,false);assert.equal(c.rights.status,'unverified');assert.ok(c.sourcePageUrl.startsWith('https://'));assert.ok(c.assetLocator);assert.equal(c.checkedOn,audit.checkedOn);}
 });
 check('source-labelled branch, ambiguous branch and visual verification remain distinct',()=>{
  assert.equal(audit.candidates.filter(c=>c.branchMatch.status==='source-labeled-branch').length,2);
  assert.equal(audit.candidates.find(c=>c.id==='montag-barista-interior').branchMatch.status,'unresolved');
  assert.ok(audit.candidates.every(c=>c.branchMatch.verified===false&&c.branchMatch.notes));
 });
 check('fallback needs an actual licensed labelled illustration; none is fabricated',()=>{
  for(const v of audit.venues){assert.deepEqual(v.usablePhotoIds,[]);assert.deepEqual(v.verifiedProductPhotoIds,[]);assert.equal(v.fallback.required,true);assert.equal(v.fallback.label,'Temsili görsel');assert.equal(v.fallback.assetUrl,null);assert.equal(v.fallback.status,'required-not-created');}
 });
 check('Google photo path is inactive, nonpersistent and has no assumed free account credit',()=>{
  const g=audit.googlePhotos;assert.equal(g.status,'inactive-not-requested');assert.equal(g.placeIdentityVerified,false);assert.equal(g.storePhotoNames,false);assert.equal(g.storePhotoBytes,false);assert.equal(g.allowNextImagePersistentCache,false);assert.equal(g.pricing.accountRemainingFreeAllowance,null);assert.equal(g.pricing.approvalRequiredBeforeRequests,true);assert.equal(audit.method.googlePhotosApiRequests,0);assert.equal(audit.method.paidApiRequests,0);assert.equal(audit.method.imageBytesDownloaded,false);
 });
 const selection=await readVisitorVenueSelection();
 check('all four actual visitor cards still hide photos and internal image evidence',()=>{
  assert.deepEqual(selection.cards.map(c=>c.id).sort(),audit.venues.map(v=>v.venueId).sort());
  for(const c of selection.cards){assert.equal(c.photo,null);assert.ok(!JSON.stringify(c).includes('sourcePageUrl'));assert.ok(!JSON.stringify(c).includes('permissionProof'));}
 });
 console.log(`${checks}/${checks} image audit checks passed. No image download or API request.`);
})().catch(()=>{console.error('Image audit verification failed');process.exitCode=1;});
