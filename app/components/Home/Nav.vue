<template>
  <div class="absolute z-50 pt-8 md:pt-14 top-0 left-0 w-full">
    <header class="flex items-center justify-between container transition-all duration-300 ease-out">
      <NuxtLink to="/">
        <AppLogo class="w-[30px] md:w-[30px]" />
      </NuxtLink>
      <div class="flex items-center gap-x-8 max-lg:hidden">
        <nav class="flex items-center gap-x-8">
          <NuxtLink
            v-for="link of header.nav"
            :key="link.label"
            :to="link.to"
            class="inline-block font-mono text-sm text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
        <div class="flex items-center gap-x-4">
          <NuxtLink
            v-for="link of header.links"
            :key="link.to"
            :to="link.to"
            target="_blank"
            class="text-foreground/60 hover:text-foreground/100 duration-150 transition-colors ease-out"
            :aria-label="link['aria-label']"
          >
            <UIcon :name="link.icon" class="size-5" />
          </NuxtLink>
        </div>
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const { header } = useAppConfig();
</script>
