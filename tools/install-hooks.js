#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const gitDir = path.join(projectRoot, ".git");
const hooksDir = path.join(gitDir, "hooks");
const preCommitPath = path.join(hooksDir, "pre-commit");

const script = `#!/usr/bin/env bash
# Auto-generated pre-commit hook to keep tests manifest up to date
set -euo pipefail
node tools/generate-test-manifest.js
git add tests/manifest.json tests/manifest.js
`;

if (!fs.existsSync(gitDir)) {
  console.error("No .git directory found. Run this after git init.");
  process.exit(0);
}
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });
fs.writeFileSync(preCommitPath, script, "utf8");
try {
  fs.chmodSync(preCommitPath, 0o755);
} catch (e) {}
console.log("Installed pre-commit hook to generate tests manifest.");
