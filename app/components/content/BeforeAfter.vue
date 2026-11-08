<script setup lang="ts">
// Two screenshots of the same page, a draggable divider between them.
// The range input covers the whole frame, so it works with touch, mouse and keyboard.
withDefaults(
  defineProps<{
    before: string;
    after: string;
    beforeLabel?: string;
    afterLabel?: string;
    alt?: string;
    width?: number;
    height?: number;
  }>(),
  { beforeLabel: 'Before', afterLabel: 'After', alt: '', width: 960, height: 600 },
);

const position = ref(50);
</script>

<template>
  <figure class="compare" :style="{ '--pos': `${position}%`, aspectRatio: `${width} / ${height}` }">
    <img class="compare-img" :src="after" :alt="alt ? `${alt} (${afterLabel})` : ''" :width="width" :height="height" loading="lazy" />
    <img
      class="compare-img compare-before"
      :src="before"
      :alt="alt ? `${alt} (${beforeLabel})` : ''"
      :width="width"
      :height="height"
      loading="lazy"
    />

    <span class="compare-tag compare-tag-before">{{ beforeLabel }}</span>
    <span class="compare-tag compare-tag-after">{{ afterLabel }}</span>

    <span class="compare-line" aria-hidden="true"><span class="compare-knob">&harr;</span></span>

    <input v-model.number="position" class="compare-range" type="range" min="0" max="100" step="0.1" aria-label="Compare before and after" />
  </figure>
</template>

<style scoped>
.compare {
  position: relative;
  margin: 1.25rem 0;
  overflow: hidden;
  border: 1px solid var(--ui-border-muted);
  border-radius: 8px;
  background: var(--ui-bg-muted);
  user-select: none;
}

.compare-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  object-fit: cover;
  object-position: top left;
  border: 0;
  border-radius: 0;
}

.compare-before {
  clip-path: inset(0 calc(100% - var(--pos)) 0 0);
}

.compare-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: 2px;
  margin-left: -1px;
  background: rgb(255 255 255 / 0.85);
  box-shadow: 0 0 0 1px rgb(0 0 0 / 0.35);
  pointer-events: none;
}

.compare-knob {
  position: absolute;
  top: 50%;
  left: 50%;
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  box-shadow: 0 1px 6px rgb(0 0 0 / 0.5);
  color: #111;
  font-size: 14px;
  line-height: 1;
}

.compare-tag {
  position: absolute;
  bottom: 10px;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgb(0 0 0 / 0.6);
  color: #fff;
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 11px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  pointer-events: none;
}

.compare-tag-before {
  left: 10px;
}

.compare-tag-after {
  right: 10px;
}

.compare-range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: ew-resize;
}
</style>
