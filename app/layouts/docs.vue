<script setup lang="ts">
import { activeNavBranch, openActiveNavSections } from '~/utils/sanitize-docs-navigation';
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

const route = useRoute();
const currentPath = computed(() => route.path.replace(/\/$/, ''));
const openNavigation = computed(() => openActiveNavSections(docsNavigation.value, currentPath.value));
// `defaultOpen` is read on mount: remount only when the page moves to another section.
const navigationKey = computed(() => activeNavBranch(docsNavigation.value, currentPath.value));
</script>

<template>
  <div class="band docs-band">
    <div class="frame wide docs-frame">
      <aside class="docs-aside" aria-label="Documentation">
        <UContentNavigation
          :key="navigationKey"
          :navigation="openNavigation"
          trailing-icon="i-lucide-chevron-right"
          :ui="{
            linkTrailingIcon: 'group-data-[state=open]:rotate-90',
            link: 'text-[13px]',
            linkLeadingIcon: 'text-(--h-accent)',
          }"
          highlight
          highlight-color="primary"
        />
      </aside>
      <div class="docs-main">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.docs-band {
  border-top: 0;
}

.docs-frame {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
}

.docs-frame::before,
.docs-frame::after {
  display: none;
}

.docs-aside {
  position: sticky;
  top: var(--ui-header-height);
  align-self: start;
  max-height: calc(100vh - var(--ui-header-height));
  overflow-y: auto;
  padding: 28px 20px 40px;
  scrollbar-width: thin;
  scrollbar-color: #26262b transparent;
}

.docs-aside::-webkit-scrollbar-thumb {
  background: #26262b;
}

/* The rule between sidebar and content belongs to the content column: the
   sidebar is sticky and only as tall as its links. */
.docs-main {
  min-width: 0;
  border-left: 1px solid var(--h-line);
}

@media (width < 1024px) {
  .docs-frame {
    grid-template-columns: minmax(0, 1fr);
  }

  .docs-aside {
    display: none;
  }

  .docs-main {
    border-left: 0;
  }
}
</style>
