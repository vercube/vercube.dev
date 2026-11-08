<script setup lang="ts">
import { findPageBreadcrumb } from '@nuxt/content/utils';
import { mapContentNavigation } from '@nuxt/ui/utils/content';
import { kebabCase } from 'scule';
import type { ContentNavigationItem } from '@nuxt/content';

interface BreadcrumbLink {
  label?: string;
  to?: string;
}

definePageMeta({
  layout: 'docs',
  colorMode: 'dark',
});

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation', ref([]));

const route = useRoute();

const { data: docsPathRows } = await useAsyncData('docs-path-index', () => queryCollection('docs').select('path').all());
const docsPathSet = computed(() => new Set((docsPathRows.value ?? []).map((row) => row.path).filter(Boolean) as string[]));

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('docs').path(route.path).first());
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
}

const { data: surround } = await useAsyncData(`${kebabCase(route.path)}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description'],
  });
});

const surroundDisplay = computed(() => (surround.value ?? []).filter((item) => item?.path && docsPathSet.value.has(item.path)));

const breadcrumb: ComputedRef<BreadcrumbLink[]> = computed(() =>
  mapContentNavigation(findPageBreadcrumb(navigation.value, page.value?.path)).map((link) => ({
    label: link.label,
    to: link.to && docsPathSet.value.has(link.to) ? link.to : undefined,
  })),
);

const title = page.value.seo?.title || page.value.title;
const description = page.value.seo?.description || page.value.description;
const titleTemplate = ref('%s - Vercube Docs');

useSeoMeta({
  title,
  titleTemplate,
  description,
  ogDescription: description,
  ogTitle: titleTemplate.value?.includes('%s') ? titleTemplate.value.replace('%s', title) : title,
});

// The card names the subject, not the page: every page inside a section of
// its own (/docs/modules/auth/overview, /docs/modules/auth/decorators, …) is
// "Auth" under "Docs · Modules", and a top-level section's "Overview" page is
// that section.
const crumbs = computed(() => breadcrumb.value.map((link: BreadcrumbLink) => link.label).filter(Boolean) as string[]);
const isOverview = /^overview$/i.test(title ?? '');
const inSubsection = crumbs.value.length > 2 || (isOverview && crumbs.value.length > 1);
const ogTitle = inSubsection ? crumbs.value.at(-1)! : title;
const ogHeadline = (inSubsection ? crumbs.value.slice(0, -1) : crumbs.value).join(' · ') || 'Docs';

defineOgImage('Vercube', {
  headline: ogHeadline,
  title: ogTitle,
  description,
});

const editThisPage = computed(() => ({
  icon: 'i-heroicons-pencil-square-solid',
  label: 'Edit this page',
  to: `https://github.com/vercube/vercube/edit/main/${page?.value?.stem}.md`,
  target: '_blank',
}));

const communityLinks = computed(() => [
  {
    icon: 'i-lucide-heart',
    label: 'Become a Sponsor',
    to: 'https://github.com/sponsors/vercube',
    target: '_blank',
  },
  {
    icon: 'lucide:bot',
    label: 'llms.txt',
    to: 'https://vercube.dev/llms.txt',
  },
  {
    icon: 'i-heroicons-star-solid',
    label: 'Star on GitHub',
    to: `https://github.com/vercube/vercube`,
    target: '_blank',
  },
  {
    icon: 'i-heroicons-lifebuoy-solid',
    label: 'Contributing',
    to: 'https://github.com/vercube/vercube/blob/main/CONTRIBUTING.md',
    target: '_blank',
  },
]);
</script>

<template>
  <UPage
    v-if="page"
    :ui="{
      root: 'lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-0',
      center: 'lg:col-span-1 min-w-0 docs-center',
      right: 'lg:col-span-1 docs-right',
    }"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links?.map((link: any) => ({ ...link, size: 'md' }))"
      :ui="{
        root: 'border-b border-default pt-10 pb-8',
        headline: 'mb-4 font-mono text-[11px] uppercase tracking-[0.08em] text-dimmed font-normal',
        title: 'page-title text-4xl sm:text-[2.75rem] leading-[1.05] font-normal',
        description: 'text-base text-muted mt-3',
      }"
    >
      <template #headline>
        <UBreadcrumb
          :items="breadcrumb"
          :ui="{ link: 'font-mono text-[11px] uppercase tracking-[0.08em]', separatorIcon: 'size-3' }"
        />
      </template>
    </UPageHeader>

    <UPageBody :ui="{ base: 'mt-8 pb-0 space-y-12' }">
      <ContentRenderer v-if="page.body" :value="page" />
      <div class="after">
        <AppSurround :surround="surroundDisplay as any" />
        <p class="mono help">
          <NuxtLink to="https://github.com/vercube/vercube/issues/new/choose" target="_blank">Report an issue</NuxtLink>
          <NuxtLink :to="editThisPage.to" target="_blank">Edit this page on GitHub →</NuxtLink>
        </p>
      </div>
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc
        :links="page.body?.toc?.links"
        highlight
        highlight-color="primary"
        title="On this page"
        :ui="{
          // No negative margins or blur on desktop: they pushed the panel past
          // the frame and smeared its right rule into a grey strip.
          root: 'lg:mx-0 lg:px-0 lg:backdrop-blur-none',
          title: 'font-mono text-[11px] uppercase tracking-[0.08em] text-dimmed',
          link: 'text-[13px]',
        }"
      >
        <template #bottom>
          <div class="hidden lg:block space-y-6 !mt-6">
            <USeparator type="solid" />
            <UPageLinks
              title="Community"
              :links="communityLinks"
              :ui="{ title: 'font-mono text-[11px] uppercase tracking-[0.08em] text-dimmed', link: 'text-[13px]' }"
            />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>

<style scoped>
:deep(.docs-center) {
  --docs-pad: clamp(20px, 3vw, 48px);
  padding: 0 var(--docs-pad);
}

:deep(.docs-right) {
  border-left: 1px solid var(--h-line);
  padding-left: 20px;
}

/* Previous / next and the page links run edge to edge across the content
   column and close it, like the end of a blog post. */
.after {
  margin: 72px calc(-1 * var(--docs-pad)) 0;
  border-top: 1px solid var(--h-line);
}

.help {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px var(--docs-pad);
  border-top: 1px solid var(--h-line);
  font-size: 11.5px;
  color: var(--h-dim);
}

.help a {
  transition: color 160ms ease;
}

.help a:hover {
  color: var(--h-ink);
}

@media (width < 1024px) {
  :deep(.docs-right) {
    border-left: 0;
    padding-left: 0;
  }
}
</style>
