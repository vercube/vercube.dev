<template>
  <div class="window">
    <div class="bar mono">
      <span class="dots" aria-hidden="true"><i /><i /><i /></span>
      <span class="title">{{ title }}</span>
      <span class="right"><slot name="right" /></span>
    </div>
    <div class="body" :class="{ flush }">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; flush?: boolean }>();
</script>

<style scoped>
.window {
  display: flex;
  flex-direction: column;
  min-width: 0;
  border: 1px solid var(--h-line);
  background: var(--h-panel);
}

.bar {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 34px;
  padding: 0 12px;
  border-bottom: 1px solid var(--h-line);
  font-size: 11.5px;
  color: var(--h-muted);
}

.dots {
  display: flex;
  gap: 5px;
}

.dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3f3f46;
}

.title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.body {
  flex: 1;
  min-height: 0;
  padding: 14px 16px;
  font-family: 'Geist Mono', ui-monospace, monospace;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--h-muted);
  overflow: auto;
}

.body.flush {
  padding: 0;
}

/* Shiki output from <MDC>: strip the prose chrome. */
.body :deep(pre) {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent !important;
  font-size: 12.5px;
  line-height: 1.7;
}

.body :deep(.shiki) {
  background: transparent !important;
}

.body :deep(pre code) {
  white-space: pre;
}

.body :deep(p) {
  margin: 0;
}

.body :deep(.md button) {
  display: none;
}

/* ProsePre wraps the code in a block with vertical margins; inside a panel
   the panel's own padding is the spacing. */
.body :deep(.md .my-5) {
  margin-block: 0;
}
</style>
