# Repository Guidelines

## Table of Contents
- [Contributor Notes](#contributor-notes)
- [Documentation Guidelines](#documentation-guidelines)
- [Project Structure](#project-structure)
- [Build & Development Commands](#build--development-commands)
- [Coding Style & Tooling](#coding-style--tooling)
- [Testing Guidelines](#testing-guidelines)
- [Build Artifacts](#build-artifacts)

## Contributor Notes
- Keep source code, comments, documentation, and commit messages in English.
- Run `npm run build` and `npm test` before publishing changes to ensure type-checking and tests stay green.
- Maintain `README.md` in English and `README-ru.md` in Russian so both stay aligned with the mutex-pool feature set.

## Documentation Guidelines
- **Use professional style without emojis** in all documentation, commit messages, and code comments.
- Keep documentation clear, concise, and technically accurate.
- Focus on technical content rather than decorative elements.

## Project Structure
- `src/`: TypeScript sources for the MutexPool library.
- `dist/`: Compiled JavaScript and TypeScript declarations emitted by `npm run build` (ignored by git).
- `index.ts`: Entry point that exports the MutexPool class.
- `README-release.md`: Release procedure checklist in English — comprehensive guide for executing project releases.

## Build & Development Commands
- `npm run build`: Compile TypeScript to `dist/` using tsup (generates CJS, ESM, and type declarations).
- `npm test`: Run Jest tests.
- After modifying `package.json` dependencies, always run `npm install` to update `package-lock.json` accordingly.
- Keep documentation (`README*`, `CHANGELOG.md`, ru variants when available) aligned with the current feature set after each iteration.

## Coding Style & Tooling
- Project uses TypeScript with strict mode enabled.
- Prefer modern ES/TypeScript features (`const`, optional chaining, nullish coalescing, async/await).
- Keep TypeScript types strict: no `any`, prefer precise interfaces.
- Follow consistent naming conventions:
  - Classes: PascalCase (e.g., `MutexPool`)
  - Methods and properties: camelCase (e.g., `allJobsFinished`)
  - Types and interfaces: PascalCase (e.g., `Job`, `SemaphoreInterface`)

## Testing Guidelines
- All public methods should have corresponding tests.
- Tests are written using Jest framework.
- Test files should be placed in the same directory as the source files with `.test.ts` extension.
- Aim for high code coverage (≥80%) for critical paths.
- Test both success and error scenarios.

## Build Artifacts
- Only `dist/` should contain compiled assets; do not commit build output.
- The build generates:
  - `dist/index.js` - CommonJS bundle
  - `dist/index.mjs` - ES Module bundle
  - `dist/index.d.ts` - TypeScript type declarations
