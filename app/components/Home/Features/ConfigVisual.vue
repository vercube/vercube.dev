<template>
  <div class="config font-(family-name:--font-geist-mono)">
    <div class="opt" v-for="(option, i) in options" :key="option" :style="{ '--d': `${i * 0.5}s` }">
      <span class="label">{{ option }}</span>
      <span class="toggle"><span class="knob" /></span>
    </div>
  </div>
</template>

<script setup lang="ts">
const options = ['server.port', 'logger', 'cors'];
</script>

<style scoped>
.config {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  width: 100%;
  font-size: 0.82rem;
}

.opt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.label {
  color: rgb(255 255 255 / 0.62);
}

.toggle {
  position: relative;
  flex: 0 0 auto;
  width: 34px;
  height: 18px;
  border-radius: 9999px;
  background: rgb(188 78 255 / 0.4);
  transition: background 0.3s ease;
}

.knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 9999px;
  background: #fff;
  transform: translateX(16px);
}

@media (prefers-reduced-motion: no-preference) {
  .toggle {
    animation: track 4s ease-in-out infinite;
    animation-delay: var(--d);
  }

  .knob {
    animation: knob 4s cubic-bezier(0.77, 0, 0.175, 1) infinite;
    animation-delay: var(--d);
  }
}

@keyframes knob {
  0%,
  18% {
    transform: translateX(0);
  }
  32%,
  82% {
    transform: translateX(16px);
  }
  96%,
  100% {
    transform: translateX(0);
  }
}

@keyframes track {
  0%,
  18% {
    background: rgb(255 255 255 / 0.12);
  }
  32%,
  82% {
    background: rgb(188 78 255 / 0.4);
  }
  96%,
  100% {
    background: rgb(255 255 255 / 0.12);
  }
}
</style>
