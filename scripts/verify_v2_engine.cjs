require('./research-ts-loader.cjs');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const {
  runCharidesMarinaRegressionTest,
  generateKusadasiAuditReports,
  QUARANTINED_VENUES,
} = require('../lib/pilot/gastronomy/v2Engine.ts');
const { readIntegrationDiscovery } = require('../lib/pilot/integration/discovery.ts');
const { toFoodDiscovery } = require('../lib/pilot/integration/foodAdapter.ts');

const mod = { exports: {} };
new Function(
  'require',
  'module',
  'exports',
  ts.transpileModule(fs.readFileSync('lib/food/realProvider.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
)(require, mod, mod.exports);
const { createRealFoodProvider } = mod.exports;

(async () => {
  // 1. Mandatory Charides Marina Regression Test
  const reg = runCharidesMarinaRegressionTest();
  assert.equal(reg.passed, true, 'Charides Marina regression test must pass');
  assert.equal(reg.discoveredWithoutNameInQuery, true, 'Charides Marina must be discovered without passing its name in queries');
  assert.equal(reg.separatedFromGazibegendiBranch, true, 'Charides Marina and Charides Gazibeğendi must remain separate branches');
  assert.deepEqual(reg.qualifiedCategories, ['ege-balik-kusadasi', 'date-aksam-kusadasi']);
  console.log('PASS 1/5: Mandatory Charides Sea Food Marina name-blind discovery & branch separation regression test');

  // 2. Chain & Hotel Exclusion Policy Test
  for (const bannedId of [
    'kusadasi-kahvalti-sultankonak',
    'kusadasi-kahve-espressolab',
    'kusadasi-kahve-colombia',
    'kusadasi-pizza-locale',
    'kusadasi-date-giorooftop',
    'caddebostan-dessert-pelit',
    'suadiye-brunch-lepain',
    'suadiye-dessert-godiva',
    'taksim-tatli-mado',
    'bebek-bistro-kirinti',
  ]) {
    assert.ok(QUARANTINED_VENUES[bannedId], `Banned chain/hotel ${bannedId} must be recorded in QUARANTINED_VENUES`);
  }
  console.log('PASS 2/5: Chain & Hotel Exclusion Policy quarantines franchises and hotel breakfast/rooftop venues without deleting history');

  // 3. Kuşadası Live Adapter & Provider Check (Multi-Category + Dynamic 1..5 Venues without Padding to 4)
  const kusadasiData = await readIntegrationDiscovery('kusadasi', '');
  assert.ok(kusadasiData);
  const kusadasiFood = toFoodDiscovery(kusadasiData);
  const provider = createRealFoodProvider(kusadasiFood);

  const balik = provider.getCategoryResult('kusadasi-aydin', 'ege-balik-kusadasi');
  const date = provider.getCategoryResult('kusadasi-aydin', 'date-gunbatimi-kusadasi');
  const kahvalti = provider.getCategoryResult('kusadasi-aydin', 'koy-kahvalti-kusadasi');
  const pizza = provider.getCategoryResult('kusadasi-aydin', 'pizza-italyan-kusadasi');
  const kahve = provider.getCategoryResult('kusadasi-aydin', 'nitelikli-kahve-kusadasi');

  assert.equal(balik.coreVenues.length, 4);
  assert.ok(balik.coreVenues.some((v) => v.id === 'kusadasi-balik-charides-marina'));
  assert.ok(balik.coreVenues.some((v) => v.id === 'kusadasi-date-bottarga'));

  assert.equal(date.coreVenues.length, 4);
  assert.ok(date.coreVenues.some((v) => v.id === 'kusadasi-balik-charides-marina'));
  assert.ok(date.coreVenues.some((v) => v.id === 'kusadasi-date-bottarga'));

  // Dynamic count: 2 genuine venues each instead of padding to 4 with hotels/chains!
  assert.equal(kahvalti.coreVenues.length, 2);
  assert.deepEqual(
    kahvalti.coreVenues.map((v) => v.id),
    ['kusadasi-kahvalti-degirmen', 'kusadasi-kahvalti-koysofrasi']
  );

  assert.equal(pizza.coreVenues.length, 2);
  assert.deepEqual(
    pizza.coreVenues.map((v) => v.id),
    ['kusadasi-pizza-granidiperle', 'kusadasi-pizza-miovino']
  );

  assert.equal(kahve.coreVenues.length, 2);
  assert.deepEqual(
    kahve.coreVenues.map((v) => v.id),
    ['kusadasi-kahve-court', 'kusadasi-kahve-roost']
  );
  console.log('PASS 3/5: Kuşadası V2 dynamic venue counts (4/4/2/2/2) and multi-category membership verified');

  // 4. Discovery Coverage Report & Selection Quality Report Generation
  const { coverageReport, selectionReport } = generateKusadasiAuditReports();
  assert.ok(coverageReport.totalCandidatesDiscovered >= 14);
  assert.ok(coverageReport.benchmarkResults.every((b) => b.discoveredWithoutNamePrompt && b.status === 'DISCOVERED_AND_SELECTED'));
  assert.equal(selectionReport.categoriesEvaluated.length, 5);

  const outDir = path.join(process.cwd(), 'work', 'v2-audit');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'kusadasi-discovery-coverage.json'), JSON.stringify(coverageReport, null, 2));
  fs.writeFileSync(path.join(outDir, 'kusadasi-selection-quality.json'), JSON.stringify(selectionReport, null, 2));
  fs.writeFileSync(path.join(outDir, 'quarantined-venues.json'), JSON.stringify(QUARANTINED_VENUES, null, 2));
  console.log('PASS 4/5: Discovery Coverage Report & Selection Quality Report generated in work/v2-audit/');

  // 5. Canonical SQL Migration Check
  assert.ok(fs.existsSync('supabase/migrations/20261105200000_create_gastronomy_v2_canonical_schema.sql'));
  console.log('PASS 5/5: Canonical Supabase staging V2 schema migration verified');
  console.log('\n5/5 Gastronomy Engine V2 checks passed.');
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
