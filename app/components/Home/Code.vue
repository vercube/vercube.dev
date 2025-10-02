<template>
  <UPageCard
    class="bg-transparent shadow-none border-none overflow-hidden font-mono text-sm"
    variant="soft"
  >
    <UTabs
      :items="tabs"
      :unmount-on-hide="false"
      :ui="{
        list: 'rounded-full bg-[#262626]/80',
        trigger: 'group data-[state=active]:text-highlighted',
        indicator: 'bg-default rounded-full',
        content: 'border-none bg-transparent/50'
      }"
    >
      <template #content="{ item, index }">
        <LazyMDC
          class="bg-[#0a0a0a]"
          :value="item.content"
          :cache-key="`index-hero-tab-${index}`"
          hydrate-on-idle
        />
      </template>
    </UTabs>
  </UPageCard>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('hero', () => queryCollection('index').first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const tabs = computed(() => page.value?.hero.tabs.map(tab => ({
  label: tab.title,
  content: tab.content
})))
</script>
