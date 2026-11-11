export interface TreeRow {
  path: string;
  name: string;
  depth: number;
  folder: boolean;
  /** The recipe that writes this file; template files have none. */
  origin?: string;
}

/** Turns file paths into the rows of a tree, folders first. A trailing slash marks an empty folder. */
export function buildTree(files: Map<string, string | undefined>): TreeRow[] {
  interface Node {
    children: Map<string, Node>;
    folder: boolean;
    origin?: string;
  }
  const root: Node = { children: new Map(), folder: true };
  for (const [path, origin] of files) {
    const parts = path.split('/').filter(Boolean);
    let node = root;
    for (const [i, part] of parts.entries()) {
      const leaf = i === parts.length - 1;
      if (!node.children.has(part)) node.children.set(part, { children: new Map(), folder: !leaf || path.endsWith('/') });
      node = node.children.get(part)!;
    }
    node.origin = origin;
  }
  const rows: TreeRow[] = [];
  const walk = (node: Node, prefix: string, depth: number) => {
    const entries = [...node.children].toSorted(([, a], [, b]) => Number(b.folder) - Number(a.folder));
    for (const [name, child] of entries) {
      const path = `${prefix}${name}`;
      rows.push({ path, name, depth, folder: child.folder, origin: child.origin });
      walk(child, `${path}/`, depth + 1);
    }
  };
  walk(root, '', 0);
  return rows;
}
