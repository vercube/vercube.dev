<template>
  <div class="routing font-(family-name:--font-geist-mono)">
    <div class="head">
      <UIcon name="i-lucide-route" class="size-3" />
      Router
    </div>

    <div class="rows">
      <div v-for="(route, i) in routes" :key="route.method + route.path" class="row" :style="{ '--d': `${i * 1.2}s` }">
        <span class="dot" />
        <span class="method">{{ route.method }}</span>
        <span class="path">{{ route.path }}</span>
        <span class="status">{{ route.status }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const routes = [
  { method: 'GET', path: '/users', status: '200' },
  { method: 'POST', path: '/users', status: '201' },
  { method: 'GET', path: '/users/:id', status: '200' },
];
</script>

<style scoped>
.routing {
  --ease-io: cubic-bezier(0.77, 0, 0.175, 1);
  width: 100%;
}

.head {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.4);
}

.row {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  height: 2.1rem;
  padding: 0 0.4rem;
  border-radius: 0.4rem;
  font-size: 0.82rem;
}

.dot {
  flex: 0 0 auto;
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.18);
}

.method {
  flex: 0 0 auto;
  width: 2.8rem;
  font-size: 0.72rem;
  color: rgb(255 255 255 / 0.45);
}

.path {
  flex: 1;
  color: rgb(255 255 255 / 0.7);
}

.status {
  flex: 0 0 auto;
  color: #bc4eff;
}

@media (prefers-reduced-motion: no-preference) {
  .row {
    animation: route-row 3.6s ease-out infinite;
    animation-delay: var(--d);
  }

  .dot {
    animation: route-dot 3.6s var(--ease-io) infinite;
    animation-delay: var(--d);
  }

  .status {
    animation: route-status 3.6s ease-out infinite;
    animation-delay: var(--d);
  }
}

@keyframes route-row {
  0% {
    background: rgb(188 78 255 / 0.08);
  }
  27%,
  100% {
    background: transparent;
  }
}

@keyframes route-dot {
  0% {
    background: #bc4eff;
    box-shadow: 0 0 8px 1px rgb(188 78 255 / 0.7);
  }
  27%,
  100% {
    background: rgb(255 255 255 / 0.18);
    box-shadow: 0 0 0 0 rgb(188 78 255 / 0);
  }
}

@keyframes route-status {
  0% {
    opacity: 1;
  }
  27%,
  100% {
    opacity: 0;
  }
}
</style>
