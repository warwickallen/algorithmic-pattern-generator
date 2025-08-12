#!/usr/bin/env node
/*
 Generates BUILD files (repo root and public/) containing a build string:
   ${VERSION}-${BRANCH}-${HASH}-${USER}-${HOST}-${TIMESTAMP}

 Rules:
 - VERSION: from VERSION file (using only the three-segment number), else "~.~.~"
 - BRANCH: current git branch, else "~"
 - HASH: short git hash, else "~"
 - USER: git user.name, else OS username, else "~"
 - HOST: machine hostname, else "~"
 - TIMESTAMP: UTC yyyymmddThhMMss
 - Any character not a Unicode word char, parenthesis, or tilde becomes underscore
*/
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

function readVersion() {
  try {
    const p = path.join(projectRoot, "VERSION");
    if (!fs.existsSync(p)) return "~.~.~";
    const v = fs.readFileSync(p, "utf8").trim();
    const match = v.match(/(\d+\.\d+\.\d+)/);
    return match ? match[1] : "~.~.~";
  } catch {
    return "~.~.~";
  }
}

function git(cmd) {
  try {
    const out = execSync(`git ${cmd}`, {
      cwd: projectRoot,
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });
    const s = String(out || "").trim();
    return s || "~";
  } catch {
    return "~";
  }
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    if (v && String(v).trim()) return String(v).trim();
  }
  return "~";
}

function formatUtcTimestamp(date = new Date()) {
  const pad2 = (n) => String(n).padStart(2, "0");
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());
  const mm = pad2(date.getUTCMinutes());
  const ss = pad2(date.getUTCSeconds());
  return `${y}${m}${d}T${hh}${mm}${ss}`;
}

// Replace anything not:
// Unicode word (letters, numbers, marks, connector punct incl _), parentheses, tilde
function sanitise(input) {
  const s = String(input == null ? "" : input);
  // Allowed: \p{L} letters, \p{N} numbers, \p{M} marks, \p{Pc} connector punctuation,
  //          underscore, parentheses, tilde
  // Replace everything else with underscore
  return s.replace(/[^\p{L}\p{N}\p{M}\p{Pc}_()~]/gu, "_");
}

function generateBuildString() {
  const VERSION = readVersion();
  const BRANCH = git("rev-parse --abbrev-ref HEAD");
  const HASH = git("rev-parse --short HEAD");
  const gitUser = git("config --get user.name");
  const envUser = process.env.USERNAME || process.env.USER || "";
  const USER = firstNonEmpty(gitUser, envUser);
  const envHost = process.env.HOSTNAME || "";
  let hostCandidate = envHost;
  if (!hostCandidate) {
    try {
      hostCandidate = os.hostname();
    } catch {
      hostCandidate = "";
    }
  }
  const HOST = firstNonEmpty(hostCandidate);
  const TIMESTAMP = formatUtcTimestamp();

  // Preserve semantic version formatting (allow dots) by not sanitising VERSION
  const parts = [
    VERSION,
    sanitise(BRANCH),
    sanitise(HASH),
    sanitise(USER),
    sanitise(HOST),
    sanitise(TIMESTAMP),
  ];
  return parts.join("-");
}

function writeBuildFiles(buildString) {
  const targets = [
    path.join(projectRoot, "BUILD"),
    path.join(projectRoot, "public", "BUILD"),
  ];
  for (const t of targets) {
    try {
      fs.writeFileSync(t, buildString + "\n", "utf8");
    } catch (e) {
      // best-effort; continue
    }
  }
}

function main() {
  const buildString = generateBuildString();
  writeBuildFiles(buildString);
  console.log(`Wrote BUILD: ${buildString}`);
}

main();
