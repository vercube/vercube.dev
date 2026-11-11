<template>
  <section class="band">
    <div class="frame mission grid-bg">
      <p class="pixel statement" data-reveal>
        Free and MIT licensed.<br />
        Built in the open, shaped by the people who use it<span class="dot">.</span>
      </p>
      <div class="ctas" data-reveal style="--r: 1">
        <NuxtLink to="https://github.com/vercube/vercube" target="_blank" class="btn">
          <UIcon name="i-simple-icons-github" class="size-4" />
          Star on GitHub
        </NuxtLink>
        <NuxtLink to="https://github.com/sponsors/OskarLebuda" target="_blank" class="btn">
          <UIcon name="i-lucide-heart" class="size-4 heart" />
          Sponsor
        </NuxtLink>
        <NuxtLink to="https://chat.vercube.dev" target="_blank" class="btn">
          <UIcon name="i-simple-icons-discord" class="size-4" />
          Discord
        </NuxtLink>
      </div>
    </div>
    <div class="frame start">
      <p class="start-text">Start with one command, then read the guide.</p>
      <div class="start-actions">
        <code class="mono cmd"><span class="prompt">$</span> pnpm create vercube</code>
        <NuxtLink to="/docs/getting-started" class="btn primary">Get started →</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mission {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 104px var(--pad);
  text-align: center;
}

.statement {
  max-width: 24ch;
  font-size: clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem);
  line-height: 1.15;
  text-shadow: 0 4px 24px rgb(0 0 0 / 0.5);
}

.dot {
  color: var(--h-accent);
}

.ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.heart {
  color: #f472b6;
}

.start {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px var(--pad);
  border-top: 1px solid var(--h-line);
}

.start-text {
  font-size: 14px;
  color: var(--h-ink);
}

.start-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cmd {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--h-line);
  background: var(--h-panel);
  font-size: 12.5px;
  color: var(--h-ink);
}

.prompt {
  margin-right: 8px;
  color: var(--h-accent);
}

@media (width < 720px) {
  .start {
    flex-direction: column;
    align-items: flex-start;
  }

  .start-actions {
    flex-wrap: wrap;
  }
}
</style>
