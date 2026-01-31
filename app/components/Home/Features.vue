<template>
  <section class="w-full py-32 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-20 z-10 relative">
        <h2 class="text-5xl md:text-6xl mb-6 font-(family-name:--font-geist-mono)">
          <span class="text-foreground">Built for </span>
          <span class="bg-gradient-to-r from-[#bc4eff] to-purple-400 bg-clip-text text-transparent"> modern development </span>
        </h2>

        <p class="text-balance text-foreground/60 font-(family-name:--font-geist-mono) mmax-w-2xl mx-auto">
          Vercube makes building server applications simple, fast, and enjoyable
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="(feature, index) in features"
          :key="index"
          :class="[
            'group relative rounded-2xl border border-muted/30 border-border/50 bg-background/50 backdrop-blur-sm p-8 transition-all duration-300 hover:border-accent/50 hover:bg-background/80 overflow-hidden',
            getGridClass(index),
          ]"
          @mouseenter="setHoveredIndex(index)"
          @mouseleave="setHoveredIndex(null)"
        >
          <div
            v-if="hoveredIndex === index"
            class="absolute inset-0 pointer-events-none rounded-2xl z-0 transition-all duration-[1500ms] ease-out"
            :style="getHoverStyle(feature.accentColor)"
          />

          <div
            :class="[
              'mb-6 transition-transform duration-300 relative z-10',
              hoveredIndex === index && index !== 3 ? 'scale-110' : 'scale-100',
            ]"
          >
            <component :is="feature.icon" />
          </div>

          <div class="relative z-10">
            <h3 class="text-2xl font-bold mb-3 text-foreground font-mono">
              {{ feature.title }}
            </h3>
            <p class="text-muted leading-relaxed font-mono">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BlazingFastIcon from './Features/BlazingFastIcon.vue';
import ESMFirstIcon from './Features/ESMFirstIcon.vue';
import DependencyInjectionIcon from './Features/DependencyInjectionIcon.vue';
import WebNativeHTTPIcon from './Features/WebNativeHTTPIcon.vue';

interface Feature {
  title: string;
  description: string;
  icon: any;
  accentColor: string;
}

const hoveredIndex = ref<number | null>(null);

const features: Feature[] = [
  {
    title: 'Blazing Fast',
    description: 'Powered by Rolldown for minimal overhead and maximum speed.',
    accentColor: 'rgb(34, 197, 94)', // green-500
    icon: BlazingFastIcon,
  },
  {
    title: 'ESM-First',
    description: 'Modern architecture built fully around native ESM.',
    accentColor: 'rgb(59, 130, 246)', // blue-500
    icon: ESMFirstIcon,
  },
  {
    title: 'Dependency Injection Everywhere',
    description: 'Clean, testable, and scalable apps thanks to built-in DI.',
    accentColor: 'rgb(168, 85, 247)', // purple-500
    icon: DependencyInjectionIcon,
  },
  {
    title: 'Web-Native HTTP',
    description: 'Create servers directly on the platform APIs you know: Fetch, Request, and Response.',
    accentColor: 'rgb(6, 182, 212)', // cyan-500
    icon: WebNativeHTTPIcon,
  },
];

const setHoveredIndex = (index: number | null) => {
  hoveredIndex.value = index;
};

const getGridClass = (index: number) => {
  switch (index) {
    case 0: {
      return 'md:col-span-2';
    }
    case 1: {
      return 'md:col-span-1';
    }
    case 2: {
      return 'md:col-span-1';
    }
    case 3: {
      return 'md:col-span-2';
    }
    default: {
      return '';
    }
  }
};

const getHoverStyle = (accentColor: string) => {
  const rgbToRgba = (rgb: string, opacity: number) => {
    const match = rgb.match(/\d+/g);
    if (match) {
      return `rgba(${match[0]}, ${match[1]}, ${match[2]}, ${opacity})`;
    }
    return rgb;
  };

  return {
    background: `radial-gradient(400px circle at 50% 0%, ${rgbToRgba(accentColor, 0.5)}, transparent 70%)`,
    // oxlint-disable-next-line no-negated-condition
    opacity: hoveredIndex.value !== null ? 1 : 0,
    // oxlint-disable-next-line no-negated-condition
    transform: hoveredIndex.value !== null ? 'scale(1)' : 'scale(0.3)',
    transformOrigin: '50% 0%',
    maskImage: 'linear-gradient(black, black) content-box, linear-gradient(black, black)',
    maskComposite: 'exclude',
    WebkitMaskComposite: 'xor',
    padding: '1px',
  };
};
</script>
