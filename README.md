# Precommit Tester

This repository is a learning project for building a full Git hook workflow from scratch.

The focus is not just "how to run the app". The focus is:

- how to create the project structure
- how to add TypeScript and Express
- how to create linting and formatting files
- how to configure Husky hooks
- how to add commit message validation
- how to add spell checking
- how to add secret scanning and security scanning
- how to make the project build into `dist/`

If someone wants to learn how a real pre-commit / pre-push setup is assembled file by file, this README is written for that purpose.

## What This Project Contains

- Express server written in TypeScript
- ESLint flat config in `eslint.config.js`
- Prettier config in `.prettierrc.json`
- commitlint config in `commitlint.config.js`
- cspell config in `cspell.json`
- Husky hooks in `.husky/`
- lint-staged rules in `package.json`
- CodeQL, Semgrep, Trivy, and Gitleaks integration

## Final Result

After setup, the workflow looks like this:

- `npm run build` compiles TypeScript into `dist/`
- `git commit` triggers:
  - `lint-staged`
  - `cspell`
  - `gitleaks`
- `git push` triggers:
  - `semgrep`
  - `trivy`
  - `codeql`
  - `build`
- commit messages are checked by `commitlint`

## Project Files

Here is the important file map for this repository:

```text
.
|-- .husky/
|   |-- commit-msg
|   |-- pre-commit
|   `-- pre-push
|-- src/
|   |-- controller/
|   `-- route/
|-- server.ts
|-- package.json
|-- tsconfig.json
|-- eslint.config.js
|-- commitlint.config.js
|-- cspell.json
|-- .prettierrc.json
`-- .gitignore
```

## Build Order

If you were teaching someone how to create this repo from zero, this is the order to follow:

1. Create the Node.js project
2. Add TypeScript
3. Add Express
4. Add Prettier
5. Add ESLint
6. Add commitlint
7. Add cspell
8. Add Husky
9. Add `lint-staged`
10. Add security tools:

- CodeQL
- Semgrep
- Trivy
- Gitleaks

11. Add Git hooks
12. Make the project build to `dist/`

The next sections explain each step in that order.

## 1. Create the Node Project

Start with a standard Node.js project:

```bash
npm init -y
```

This creates `package.json`, which is the base of the whole setup.

At this stage, the project only knows how to install packages and run scripts.

## 2. Install the Runtime Dependencies

The app uses Express for the HTTP server:

```bash
npm install express
```

The server entry point is [`server.ts`](./server.ts), which boots the Express app and listens on port `3000` by default.

## 3. Install the TypeScript Tooling

Install the TypeScript development dependencies:

```bash
npm install -D typescript ts-node @types/node @types/express
```

Why these packages exist:

- `typescript`
  - compiles `.ts` files to `.js`
- `ts-node`
  - runs TypeScript directly during development
- `@types/node`
  - adds Node.js type definitions
- `@types/express`
  - adds Express type definitions

## 4. Create `tsconfig.json`

This file tells TypeScript how to compile the project.

Current file:

[`tsconfig.json`](./tsconfig.json)

Important settings in this repo:

- `target: ES2020`
  - compiles to a modern JavaScript target
- `module: commonjs`
  - matches the current Node.js module style used in this project
- `rootDir: .`
  - allows both `server.ts` and `src/**/*.ts`
- `outDir: dist`
  - writes compiled JavaScript into `dist/`
- `strict: true`
  - enables strict type checking

If you were creating it from scratch, the important thing is to make sure `outDir` is set to `dist`, because that is what makes the project build into the `dist/` folder.

## 5. Create the Application Files

The app is intentionally small so the documentation stays focused on tooling.

### `server.ts`

This is the main entry file.

What it does:

- creates the Express app
- enables JSON and URL-encoded body parsing
- renders a simple HTML login page
- mounts the login router
- starts the server

### `src/route/loginRoute.ts`

This file defines the route for login-related requests.

### `src/controller/loginController.ts`

This file contains the request handler logic for login.

This controller/route split is useful because it mirrors how most backend projects are organized.

## 6. Add Prettier

Install Prettier:

```bash
npm install -D prettier
```

Create the formatting config file:

[`./.prettierrc.json`](./.prettierrc.json)

Why it exists:

- keeps formatting consistent across the repository
- reduces style-only diffs
- works well with `lint-staged`

Current rules in this repo:

- `semi: true`
- `singleQuote: true`
- `trailingComma: all`
- `printWidth: 100`

## 7. Add ESLint

Install ESLint and the TypeScript ESLint packages:

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

Create the ESLint config file:

[`eslint.config.js`](./eslint.config.js)

Why this repo uses `eslint.config.js` instead of `eslint.config.ts`:

- ESLint flat config is easiest to load as plain JavaScript
- it avoids needing an extra build step just for config
- it works well in a CommonJS project

Current setup in this repo:

- TypeScript files are matched with `files: ['**/*.ts']`
- `@typescript-eslint/parser` parses the TypeScript
- `@typescript-eslint/eslint-plugin` provides TypeScript-aware rules
- the config is intentionally minimal so it is easy to teach and extend later

If you want a more advanced setup later, this file is the place to add:

- recommended rule sets
- import rules
- no-unused-vars handling
- project-specific rules

## 8. Add commitlint

Install commitlint:

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

Create the config file:

[`commitlint.config.js`](./commitlint.config.js)

What this does:

- enforces Conventional Commits
- makes commit history consistent and easier to read

Example valid messages:

- `feat: add login route`
- `fix: handle missing password`
- `chore: update dependencies`

The hook that uses this file is `.husky/commit-msg`.

## 9. Add cspell

Install cspell:

```bash
npm install -D cspell
```

Create the dictionary and project-specific word list:

[`cspell.json`](./cspell.json)

Why it exists:

- catches spelling mistakes in source files and docs
- reduces noise in technical writing
- prevents accidental typos in config names and feature names

Words like these are intentionally added because they are project-specific:

- `ts-node`
- `precommit`
- `commitlint`
- `lint-staged`
- `gitleaks`
- `semgrep`
- `sarif`

## 10. Add Husky

Install Husky:

```bash
npm install -D husky
```

Create the Git hook system:

```bash
npx husky init
```

Husky creates the `.husky/` folder and the internal bootstrap files.

This repository uses the `prepare` script so Husky installs automatically:

```json
"prepare": "husky"
```

That is why `npm install` is enough to activate the hooks.

## 11. Add lint-staged

Install lint-staged:

```bash
npm install -D lint-staged
```

Add the staged-file rules inside `package.json`.

Current config in this repo:

```json
"lint-staged": {
  "*.{ts,js}": [
    "prettier --write",
    "eslint --fix"
  ],
  "*.{json,md}": [
    "prettier --write"
  ]
}
```

Why this is useful:

- only touches files that are about to be committed
- keeps pre-commit fast
- automatically formats and fixes code before it lands in Git

## 12. Add the Security Tools

This project uses four extra security tools on top of the standard linters.

### 12.1 CodeQL

CodeQL is used for deeper code analysis and SARIF reporting.

The script in `package.json` is:

```json
"codeql": "codeql database create .codeql-db --language=javascript --source-root=. --overwrite && codeql database analyze .codeql-db codeql/javascript-queries --format=sarif-latest --output=codeql-results.sarif"
```

What it does:

- creates a local database in `.codeql-db`
- analyzes JavaScript/TypeScript code
- writes findings to `codeql-results.sarif`

Generated files are ignored in `.gitignore`.

### 12.2 Semgrep

Semgrep is a static analysis tool for pattern-based security and code checks.

Script:

```json
"semgrep": "semgrep scan"
```

### 12.3 Trivy

Trivy scans the filesystem for vulnerabilities and misconfigurations.

Script:

```json
"trivy": "trivy fs ."
```

### 12.4 Gitleaks

Gitleaks scans staged Git changes for secrets.

It is used directly in the `pre-commit` hook:

```sh
gitleaks protect --staged --redact
```

## 13. Create the Husky Hooks

The `.husky/` folder is where the Git automation lives.

### `commit-msg`

File: [.husky/commit-msg](./.husky/commit-msg)

Current content:

```sh
npx commitlint --edit "$1"
```

This means every commit message is checked before the commit is finalized.

### `pre-commit`

File: [.husky/pre-commit](./.husky/pre-commit)

Current content:

```sh
echo "Running pre-commit hook..."

npx lint-staged
npx cspell "**/*.{ts,js,json,md}" --no-summary --no-progress
gitleaks protect --staged --redact
```

Why these three checks are grouped here:

- `lint-staged` keeps code style and fixable lint issues out of the commit
- `cspell` protects documentation and code comments from typos
- `gitleaks` blocks obvious secret leaks before they enter the repository

### `pre-push`

File: [.husky/pre-push](./.husky/pre-push)

Current content:

```sh
echo "Running pre-push hook..."

export PYTHONUTF8=1
export PYTHONIOENCODING=utf-8

npm run semgrep
npm run trivy

echo "Running CodeQL..."
npm run codeql

echo "Running build..."
npm run build

echo "Pre-push checks passed."
```

Why the heavier checks happen at push time:

- pushing is less frequent than saving files
- security scans can take longer
- this keeps the commit workflow fast while still protecting the branch

## 14. Make the Project Build to `dist/`

This repository is configured so the build emits JavaScript files into `dist/`.

The important script is:

```json
"build": "tsc -p tsconfig.json"
```

The key TypeScript setting is:

```json
"outDir": "dist"
```

That combination means:

- `npm run build` compiles the project
- the compiled output goes into `dist/`
- the runtime entry point can be `node dist/server.js`

## Package Scripts Explained

These are the scripts in [`package.json`](./package.json):

- `start`
  - runs the compiled server from `dist/server.js`
- `dev`
  - runs the app directly with `ts-node`
- `format`
  - formats the repository with Prettier
- `lint`
  - runs ESLint
- `lint:fix`
  - runs ESLint and applies fixes
- `spellcheck`
  - runs cspell across `ts`, `js`, `json`, and `md`
- `typecheck`
  - runs TypeScript without emitting files
- `build`
  - compiles TypeScript into `dist/`
- `codeql`
  - creates and analyzes the CodeQL database
- `semgrep`
  - runs Semgrep scan
- `trivy`
  - runs Trivy filesystem scan
- `prepare`
  - installs Husky hooks

## Windows Tool Installation

This repo is Windows-friendly, but the hooks are shell scripts, so some setup matters.

### Git Bash

Install Git for Windows and use Git Bash when running Husky hooks.

### Node.js

Install Node.js 18+ and verify:

```powershell
node -v
npm -v
```

### Python for Semgrep

Install Python 3.10+ and verify:

```powershell
python --version
```

### CodeQL

Install the CodeQL CLI, add it to `PATH`, then verify:

```powershell
codeql version
```

### Semgrep

Install with a supported method such as `pipx` or `uv`, then verify:

```powershell
semgrep --version
```

### Trivy

Install the Trivy CLI, then verify:

```powershell
trivy --version
```

### Gitleaks

Install the Gitleaks CLI, then verify:

```powershell
gitleaks version
```

## Generated Files

These are generated locally and ignored by Git:

- `.codeql-db/`
- `codeql-results.sarif`
- `dist/`

## How a Developer Learns From This Repo

The best way to study this project is to look at each file and ask:

- What problem does this file solve?
- Why is it needed at this stage?
- Which hook or script uses it?
- What happens if it is missing?

That is the whole teaching goal of the repository.

## Suggested Learning Path

1. Read [`package.json`](./package.json) first.
2. Read [`tsconfig.json`](./tsconfig.json) next.
3. Read [`eslint.config.js`](./eslint.config.js).
4. Read [`commitlint.config.js`](./commitlint.config.js).
5. Read [`cspell.json`](./cspell.json).
6. Read the files in [.husky/](./.husky/).
7. Read [`server.ts`](./server.ts).
8. Run `npm run build` and inspect `dist/`.

## Closing Idea

This repo is meant to teach how code quality and security gates are assembled, not just how to clone and run a project.

If someone understands why each file exists, they can build the same workflow in a brand-new repo without copying blindly.
