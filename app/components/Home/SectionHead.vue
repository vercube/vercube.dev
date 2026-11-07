<template>
  <div class="head">
    <p class="label mono" data-reveal>
      <span class="index">{{ index }}</span>
      {{ label }}
    </p>
    <h2 class="pixel title" data-reveal style="--r: 1"><slot name="title" /></h2>
    <p class="text" data-reveal style="--r: 2"><slot /></p>
    <div v-if="chips?.length" class="chips" data-reveal style="--r: 3">
      <span v-for="chip in chips" :key="chip" class="chip">{{ chip }}</span>
    </div>
    <NuxtLink v-if="to" :to="to" class="link-arrow" data-reveal style="--r: 4">{{ link }} →</NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{ index: string; label: string; chips?: string[]; to?: string; link?: string }>();
</script>

<style scoped>
.head {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
}

.label {
  display: flex;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--h-dim);
}

.index {
  color: var(--h-accent);
}

.title {
  margin-top: 2px;
  font-size: clamp(2rem, 1.4rem + 2vw, 2.9rem);
  line-height: 1.05;
  text-shadow: 0 4px 24px rgb(0 0 0 / 0.5);
}

.title :deep(.dot) {
  color: var(--h-accent);
}

.text {
  max-width: 54ch;
  font-size: 15px;
  line-height: 1.7;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}
</style>
