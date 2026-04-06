// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-nocheck — `.nuxt/schema/nuxt.schema.d.ts` can merge `NuxtConfig` as `{}` when only `appConfig` keys are customized; runtime config stays valid.

// Set early so nuxt-og-image resolves `nitro-prerender` compatibility instead of the unknown
// `github-pages` preset (the preset applies `static: true` after some module hooks run).
const isGithubPagesDeploy = process.env.DEPLOY_TARGET === 'github-pages';

export default defineNuxtConfig({
  modules: [
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxt/scripts',
    '@tresjs/nuxt',
    [
      '@nuxtjs/google-fonts',
      {
        subsets: ['latin'],
        families: {
          'Geist+Mono': true,
        },
      },
    ],
  ],

  devtools: {
    enabled: true,
  },

  css: ['~/assets/css/main.css'],

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
    // Static hosting (GitHub Pages): docs must be prerendered so crawlers and OG validators get real
    // HTML with meta tags. Client-only shells look “empty” to bots.
    '/docs/**': { prerender: true },
    // Fresh GitHub releases: keep SSR-only (no frozen HTML at build).
    '/changelog': { prerender: false },
    // nuxt-og-image browser renderer needs a real browser at build time; generate at runtime instead.
    '/_og/**': { prerender: false },
    // Crawled from /; some upstream docs AST breaks minimark stringify during static generation.
    '/raw/**': { prerender: false },
  },

  compatibilityDate: '2025-10-01',

  nitro: {
    ...(isGithubPagesDeploy ? { static: true } : {}),
    prerender: {
      // Seed docs so the crawler can follow sidebar/nav links to every page.
      routes: ['/', '/docs/getting-started'],
      crawlLinks: true,
      autoSubfolderIndex: false,
      // Nav includes parent paths without a markdown file (e.g. /docs/modules); crawlers still 404 those.
      failOnError: false,
      // IPX URLs are not static files; skip prerendering them (images use `none` provider on GitHub Pages).
      ignore: ['/_ipx'],
    },
  },

  icon: {
    provider: 'iconify',
  },

  // GitHub Pages is static-only: there is no Nitro server for `/_ipx/*`. Use direct asset URLs when
  // `DEPLOY_TARGET=github-pages` (set in deploy workflow). Local dev keeps default `ipx`.
  image: {
    provider: process.env.DEPLOY_TARGET === 'github-pages' ? 'none' : 'ipx',
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
    // v6: avoid exposing /_og/debug.json in production
    debug: false,
  },
});
