// index.html のインライン <script> の SHA-256 を計算して CSP の script-src に書き込む。
// 使い方: node scripts/csp-hash.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const file = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) throw new Error('inline <script> not found');
const hash = crypto.createHash('sha256').update(m[1], 'utf8').digest('base64');

const re = /script-src 'self' 'sha256-[^']*'/;
if (!re.test(html)) throw new Error('CSP script-src with sha256 not found');
html = html.replace(re, `script-src 'self' 'sha256-${hash}'`);
fs.writeFileSync(file, html);
console.log('CSP script hash updated:', hash);
