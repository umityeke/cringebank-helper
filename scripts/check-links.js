const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');

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

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function isSkippableUrl(url) {
  if (!url) return true;
  const trimmed = url.trim();
  if (!trimmed) return true;

  if (trimmed.startsWith('#')) return false; // anchor check
  if (trimmed.startsWith('//')) return true;

  // Any scheme like http:, https:, mailto:, tel:, javascript:, data:
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return true;

  return false;
}

function splitUrl(url) {
  const trimmed = url.trim();
  const [beforeHash, hash = ''] = trimmed.split('#');
  const [beforeQuery] = beforeHash.split('?');
  return {
    pathPart: beforeQuery,
    hashPart: hash,
  };
}

function resolveTargetPath(fromFilePath, urlPathPart) {
  if (!urlPathPart) return null; // query-only like "?q=..."

  const cleaned = urlPathPart.replace(/^\/+/, '');
  if (urlPathPart.startsWith('/')) {
    return path.resolve(repoRoot, cleaned);
  }

  return path.resolve(path.dirname(fromFilePath), urlPathPart);
}

const anchorCache = new Map();
function getAnchorsForFile(filePath) {
  const cached = anchorCache.get(filePath);
  if (cached) return cached;

  const content = fs.readFileSync(filePath, 'utf8');
  const anchors = new Set();

  const idRegex = /\bid\s*=\s*("([^"]+)"|'([^']+)')/gi;
  let m;
  while ((m = idRegex.exec(content))) {
    anchors.add(m[2] ?? m[3]);
  }

  const nameRegex = /\bname\s*=\s*("([^"]+)"|'([^']+)')/gi;
  while ((m = nameRegex.exec(content))) {
    anchors.add(m[2] ?? m[3]);
  }

  anchorCache.set(filePath, anchors);
  return anchors;
}

function existsFileOrIndex(targetPath) {
  if (!fs.existsSync(targetPath)) return { exists: false, resolved: targetPath };

  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    const indexHtml = path.join(targetPath, 'index.html');
    return { exists: fs.existsSync(indexHtml), resolved: indexHtml };
  }

  return { exists: true, resolved: targetPath };
}

function collectBrokenLinks() {
  const allFiles = walkFiles(repoRoot);
  const htmlFiles = allFiles.filter((p) => path.extname(p).toLowerCase() === '.html');

  const broken = [];
  const attrRegex = /\b(?:href|src)\s*=\s*("([^"]*)"|'([^']*)')/gi;

  for (const htmlFile of htmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');

    let match;
    while ((match = attrRegex.exec(content))) {
      const rawUrl = match[2] ?? match[3] ?? '';
      if (isSkippableUrl(rawUrl)) continue;

      const { pathPart, hashPart } = splitUrl(rawUrl);

      // Anchor-only link
      if (rawUrl.trim().startsWith('#')) {
        const anchor = rawUrl.trim().slice(1);
        if (!anchor) continue;
        const anchors = getAnchorsForFile(htmlFile);
        if (!anchors.has(anchor)) {
          broken.push({
            source: htmlFile,
            url: rawUrl,
            resolved: htmlFile,
            reason: `Missing anchor #${anchor}`,
          });
        }
        continue;
      }

      const targetPath = resolveTargetPath(htmlFile, pathPart);
      if (!targetPath) continue;

      const { exists, resolved } = existsFileOrIndex(targetPath);
      if (!exists) {
        broken.push({
          source: htmlFile,
          url: rawUrl,
          resolved,
          reason: 'Missing file',
        });
        continue;
      }

      if (hashPart) {
        const anchors = getAnchorsForFile(resolved);
        if (!anchors.has(hashPart)) {
          broken.push({
            source: htmlFile,
            url: rawUrl,
            resolved,
            reason: `Missing anchor #${hashPart}`,
          });
        }
      }
    }
  }

  return broken;
}

function main() {
  const broken = collectBrokenLinks();

  const outPath = path.resolve(repoRoot, 'broken-links.tsv');
  const header = ['source', 'url', 'resolved', 'reason'].join('\t');

  const lines = [header];
  for (const row of broken) {
    const sourceRel = toPosix(path.relative(repoRoot, row.source));
    const resolvedRel = toPosix(path.relative(repoRoot, row.resolved));
    lines.push([sourceRel, row.url, resolvedRel, row.reason].join('\t'));
  }

  fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
  console.log(`Checked ${broken.length === 0 ? 'OK' : 'with issues'}: ${broken.length} broken link(s).`);
  console.log(`Wrote ${path.relative(repoRoot, outPath)}`);
}

main();
