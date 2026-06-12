<template>
  <div class="di font-(family-name:--font-geist-mono)">
    <div class="head">
      <UIcon name="i-lucide-box" class="size-3" />
      Container
    </div>

    <div v-for="(binding, i) in bindings" :key="binding.token" class="bind" :style="{ '--d': `${i * 0.45}s` }">
      <span class="token">{{ binding.token }}</span>
      <span class="wire"><span class="packet" /></span>
      <span class="impl">
        <span class="name">{{ binding.impl }}</span>
        <UIcon name="i-lucide-check" class="chk size-3" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const bindings = [
  { token: 'Logger', impl: 'ConsoleLogger' },
  { token: 'Database', impl: 'PrismaClient' },
  { token: 'Mailer', impl: 'ResendMailer' },
];
</script>

<style scoped>
.di {
  --ease-io: cubic-bezier(0.77, 0, 0.175, 1);
  width: 100%;
}

.head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.7rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.4);
}

.bind {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.4rem 0.4rem;
  border-radius: 0.4rem;
  font-size: 0.78rem;
}

.token {
  flex: 0 0 auto;
  width: 4.5rem;
  color: rgb(255 255 255 / 0.6);
}

.wire {
  position: relative;
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 0.12), transparent);
}

.packet {
  position: absolute;
  top: 50%;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: #bc4eff;
  box-shadow: 0 0 8px 2px rgb(188 78 255 / 0.7);
  transform: translate(-50%, -50%);
  opacity: 0;
}

.impl {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Base / reduced-motion: resolved state stays legible without animation */
.name {
  color: #bc4eff;
}

.chk {
  color: #bc4eff;
  opacity: 1;
}

@media (prefers-reduced-motion: no-preference) {
  .packet {
    animation: di-packet 3s var(--ease-io) infinite;
    animation-delay: var(--d);
  }

  .bind {
    animation: di-glow 3s ease-out infinite;
    animation-delay: var(--d);
  }

  .name {
    animation: di-name 3s ease-out infinite;
    animation-delay: var(--d);
  }

  .chk {
    animation: di-chk 3s ease-out infinite;
    animation-delay: var(--d);
  }
}

@keyframes di-packet {
  0% {
    left: 0;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  30% {
    left: 100%;
    opacity: 1;
  }
  36%,
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes di-name {
  0%,
  29% {
    color: rgb(255 255 255 / 0.35);
  }
  35%,
  100% {
    color: #bc4eff;
  }
}

@keyframes di-chk {
  0%,
  29% {
    opacity: 0;
    transform: scale(0.8);
  }
  35%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes di-glow {
  0%,
  29% {
    background: transparent;
  }
  35% {
    background: rgb(188 78 255 / 0.08);
  }
  60%,
  100% {
    background: transparent;
  }
}
</style>
