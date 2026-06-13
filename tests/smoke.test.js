/*
 * Minimal offline smoke test for the Semaglutide-HFpEF-LivingMeta dashboard.
 *
 * The app is a single-file browser HTML dashboard (no DOM in Node), so this
 * test asserts the shipped-asset integrity invariants that the project contract
 * depends on: no BOM, no unfilled template tokens, no hardcoded local paths,
 * balanced <script> tags, and presence of the core statistical-engine symbols.
 *
 * Run: `node tests/smoke.test.js`  (or `npm test`)
 * Exits non-zero on any failure.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const REVIEW = path.join(ROOT, 'SEMAGLUTIDE_HFPEF_REVIEW.html');
const INDEX = path.join(ROOT, 'index.html');

let failures = 0;
function check(name, cond) {
  if (cond) {
    console.log('  ok   - ' + name);
  } else {
    console.error('  FAIL - ' + name);
    failures++;
  }
}

// --- shipped review HTML ---------------------------------------------------
const buf = fs.readFileSync(REVIEW);
const html = buf.toString('utf8');

check('review HTML exists and is non-trivial (>100 KB)', buf.length > 100 * 1024);
check('review HTML has no UTF-8 BOM',
  !(buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf));
check('review HTML has no unfilled template tokens',
  !/\{\{[^}]+\}\}|REPLACE_ME|__PLACEHOLDER__/.test(html));
check('review HTML has no hardcoded local paths',
  !/C:\\\\Users|C:\\Users|\/home\/[a-z]/.test(html));

const scriptOpen = (html.match(/<script\b/gi) || []).length;
const scriptClose = (html.match(/<\/script>/gi) || []).length;
check('review HTML has balanced <script> tags (' + scriptOpen + '/' + scriptClose + ')',
  scriptOpen === scriptClose);

// Core statistical-engine symbols must be present (regression guard against an
// accidental truncation / minifier dropping the engine).
['AnalysisEngine', 'computeCore', 'qProfileTau2CI', 'tQuantile', 'hksjSE']
  .forEach(sym => check('review HTML defines "' + sym + '"', html.includes(sym)));

// --- redirect index ---------------------------------------------------------
const idx = fs.readFileSync(INDEX, 'utf8');
check('index.html redirects to the review dashboard',
  idx.includes('SEMAGLUTIDE_HFPEF_REVIEW.html'));

// ---------------------------------------------------------------------------
if (failures) {
  console.error('\n' + failures + ' check(s) failed');
  process.exit(1);
}
console.log('\nAll smoke checks passed');
