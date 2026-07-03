import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A warm local directory & reference library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Local Directory · Reference Library',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get started', href: '/signup' },
      secondary: { label: 'Search everything', href: '/search' },
    },
  },
  footer: {
    tagline: 'Trusted places · Verified reference material',
    description:
      'A warm, useful home for the businesses locals actually recommend and the reference guides worth downloading. Every place verified, every reference printer-friendly.',
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'Local Directory', href: '/listings' },
          { label: 'Reference Library', href: '/pdf' },
          { label: 'Editorial', href: '/articles' },
          { label: 'Field Gallery', href: '/image-sharing' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search everything', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Warm · Useful · Findable',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'You might also like',
    published: 'Published',
  },
} as const
