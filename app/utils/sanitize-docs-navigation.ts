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

/** Opens the sections leading to `path`, so a section collapsed by default still shows the current page. */
export function openActiveNavSections(items: ContentNavigationItem[], path: string): ContentNavigationItem[] {
  return items.map((item) => {
    if (!item.children?.length) return item;
    const children = openActiveNavSections(item.children, path);
    const containsPage = (nodes: ContentNavigationItem[]): boolean =>
      nodes.some((node) => node.path === path || (node.children ? containsPage(node.children) : false));
    return containsPage(children) ? { ...item, children, defaultOpen: true } : { ...item, children };
  });
}

/** Identifies the open branch: it changes only when the current page moves to another section. */
export function activeNavBranch(items: ContentNavigationItem[], path: string): string {
  for (const item of items) {
    if (item.path === path) return item.title;
    if (item.children?.length) {
      const inner = activeNavBranch(item.children, path);
      if (inner) return item.children.some((child) => child.path === path) ? item.title : `${item.title}/${inner}`;
    }
  }
  return '';
}
