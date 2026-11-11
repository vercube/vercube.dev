<script lang="ts" setup>
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The site's OG image, in the vercube.dev style: the hero's particle field
 * under the same veil, a frame of hairlines with small squares where they
 * cross, a mono kicker, a Geist Pixel Line title and a Geist description.
 */
const props = defineProps<{
  /** Mono kicker above the title, e.g. "Docs · Core features". */
  headline?: string;
  title: string;
  description?: string;
}>();

let cachedBackground: string | undefined;

function background(): string | undefined {
  if (cachedBackground) return cachedBackground;

  const config = useRuntimeConfig();
  // @ts-expect-error - rootDir is not typed
  const roots = [config.rootDir, process.cwd()].filter(Boolean) as string[];

  for (const root of roots) {
    const file = join(root, 'public/images/og-background.jpg');
    if (existsSync(file)) {
      cachedBackground = `data:image/jpeg;base64,${readFileSync(file).toString('base64')}`;
      return cachedBackground;
    }
  }

  return undefined;
}

const backgroundSrc = background();

// The pixel face is wide: long titles step down so they stay on two lines.
const titleSize = computed(() => {
  const length = props.title.length;
  if (length > 34) return 52;
  if (length > 22) return 64;
  return 80;
});

// A version number ending the title would read as "1.4." with the dot.
const titleDot = computed(() => !/\d$/.test(props.title.trim()));

// The title as words, so the violet dot stays on the last one when it wraps.
const words = computed(() => props.title.trim().split(/\s+/));

const summary = computed(() => {
  const text = (props.description ?? '').replaceAll(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 147).replace(/\s+\S*$/, '')}…` : text;
});

const LINE = '#26262b';
const MARK = 'position: absolute; width: 9px; height: 9px; background: #09090b; border: 1px solid #52525b;';
</script>

<template>
  <div style="display: flex; position: relative; width: 1200px; height: 630px; background: #000; overflow: hidden">
    <img
      v-if="backgroundSrc"
      :src="backgroundSrc"
      width="1200"
      height="630"
      alt=""
      style="position: absolute; top: 0; left: 0; width: 1200px; height: 630px"
    />

    <!-- The veil of the site's heroes: flat black, deeper under the text, fading at the bottom. -->
    <div style="position: absolute; top: 0; left: 0; width: 1200px; height: 630px; background: rgba(0, 0, 0, 0.45)" />
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 630px;
        background-image: linear-gradient(90deg, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.55) 48%, rgba(0, 0, 0, 0) 100%);
      "
    />
    <div
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 1200px;
        height: 630px;
        background-image: linear-gradient(180deg, rgba(9, 9, 11, 0) 60%, rgba(9, 9, 11, 0.9) 100%);
      "
    />

    <!-- Frame: two side rules, two bands, a square at every crossing. -->
    <div :style="`position: absolute; top: 0; left: 64px; width: 1px; height: 630px; background: ${LINE}`" />
    <div :style="`position: absolute; top: 0; left: 1135px; width: 1px; height: 630px; background: ${LINE}`" />
    <div :style="`position: absolute; top: 84px; left: 0; width: 1200px; height: 1px; background: ${LINE}`" />
    <div :style="`position: absolute; top: 538px; left: 0; width: 1200px; height: 1px; background: ${LINE}`" />
    <div :style="`${MARK} top: 80px; left: 60px`" />
    <div :style="`${MARK} top: 80px; left: 1131px`" />
    <div :style="`${MARK} top: 534px; left: 60px`" />
    <div :style="`${MARK} top: 534px; left: 1131px`" />

    <!-- Top band: the site header's brand. -->
    <div
      style="
        position: absolute;
        top: 0;
        left: 64px;
        width: 1072px;
        height: 84px;
        display: flex;
        align-items: center;
        padding: 0 32px;
      "
    >
      <svg width="30" height="34" viewBox="0 0 94 107" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M28.8466 10.2278C27.5705 10.9779 26.6974 12.4098 26.6974 13.9098V21.5466L64.5103 43.8432C64.5103 43.8432 64.7118 43.8432 64.779 44.3205V88.5047C64.779 88.7093 64.5103 88.982 64.5103 88.982L51.2792 96.7551C51.2792 96.7551 50.6076 96.9597 50.5404 96.2779V52.571L7.55586 27.0014C7.55586 27.0014 7.35438 27.0014 7.28722 26.5241V22.5012C5.20515 23.6604 3.19026 24.8195 1.10819 26.0468C0.503725 26.3878 0.100745 27.0696 0.100745 27.8197C-0.0335816 45.1388 -0.0335816 62.4579 0.100745 79.777C0.100745 80.527 0.503719 81.2089 1.17535 81.5498L28.981 97.437V88.8457L7.75736 76.2313C7.62303 76.095 7.55587 75.9586 7.48871 75.754V36.4792C7.62303 35.4564 8.16034 35.9337 8.29467 36.0701L42.9509 57.2758C42.9509 57.2758 43.1524 57.2758 43.2196 57.6849C43.2196 72.9584 43.0852 88.232 43.2196 103.506C43.2867 106.028 46.3091 107.869 48.6598 106.574L71.9655 93.2095V39.7521L33.4137 16.91C32.8093 16.4327 33.4137 16.0236 33.4137 16.0236L46.5777 8.52318H47.1151L85.9354 31.1608C85.9354 31.1608 86.1369 31.1608 86.2041 31.6381V38.4566V85.2318C88.2861 84.0045 90.4354 82.8453 92.5174 81.618C93.1219 81.2771 93.5249 80.5952 93.5249 79.8452C93.6592 62.5261 93.6592 45.207 93.5249 27.8879C93.5249 27.1378 93.1219 26.456 92.4503 26.115L46.7792 0C40.8689 3.34109 34.8242 6.75036 28.8466 10.2278Z"
          fill="#fafafa"
        />
      </svg>
      <div style="display: flex; margin-left: 14px; font-family: 'Geist Pixel Line OG'; font-size: 30px; color: #fafafa">
        vercube
      </div>
    </div>

    <!-- Content -->
    <div
      style="
        position: absolute;
        top: 85px;
        left: 65px;
        width: 1070px;
        height: 453px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 48px;
      "
    >
      <div
        v-if="headline"
        style="
          display: flex;
          font-family: 'Geist Mono';
          font-size: 20px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #a1a1aa;
        "
      >
        {{ headline }}
      </div>
      <div
        :style="`display: flex; flex-wrap: wrap; column-gap: ${Math.round(titleSize * 0.42)}px; margin-top: 18px; max-width: 980px; font-family: 'Geist Pixel Line OG'; font-size: ${titleSize}px; line-height: 1.08; color: #fafafa`"
      >
        <div v-for="(word, i) in words" :key="i" style="display: flex">
          <span>{{ word }}</span>
          <span v-if="titleDot && i === words.length - 1" style="color: #bc4eff">.</span>
        </div>
      </div>
      <div
        v-if="summary"
        style="
          display: flex;
          margin-top: 26px;
          max-width: 860px;
          font-family: 'Geist';
          font-size: 28px;
          line-height: 1.45;
          color: #a1a1aa;
        "
      >
        {{ summary }}
      </div>
    </div>

    <!-- Bottom band -->
    <div
      style="
        position: absolute;
        top: 539px;
        left: 64px;
        width: 1072px;
        height: 91px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 32px;
      "
    >
      <div style="display: flex; font-family: 'Geist Mono'; font-size: 20px; color: #a1a1aa">vercube.dev</div>
      <div
        style="
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border: 1px solid #26262b;
          background: #0c0c0f;
          font-family: 'Geist Mono';
          font-size: 19px;
          color: #fafafa;
        "
      >
        <span style="color: #bc4eff; margin-right: 12px">$</span>
        <span>pnpm create vercube</span>
      </div>
    </div>
  </div>
</template>
