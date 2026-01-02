<script setup lang="ts">
import { kebabCase } from 'scule'

definePageMeta({
  layout: 'blog'
})

const route = useRoute()

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('blog').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// if (page.value.image) {
//   defineOgImage({ url: page.value.image })
// } else {
//   defineOgImageComponent('Docs', {
//     headline: breadcrumb.value.map(item => item.label).join(' > ')
//   }, {
//     fonts: ['Geist:400', 'Geist:600']
//   })
// }

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description
const titleTemplate = ref('%s - Vercube Blog')

useSeoMeta({
  title,
  titleTemplate,
  description,
  ogDescription: description,
  ogTitle: titleTemplate.value?.includes('%s') ? titleTemplate.value.replace('%s', title) : title
})

const editThisPage = computed(() => ({
  icon: 'i-heroicons-pencil-square-solid',
  label: 'Edit this page',
  to: `https://github.com/hugorcd/shelve/edit/main/apps/lp/content/${page?.value?.stem}.md`,
  target: '_blank'
}))
const articleLink = computed(() => `${window.location}${page.value?.path}`)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <UPage v-if="page">
    <div class="absolute inset-0 z-[-1] overflow-hidden">
      <HomeBackground class="inset-0" />
      <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
    </div>
    <UContainer class="flex flex-col items-center gap-3 mt-8 xl:pt-30">
      <UPageSection
        :title="title"
        :description="description"
        class="relative"
        orientation="vertical"
        :ui="{
          root: 'overflow-hidden pb-2',
          container: 'z-[10] !p-4 !gap-8',
          wrapper: 'relative flex flex-col',
          title: 'text-left text-4xl font-(family-name:--font-geist-mono)',
          description: 'text-left font-(family-name:--font-geist-mono)',
          links: 'gap-1 justify-start -ms-2.5'
        }"
      >
        <template #title>
          <h1 class="sm:text-4xl lg:text-5xl text-pretty tracking-tight text-highlighted text-left text-4xl font-(family-name:--font-geist-mono)">
            {{ page.title }}
          </h1>
        </template>

        <template #top>
          <NuxtImg
            v-if="page.image"
            :src="page.image"
            :alt="page.title"
            class="rounded-lg w-full h-[250px] object-cover object-center mb-4"
          />

          <div class="flex text-xs text-muted gap-2 w-full max-w-(--ui-container) mx-auto p-4">
            <span>
              {{ formatDate(page.date) }}
            </span>
            -
            <span>
              {{ page.minRead }} MIN READ
            </span>
          </div>
        </template>

        <template #default>
          <UUser
            v-if="page.author"
            variant="outline"
            v-bind="page.author"
          />
        </template>
      </UPageSection>
    </UContainer>
    <div class="bg-black border-t border-default">
      <UPageBody class="max-w-3xl mx-auto !mt-0 pt-5">
        <ContentRenderer
          v-if="page.body"
          :value="page"
        />

        <AppDivider class="my-10">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              label="Copy link"
              @click="copyToClipboard(articleLink, 'Article link copied to clipboard')"
            />
            -
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              :to="editThisPage.to"
              target="_blank"
              label="Edit this page on GitHub"
            />
          </div>
        </AppDivider>
      </UPageBody>
    </div>
  </UPage>
</template>
