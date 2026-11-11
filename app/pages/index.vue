<template>
  <div class="home">
    <div>
      <HomeHero />
      <HomeRuntimes />
      <HomeRouting />
      <HomeInjection />
      <HomeCreate />
      <HomeDevtools />
      <HomeBenchmarks />
      <HomeModules />
      <HomeOpenSource />
    </div>
  </div>
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

const title = page.value.seo?.title || page.value.title || 'Vercube - The TypeScript server framework';
const description =
  page.value.seo?.description ||
  page.value.description ||
  'A TypeScript server framework with decorators and dependency injection, as fast as a bare router. Runs on Node.js, Bun and Deno.';

const siteUrl = site.url || 'https://vercube.dev';
const canonicalUrl = `${siteUrl}${route.path}`;

// Define OG Image component for homepage
defineOgImage('Vercube', {
  headline: 'The TypeScript server framework',
  title: 'Unleash your server development',
  description: 'Decorators and dependency injection, as fast as a bare router. Node.js, Bun and Deno.',
});

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

// Marks the page as scripted before first paint, so section entrances can
// start hidden; without script nothing is ever hidden.
useHead({
  script: [
    {
      // If the bundle never mounts, nothing would reveal the sections: show them.
      innerHTML:
        "document.documentElement.classList.add('js');setTimeout(function(){var a=document.getElementById('__nuxt');if(!a||!a.__vue_app__)document.documentElement.classList.remove('js')},5000)",
      tagPosition: 'head',
    },
  ],
});

let io: IntersectionObserver | null = null;
onMounted(() => {
  document.documentElement.classList.add('js');
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io?.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
  );
  for (const el of document.querySelectorAll('.site [data-reveal]')) io?.observe(el);
});
onBeforeUnmount(() => io?.disconnect());

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
