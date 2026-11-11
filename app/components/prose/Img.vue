<script setup lang="ts">
import UProseImg from '@nuxt/ui/components/prose/Img.vue';

const props = withDefaults(
  defineProps<{
    src: string;
    alt?: string;
    width?: string | number;
    height?: string | number;
  }>(),
  { alt: '', width: undefined, height: undefined },
);

// Diagrams are SVGs drawn to their own size: they sit in a full-width panel,
// like a code block, at that size instead of being stretched to the column.
const isDiagram = computed(() => /\.svg(?:$|[?#])/.test(props.src));
</script>

<template>
  <figure v-if="isDiagram" class="diagram">
    <img :src="src" :alt="alt" loading="lazy" />
  </figure>
  <UProseImg v-else v-bind="props" />
</template>

<style scoped>
.diagram {
  margin: 1.25rem 0;
  padding: 24px 16px;
  border: 1px solid var(--ui-border-muted);
  background: var(--ui-bg-muted);
  overflow-x: auto;
}

.diagram img {
  display: block;
  max-width: 100%;
  height: auto;
  margin-inline: auto;
}
</style>
