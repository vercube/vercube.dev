<template>
  <ClientOnly>
    <template #fallback>
      <div class="fixed inset-0 bg-black" />
    </template>
    <HomeBackground />
  </ClientOnly>
  <div class="fixed inset-0 bg-gradient-to-r from-[#000] via-[#000]/50 to-transparent pointer-events-none" />
  <HomeNav />
  <HomeHero />
  <HomeFeatures />
  <HomeSponsorship />
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

definePageMeta({
  colorMode: 'dark',
});

const route = useRoute();
const site = useSiteConfig();

const title = page.value.seo?.title || page.value.title || 'Vercube - Unleash your server development';
const description =
  page.value.seo?.description ||
  page.value.description ||
  'An ultra-efficient JavaScript server framework that runs anywhere - Node.js, Bun, or Deno - with unmatched flexibility and complete configurability for developers who refuse to sacrifice speed or control.';

const siteUrl = site.url || 'https://vercube.dev';
const canonicalUrl = `${siteUrl}${route.path}`;

// Define OG Image component for homepage
defineOgImageComponent(
  'Docs',
  {
    headline: 'Next generation server framework',
    title: 'Vercube',
    description: 'Unleash your server development with an ultra-efficient JavaScript framework',
  },
  {
    fonts: ['Geist:400', 'Geist:600'],
  },
);

// Homepage-specific SEO (overrides global defaults)
useSeoMeta({
  titleTemplate: '',
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonicalUrl,
  ogImageAlt: title,
  twitterTitle: title,
  twitterDescription: description,
  twitterImageAlt: title,
});

// Canonical URL for homepage
useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
});
</script>
