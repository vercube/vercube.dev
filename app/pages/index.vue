<!-- eslint-disable vue/no-multiple-template-root -->
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
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

definePageMeta({
  colorMode: 'dark'
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})
</script>
