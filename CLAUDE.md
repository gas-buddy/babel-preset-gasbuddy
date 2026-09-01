# @gasbuddy/babel-preset-gasbuddy

## What this is

GasBuddy's shared Babel preset: `@babel/preset-env` + `@babel/preset-react` + `@babel/preset-typescript`, plus the loadable/css-modules plugin set. Consumed by GasBuddy web apps via `extends: '@gasbuddy/babel-preset-gasbuddy'` and it backs every babel surface in those apps (webpack babel-loader, `@babel/register` dev SSR, babel CLI server builds, babel-jest, Storybook).

## Naming history — important

- v7+ publishes as **`@gasbuddy/babel-preset-gasbuddy`** (org-scoped, `publishConfig.access: public`).
- The unscoped `babel-preset-gasbuddy` npm package is **frozen at 6.x**. Never publish or deprecate the unscoped name.
- Legacy repos (node-14 era) intentionally remain on unscoped 6.x. Do not migrate them here without an explicit ask.

## Invariants (do not break)

1. **`.js`/`.jsx` output is byte-identical across preset changes.** `__tests__/preset.test.js` proves this against the committed pre-TS snapshot (`__tests__/fixtures/preset-before.js`). Any preset/dependency change must keep `npm test` green; if output legitimately must change, that is a major-version discussion, not a test update.
2. **`@babel/preset-typescript` self-gates on file extension** — TS support must never alter JS/JSX compilation.
3. **Node floor is 14** (`engines.node >=14`) because active consumers (e.g. consumer-web-packages) run node 14. Test changes on node 14 AND a modern node before committing.
4. Tests are a **plain script** (no jest, no `node:test`) so they run on the full CI matrix (14.x–24.x). Keep them dependency-free and hermetic — no git commands, no network.

## Toolchain

- npm (no yarn). `package-lock.json` is **`lockfileVersion: 1`**; if you must regenerate it, use npm 6 (`nvm use 14`) or pass a flag that preserves ≤v2 — a v3 lock breaks older npm installs. `npm ci` on modern npm reads v1 without rewriting it.
- `npm test` is the only quality gate; there is no lint or build step.

## CI / publishing

- `.github/workflows/nodejs.yml`: install + test across the node matrix on every push.
- `.github/workflows/npmpublish.yml`: publish on GitHub release. Uses **npm OIDC trusted publishing** (job-scoped `id-token: write`, no npm token) with dist-tag derivation from the version (`1.2.3-beta.0` → `beta`, plain → `latest`). Publish job runs node 24 (bundled npm ≥11.5, the OIDC floor); do not downgrade it below that without pinning `npx -y npm@11.x`.
- Trusted publisher must exist on npmjs.com for this package (repo `gas-buddy/babel-preset-gasbuddy`, workflow `npmpublish.yml`). The very first publish of a new scoped version line may need to be manual by an org member.

## Conventions

- Final version bumps are made explicitly by the maintainer at release time — do not stamp a final version in a feature PR. Pre-release bumps in feature PRs are fine (e.g. `7.1.0-beta.0`): merging to master auto-publishes, and the workflow derives the dist-tag from the version, so a beta publishes under the `beta` tag and never captures `latest`.
- Keep changes surgical; this package fans out into every consumer's compile pipeline.
