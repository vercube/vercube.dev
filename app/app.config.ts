const links = [
  {
    icon: 'i-simple-icons-discord',
    to: 'https://chat.vercube.dev',
    target: '_blank',
    'aria-label': 'Vercube on Discord',
  },
  {
    icon: 'i-simple-icons-x',
    to: 'https://x.com/vercubejs',
    target: '_blank',
    'aria-label': 'Vercube on X',
  },
  {
    icon: 'i-simple-icons-github',
    to: 'https://github.com/vercube/vercube',
    target: '_blank',
    'aria-label': 'Vercube on GitHub',
  },
];

export default defineAppConfig({
  repository: 'vercube/vercube',
  theme: {
    radius: 0.5,
    blackAsPrimary: true,
  },
  ui: {
    radius: 0.5,
    colors: {
      primary: 'black',
      neutral: 'zinc',
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted',
      },
    },
    tabs: {
      slots: {
        list: 'rounded-full',
      },
    },
    // The search palette, styled like the site: mono labels, square rows,
    // a violet bar on the highlighted result.
    contentSearch: {
      slots: {
        modal: 'sm:max-w-2xl sm:h-[30rem] bg-[#0c0c0f] ring-[#26262b] shadow-[0_32px_96px_-24px_rgb(0_0_0/0.8)]',
      },
    },
    modal: {
      variants: {
        overlay: {
          true: { overlay: 'bg-black/60 backdrop-blur-[3px]' },
        },
      },
    },
    commandPalette: {
      slots: {
        root: 'divide-[#26262b]',
        input: '[&>input]:font-mono [&>input]:text-[13px] [&>input]:placeholder:text-dimmed [&_svg]:text-(--ui-primary)',
        viewport: 'divide-[#1b1b1f]',
        group: 'p-1.5',
        label: 'px-2.5 pt-2.5 pb-1.5 font-mono text-[10.5px] font-normal uppercase tracking-[0.08em] text-dimmed',
        item: 'px-2.5 py-2 text-[13px] gap-2.5 before:inset-0 before:rounded-none before:border-l-2 before:border-transparent data-highlighted:not-data-disabled:before:bg-[#bc4eff]/10 data-highlighted:not-data-disabled:before:border-[#bc4eff]',
        itemLeadingIcon: 'size-4 text-dimmed group-data-highlighted:text-(--ui-primary)',
        itemLabel: 'text-dimmed',
        itemLabelBase: 'font-mono text-[12.5px] text-highlighted',
        itemLabelPrefix: 'font-mono text-[12.5px] text-dimmed',
        itemLabelSuffix: 'text-[12.5px] text-dimmed',
        itemDescription: 'text-[12.5px] text-dimmed',
        footer: 'p-0',
        empty: 'py-10 font-mono text-[12px] text-dimmed',
      },
    },
    prose: {
      code: {
        // `inline-block` makes a chip unbreakable, so a long token like
        // `@vercube/telemetry` pushes itself onto a line of its own on a narrow
        // screen. Inline, and allowed to wrap.
        base: 'px-1.5 py-0.5 text-sm font-mono font-medium rounded-md inline [overflow-wrap:anywhere] border border-muted text-highlighted bg-muted',
      },
    },
  },
  seo: {
    siteName: 'Vercube Docs',
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: '',
    },
    search: true,
    colorMode: false,
    links,
    nav: [
      { label: 'Docs', to: '/docs' },
      { label: 'Examples', to: '/docs/getting-started/examples' },
      { label: 'Changelog', to: '/changelog' },
      { label: 'Blog', to: '/blog' },
    ],
  },
  footer: {
    credits: `${new Date().getFullYear()} © Vercube`,
    links,
  },
});
