// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    '@nuxt/scripts',
    '@tresjs/nuxt',
    ['@nuxtjs/google-fonts', {
      subsets: ['latin'],
      families: {
        'Geist+Mono': true
      }
    }]
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/docs': { redirect: { statusCode: 301, to: '/docs/getting-started' } }
  },

  compatibilityDate: '2025-10-01',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      autoSubfolderIndex: false
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  llms: {
    domain: 'https://vercube.dev/',
    title: 'Vercube',
    description: 'Unleash your server development with an ultra-efficient JavaScript framework',
    full: {
      title: 'Vercube - Full Documentation',
      description: 'This is the full documentation for Vercube.'
    }
  },

  ogImage: {
    debug: true,
    fonts: [
      {
        name: 'Geist Mono',
        path: '/fonts/GeistMono-Regular.ttf',
        weight: 400,
        style: 'normal'
      }
    ]
  }
})
