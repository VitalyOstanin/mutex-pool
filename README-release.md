# Release Procedure

This document outlines the complete release procedure for the mutex-pool project. Follow these steps in order to ensure a clean, validated release.

## Table of Contents

- [Overview](#overview)
- [Pre-Release Checklist](#pre-release-checklist)
  - [1. Version Update](#1-version-update)
  - [2. Lock File Update](#2-lock-file-update)
  - [3. Documentation Updates](#3-documentation-updates)
  - [4. Build Validation](#4-build-validation)
  - [5. Test Validation](#5-test-validation)
  - [6. Final Code Review](#6-final-code-review)
  - [7. Git Status Check](#7-git-status-check)
- [Release Execution](#release-execution)
  - [Automated Release via GitHub Actions](#automated-release-via-github-actions)
  - [Prerequisites](#prerequisites)
  - [Release Steps](#release-steps)
  - [Monitor Release Progress](#monitor-release-progress)
  - [What GitHub Actions Does](#what-github-actions-does)
- [Post-Release Verification](#post-release-verification)
  - [1. Verify GitHub Actions Workflow](#1-verify-github-actions-workflow)
  - [2. Verify npm Package](#2-verify-npm-package)
  - [3. Smoke Test Published Package](#3-smoke-test-published-package)
  - [4. Verify GitHub Release](#4-verify-github-release)

## Overview

The mutex-pool project uses **automated CI/CD via GitHub Actions** for releases:

- **CI Workflow**: Automatically runs tests, linting, and builds on every push and PR
- **Publish Workflow**: Automatically publishes to npm and creates GitHub Release when you push a version tag

**Quick Release (TL;DR):**
```bash
npm version patch              # Update version, create commit & tag
git push --follow-tags        # Push to GitHub → triggers automated release
```

For detailed instructions and prerequisites, continue reading below.

## Pre-Release Checklist

### 1. Version Update

**Verify that `package.json` version has been incremented:**

```bash
# Check current version
grep '"version"' package.json
```

Version should follow [Semantic Versioning](https://semver.org/):
- **MAJOR** (x.0.0): Breaking changes or major feature additions
- **MINOR** (0.x.0): New features, backward-compatible
- **PATCH** (0.0.x): Bug fixes, backward-compatible

**Update version manually if needed:**

```bash
# For patch release
npm version patch --no-git-tag-version

# For minor release
npm version minor --no-git-tag-version

# For major release
npm version major --no-git-tag-version
```

### 2. Lock File Update

**Ensure `package-lock.json` is synchronized:**

```bash
# Update lockfile after any package.json changes
npm install

# Verify no unexpected changes
git diff package-lock.json
```

The lockfile must reflect the exact dependency tree. Never commit a stale lockfile.

### 3. Documentation Updates

**Update all relevant documentation files:**

#### CHANGELOG Updates

```bash
# Check if CHANGELOG.md exists
test -f CHANGELOG.md && echo "Found" || echo "Missing"
```

Ensure CHANGELOG.md includes:
- New version number and release date
- All new features, fixes, and breaking changes
- Links to related issues/PRs

**Example CHANGELOG entry:**

```markdown
## [0.1.0] - 2025-10-18

### Added
- Initial implementation of MutexPool class
- Support for concurrent job processing with configurable pool size

### Fixed
- Memory leak in job cleanup

### Changed
- Improved error handling in job execution
```

#### README Updates

```bash
# Verify README files are up-to-date
ls -1 README*.md
```

Ensure both `README.md` (English) and `README-ru.md` (Russian) reflect:
- New features and API changes
- Updated usage examples
- Version compatibility notes

### 4. Build Validation

**Run full TypeScript build:**

```bash
npm run build
```

Build must complete without errors. Check for:
- TypeScript compilation errors
- Type checking failures
- Missing dependencies

**Expected output:**
```
[no output on success]
```

**Verify build artifacts:**
```bash
ls -lh dist/
# Should contain: index.js, index.mjs, index.d.ts
```

Any errors must be fixed before proceeding.

### 5. Test Validation

**Run all tests:**

```bash
npm test
```

All tests must pass. Check for:
- Unit test failures
- Integration test failures
- Coverage thresholds (if configured)

**Expected output:**
```
PASS  src/index.test.ts
Test Suites: 1 passed, 1 total
Tests:       X passed, X total
```

### 6. Final Code Review

**Perform a comprehensive code review:**

- [ ] Review all changes since last release
- [ ] Verify no debugging code (console.log, debugger statements)
- [ ] Check for TODOs or FIXMEs that should be addressed
- [ ] Ensure code follows project style guidelines (AGENTS.md)
- [ ] Validate error handling and edge cases
- [ ] Confirm API compatibility (no breaking changes without version bump)

```bash
# Review all changes since last tag
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD")..HEAD --oneline

# Check for debugging artifacts
git grep -n "console\.log\|debugger" src/ || echo "None found"
```

### 7. Git Status Check

**Ensure all changes are committed:**

```bash
# Check working directory status
git status
```

**Expected output:**
```
On branch master
nothing to commit, working tree clean
```

If there are uncommitted changes:

```bash
# Stage all changes
git add .

# Create commit with descriptive message
git commit -m "chore: prepare release v0.x.x"
```

## Release Execution

Once all checklist items are completed:

### Automated Release via GitHub Actions

This project uses GitHub Actions for automated CI/CD. The release process is fully automated when you create a version tag.

#### Prerequisites

**One-time setup:** Configure NPM_TOKEN in GitHub repository secrets:

1. Generate npm Access Token:
   - Go to [npmjs.com](https://www.npmjs.com/) and log in
   - Navigate to **Access Tokens** in your account settings
   - Click **Generate New Token** → **Classic Token**
   - Select **Automation** type (for CI/CD)
   - Copy the generated token

2. Add Secret to GitHub:
   - Go to your GitHub repository settings
   - Navigate to **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Name: `NPM_TOKEN`
   - Value: Paste your npm token
   - Click **Add secret**

#### Release Steps

```bash
# 1. Update version and create git tag
npm version patch   # for 0.0.1 → 0.0.2 (bug fixes)
# or
npm version minor   # for 0.0.1 → 0.1.0 (new features)
# or
npm version major   # for 0.0.1 → 1.0.0 (breaking changes)

# Note: npm version automatically:
# - Updates package.json and package-lock.json
# - Creates a git commit (e.g., "0.0.2")
# - Creates a git tag (e.g., "v0.0.2")

# 2. Push commit and tags to GitHub
git push --follow-tags

# 3. GitHub Actions will automatically:
#    ✓ Run CI tests (Node.js 20.x, 22.x)
#    ✓ Build the project
#    ✓ Run tests
#    ✓ Publish to npm with provenance
#    ✓ Create GitHub Release with installation instructions
```

#### Monitor Release Progress

1. **Check GitHub Actions workflow:**
   - Go to your repository's Actions tab
   - Look for "Publish to npm" workflow run
   - Verify all steps completed successfully

2. **View created release:**
   - Go to your repository's Releases page
   - Verify release was created with correct version tag
   - Check release notes and installation instructions

#### What GitHub Actions Does

The automated workflow (`.github/workflows/publish.yml`) performs:

1. **Environment Setup**
   - Checkout repository code
   - Setup Node.js 20.x with npm cache
   - Install dependencies with `npm ci`

2. **Build & Validation**
   - Build project with `npm run build`
   - Run tests with `npm test`
   - Verify package contents with `npm pack --dry-run`
   - Ensure all required files are included

3. **Publishing**
   - Publish to npm with `--provenance` flag (cryptographic signature)
   - Use `--access public` for scoped package visibility

4. **GitHub Release Creation**
   - Create GitHub Release automatically
   - Include installation instructions
   - Link to package on npmjs.com

## Post-Release Verification

After publishing, verify the release was successful:

### 1. Verify GitHub Actions Workflow

```bash
# Check latest workflow run status via GitHub CLI (optional)
gh run list --workflow=publish.yml --limit 1

# Or visit in browser (replace with your repository URL)
```

**Expected workflow status:** All steps completed successfully

### 2. Verify npm Package

```bash
# Check published version
npm view @vitalyostanin/mutex-pool version

# Expected output: 0.x.x (matching your release tag)

# View full package info
npm view @vitalyostanin/mutex-pool

# Check package provenance (cryptographic signature)
npm view @vitalyostanin/mutex-pool --json | grep -i provenance
```

### 3. Smoke Test Published Package

Test the published package to verify it works correctly:

```bash
# Create temporary test directory
mkdir -p /tmp/mutex-pool-test && cd /tmp/mutex-pool-test

# Initialize test project
npm init -y

# Install published package
npm install @vitalyostanin/mutex-pool@latest

# Create test script
cat > test.js << 'EOF'
const { MutexPool } = require('@vitalyostanin/mutex-pool');

const pool = new MutexPool(2);

async function test() {
  console.log('Testing MutexPool...');

  for (let i = 0; i < 5; i++) {
    await pool.start(async () => {
      console.log(`Job ${i} started`);
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log(`Job ${i} finished`);
    });
  }

  await pool.allJobsFinished();
  console.log('All jobs completed successfully!');
}

test().catch(console.error);
EOF

# Run test
node test.js

# Clean up
cd - && rm -rf /tmp/mutex-pool-test
```

**Success criteria:**
- Package installs without errors
- MutexPool class can be imported
- Basic functionality works as expected

### 4. Verify GitHub Release

```bash
# Visit releases page (replace with your repository URL)

# Or check via GitHub CLI
gh release view v0.x.x
```

**Verify:**
- Release is published (not draft)
- Release notes are properly formatted
- Installation instructions are present
- Tag matches package version

---

**Note:** Always follow this procedure completely. Skipping steps may result in broken releases, dependency conflicts, or user issues.
