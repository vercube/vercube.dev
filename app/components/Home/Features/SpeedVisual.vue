<template>
  <div class="speed font-(family-name:--font-geist-mono)">
    <div class="bar">
      <span class="wdot" />
      <span class="wdot" />
      <span class="wdot" />
      <span class="bar-label">vercube dev</span>
    </div>
    <div class="body">
      <div class="line cmd"><span class="prompt">$</span> vercube dev<span class="cursor">_</span></div>
      <div class="line dim">resolving modules</div>
      <div class="line dim">bundling with rolldown</div>
      <div class="ready">
        <UIcon name="i-lucide-check" class="size-3.5 text-[#bc4eff]" />
        <span>Ready in <span class="accent">43ms</span></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.speed {
  width: 100%;
}

.bar {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
}

.wdot {
  width: 7px;
  height: 7px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.16);
}

.bar-label {
  margin-left: 0.4rem;
  font-size: 0.62rem;
  letter-spacing: 0.04em;
  color: rgb(255 255 255 / 0.32);
}

.body {
  padding-top: 0.85rem;
  font-size: 0.78rem;
  line-height: 1.7;
}

.cmd {
  color: rgb(255 255 255 / 0.55);
}

.prompt {
  color: rgb(255 255 255 / 0.75);
}

.dim {
  color: rgb(255 255 255 / 0.3);
}

.cursor {
  color: #bc4eff;
}

.ready {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.8rem;
  color: rgb(255 255 255 / 0.7);
}

.accent {
  color: #bc4eff;
}

@media (prefers-reduced-motion: no-preference) {
  .cursor {
    animation: blink 1.1s steps(1) infinite;
  }

  .accent {
    animation: ms-pulse 3.6s ease-in-out infinite;
  }
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  50.01%,
  100% {
    opacity: 0;
  }
}

@keyframes ms-pulse {
  0%,
  100% {
    text-shadow: 0 0 0 rgb(188 78 255 / 0);
  }
  50% {
    text-shadow: 0 0 12px rgb(188 78 255 / 0.6);
  }
}
</style>
