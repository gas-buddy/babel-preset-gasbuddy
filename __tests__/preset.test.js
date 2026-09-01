/* global require, module, __dirname, console */
/**
 * Proves that adding @babel/preset-typescript is inert for .js/.jsx input
 * (byte-identical output vs the committed pre-TypeScript preset snapshot)
 * and that it correctly strips types from .ts input.
 */
const path = require('path');
const assert = require('assert');
const babel = require('@babel/core');

const repoRoot = path.join(__dirname, '..');
const fixturesDir = path.join(__dirname, 'fixtures');

function transform(preset, filePath) {
  const result = babel.transformFileSync(filePath, {
    presets: [preset],
    babelrc: false,
    configFile: false,
  });
  return result.code;
}

// Drop any inline source-map comment before asserting on output text, so a
// base64-embedded sourcesContent payload can't produce a false-positive match.
function stripSourceMapComment(code) {
  return code.replace(/^\/\/#\s*sourceMappingURL=.*$/gm, '');
}

function main() {
  const presetAfter = require(path.join(repoRoot, 'index.js'));
  const presetBefore = require(path.join(fixturesDir, 'preset-before.js'));

  ['sample.js', 'sample.jsx'].forEach((fixture) => {
    const filePath = path.join(fixturesDir, fixture);
    const before = transform(presetBefore, filePath);
    const after = transform(presetAfter, filePath);
    assert.ok(before === after, `${fixture}: output changed after adding @babel/preset-typescript`);
    console.log(`PASS: ${fixture} output byte-identical before/after`);
  });

  const tsOutput = stripSourceMapComment(transform(presetAfter, path.join(fixturesDir, 'sample.ts')));
  assert.ok(!/interface\s+Foo/.test(tsOutput), 'sample.ts: interface was not stripped');
  assert.ok(!/Baz/.test(tsOutput), 'sample.ts: type-only import was not stripped');
  assert.ok(!/:\s*number/.test(tsOutput), 'sample.ts: type annotation was not stripped');
  assert.ok(/const value = 42/.test(tsOutput), 'sample.ts: value declaration missing after strip');
  console.log('PASS: sample.ts types stripped, value preserved');

  console.log('\nAll fixture checks passed.');
}

main();
