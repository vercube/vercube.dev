<script setup lang="ts">
import type { NuxtError } from '#app';
import { stripFolderOnlyNavPaths } from '~/utils/sanitize-docs-navigation';

defineProps<{
  error: NuxtError;
}>();

useHead({
  htmlAttrs: {
    lang: 'en',
  },
});

useSeoMeta({
  title: 'Page not found',
  description: 'We are sorry but this page could not be found.',
});

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'));
const { data: docsPathRows } = await useAsyncData('docs-path-index', () => queryCollection('docs').select('path').all());

const docsPathSet = computed(
  () => new Set((docsPathRows.value ?? []).map((row) => row.path).filter(Boolean) as string[]),
);

const navigationDisplay = computed(() => stripFolderOnlyNavPaths(navigation.value ?? [], docsPathSet.value));

const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), {
  server: false,
});

provide('navigation', navigation);
provide('navigationDisplay', navigationDisplay);
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigationDisplay" />
    </ClientOnly>
  </UApp>
</template>
