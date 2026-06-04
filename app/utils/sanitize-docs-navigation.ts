import type { ContentNavigationItem } from '@nuxt/content';

/**
 * Drop `path` on nav nodes that don't map to a real markdown page.
 * Keeps the section tree intact while preventing crawlers/users from following dead `/docs/...` links.
 */
export function stripFolderOnlyNavPaths(items: ContentNavigationItem[], pathsWithPage: Set<string>): ContentNavigationItem[] {
  return items.map((item) => {
    const children = item.children?.length ? stripFolderOnlyNavPaths(item.children, pathsWithPage) : item.children;

    const path = item.path;
    const pathIsPage = path ? pathsWithPage.has(path) : false;

    if (path && !pathIsPage) {
      const { path: _drop, ...rest } = item;
      return { ...rest, children } as ContentNavigationItem;
    }

    return { ...item, children } as ContentNavigationItem;
  });
}
