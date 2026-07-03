import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: `${slot4BrandConfig.siteName} — Local Directory & Reference Library`,
      description:
        'A warm local directory of the places worth recommending, and a reference library of downloadable guides — all in one calm surface.',
      openGraphTitle: `${slot4BrandConfig.siteName} — Local Directory & Reference Library`,
      openGraphDescription:
        'Discover the neighbourhood spots locals actually recommend, plus a growing library of downloadable guides.',
      keywords: [
        'local directory',
        'reference library',
        'business directory',
        'downloadable guides',
        'reference library',
      ],
    },
    hero: {
      badge: 'Directory · Reference Library · Since day one',
      title: ['A calmer way to find', 'trusted places and useful guides.'],
      description:
        'The corners of the neighbourhood worth knowing about, and a growing reference shelf of downloadable guides. Warm, verified, printer-friendly.',
      primaryCta: { label: 'Browse the Directory', href: '/listings' },
      secondaryCta: { label: 'Open the Library', href: '/pdf' },
      searchPlaceholder: 'Search places, guides, streets, categories…',
      focusLabel: 'Focus',
      featureCardBadge: 'Latest recommendations',
      featureCardTitle: 'The most recent verified entry sets the tone of the homepage.',
      featureCardDescription:
        'Freshly added directory entries and reference guides always land here first — no algorithm gymnastics.',
    },
    intro: {
      badge: 'What this platform is',
      title: 'A directory that reads like a neighbourhood, and a library that opens on first tap.',
      paragraphs: [
        'Two surfaces, one calm architecture. The Local Directory holds the places worth visiting. The Reference Library holds the guides worth keeping.',
        'Both are built for the way people actually browse — quick to skim, easy to dig into, printer-friendly when it matters.',
        'No walled gardens, no email walls, no dark patterns. Just a warm, useful place to look things up.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Every directory entry is verified — hours, address, contact — before it lands.',
        'Every reference document opens directly, no signup, no download queue.',
        'Section rhythm is designed for a slow scroll, not an endless feed.',
        'Warm palette, generous whitespace, honest typography.',
      ],
      primaryLink: { label: 'Browse the Directory', href: '/listings' },
      secondaryLink: { label: 'Open the Library', href: '/pdf' },
    },
    cta: {
      badge: 'Add to the platform',
      title: 'Add your business, share a reference guide, or recommend a place.',
      description:
        'Everything on {name} was submitted, checked, then published. If you have something worth adding, this is the door.',
      primaryCta: { label: 'Submit an entry', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest additions to this shelf.',
    },
  },
  about: {
    badge: 'Our approach',
    title: 'A warmer way to look things up.',
    description: `${slot4BrandConfig.siteName} is a small pairing: a Local Directory for places worth recommending, and a Reference Library of downloadable guides worth keeping.`,
    paragraphs: [
      'We started because the useful corners of the neighbourhood — and the useful guides sitting on someone’s hard drive — deserved a warmer, calmer home than the usual search result.',
      'Every entry is verified before it lands. Every guide opens in one tap, no email wall. The rhythm of the site is slow on purpose — this is a look-things-up surface, not a scroll-forever one.',
      'What you find here is what someone thought was worth passing on.',
    ],
    values: [
      {
        title: 'Verified before published',
        description:
          'Hours, addresses and file contents are checked by a human before an entry goes live. If we can’t verify it, we don’t publish it.',
      },
      {
        title: 'Printer-friendly by default',
        description:
          'The Reference Library was built assuming you might print it. Guides open cleanly, save cleanly and share cleanly.',
      },
      {
        title: 'No dark patterns',
        description:
          'No email walls, no autoplay, no fake urgency. Just a calm surface for looking things up.',
      },
    ],
  },
  contact: {
    eyebrow: `Talk to ${slot4BrandConfig.siteName}`,
    title: 'Add an entry, flag a fix, or just say hello.',
    description:
      'Tell us what you’re trying to publish, correct, or ask about. Directory submissions, reference-library uploads, and neighbourhood tips all land in the same warm inbox — we route it from there.',
    formTitle: 'Send a note',
  },
  search: {
    metadata: {
      title: 'Search everything',
      description:
        'Search the Local Directory and the Reference Library — places, guides, categories, streets and topics.',
    },
    hero: {
      badge: 'Search the whole platform',
      title: 'Look something up.',
      description:
        'Directory entries, reference guides, editorial pieces, community board posts — all searchable from a single warm door.',
      placeholder: 'Search places, guides, streets, topics…',
    },
    resultsTitle: 'Fresh across the platform',
  },
  create: {
    metadata: {
      title: 'Submit an entry',
      description: 'Submit a directory entry or a reference guide.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Sign in to submit an entry.',
      description:
        'Use your account to open the submission workspace — one form covers directory entries, reference-library uploads and everything else on the platform.',
    },
    hero: {
      badge: 'Submission workspace',
      title: 'Add something worth passing on.',
      description:
        'Pick what you’re submitting, fill in the details, and we’ll verify it before it lands. Every field is optional except the essentials.',
    },
    formTitle: 'Entry details',
    submitLabel: 'Submit for review',
    successTitle: 'Thanks — your entry is in the queue.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to the platform.',
      badge: 'Welcome back',
      title: 'Sign in to keep browsing.',
      description:
        'Come back to your bookmarks, your submissions and your downloads. Same warm door, no fuss.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched. Create one first, then sign in.',
      success: 'Signed in. Redirecting…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account.',
      badge: 'Join the platform',
      title: 'Create your account.',
      description:
        'One account covers directory submissions, reference-library uploads and saved bookmarks. No spam, no upsell.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Redirecting…',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'More from the editorial desk',
      fallbackTitle: 'Editorial piece',
    },
    listing: {
      relatedTitle: 'More from the directory',
      fallbackTitle: 'Directory entry',
    },
    image: {
      relatedTitle: 'More from the field gallery',
      fallbackTitle: 'Gallery entry',
    },
    profile: {
      relatedTitle: 'More profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
