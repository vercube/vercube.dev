<template>
  <section class="w-full px-6 py-32">
    <div class="mx-auto max-w-6xl">
      <div class="reveal mx-auto mb-16 max-w-2xl text-center">
        <h2 class="text-4xl sm:text-5xl font-(family-name:--font-geist-pixel-circle)">
          <span class="text-foreground">Built for </span>
          <span class="text-[#bc4eff]">modern development</span>
        </h2>
        <p class="mt-5 text-foreground/60 font-(family-name:--font-geist-mono) text-balance">
          Everything you need to ship fast, type-safe servers, and nothing you don't.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <!-- Routing (wide) -->
        <article class="reveal tile md:col-span-2">
          <div class="tile-visual">
            <HomeFeaturesRoutingVisual class="w-full max-w-xs" />
          </div>
          <h3 class="tile-title">Decorator-based routing</h3>
          <p class="tile-desc">Declarative controllers and method decorators map requests to handlers, with zero boilerplate.</p>
        </article>

        <!-- Blazing Fast -->
        <article class="reveal tile">
          <div class="tile-visual">
            <HomeFeaturesSpeedVisual />
          </div>
          <h3 class="tile-title">Blazing fast</h3>
          <p class="tile-desc">Powered by Rolldown for minimal overhead and instant cold starts.</p>
        </article>

        <!-- Dependency Injection -->
        <article class="reveal tile">
          <div class="tile-visual">
            <HomeFeaturesInjectionVisual class="w-full" />
          </div>
          <h3 class="tile-title">Dependency injection</h3>
          <p class="tile-desc">Clean, testable, scalable apps thanks to first-class built-in DI.</p>
        </article>

        <!-- Web-Native HTTP (wide) -->
        <article class="reveal tile md:col-span-2">
          <div class="tile-visual">
            <HomeFeaturesHttpVisual class="w-full max-w-lg" />
          </div>
          <h3 class="tile-title">Web-native HTTP</h3>
          <p class="tile-desc">Build on the platform APIs you already know: Fetch, Request, and Response.</p>
        </article>

        <!-- ESM-First -->
        <article class="reveal tile">
          <div class="tile-visual">
            <HomeFeaturesEsmVisual />
          </div>
          <h3 class="tile-title">ESM-First</h3>
          <p class="tile-desc">A modern architecture built fully around native ECMAScript modules.</p>
        </article>

        <!-- Fully Configurable -->
        <article class="reveal tile">
          <div class="tile-visual">
            <HomeFeaturesConfigVisual class="max-w-[220px]" />
          </div>
          <h3 class="tile-title">Fully Configurable</h3>
          <p class="tile-desc">Sensible defaults out of the box, with complete control when you need it.</p>
        </article>

        <!-- Type-Safe -->
        <article class="reveal tile md:col-span-2 lg:col-span-1">
          <div class="tile-visual">
            <HomeFeaturesTypeVisual />
          </div>
          <h3 class="tile-title">Type-Safe by Design</h3>
          <p class="tile-desc">End-to-end TypeScript with decorators and full type inference.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tile {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 1.75rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 1rem;
  background: rgb(255 255 255 / 0.02);
  transition:
    border-color 0.3s ease,
    background 0.3s ease;
}

.tile:hover {
  border-color: rgb(188 78 255 / 0.3);
  background: rgb(188 78 255 / 0.03);
}

.tile::before {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgb(188 78 255 / 0.6), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tile:hover::before {
  opacity: 1;
}

.tile-visual {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  min-height: 168px;
  padding-bottom: 1.5rem;
}

.tile-title {
  margin-bottom: 0.5rem;
  font-family: var(--font-geist-mono);
  font-size: 1.05rem;
  color: var(--foreground);
}

.tile-desc {
  font-family: var(--font-geist-mono);
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgb(255 255 255 / 0.55);
}
</style>
