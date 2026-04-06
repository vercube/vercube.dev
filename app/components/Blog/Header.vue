<script setup lang="ts">
const { title, description } = defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <UPageSection
    :title="title"
    :description="description"
    class="relative"
    orientation="vertical"
    :ui="{
      root: 'border-b border-default overflow-hidden',
      container: 'z-[10] xl:mt-20',
      wrapper: 'relative flex flex-col',
      headline: 'mb-6',
      title: 'text-left text-4xl font-(family-name:--font-geist-mono)',
      description: 'text-left max-w-lg font-(family-name:--font-geist-mono)',
      links: 'gap-1 justify-start -ms-2.5',
    }"
  >
    <template #top>
      <div class="absolute inset-0 z-[-1] overflow-hidden">
        <HomeBackground class="inset-0" />
        <div class="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent pointer-events-none" />
      </div>
    </template>
  </UPageSection>
</template>
