# @gasbuddy/babel-preset-gasbuddy

GasBuddy's shared Babel preset — env + React + TypeScript in one place, so dependent project configuration lives here.

Published under the `@gasbuddy` scope as of v7. The unscoped `babel-preset-gasbuddy` package is frozen at 6.x (its npm ownership predates the org) — new consumers and all v7+ upgrades should use this package.

## Usage

```sh
npm install --save-dev @gasbuddy/babel-preset-gasbuddy
```

```js
// babel.config.js
module.exports = {
  extends: '@gasbuddy/babel-preset-gasbuddy',
};
```

Requires Node >= 14.

## Why

High performance node-compatible output with transparent React and TypeScript support and small bundles — `.ts`/`.tsx` are compiled via `@babel/preset-typescript` (self-gated on file extension; `.js`/`.jsx` output is byte-identical to v6).
