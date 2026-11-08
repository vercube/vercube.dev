<script setup lang="ts">
import { buildTree } from '~/utils/file-tree';

// A directory listing, from paths: `controllers/UserController.ts`.
interface Entry {
  path: string;
  note?: string;
}

const props = withDefaults(defineProps<{ files: Entry[]; root?: string }>(), { root: 'src/' });

const rows = computed(() => buildTree(new Map(props.files.map((file) => [file.path, file.note]))));
</script>

<template>
  <HomeWindow :title="root" class="my-5">
    <SiteFileRows :rows="rows" plain />
  </HomeWindow>
</template>
