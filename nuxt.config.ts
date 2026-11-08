// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-nocheck — `.nuxt/schema/nuxt.schema.d.ts` can merge `NuxtConfig` as `{}` when only `appConfig` keys are customized; runtime config stays valid.

import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Set early so nuxt-og-image resolves `nitro-prerender` compatibility instead of the unknown
// `github-pages` preset (the preset applies `static: true` after some module hooks run).
const isGithubPagesDeploy = process.env.DEPLOY_TARGET === 'github-pages';

// Blog posts are named after releases (`announcing-1.4`). The prerender crawler
// reads the ".4" as a file extension and never visits them, so they are listed
// here, one route per file in content/blog (`4.announcing-1.4.md`).
const blogRoutes = readdirSync(fileURLToPath(new URL('./content/blog', import.meta.url)))
  .filter((file) => file.endsWith('.md'))
  .map((file) => `/blog/${file.replace(/^\d+\./, '').replace(/\.md$/, '')}`);

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxt/scripts',
    '@tresjs/nuxt',
    '@nuxt/fonts',
  ],

  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  css: ['~/assets/css/main.css'],

  // The site has one dark theme; the design does not have a light variant.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
        },
      },
    },
  },

  mdc: {
    highlight: {
      noApiRoute: false,
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/docs': { redirect: { statusCode: 301, to: '/docs/getting-started' } },
    '/docs/contributing': {
      redirect: { statusCode: 301, to: 'https://github.com/vercube/vercube/blob/main/CONTRIBUTING.md' },
    },
    '/docs/core-features': { redirect: { statusCode: 301, to: '/docs/core-features/configuration' } },
    '/docs/modules': { redirect: { statusCode: 301, to: '/docs/modules/mcp' } },
    '/docs/advanced': { redirect: { statusCode: 301, to: '/docs/advanced/custom-decorator' } },
    '/docs/modules/web-sockets': { redirect: { statusCode: 301, to: '/docs/modules/web-sockets/overview' } },
    '/docs/modules/auth': { redirect: { statusCode: 301, to: '/docs/modules/auth/overview' } },
    '/docs/modules/storage': { redirect: { statusCode: 301, to: '/docs/modules/storage/overview' } },
    '/docs/modules/logger': { redirect: { statusCode: 301, to: '/docs/modules/logger/overview' } },
    '/docs/modules/serverless': { redirect: { statusCode: 301, to: '/docs/modules/serverless/overview' } },
    '/docs/modules/queue': { redirect: { statusCode: 301, to: '/docs/modules/queue/overview' } },
    '/docs/modules/scheduler': { redirect: { statusCode: 301, to: '/docs/modules/scheduler/overview' } },
    '/docs/modules/testing': { redirect: { statusCode: 301, to: '/docs/modules/testing/overview' } },
    '/docs/core/validation': { redirect: { statusCode: 301, to: '/docs/core-features/validation' } },
    // Static hosting (GitHub Pages): docs must be prerendered so crawlers and OG validators get real
    // HTML with meta tags. Client-only shells look “empty” to bots.
    '/docs/**': { prerender: true },
    '/blog': { prerender: true },
    '/blog/**': { prerender: true },
    // Prerender shell + OG; release list still refetches on the client (see changelog.vue).
    '/changelog': { prerender: true },
    // Crawled from /; some upstream docs AST breaks minimark stringify during static generation.
    '/raw/**': { prerender: false },
  },

  // Absolute site URL is required so OG/Twitter image meta and canonical links are fully-qualified.
  // Crawlers (Facebook, X, Slack) reject relative og:image URLs. Env var still overrides per-environment.
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://vercube.dev',
    name: 'Vercube',
  },

  compatibilityDate: '2025-10-01',

  nitro: {
    ...(isGithubPagesDeploy ? { static: true } : {}),
    prerender: {
      // Seed docs so the crawler can follow sidebar/nav links to every page.
      routes: ['/', '/docs/getting-started', '/sitemap.xml', ...blogRoutes],
      crawlLinks: true,
      autoSubfolderIndex: false,
      // Nav includes parent paths without a markdown file (e.g. /docs/modules); crawlers still 404 those.
      failOnError: false,
      // IPX URLs are not static files; skip prerendering them (images use `none` provider on GitHub Pages).
      ignore: ['/_ipx'],
    },
  },

  fonts: {
    families: [
      { name: 'Geist', weights: [400, 500, 600, 700], global: true },
      { name: 'Geist Mono', weights: [400, 500, 600, 700], global: true },
      {
        name: 'Geist Pixel Line',
        src: '/fonts/GeistPixel-Line.woff2',
        weights: [400, 500, 600, 700],
        global: true,
      },
      {
        // The same face as a TTF, for the OG images only: nuxt-og-image takes
        // its fonts from here, and its Satori renderer cannot read WOFF2.
        // Nothing on the site uses this family, so browsers never fetch it.
        name: 'Geist Pixel Line OG',
        provider: 'local',
        src: '/fonts/GeistPixel-Line.ttf',
        weights: [400],
        global: true,
      },
    ],
  },

  icon: {
    provider: 'iconify',
    // Picked at runtime by the generator's file tree, so the bundle scan cannot see them.
    clientBundle: {
      icons: [
        'lucide:folder-open',
        'vscode-icons:file-type-typescript-official',
        'vscode-icons:file-type-testts',
        'vscode-icons:file-type-vite',
        'vscode-icons:file-type-npm',
        'vscode-icons:file-type-dotenv',
        'vscode-icons:file-type-docker2',
        'vscode-icons:file-type-vue',
        'vscode-icons:file-type-json',
        'vscode-icons:file-type-yaml',
      ],
    },
  },

  // GitHub Pages is static-only: there is no Nitro server for `/_ipx/*`. Use direct asset URLs when
  // `DEPLOY_TARGET=github-pages` (set in deploy workflow). Local dev keeps default `ipx`.
  image: {
    provider: process.env.DEPLOY_TARGET === 'github-pages' ? 'none' : 'ipx',
    ipx: {
      // SVGO strips geometry and styles the docs diagrams rely on (label
      // boxes, embedded font). Sanitizing still runs.
      svg: { optimize: false },
    },
  },

  llms: {
    domain: 'https://vercube.dev/',
    title: 'Vercube',
    description: 'Unleash your server development with an ultra-efficient JavaScript framework',
    full: {
      title: 'Vercube - Full Documentation',
      description: 'This is the full documentation for Vercube.',
    },
  },

  ogImage: {
    // The standard social card size; the component is drawn for it.
    defaults: { width: 1200, height: 630 },
    // Dev: /_og/debug.json + DevTools OG tab. Prod: keep false.
    debug: process.env.NODE_ENV !== 'production',
    // GitHub Pages is static: PNGs under /_og/** must be generated at build (Satori prerender).
    // Never add routeRules `/_og/**: { prerender: false }` — there is no runtime renderer on Pages.
  },
});
