// Local CLI/test loader using the installed compiler; pilot modules plus the explicit pure illustration catalogue. No dependency download.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const original = require.extensions['.ts'];
require.extensions['.ts'] = (module, filename) => {
  if (!filename.startsWith(path.join(process.cwd(), 'lib', 'pilot')) && filename !== path.join(process.cwd(), 'lib', 'food', 'illustrations.ts')) {
    if (original) return original(module, filename);
    throw new Error('Outside pilot TypeScript scope');
  }
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true},
  }).outputText, filename);
};
