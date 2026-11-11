import type { MDCRoot } from '@nuxtjs/mdc';

/**
 * Parses markdown code blocks once, at prerender, and returns their highlighted ASTs.
 *
 * `<MDC hydrate-on-idle>` cannot be trusted with this on a static host: it hydrates
 * after the app has finished, so its own `useAsyncData` skips the payload, parses on
 * the client and asks `/api/_mdc/highlight`, which a static host does not have. The
 * code then shows uncolored. Fetched here, in the section's own setup, the result
 * comes from the payload, and a lazy `<MDCRenderer>` only draws it.
 */
export function useCodeBlocks<T extends Record<string, string>>(key: string, sources: T) {
  return useAsyncData(key, async () => {
    const { parseMarkdown } = await import('@nuxtjs/mdc/runtime');
    const entries = await Promise.all(
      Object.entries(sources).map(async ([name, markdown]) => [name, (await parseMarkdown(markdown)).body] as const),
    );
    return Object.fromEntries(entries) as Record<keyof T, MDCRoot>;
  });
}
