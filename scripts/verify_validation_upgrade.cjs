const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
const moduleUnderTest = { exports: {} };
new Function('require', 'module', 'exports', ts.transpileModule(fs.readFileSync('lib/validators.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText)(require, moduleUnderTest, moduleUnderTest.exports);
const { restaurantSchema, articleSchema, priceTagSchema } = moduleUnderTest.exports;
assert.ok(restaurantSchema.safeParse({ name: 'Test Mekanı', category: 'Kahve', latitude: 40.98, longitude: 29.02 }).success);
assert.equal(restaurantSchema.safeParse({ name: 'Test', category: 'Kahve', latitude: 91 }).success, false);
assert.equal(restaurantSchema.safeParse({ name: 'Test', category: 'Kahve', website_url: 'javascript:alert(1)' }).success, false);
assert.equal(articleSchema.safeParse({ title: 'Geçerli başlık', slug: '../unsafe', content: 'x'.repeat(60) }).success, false);
assert.equal(priceTagSchema.safeParse({ label: 'Test', slug: 'test', min_price: -1 }).success, false);
const { z } = require('zod');
assert.ok(z.record(z.string(), z.any()).safeParse({ device: 'mobile', count: 1 }).success);
assert.equal(z.record(z.string(), z.any()).safeParse(['array-is-not-metadata']).success, false);
assert.match(require('uuid').v4(), /^[0-9a-f-]{36}$/i);
console.log('PASS 8 validation/Google-client UUID compatibility assertions');
