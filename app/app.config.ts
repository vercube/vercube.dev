const links = [{
  'icon': 'i-simple-icons-discord',
  'to': 'https://discord.gg/vercube',
  'target': '_blank',
  'aria-label': 'Vercube on Discord'
}, {
  'icon': 'i-simple-icons-x',
  'to': 'https://x.com/vercubejs',
  'target': '_blank',
  'aria-label': 'Vercube on X'
}, {
  'icon': 'i-simple-icons-github',
  'to': 'https://github.com/vercube/vercube',
  'target': '_blank',
  'aria-label': 'Vercube on GitHub'
}]

export default defineAppConfig({
  repository: 'vercube/vercube',
  theme: {
    radius: 0.5,
    blackAsPrimary: true
  },
  ui: {
    radius: 0.5,
    colors: {
      primary: 'black',
      neutral: 'neutral'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    },
    tabs: {
      slots: {
        list: 'rounded-full'
      }
    }
  },
  seo: {
    siteName: 'Vercube Docs'
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links,
    nav: [
      { label: 'Docs', to: '/docs' },
      { label: 'Examples', to: '/examples' },
      { label: 'Changelog', to: '/changelog' },
      { label: 'Blog', to: '/blog' }
    ]
  },
  footer: {
    credits: `${new Date().getFullYear()} © Vercube`,
    links
  }
})
