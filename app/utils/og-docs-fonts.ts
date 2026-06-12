/**
 * Client-safe font list for `defineOgImage('Docs', …)`.
 * Geist Pixel Circle TTF path is resolved from project root at OG render time (Nitro).
 */
export const ogDocsFonts = [
  {
    name: 'Geist Pixel Circle',
    weight: 400,
    path: 'public/fonts/GeistPixel-Circle.ttf',
  },
  'Geist Mono:400',
  'Geist Mono:600',
  'Geist:400',
  'Geist:600',
] as const;
