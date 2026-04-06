// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-nocheck — `.nuxt/schema/nuxt.schema.d.ts` can merge `NuxtConfig` as `{}` when only `appConfig` keys are customized; runtime config stays valid.
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
    '/docs/**': { prerender: false },
    // Always SSR: prerender crawl would freeze GitHub releases at build time.
    '/changelog': { prerender: false },
    // nuxt-og-image browser renderer needs a real browser at build time; generate at runtime instead.
    '/_og/**': { prerender: false },
    // Crawled from /; some upstream docs AST breaks minimark stringify during static generation.
    '/raw/**': { prerender: false },
  },

  compatibilityDate: '2025-10-01',

  nitro: {
    prerender: {
      routes: ['/'],
      crawlLinks: true,
      autoSubfolderIndex: false,
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
