<template>
  <div class="type font-(family-name:--font-geist-mono)">
    <div class="code"><span class="kw">const</span> app: <span class="typ">App</span> = createApp()</div>
    <div class="hint">
      <UIcon name="i-lucide-check" class="size-3" />
      inferred: <span class="typ">App</span>
    </div>
  </div>
</template>

<style scoped>
.type {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.8rem;
  width: 100%;
}

.code {
  font-size: 0.82rem;
  color: rgb(255 255 255 / 0.62);
}

.kw {
  color: #bc4eff;
}

.typ {
  color: #d9a9ff;
}

.hint {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.6rem;
  border: 1px solid rgb(188 78 255 / 0.25);
  border-radius: 0.5rem;
  background: rgb(188 78 255 / 0.06);
  font-size: 0.72rem;
  color: rgb(255 255 255 / 0.6);
}

.hint :deep(svg) {
  color: #bc4eff;
}

@media (prefers-reduced-motion: no-preference) {
  .hint {
    animation: hint 3.6s ease-out infinite;
  }
}

@keyframes hint {
  0%,
  10% {
    opacity: 0;
    transform: translateY(-4px);
  }
  22%,
  82% {
    opacity: 1;
    transform: translateY(0);
  }
  94%,
  100% {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
