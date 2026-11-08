import { queryCollection } from '@nuxt/content/server';

const SITE = process.env.NUXT_PUBLIC_SITE_URL || 'https://vercube.dev';

const escape = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

interface Entry {
  path: string;
  lastmod?: string;
}

export default eventHandler(async (event) => {
  const [docs, posts] = await Promise.all([
    queryCollection(event, 'docs').select('path').all(),
    queryCollection(event, 'blog').select('path', 'date').all(),
  ]);

  const entries: Entry[] = [
    { path: '/' },
    { path: '/blog' },
    { path: '/changelog' },
    ...posts.map((post) => ({ path: post.path, lastmod: new Date(post.date).toISOString().slice(0, 10) })),
    ...docs.map((page) => ({ path: page.path })),
  ];

  const seen = new Set<string>();
  const urls = entries
    .filter((entry) => !seen.has(entry.path) && seen.add(entry.path))
    .map(
      (entry) =>
        `  <url><loc>${escape(SITE + entry.path)}</loc>${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}</url>`,
    );

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
});
