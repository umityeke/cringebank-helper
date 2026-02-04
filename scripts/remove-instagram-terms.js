const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

// This script is intentionally formatting-preserving.
// It only edits .html and .md files (UTF-8) and does NOT normalize whitespace.
// Do file renames separately via git:
//   git mv articles/cringebank/reels-kisa-video.html articles/cringebank/cringeclap-kisa-video.html
//   git mv articles/cringebank/cringespill-hikaye.html articles/cringebank/cringespill-gecici-paylasim.html
//   git mv articles/cringebank/dm-taciz-tehdit-santaj.html articles/cringebank/ozel-mesaj-taciz-tehdit-santaj.html

function walkFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (entry.isFile()) files.push(fullPath);
  }

  return files;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyReplacements(content, replacements) {
  let next = content;
  for (const { from, to } of replacements) {
    next = next.replace(from, to);
  }
  return next;
}

const pathReplacements = [
  {
    fromRel: 'articles/cringebank/reels-kisa-video.html',
    toRel: 'articles/cringebank/cringeclap-kisa-video.html',
  },
  {
    fromRel: 'articles/cringebank/cringespill-hikaye.html',
    toRel: 'articles/cringebank/cringespill-gecici-paylasim.html',
  },
  {
    fromRel: 'articles/cringebank/dm-taciz-tehdit-santaj.html',
    toRel: 'articles/cringebank/ozel-mesaj-taciz-tehdit-santaj.html',
  },
];

function applyTerminology(content) {
  let next = content;

  // Update link targets and relative references.
  for (const { fromRel, toRel } of pathReplacements) {
    next = next.replace(new RegExp(escapeRegExp(fromRel), 'g'), toRel);

    const fromBase = fromRel.split('/').pop();
    const toBase = toRel.split('/').pop();
    if (fromBase && toBase) {
      next = next.replace(new RegExp(escapeRegExp(fromBase), 'g'), toBase);
    }
  }

  // Reels -> Kısa Video (avoid Instagram wording)
  next = applyReplacements(next, [
    { from: /CringeClap \(Reels\)\s*&\s*kısa video/g, to: 'CringeClap (Kısa Video)' },
    { from: /CringeClap \(Reels\)/g, to: 'CringeClap (Kısa Video)' },
    { from: /\bReels\b/g, to: 'Kısa Video' },
    { from: /\breels\b/g, to: 'kısa video' },
    { from: /Reels\s*\/\s*kısa video/gi, to: 'Kısa Video' },
    { from: /Reels\s*\/\s*kısa videolarda/gi, to: 'Kısa videolarda' },
  ]);

  // Hikaye -> Geçici Paylaşım
  next = applyReplacements(next, [
    { from: /CringeSpill \(Hikaye\)/g, to: 'CringeSpill (Geçici Paylaşım)' },
    { from: /\bHikaye\b/g, to: 'Geçici Paylaşım' },
    { from: /\bhikaye\b/g, to: 'geçici paylaşım' },
  ]);

  // DM -> Özel Mesaj
  next = applyReplacements(next, [
    { from: /\bDM güvenliği\b/g, to: 'Özel mesaj güvenliği' },
    { from: /\bDM Güvenliği\b/g, to: 'Özel Mesaj Güvenliği' },
    { from: /\bKonu: DM\b/g, to: 'Konu: Özel Mesaj' },

    { from: /\bDM['’]de\b/g, to: 'özel mesajda' },
    { from: /\bDM['’]lerde\b/g, to: 'özel mesajlarda' },
    { from: /\bDM['’]ler\b/g, to: 'özel mesajlar' },
    { from: /\bDM['’]e\b/g, to: 'özel mesaja' },
    { from: /\bDM\b/g, to: 'Özel Mesaj' },

    // Lowercase token (e.g., query examples)
    { from: /\bdm\b/g, to: 'mesaj' },
  ]);

  // Search query shortcuts
  next = applyReplacements(next, [
    { from: /q=dm\b/g, to: 'q=mesaj' },
    { from: /"dm"/g, to: '"mesaj"' },
  ]);

  // Idiomatic phrasing cleanup (after hikaye->geçici paylaşım swap)
  next = applyReplacements(next, [
    { from: /Tek bir net geçici paylaşım anlat:/g, to: 'Tek bir net özet ver:' },
    { from: /Tek bir net geçici paylaşım anlat\b/g, to: 'Tek bir net özet ver' },
  ]);

  // Update in-page anchors that used #reels
  next = applyReplacements(next, [
    { from: /id="reels"/g, to: 'id="kisa-video"' },
    { from: /href="#reels"/g, to: 'href="#kisa-video"' },
    { from: />Reels\s*<\/a>/g, to: '>Kısa Video</a>' },
  ]);

  // Exact cleanup
  next = next.replace('Sosyal medya/DM/WhatsApp', 'Sosyal medya/mesajlaşma/WhatsApp');

  return next;
}

function main() {
  const allFiles = walkFiles(repoRoot);
  const editableExts = new Set(['.html', '.md']);

  let updatedCount = 0;
  for (const filePath of allFiles) {
    const ext = path.extname(filePath).toLowerCase();
    if (!editableExts.has(ext)) continue;

    const before = fs.readFileSync(filePath, 'utf8');
    const after = applyTerminology(before);

    if (after !== before) {
      fs.writeFileSync(filePath, after, 'utf8');
      updatedCount += 1;
    }
  }

  console.log(`Updated content in ${updatedCount} file(s).`);
}

main();
