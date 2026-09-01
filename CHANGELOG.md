# Changelog

## Unreleased

- Adds TypeScript support via `@babel/preset-typescript`. No behavior change for JS/JSX input — the preset self-gates on file extension (`.ts`/`.tsx`), so existing `.js`/`.jsx` consumers are unaffected.
- Refreshed the dependency graph to close out stale transitive vulnerabilities flagged against `@babel/plugin-transform-flow-strip-types`, `@babel/plugin-transform-react-constant-elements`, `@babel/plugin-proposal-optional-chaining`, `@loadable/babel-plugin`, and `@babel/preset-typescript`. `package-lock.json` regenerated with npm 6 to keep `lockfileVersion: 1` (Node 8.x/10.x CI compatibility).
