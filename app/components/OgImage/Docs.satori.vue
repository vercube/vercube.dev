<script lang="ts" setup>
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

defineProps<{
  headline?: string;
  title: string;
  description?: string;
}>();

let cachedBackgroundSrc: string | undefined;

function getBackgroundSrc() {
  if (cachedBackgroundSrc) return cachedBackgroundSrc;

  const config = useRuntimeConfig();
  const roots = [config.rootDir, process.cwd()].filter(Boolean) as string[];

  for (const root of roots) {
    const filePath = join(root, 'public/images/background.png');
    if (existsSync(filePath)) {
      cachedBackgroundSrc = `data:image/png;base64,${readFileSync(filePath).toString('base64')}`;
      return cachedBackgroundSrc;
    }
  }

  return undefined;
}

const backgroundSrc = getBackgroundSrc();
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 1200px;
      height: 600px;
      padding: 32px 0;
      overflow: hidden;
      background-color: #05010a;
      position: relative;
    "
  >
    <img
      v-if="backgroundSrc"
      :src="backgroundSrc"
      width="1200"
      height="600"
      alt=""
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 600px; object-fit: cover"
    />
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 600px;
        background: linear-gradient(to right, rgb(0 0 0 / 0.2), rgb(0 0 0 / 0.1) 55%, transparent 100%);
      "
    />
    <div
      style="position: relative; display: flex; flex-direction: column; gap: 16px; justify-content: center; padding-left: 80px"
    >
      <div style="display: flex">
        <svg width="50" viewBox="0 0 94 107" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M28.8466 10.2278C27.5705 10.9779 26.6974 12.4098 26.6974 13.9098V21.5466L64.5103 43.8432C64.5103 43.8432 64.7118 43.8432 64.779 44.3205V88.5047C64.779 88.7093 64.5103 88.982 64.5103 88.982L51.2792 96.7551C51.2792 96.7551 50.6076 96.9597 50.5404 96.2779V52.571L7.55586 27.0014C7.55586 27.0014 7.35438 27.0014 7.28722 26.5241V22.5012C5.20515 23.6604 3.19026 24.8195 1.10819 26.0468C0.503725 26.3878 0.100745 27.0696 0.100745 27.8197C-0.0335816 45.1388 -0.0335816 62.4579 0.100745 79.777C0.100745 80.527 0.503719 81.2089 1.17535 81.5498L28.981 97.437V88.8457L7.75736 76.2313C7.62303 76.095 7.55587 75.9586 7.48871 75.754V36.4792C7.62303 35.4564 8.16034 35.9337 8.29467 36.0701L42.9509 57.2758C42.9509 57.2758 43.1524 57.2758 43.2196 57.6849C43.2196 72.9584 43.0852 88.232 43.2196 103.506C43.2867 106.028 46.3091 107.869 48.6598 106.574L71.9655 93.2095V39.7521L33.4137 16.91C32.8093 16.4327 33.4137 16.0236 33.4137 16.0236L46.5777 8.52318H47.1151L85.9354 31.1608C85.9354 31.1608 86.1369 31.1608 86.2041 31.6381V38.4566V85.2318C88.2861 84.0045 90.4354 82.8453 92.5174 81.618C93.1219 81.2771 93.5249 80.5952 93.5249 79.8452C93.6592 62.5261 93.6592 45.207 93.5249 27.8879C93.5249 27.1378 93.1219 26.456 92.4503 26.115L46.7792 0C40.8689 3.34109 34.8242 6.75036 28.8466 10.2278Z"
            fill="#fff"
          />
          <defs />
        </svg>
      </div>
      <p
        v-if="headline"
        style="
          display: flex;
          font-size: 24px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Geist Mono', monospace;
        "
      >
        // {{ headline }}
      </p>
      <h1
        style="
          display: flex;
          margin: 0;
          font-size: 75px;
          font-weight: 400;
          color: #fff;
          max-width: 950px;
          font-family: 'Geist Pixel Circle', 'Geist Mono', monospace;
        "
      >
        {{ title }}
      </h1>
      <p
        v-if="description"
        style="
          font-size: 32px;
          line-height: 1.4;
          max-width: 900px;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 400;
          font-family: 'Geist Mono', monospace;
        "
      >
        {{ description.slice(0, 200) }}
      </p>
    </div>
  </div>
</template>
