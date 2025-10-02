<script setup lang="ts">
definePageMeta({
  layout: 'changelog',
  colorMode: 'dark'
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Vercube Changelog'
const description = 'Track our journey with a detailed history of updates, improvements, and new features.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/changelog-light.png',
  twitterCard: 'summary_large_image'
})

const appConfig = useAppConfig()

const { data: versions } = await useFetch(computed(() => `https://ungh.cc/repos/${appConfig.repository}/releases`), {
  transform: (data: {
    releases: {
      name?: string
      tag: string
      publishedAt: string
      markdown: string
    }[]
  }) => {
    return data.releases.map(release => ({
      tag: release.tag,
      title: release.name || release.tag,
      date: release.publishedAt,
      markdown: release.markdown
    }))
  }
})
</script>

<template>
  <UChangelogVersions
    as="main"
    :indicator-motion="false"
    :ui="{
      root: 'py-16 sm:py-24 lg:py-32',
      indicator: 'inset-y-0'
    }"
  >
    <UChangelogVersion
      v-for="version in versions"
      :key="version.tag"
      v-bind="version"
      :ui="{
        root: 'flex items-start',
        container: 'flex-1 max-w-xl',
        header: 'border-b border-default pb-4',
        title: 'text-3xl',
        date: 'text-xs/9 text-highlighted font-mono',
        indicator: 'sticky top-0 pt-16 -mt-16 sm:pt-24 sm:-mt-24 lg:pt-32 lg:-mt-32'
      }"
    >
      <template #body>
        <MDC
          v-if="version.markdown"
          :value="version.markdown"
        />
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
