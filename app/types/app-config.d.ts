declare module 'nuxt/schema' {
  interface AppConfig {
    repository: string;
    theme: {
      radius: number;
      blackAsPrimary: boolean;
    };
    seo: {
      siteName: string;
    };
    header: {
      title: string;
      to: string;
      logo: {
        alt: string;
        light: string;
        dark: string;
      };
      search: boolean;
      colorMode: boolean;
      links: ReadonlyArray<{
        icon?: string;
        to?: string;
        target?: string;
        'aria-label'?: string;
      }>;
      nav: ReadonlyArray<{ label: string; to: string }>;
    };
    footer: {
      credits: string;
      links: ReadonlyArray<{
        icon?: string;
        to?: string;
        target?: string;
        'aria-label'?: string;
      }>;
    };
  }
}

declare module '@nuxt/schema' {
  interface AppConfig {
    repository: string;
    theme: {
      radius: number;
      blackAsPrimary: boolean;
    };
    seo: {
      siteName: string;
    };
    header: {
      title: string;
      to: string;
      logo: {
        alt: string;
        light: string;
        dark: string;
      };
      search: boolean;
      colorMode: boolean;
      links: ReadonlyArray<{
        icon?: string;
        to?: string;
        target?: string;
        'aria-label'?: string;
      }>;
      nav: ReadonlyArray<{ label: string; to: string }>;
    };
    footer: {
      credits: string;
      links: ReadonlyArray<{
        icon?: string;
        to?: string;
        target?: string;
        'aria-label'?: string;
      }>;
    };
  }
}
