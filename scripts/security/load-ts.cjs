const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const root = process.cwd();
const repoRequire = createRequire(path.join(root, 'package.json'));
const ts = repoRequire('typescript');

module.exports = function loadTs(relativePath, { mocks = {}, cache = new Map() } = {}) {
  const absPath = path.isAbsolute(relativePath) ? relativePath : path.join(root, relativePath);
  if (cache.has(absPath)) {
    return cache.get(absPath).exports;
  }

  const mod = { exports: {} };
  cache.set(absPath, mod);

  const localRequire = createRequire(absPath);
  const source = fs.readFileSync(absPath, 'utf8');
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

  function scopedRequire(id) {
    if (Object.prototype.hasOwnProperty.call(mocks, id)) {
      return mocks[id];
    }
    if (id.startsWith('@/')) {
      const base = path.join(root, id.slice(2));
      for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
            return loadTs(candidate, { mocks, cache });
          }
          return localRequire(candidate);
        }
      }
    }
    if (id.startsWith('./') || id.startsWith('../')) {
      const base = path.resolve(path.dirname(absPath), id);
      for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          if (candidate.endsWith('.ts') || candidate.endsWith('.tsx')) {
            return loadTs(candidate, { mocks, cache });
          }
          return localRequire(candidate);
        }
      }
    }
    return localRequire(id);
  }

  new Function('require', 'module', 'exports', transpiled)(scopedRequire, mod, mod.exports);
  return mod.exports;
};
