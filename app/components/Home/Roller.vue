<template>
  <span class="roller" :aria-label="text">
    <span v-for="(ch, i) in chars" :key="i" class="slot" aria-hidden="true">
      <span
        v-if="/\d/.test(ch)"
        class="reel"
        :style="{ transform: `translateY(-${(on ? +ch : 0) * 10}%)`, transitionDelay: `${i * 60}ms` }"
      >
        <span v-for="d in 10" :key="d">{{ d - 1 }}</span>
      </span>
      <span v-else>{{ ch }}</span>
    </span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string; on: boolean }>();
const chars = computed(() => [...props.text]);
</script>

<style scoped>
.roller {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
}

.slot {
  display: inline-block;
  height: 1em;
  line-height: 1;
  overflow: hidden;
}

.reel {
  display: flex;
  flex-direction: column;
  transition: transform 1100ms cubic-bezier(0.23, 1, 0.32, 1);
}

.reel span {
  height: 1em;
}

@media (prefers-reduced-motion: reduce) {
  .reel {
    transition: none;
  }
}
</style>
