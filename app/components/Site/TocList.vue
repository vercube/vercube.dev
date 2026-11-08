<template>
  <div ref="root" class="toc-list">
    <svg v-if="height" class="rail" width="16" :height="height" aria-hidden="true">
      <path class="base" :d="rail" />
      <path class="mark" :d="rail" :style="markStyle" />
    </svg>
    <ul>
      <li v-for="(row, i) in rows" :key="row.id" :ref="(el) => setRow(el, i)">
        <NuxtLink :to="`#${row.id}`" class="link" :class="{ on: i === active }" :style="{ '--depth': row.depth }">
          {{ row.text }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface TocLink {
  id: string;
  text: string;
  children?: TocLink[];
}

const props = defineProps<{ links: TocLink[] }>();

// The rail runs at x0 beside top-level rows and x1 beside nested ones, bending over `bend` pixels.
const x0 = 0.5;
const x1 = 10.5;
const bend = 8;
const HEADER_OFFSET = 120;

const rows = computed(() => {
  const flatten = (links: TocLink[], depth: number): (TocLink & { depth: number })[] =>
    links.flatMap((link) => [{ ...link, depth }, ...flatten(link.children ?? [], depth + 1)]);
  return flatten(props.links, 0);
});

const root = ref<HTMLElement | null>(null);
const rowEls: HTMLElement[] = [];
const boxes = shallowRef<{ top: number; bottom: number }[]>([]);
const height = ref(0);
const active = ref(0);

function setRow(el: unknown, i: number) {
  if (el) rowEls[i] = el as HTMLElement;
}

function measure() {
  if (!root.value) return;
  height.value = root.value.offsetHeight;
  boxes.value = rowEls.slice(0, rows.value.length).map((el) => ({
    top: el.offsetTop,
    bottom: el.offsetTop + el.offsetHeight,
  }));
}

// Nested rows sit further right, and the rail follows them.
const xOf = (depth: number) => (depth > 0 ? x1 : x0);

const points = computed(() => {
  const count = boxes.value.length;
  if (!count) return [];
  const list = [{ x: xOf(rows.value[0]!.depth), y: 0 }];
  for (let i = 0; i < count - 1; i++) {
    const x = xOf(rows.value[i]!.depth);
    const next = xOf(rows.value[i + 1]!.depth);
    if (x === next) continue;
    const y = boxes.value[i]!.bottom;
    list.push({ x, y: y - bend / 2 }, { x: next, y: y + bend / 2 });
  }
  list.push({ x: xOf(rows.value[count - 1]!.depth), y: height.value });
  return list;
});

const rail = computed(() => points.value.map(({ x, y }, i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' '));

/** Distance along the rail down to height `y`; the rail only ever goes down. */
function lengthAt(y: number): number {
  let length = 0;
  for (let i = 1; i < points.value.length; i++) {
    const from = points.value[i - 1]!;
    const to = points.value[i]!;
    if (y <= from.y) break;
    const part = Math.min((y - from.y) / (to.y - from.y), 1);
    length += Math.hypot(to.x - from.x, to.y - from.y) * part;
  }
  return length;
}

// The marker is a dash of the rail itself, so moving it travels along the bends.
const markStyle = computed(() => {
  const box = boxes.value[active.value];
  if (!box) return { opacity: 0 };
  const start = lengthAt(box.top);
  return {
    strokeDasharray: `${lengthAt(box.bottom) - start} 100000`,
    strokeDashoffset: -start,
  };
});

function updateActive() {
  const headings = rows.value.map((row) => document.querySelector(`#${CSS.escape(row.id)}`));
  let index = 0;
  for (const [i, heading] of headings.entries()) {
    if (heading && heading.getBoundingClientRect().top <= HEADER_OFFSET) index = i;
  }
  // The last sections can be too short to ever reach the top.
  const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
  active.value = end ? rows.value.length - 1 : index;
}

// A long list scrolls in its panel: keep the current row in view.
watch(active, (index) => {
  const row = rowEls[index];
  let box = root.value?.parentElement ?? null;
  while (box && box.scrollHeight <= box.clientHeight) box = box.parentElement;
  if (!row || !box || box === document.documentElement || box === document.body) return;
  const rowBox = row.getBoundingClientRect();
  const panel = box.getBoundingClientRect();
  if (rowBox.top < panel.top || rowBox.bottom > panel.bottom) {
    box.scrollTop += rowBox.top - panel.top - panel.height / 2;
  }
});

let frame = 0;
function onScroll() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateActive);
}

let observer: ResizeObserver | undefined;
onMounted(() => {
  measure();
  updateActive();
  observer = new ResizeObserver(measure);
  if (root.value) observer.observe(root.value);
  window.addEventListener('scroll', onScroll, { passive: true });
});

watch(rows, async () => {
  rowEls.length = 0;
  await nextTick();
  measure();
  updateActive();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.toc-list {
  position: relative;
}

.rail {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.rail path {
  fill: none;
  stroke-width: 1;
}

.base {
  stroke: var(--h-line);
}

.rail .mark {
  stroke: var(--h-accent);
  stroke-width: 2;
  transition:
    stroke-dashoffset 320ms var(--ease),
    stroke-dasharray 320ms var(--ease);
}

.link {
  display: block;
  padding: 4px 0 4px calc(14px + min(var(--depth), 1) * 12px + max(var(--depth) - 1, 0) * 10px);
  font-size: 13px;
  line-height: 1.45;
  color: var(--h-muted);
  transition: color 160ms ease;
}

.link:hover {
  color: var(--h-ink);
}

.link.on {
  color: var(--h-ink);
}

@media (prefers-reduced-motion: reduce) {
  .rail .mark,
  .link {
    transition: none;
  }
}
</style>
