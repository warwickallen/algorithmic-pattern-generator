// Generate a detailed Old->New test mapping table
// Parses test-suite-old.html for old tests and tests/** for new tests
// Writes PORTING_MAPPING.md with one row per old test

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();

function readFile(p) {
  return fs.readFileSync(path.join(ROOT, p), "utf8");
}

function listFiles(dir) {
  const out = [];
  function walk(d) {
    for (const entry of fs.readdirSync(path.join(ROOT, d))) {
      const full = path.join(d, entry);
      const stat = fs.statSync(path.join(ROOT, full));
      if (stat.isDirectory()) walk(full);
      else out.push(full.replace(/\\/g, "/"));
    }
  }
  walk(dir);
  return out;
}

function extractOldTests(html) {
  // Match: testSuite.addTest("Name", async ()=>{...}, "category")
  const re = /testSuite\.addTest\(\s*"([^"]+)"[\s\S]*?,\s*"([^"]+)"\s*\)/g;
  const results = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const name = m[1];
    const category = m[2];
    results.push({ name, oldCategory: category });
  }
  return results;
}

function extractNewTests(files) {
  const map = new Map(); // name -> array of {file, category}
  const re = /runner\.addTest\(\s*"([^"]+)"[\s\S]*?,\s*"([^"]+)"\s*\)/g;
  for (const f of files) {
    if (!/\.test\.js$/.test(f)) continue;
    const src = readFile(f);
    let m;
    while ((m = re.exec(src)) !== null) {
      const name = m[1];
      const category = m[2];
      const arr = map.get(name) || [];
      arr.push({ file: f, newCategory: category });
      map.set(name, arr);
    }
  }
  return map;
}

function generateTable(oldTests, newMap) {
  const lines = [];
  lines.push("# Old-to-New Test Mapping");
  lines.push("");
  lines.push(
    "This document maps each test from `test-suite-old.html` to its corresponding new test file."
  );
  lines.push("");
  lines.push(
    "Note: Some items were consolidated across fewer, broader tests. Names matched by title where possible."
  );
  lines.push("");
  lines.push(
    "| Id | Old test name | Old category | New test file(s) |"
  );
  lines.push("| --- | --- | --- | --- |");
  let rowId = 1;
  for (const { name, oldCategory } of oldTests) {
    const hits = newMap.get(name);
    if (!hits || hits.length === 0) {
      lines.push(`| ${rowId++} | ${name} | ${oldCategory} | UNMAPPED |`);
    } else {
      // If multiple, emit multiple rows (duplicate old name/category for readability)
      hits.forEach((h) => {
        const fileDisplay = String(h.file).replace(/^tests\//, "");
        lines.push(
          `| ${rowId++} | ${name} | ${oldCategory} | ${fileDisplay} |`
        );
      });
    }
  }
  lines.push("");
  return lines.join("\n");
}

function main() {
  const oldHtml = readFile("test-suite-old.html");
  const oldTests = extractOldTests(oldHtml);
  const newFiles = listFiles("tests");
  const newMap = extractNewTests(newFiles);
  const md = generateTable(oldTests, newMap);
  fs.writeFileSync(path.join(ROOT, "PORTING_MAPPING.md"), md, "utf8");
  console.log(
    `Wrote mapping for ${oldTests.length} old tests to PORTING_MAPPING.md`
  );
}

main();
