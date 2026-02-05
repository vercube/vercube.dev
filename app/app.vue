<script setup lang="ts">
const { seo } = useAppConfig()
const site = useSiteConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false
})

const siteUrl = site.url || 'https://vercube.dev'
const siteName = seo?.siteName || 'Vercube'

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  // Global defaults
  titleTemplate: `%s - ${siteName}`,
  ogSiteName: siteName,
  twitterCard: 'summary_large_image',
  twitterSite: '@vercubejs',
  twitterCreator: '@vercubejs',

  // Open Graph defaults
  ogType: 'website',
  ogLocale: 'en_US',
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,

  // Application defaults
  applicationName: siteName,
  appleMobileWebAppTitle: siteName,
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent',

  // Theme
  themeColor: '#000000',
  colorScheme: 'dark light',

  // SEO defaults
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  author: 'Vercube Team',

  // Keywords (global)
  keywords: [
    'vercube',
    'javascript framework',
    'typescript framework',
    'server framework',
    'node.js',
    'bun',
    'deno',
    'dependency injection',
    'decorators',
    'routing',
    'middleware',
    'validation',
    'esm',
    'web-native',
    'request response',
    'serverless',
    'api framework',
    'modern javascript',
    'type-safe',
    'zero-config'
  ].join(', ')
})

// Global JSON-LD structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Vercube',
        'url': siteUrl,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${siteUrl}/docs?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'Vercube',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Node.js, Bun, Deno',
        'url': siteUrl,
        'author': {
          '@type': 'Organization',
          'name': 'Vercube',
          'url': 'https://github.com/vercube'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '5',
          'ratingCount': '1'
        }
      })
    }
  ]
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
