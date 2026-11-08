<script setup lang="ts">
import { stripFolderOnlyNavPaths } from '~/utils/sanitize-docs-navigation';

const { seo } = useAppConfig();
const site = useSiteConfig();

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'));
const { data: docsPathRows } = await useAsyncData('docs-path-index', () => queryCollection('docs').select('path').all());

const docsPathSet = computed(() => new Set((docsPathRows.value ?? []).map((row) => row.path).filter(Boolean) as string[]));

const navigationDisplay = computed(() => stripFolderOnlyNavPaths(navigation.value ?? [], docsPathSet.value));

// The search groups its results by section and keys each group by the
// section's `path`, so it takes the navigation before folder paths are
// stripped. Starting at the sections of /docs gives one group per section.
const searchNavigation = computed(
  () => navigation.value?.find((item) => item.path === '/docs')?.children ?? navigation.value ?? [],
);
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false,
});

const siteUrl = site.url || 'https://vercube.dev';
const siteName = seo?.siteName || 'Vercube';

// One canonical URL per page, so preview deployments and trailing-slash variants do not compete with it.
const route = useRoute();
const canonical = computed(() => `${siteUrl}${route.path === '/' ? '' : route.path.replace(/\/$/, '')}` || siteUrl);

useHead({ link: [{ rel: 'canonical', href: canonical }] });
useSeoMeta({ ogUrl: canonical });

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'shortcut icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  // Global defaults
  titleTemplate: `%s - ${siteName}`,
  ogSiteName: siteName,
  twitterCard: 'summary_large_image',
  twitterSite: '@vercubejs',
  twitterCreator: '@vercubejs',

  // Open Graph defaults (per-page images come from nuxt-og-image `defineOgImage`)
  ogType: 'website',
  ogLocale: 'en_US',

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
});

// Keywords (global). Not part of useSeoMeta's types since @unhead/vue 3.4, so set as a plain meta tag.
useHead({
  meta: [
    {
      name: 'keywords',
      content: [
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
        'zero-config',
      ].join(', '),
    },
  ],
});

// Global JSON-LD structured data
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Vercube',
        url: siteUrl,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/docs?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Vercube',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Node.js, Bun, Deno',
        url: siteUrl,
        author: {
          '@type': 'Organization',
          name: 'Vercube',
          url: 'https://github.com/vercube',
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          ratingCount: '1',
        },
      }),
    },
  ],
});

provide('navigation', navigation);
provide('navigationDisplay', navigationDisplay);
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator color="#bc4eff" />

    <div class="site">
      <SiteHeader />
      <!-- No min-height (UMain forces 100vh): a short page should end on the
           footer's rule, not on empty space outside the frame. -->
      <div class="site-main">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </div>
      <SiteFooter />
    </div>

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="searchNavigation" :color-mode="false" placeholder="Search the docs…">
        <template #footer>
          <div class="search-foot">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </div>
        </template>
      </LazyUContentSearch>
    </ClientOnly>
  </UApp>
</template>
