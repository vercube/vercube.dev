// Captures the homepage Devtools screenshots from a running Vercube app.
//
// Run the playground from the release branch so the shots match the shipped UI:
//   cd ../vercube && git switch 1.5 && git pull && pnpm build
//   cd playground && pnpm dev                 (serves /_devtools on :3001)
//   node scripts/capture-devtools.mjs [--base http://localhost:3001] [--only routes,graph] [--warmup 60]
//
// Sends realistic traffic for a while so charts and tables are full, puts each
// panel into a representative state and writes public/images/devtools/<id>.webp
// at 2x. Needs Google Chrome installed.
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright-core';

const { values: args } = parseArgs({
  options: {
    base: { type: 'string', default: 'http://localhost:3001' },
    only: { type: 'string' },
    warmup: { type: 'string', default: '60' },
  },
});

const OUT_DIR = resolve(import.meta.dirname, '../public/images/devtools');
const VIEWPORT = { width: 1440, height: 810 };
const SCALE = 2;
const QUALITY = 0.9;

const base = args.base.replace(/\/$/, '');
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

// --- Background traffic --------------------------------------------------
// Mostly healthy requests with the odd 401/404, so the panels look like a real
// app rather than a test run.
const traffic = [
  ['GET', '/api/playground', 8],
  ['GET', '/api/request-context/user', 6],
  ['GET', '/api/request-context/metadata', 4],
  ['GET', '/api/request-context/all', 3],
  ['GET', '/api/request-context/isolated', 3],
  ['GET', '/api/playground/runtime-config', 3],
  ['GET', '/api/playground/storage', 3],
  ['POST', '/api/playground/storage', 1, { value: 'cached' }],
  ['GET', '/api/playground/redirect', 2],
  ['GET', '/api/queue/', 2],
  ['POST', '/api/queue/welcome', 1, { email: 'ada@example.com' }],
  ['GET', '/api/playground/authorize', 1],
  ['GET', '/api/playground/missing', 1],
];
const weighted = traffic.flatMap((entry) => Array.from({ length: entry[2] }, () => entry));

let trafficOn = false;

async function hit() {
  const [method, path, , body] = weighted[Math.floor(Math.random() * weighted.length)];
  await fetch(base + path, {
    method,
    redirect: 'manual',
    headers: body ? { 'content-type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  }).catch(() => {});
}

async function runTraffic() {
  trafficOn = true;
  while (trafficOn) {
    // Occasional bursts give the throughput chart some shape.
    const burst = Math.random() < 0.2 ? 3 + Math.floor(Math.random() * 5) : 1;
    await Promise.all(Array.from({ length: burst }, hit));
    await wait(150 + Math.random() * 450);
  }
}

// --- Poses ---------------------------------------------------------------
// Each one leaves its panel in the state the homepage describes.
const poses = {
  async overview() {},

  async requests(page) {
    // Spans exist only for requests made after the page attached.
    await wait(4000);
    await page.locator('tbody tr', { hasText: '/api/request-context/user' }).first().click();
  },

  async routes(page) {
    await page.locator('tr', { hasText: '/api/playground/authenticate' }).first().click();
  },

  async graph(page) {
    await wait(2500);
    await page.locator('svg g.nodes g', { hasText: 'PlaygroundController' }).first().locator('circle').click();
  },

  async logs() {
    await wait(4000);
  },

  async config() {},
};

async function capture(browser, id) {
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, colorScheme: 'dark' });
  await context.addInitScript(() => localStorage.setItem('vercube-devtools-theme', 'dark'));
  const page = await context.newPage();
  await page.goto(`${base}/_devtools#${id}`);
  await page.waitForLoadState('networkidle').catch(() => {});
  await wait(2000);

  await poses[id](page);
  await page.mouse.move(0, VIEWPORT.height - 1);
  await wait(1200);

  // Keep the machine's home directory out of published images.
  await page.evaluate((home) => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue?.includes(home)) node.nodeValue = node.nodeValue.replaceAll(home, '~');
    }
  }, homedir());

  // ffmpeg builds often lack libwebp, so let Chrome do the encoding.
  const png = await page.screenshot({ type: 'png' });
  const webp = await page.evaluate(
    async ({ src, quality }) => {
      const image = new Image();
      image.src = src;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvas.getContext('2d').drawImage(image, 0, 0);
      return canvas.toDataURL('image/webp', quality).split(',')[1];
    },
    { src: `data:image/png;base64,${png.toString('base64')}`, quality: QUALITY },
  );
  await context.close();

  const file = join(OUT_DIR, `${id}.webp`);
  const bytes = Buffer.from(webp, 'base64');
  writeFileSync(file, bytes);
  console.log(`✓ ${id}  ${(bytes.length / 1024).toFixed(0)} KB → ${file}`);
}

// --- Run -----------------------------------------------------------------
const ids = args.only ? args.only.split(',') : Object.keys(poses);
for (const id of ids) if (!poses[id]) throw new Error(`Unknown panel: ${id}`);

const probe = await fetch(`${base}/_devtools`).catch(() => null);
if (!probe?.ok) {
  throw new Error(`No devtools at ${base}/_devtools. Start the app first (cd ../vercube/playground && pnpm dev).`);
}

mkdirSync(OUT_DIR, { recursive: true });
const trafficLoop = runTraffic();
const warmup = Number(args.warmup);
console.log(`Sending traffic for ${warmup}s so the charts fill up…`);
await wait(warmup * 1000);

const browser = await chromium.launch({ channel: 'chrome' });
try {
  for (const id of ids) await capture(browser, id);
} finally {
  await browser.close();
  trafficOn = false;
  await trafficLoop;
}
