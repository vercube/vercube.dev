<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content';

const props = defineProps<{
  surround: ContentNavigationItem[];
}>();

const prev = computed(() => (props.surround[0]?.path ? props.surround[0] : null));
const next = computed(() => (props.surround[1]?.path ? props.surround[1] : null));
</script>

<template>
  <nav v-if="prev || next" class="surround" aria-label="Pages">
    <NuxtLink v-if="prev" :to="prev.path" class="cell">
      <span class="mono dir">← Previous</span>
      <span class="title">{{ prev.title }}</span>
      <span v-if="prev.description" class="desc">{{ prev.description }}</span>
    </NuxtLink>
    <span v-else class="cell empty" />
    <NuxtLink v-if="next" :to="next.path" class="cell next">
      <span class="mono dir">Next →</span>
      <span class="title">{{ next.title }}</span>
      <span v-if="next.description" class="desc">{{ next.description }}</span>
    </NuxtLink>
  </nav>
</template>

<style scoped>
.surround {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 28px var(--docs-pad, 24px);
  transition: background-color 200ms ease;
}

.cell + .cell {
  border-left: 1px solid var(--h-line);
}

a.cell:hover {
  background: var(--h-panel);
}

.next {
  text-align: right;
}

.dir {
  font-size: 11px;
  color: var(--h-accent);
}

.title {
  font-family: 'Geist Pixel Line', 'Geist Mono', monospace;
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--h-ink);
}

.desc {
  overflow: hidden;
  font-size: 13px;
  color: var(--h-dim);
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (width < 640px) {
  .surround {
    grid-template-columns: minmax(0, 1fr);
  }

  .cell + .cell {
    border-left: 0;
    border-top: 1px solid var(--h-line);
  }

  .empty {
    display: none;
  }
}
</style>
