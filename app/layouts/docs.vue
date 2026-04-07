<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const navigationDisplay = inject<ComputedRef<ContentNavigationItem[]>>(
  'navigationDisplay',
  computed(() => []),
);
const docsNavigation = computed(
  () =>
    navigationDisplay.value.find((item) => item.path === '/docs')?.children ||
    navigationDisplay.value.find((item) => item.children?.length)?.children ||
    [],
);
</script>

<template>
  <div>
    <AppHeader />
    <UMain>
      <UContainer>
        <UPage>
          <template #left>
            <UPageAside>
              <UContentNavigation
                :navigation="docsNavigation"
                trailing-icon="i-lucide-chevron-right"
                :ui="{ linkTrailingIcon: 'group-data-[state=open]:rotate-90' }"
                highlight
              />
            </UPageAside>
          </template>
          <slot />
        </UPage>
      </UContainer>
    </UMain>
  </div>
</template>
