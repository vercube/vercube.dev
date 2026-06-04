#!/usr/bin/env node
/**
 * Quick OG sanity check (run while `pnpm dev` is up).
 *
 * Usage:
 *   node scripts/verify-og.mjs
 *   node scripts/verify-og.mjs http://localhost:3000 /blog/announcing-v1-beta
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const bgPath = join(root, 'public/images/background.png');

console.log('── OG background file ──');
if (!existsSync(bgPath)) {
  console.error('MISSING:', bgPath);
  process.exit(1);
}
console.log('OK:', bgPath, `(${readFileSync(bgPath).length} bytes)`);

const base = process.argv[2] || 'http://localhost:3000';
const pagePath = process.argv[3] || '/';
const pageUrl = new URL(pagePath, base).href;

console.log('\n── Page meta ──');
console.log('URL:', pageUrl);

const html = await fetch(pageUrl).then((r) => {
  if (!r.ok) throw new Error(`Page ${r.status}: ${pageUrl}`);
  return r.text();
});

const ogMatch = html.match(/property="og:image" content="([^"]+)"/);
if (!ogMatch) {
  console.error('No og:image in HTML (view source / SSR?). Is defineOgImage() on this route?');
  process.exit(1);
}

const ogUrl = ogMatch[1].startsWith('http') ? ogMatch[1] : new URL(ogMatch[1], base).href;
console.log('og:image:', ogUrl);

console.log('\n── Generated PNG ──');
const pngRes = await fetch(ogUrl);
if (!pngRes.ok) {
  console.error(`OG fetch failed: ${pngRes.status}`);
  process.exit(1);
}

const buf = Buffer.from(await pngRes.arrayBuffer());
console.log('Size:', buf.length, 'bytes');
console.log('Hint: <35 KB ≈ often no background; >70 KB ≈ background likely embedded');

if (buf.length < 8 || buf[0] !== 0x89) {
  console.error('Response is not a PNG');
  process.exit(1);
}

console.log('\n── Cache tip ──');
console.log('pnpm og:cache:clear && restart dev if the image looks stale after template changes.');
