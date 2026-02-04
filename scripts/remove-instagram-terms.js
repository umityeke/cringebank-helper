const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

// This script is intentionally formatting-preserving.
// It only edits .html and .md files (UTF-8) and does NOT normalize whitespace.
// Do file renames separately via git:
//   git mv articles/cringebank/reels-kisa-video.html articles/cringebank/cringeclap-kisa-video.html
//   git mv articles/cringebank/cringespill-hikaye.html articles/cringebank/cringespill-gecici-paylasim.html
//   git mv articles/cringebank/dm-taciz-tehdit-santaj.html articles/cringebank/ozel-mesaj-taciz-tehdit-santaj.html
//   git mv articles/cringebank/ozel-mesaj-taciz-tehdit-santaj.html articles/cringebank/cringchat-taciz-tehdit-santaj.html

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
  {
    fromRel: 'articles/cringebank/ozel-mesaj-taciz-tehdit-santaj.html',
    toRel: 'articles/cringebank/cringchat-taciz-tehdit-santaj.html',
  },
  {
    fromRel: 'articles/cringebank/mesaj-istekleri.html',
    toRel: 'articles/cringebank/cringchat-istekleri.html',
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

  // DM -> CringChat (and convert any existing “Özel Mesaj” wording)
  next = applyReplacements(next, [
    // DM source text
    { from: /\bDM güvenliği\b/g, to: 'CringChat güvenliği' },
    { from: /\bDM Güvenliği\b/g, to: 'CringChat Güvenliği' },
    { from: /\bKonu: DM\b/g, to: 'Konu: CringChat' },
    { from: /\bDM['’]de\b/g, to: 'CringChat’te' },
    { from: /\bDM['’]lerde\b/g, to: 'CringChat’te' },
    { from: /\bDM['’]ler\b/g, to: 'CringChat mesajları' },
    { from: /\bDM['’]e\b/g, to: 'CringChat’e' },
    { from: /\bDM\b/g, to: 'CringChat' },
    { from: /\bdm\b/g, to: 'cringchat' },

    // Existing “Özel Mesaj” text
    // NOTE: Don't use \b here; JS word boundaries are ASCII-centric and won't match Ö/ö reliably.
    { from: /Özel Mesaj Güvenliği/g, to: 'CringChat Güvenliği' },
    { from: /Özel mesaj güvenliği/g, to: 'CringChat güvenliği' },
    { from: /Konu: Özel Mesaj/g, to: 'Konu: CringChat' },
    { from: /Özel Mesaj/g, to: 'CringChat' },
    { from: /özel mesajda/g, to: 'CringChat’te' },
    { from: /özel mesajlarda/g, to: 'CringChat’te' },
    { from: /özel mesaja/g, to: 'CringChat’e' },
    { from: /özel mesajlar/g, to: 'CringChat mesajları' },
    { from: /özel mesaj/g, to: 'CringChat' },
  ]);

  // Readability cleanup after replacements
  next = applyReplacements(next, [
    { from: /CringChat atabilir/g, to: 'CringChat gönderebilir' },
    { from: /CringChat atmak/g, to: 'CringChat göndermek' },
    { from: /CringChat’lerinde/g, to: 'CringChat’inde' },
    { from: /CringChat’lerde/g, to: 'CringChat’te' },
  ]);

  // Search query shortcuts
  next = applyReplacements(next, [
    { from: /q=dm\b/g, to: 'q=mesaj' },
    { from: /"dm"/g, to: '"mesaj"' },
  ]);

  // CringChat-focused UI wording (avoid “Mesaj istekleri” as a feature name)
  next = applyReplacements(next, [
    { from: /Mesaj istekleri/g, to: 'CringChat istekleri' },
    { from: /mesaj istekleri/g, to: 'CringChat istekleri' },
    { from: /id="mesaj"/g, to: 'id="cringchat"' },
    { from: /href="#mesaj"/g, to: 'href="#cringchat"' },
    { from: />Mesaj\s*<span>/g, to: '>CringChat <span>' },
    { from: /\bMesajlar \(CringChat\)\b/g, to: 'CringChat' },
    { from: /\bMesaj \(CringChat\)\b/g, to: 'CringChat' },
    { from: /<strong>Mesaj:<\/strong>/g, to: '<strong>CringChat:</strong>' },

    // Search CTA used for this feature
    { from: /q=mesaj\b/g, to: 'q=cringchat' },
    { from: /"mesaj"/g, to: '"cringchat"' },
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

  // Exact cleanups
  next = next.replace('Sosyal medya/DM/WhatsApp', 'Sosyal medya/mesajlaşma/WhatsApp');
  next = next.replace('Sosyal medya/Özel Mesaj/WhatsApp', 'Sosyal medya/CringChat/WhatsApp');

  // Help Center -> Yardım Merkezi (site-wide wording)
  next = applyReplacements(next, [
    { from: /Cringebank Help Center/g, to: 'Cringebank Yardım Merkezi' },
    { from: /Cringestore Help Center/g, to: 'Cringestore Yardım Merkezi' },
    { from: /Cringe Help Center/g, to: 'Cringe Yardım Merkezi' },
    { from: /Help Center/g, to: 'Yardım Merkezi' },
    { from: /Help center/g, to: 'Yardım Merkezi' },
    { from: /Helpcenter/g, to: 'Yardım Merkezi' },
  ]);

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
