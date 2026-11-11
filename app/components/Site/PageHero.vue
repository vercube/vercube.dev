<template>
  <section class="page-hero band">
    <ClientOnly>
      <HomeBackground class="field" />
    </ClientOnly>
    <div class="veil" :class="{ centered: narrow }" aria-hidden="true" />
    <div class="frame inner" :class="{ narrow }">
      <p v-if="kicker || $slots.kicker" class="mono kicker hero-in" style="--i: 0">
        <slot name="kicker">{{ kicker }}</slot>
      </p>
      <h1 class="page-title title hero-in" style="--i: 1">{{ title }}<span v-if="!plain" class="dot">.</span></h1>
      <p v-if="description" class="lead hero-in" style="--i: 2">{{ description }}</p>
      <div v-if="$slots.default" class="extra hero-in" style="--i: 3">
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string; kicker?: string; narrow?: boolean; plain?: boolean }>();
</script>

<style scoped>
.page-hero {
  overflow: hidden;
  border-top: 0;
  background: #000;
  /* Sits under the translucent header, like the home hero. */
  margin-top: -57px;
}

.field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.veil {
  position: absolute;
  inset: 0;
  /* Same veil as the home hero: a flat black over the whole field, a deeper
     patch under the text, and the fade into the page at the bottom. */
  background:
    radial-gradient(ellipse 55% 70% at var(--veil-x, 32%) 58%, rgb(0 0 0 / 0.75), transparent 80%),
    linear-gradient(to bottom, transparent 50%, var(--h-bg) 96%), rgb(0 0 0 / 0.45);
  pointer-events: none;
}

.veil.centered {
  --veil-x: 50%;
}

.inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding: 137px var(--pad) 64px;
  border-inline-color: transparent;
  background:
    linear-gradient(to bottom, var(--h-line), transparent 30%, transparent 75%, var(--h-line)) left / 1px 100% no-repeat,
    linear-gradient(to bottom, var(--h-line), transparent 30%, transparent 75%, var(--h-line)) right / 1px 100% no-repeat;
}

.inner.narrow > * {
  width: min(100%, 720px);
  max-width: none;
  margin-inline: auto;
}

.kicker {
  display: flex;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--h-muted);
}

.kicker :deep(b) {
  font-weight: 400;
  color: var(--h-accent);
}

.title {
  font-size: clamp(2.2rem, 1.5rem + 2.6vw, 3.6rem);
  line-height: 1.05;
}

.dot {
  color: var(--h-accent);
}

.lead {
  max-width: 58ch;
  font-size: 16px;
  color: var(--h-muted);
}

.extra {
  margin-top: 8px;
}

@media (prefers-reduced-motion: no-preference) {
  .hero-in {
    animation: hero-rise 800ms var(--ease) both;
    animation-delay: calc(var(--i) * 100ms + 80ms);
  }
}

@keyframes hero-rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (width < 720px) {
  .inner {
    padding-top: 113px;
  }
}
</style>
