#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const gitDir = path.join(projectRoot, ".git");
const hooksDir = path.join(gitDir, "hooks");
const preCommitPath = path.join(hooksDir, "pre-commit");
const postCommitPath = path.join(hooksDir, "post-commit");
const postMergePath = path.join(hooksDir, "post-merge");
const postCheckoutPath = path.join(hooksDir, "post-checkout");

const manifestScript = `#!/usr/bin/env bash
# Auto-generated pre-commit hook to keep tests manifest up to date
set -euo pipefail
node tools/generate-test-manifest.js
git add tests/manifest.json tests/manifest.js
`;

const manifestMarker =
  "# Auto-generated pre-commit hook to keep tests manifest up to date";

if (!fs.existsSync(gitDir)) {
  console.error("No .git directory found. Run this after git init.");
  process.exit(0);
}
if (!fs.existsSync(hooksDir)) fs.mkdirSync(hooksDir, { recursive: true });

let existingContent = "";
if (fs.existsSync(preCommitPath)) {
  existingContent = fs.readFileSync(preCommitPath, "utf8");
}

let newContent;
if (existingContent.includes(manifestMarker)) {
  // Our script is already there, replace just our part
  const lines = existingContent.split("\n");
  const startIndex = lines.findIndex((line) => line.includes(manifestMarker));
  const endIndex = lines.findIndex(
    (line, i) => i > startIndex && line.trim() === ""
  );

  if (startIndex !== -1) {
    // Remove our existing section
    const beforeOurScript = lines.slice(0, startIndex);
    const afterOurScript = endIndex !== -1 ? lines.slice(endIndex + 1) : [];
    newContent = [
      ...beforeOurScript,
      ...manifestScript.split("\n"),
      ...afterOurScript,
    ].join("\n");
  } else {
    newContent = existingContent;
  }
} else {
  // No existing manifest script, append to existing content
  newContent =
    existingContent + (existingContent ? "\n\n" : "") + manifestScript;
}

fs.writeFileSync(preCommitPath, newContent, "utf8");
try {
  fs.chmodSync(preCommitPath, 0o755);
} catch (e) {}
console.log("Installed pre-commit hook to generate tests manifest.");

// Build generator hook content (shared for post-commit/merge/checkout)
const buildScript = `#!/usr/bin/env bash
# Auto-generated hook to generate BUILD identifier
set -euo pipefail
node tools/generate-build.js
`;

function installOrUpdateHook(hookPath, markerComment) {
  let existing = "";
  if (fs.existsSync(hookPath)) {
    existing = fs.readFileSync(hookPath, "utf8");
  }
  let content;
  if (existing.includes(markerComment)) {
    // Replace the section starting at marker up to next blank or EOF
    const lines = existing.split("\n");
    const startIndex = lines.findIndex((line) => line.includes(markerComment));
    let endIndex = lines.length - 1;
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].trim() === "") {
        endIndex = i;
        break;
      }
    }
    const before = lines.slice(0, startIndex);
    const after = endIndex >= 0 ? lines.slice(endIndex + 1) : [];
    content = [...before, ...buildScript.split("\n"), ...after].join("\n");
  } else {
    content = existing + (existing ? "\n\n" : "") + buildScript;
  }
  fs.writeFileSync(hookPath, content, "utf8");
  try {
    fs.chmodSync(hookPath, 0o755);
  } catch (e) {}
}

installOrUpdateHook(
  postCommitPath,
  "Auto-generated hook to generate BUILD identifier"
);
installOrUpdateHook(
  postMergePath,
  "Auto-generated hook to generate BUILD identifier"
);
installOrUpdateHook(
  postCheckoutPath,
  "Auto-generated hook to generate BUILD identifier"
);
console.log(
  "Installed post-commit, post-merge, and post-checkout hooks to generate BUILD."
);
