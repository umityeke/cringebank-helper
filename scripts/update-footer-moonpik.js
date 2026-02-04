const fs = require('fs');
const path = require('path');

const root = process.cwd();

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, out);
      continue;
    }
    if (entry.isFile() && fullPath.toLowerCase().endsWith('.html')) {
      out.push(fullPath);
    }
  }
}

const files = [];
walk(root, files);

const moonpikLink = '<a href="https://www.moonpik.com" target="_blank" rel="noopener noreferrer">Moonpik</a>';

const reInline = /(<footer\s+class="footer"[^>]*>\s*<div\s+class="container"[^>]*>)\s*[^<]*\b2026\b[^<]*(<\/div>\s*<\/footer>)/gis;
const reWithLinks = /(<footer\s+class="footer"[^>]*>[\s\S]*?<div\s+class="container"[^>]*>)\s*[^<]*\b2026\b[^<]*(?=\s*<div\s+class="footer__links")/gis;

let changed = 0;

for (const filePath of files) {
  const original = fs.readFileSync(filePath, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';

  let updated = original;

  // Footers that contain footer links: keep the rights sentence, only replace the brand.
  updated = updated.replace(reWithLinks, (_match, prefix) => {
    return `${prefix}${eol}        &copy; 2026 ${moonpikLink}. Tüm hakları saklıdır.${eol}        `;
  });

  // Inline/simple footers.
  updated = updated.replace(reInline, `$1&copy; 2026 ${moonpikLink}.$2`);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
    changed += 1;
  }
}

process.stdout.write(`Updated footer in ${changed} HTML file(s).\n`);
