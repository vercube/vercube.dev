<script setup lang="ts">
import { findPageBreadcrumb } from '@nuxt/content/utils';
import { mapContentNavigation } from '@nuxt/ui/utils/content';
import { kebabCase } from 'scule';
import { ogDocsFonts } from '~/utils/og-docs-fonts';
import type { ContentNavigationItem } from '@nuxt/content';

interface BreadcrumbLink {
  label?: string;
  to?: string;
}

definePageMeta({
  layout: 'docs',
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

defineOgImage(
  // @ts-expect-error - Docs is not typed
  'Docs',
  {
    headline: breadcrumb.value.length ? breadcrumb.value.map((link: BreadcrumbLink) => link.label).join(' > ') : '',
    title,
    description,
  },
  {
    fonts: [...ogDocsFonts],
  },
);

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
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :links="page.links?.map((link: any) => ({ ...link, size: 'md' }))"
    >
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />
      <div>
        <AppDivider class="my-10">
          <div class="flex items-center gap-2 text-sm text-muted">
            <UButton
              size="sm"
              variant="link"
              color="neutral"
              to="https://github.com/vercube/vercube/issues/new/choose"
              target="_blank"
            >
              Report an issue
            </UButton>
            or
            <UButton size="sm" variant="link" color="neutral" :to="editThisPage.to" target="_blank">
              Edit this page on GitHub
            </UButton>
          </div>
        </AppDivider>
        <AppSurround :surround="surroundDisplay as any" />
      </div>
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body?.toc?.links" highlight class="lg:backdrop-blur-none">
        <template #bottom>
          <div class="hidden lg:block space-y-6" :class="{ '!mt-6': page.body?.toc?.links?.length }">
            <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks title="Community" :links="communityLinks" />
          </div>
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
