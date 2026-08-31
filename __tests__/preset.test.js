/* global require, module, __dirname, process, console */
/**
 * Proves that adding @babel/preset-typescript is inert for .js/.jsx input
 * (byte-identical output vs the pre-TypeScript preset on origin/master) and
 * that it correctly strips types from .ts input.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
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

function loadBeforePreset() {
  const source = execSync('git show origin/master:index.js', { cwd: repoRoot }).toString();
  const tmpPath = path.join(repoRoot, `.tmp-before-index-${process.pid}.js`);
  fs.writeFileSync(tmpPath, source);
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(tmpPath);
  } finally {
    fs.unlinkSync(tmpPath);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  // eslint-disable-next-line global-require
  const presetAfter = require(path.join(repoRoot, 'index.js'));
  const presetBefore = loadBeforePreset();

  ['sample.js', 'sample.jsx'].forEach((fixture) => {
    const filePath = path.join(fixturesDir, fixture);
    const before = transform(presetBefore, filePath);
    const after = transform(presetAfter, filePath);
    assert(before === after, `${fixture}: output changed after adding @babel/preset-typescript`);
    console.log(`PASS: ${fixture} output byte-identical before/after`);
  });

  const tsOutput = transform(presetAfter, path.join(fixturesDir, 'sample.ts'));
  assert(!/interface\s+Foo/.test(tsOutput), 'sample.ts: interface was not stripped');
  assert(!/Baz/.test(tsOutput), 'sample.ts: type-only import was not stripped');
  assert(!/:\s*number/.test(tsOutput), 'sample.ts: type annotation was not stripped');
  assert(/const value = 42/.test(tsOutput), 'sample.ts: value declaration missing after strip');
  console.log('PASS: sample.ts types stripped, value preserved');

  console.log('\nAll fixture checks passed.');
}

main();
