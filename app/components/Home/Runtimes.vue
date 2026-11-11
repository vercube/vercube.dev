<template>
  <section class="band" aria-label="Where Vercube runs">
    <div class="frame strip">
      <p class="lead">Runs on the web's own Request and Response, so it runs wherever they do.</p>
      <ul class="cells">
        <li v-for="(target, i) in targets" :key="target.name" data-reveal :style="{ '--r': i }">
          <NuxtLink :to="target.to" class="cell" :title="target.name">
            <UIcon :name="target.icon" class="logo" />
            <span class="name">{{ target.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const targets = [
  { name: 'Node.js', icon: 'i-simple-icons-nodedotjs', to: '/docs/deployment/node-server' },
  { name: 'Bun', icon: 'i-simple-icons-bun', to: '/docs/deployment/node-server' },
  { name: 'Deno', icon: 'i-simple-icons-deno', to: '/docs/deployment/node-server' },
  { name: 'AWS Lambda', icon: 'i-simple-icons-awslambda', to: '/docs/deployment/aws-lambda' },
  { name: 'Azure Functions', icon: 'i-simple-icons-microsoftazure', to: '/docs/deployment/azure-functions' },
  { name: 'Vercel', icon: 'i-simple-icons-vercel', to: '/docs/deployment/vercel' },
];
</script>

<style scoped>
.strip {
  display: grid;
  grid-template-columns: 260px 1fr;
}

.lead {
  display: flex;
  align-items: center;
  padding: 20px var(--pad);
  border-right: 1px solid var(--h-line);
  font-size: 13px;
  line-height: 1.55;
  color: var(--h-ink);
}

.cells {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.cells li + li {
  border-left: 1px solid var(--h-line);
}

.cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 100%;
  min-height: 96px;
  padding: 16px 8px;
  color: var(--h-dim);
  transition:
    color 200ms ease,
    background-color 200ms ease;
}

.cell:hover {
  color: var(--h-ink);
  background: var(--h-panel);
}

.logo {
  width: 22px;
  height: 22px;
}

.name {
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 11px;
  text-align: center;
}

@media (width < 860px) {
  .strip {
    grid-template-columns: minmax(0, 1fr);
  }

  .lead {
    border-right: 0;
    border-bottom: 1px solid var(--h-line);
  }

  .cells {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .cells li:nth-child(4) {
    border-left: 0;
  }

  .cells li:nth-child(n + 4) {
    border-top: 1px solid var(--h-line);
  }
}
</style>
