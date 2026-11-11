<script setup lang="ts">
import { stripFolderOnlyNavPaths } from '~/utils/sanitize-docs-navigation';
import type { NuxtError } from '#app';

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

provide('navigation', navigation);
provide('navigationDisplay', navigationDisplay);
</script>

<template>
  <UApp>
    <div class="site fill">
      <SiteHeader />
      <main class="band">
        <div class="frame error-frame grid-bg">
          <p class="mono code">{{ error.statusCode }}</p>
          <h1 class="page-title title">
            {{ error.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}<span class="dot">.</span>
          </h1>
          <p class="lead">{{ error.statusCode === 404 ? 'This page does not exist, or it moved.' : error.statusMessage }}</p>
          <div class="ctas">
            <NuxtLink to="/" class="btn">Home</NuxtLink>
            <NuxtLink to="/docs/getting-started" class="btn primary">Read the docs →</NuxtLink>
          </div>
        </div>
      </main>
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

<style scoped>
/* The error page is short: its frame fills the screen down to the footer. */
.fill {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.fill > main {
  display: flex;
  flex: 1;
}

.fill > main > .frame {
  flex: 1;
  justify-content: center;
}

.error-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  padding: 140px var(--pad);
  text-align: center;
}

.code {
  font-size: 12px;
  color: var(--h-accent);
}

.title {
  font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.4rem);
  line-height: 1.05;
}

.dot {
  color: var(--h-accent);
}

.ctas {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
</style>
