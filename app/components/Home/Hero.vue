<template>
  <div v-if="page" class="flex flex-col min-h-[90vh] justify-between">
    <div class="flex-1 flex items-center relative">
      <div class="container mx-auto px-6 relative z-10">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="text-left">
            <AppVersion class="mb-6" />
            <p
              class="font-(family-name:--font-geist-mono) text-sm sm:text-base text-foreground/60 text-balance mt-2 mb-4 max-w-[440px]"
            >
              {{ page.hero.slug }}
            </p>
            <h1 class="text-5xl sm:text-6xl font-(family-name:--font-geist-mono)">
              {{ page.hero.title }}
            </h1>
            <p class="text-balance mt-6 text-foreground/60 font-(family-name:--font-geist-mono)">
              {{ page.hero.description }}
            </p>

            <div class="flex flex-wrap items-center gap-3 mt-14">
              <UButton
                icon="i-lucide-rocket"
                size="md"
                variant="ghost"
                to="/docs"
                class="group relative border bg-[#bc4eff]/20 border-[#bc4eff]/50 hover:border-[#bc4eff] hover:bg-[#bc4eff]/10 rounded-full px-5 py-2 h-auto text-sm transition-all duration-300"
              >
                Get Started
              </UButton>

              <UButton
                icon="i-lucide-zap"
                size="md"
                variant="outline"
                to="/docs/getting-started/installation#try-it-online"
                class="rounded-full px-5 py-2 h-auto text-sm"
              >
                Try Online
              </UButton>

              <UButton
                icon="i-lucide-github"
                size="md"
                variant="outline"
                target="_blank"
                to="https://github.com/vercube/vercube"
                class="rounded-full px-5 py-2 h-auto text-sm"
              >
                View on GitHub
              </UButton>
            </div>
          </div>

          <div class="hidden lg:block">
            <HomeCode />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('hero', () => queryCollection('index').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>
