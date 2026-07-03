import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

/*
  Display-label vocabulary (user-visible):
    listing → Local Directory
    pdf     → Reference Library
  Task keys and route paths are unchanged.
*/

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial desk',
    headline: 'Slow reads and field notes, one careful paragraph at a time.',
    description:
      'Long-form perspective from the platform — features, guides and quiet essays worth sitting with for a moment.',
    filterLabel: 'Filter reading topic',
    secondaryNote: 'Editorial pieces are paced for a proper read, not a scroll.',
    chips: ['Editorial pacing', 'Long reads', 'Field notes'],
  },
  classified: {
    eyebrow: 'Community board',
    headline: 'A fast-moving community board — fresh offers, swaps and notices.',
    description:
      'Time-sensitive posts that neighbours actually act on. Scan, tap, done.',
    filterLabel: 'Filter category',
    secondaryNote: 'Quick to scan, clear to act on.',
    chips: ['Fresh today', 'Community swaps', 'Direct action'],
  },
  sbm: {
    eyebrow: 'Saved shelf',
    headline: 'A curated shelf of links, tools and references worth keeping.',
    description:
      'Bookmarks, resources and quiet recommendations arranged like a small useful library.',
    filterLabel: 'Filter shelf',
    secondaryNote: 'Curated, categorised, and always warm to browse.',
    chips: ['Curated links', 'Everyday tools', 'Reference flow'],
  },
  profile: {
    eyebrow: 'People & makers',
    headline: 'The independents, small teams and quiet creators behind the work.',
    description:
      'Profiles built for trust — plain identity, real work, honest links.',
    filterLabel: 'Filter profile',
    secondaryNote: 'Identity first. Work second. No noise.',
    chips: ['Independents', 'Verified identity', 'Real portfolios'],
  },
  pdf: {
    eyebrow: 'Reference Library',
    headline: 'A reference library of downloadable guides, primers and briefs.',
    description:
      'Printer-friendly briefs, field guides and quick references — everything sourced, everything free to open.',
    filterLabel: 'Filter reference',
    secondaryNote: 'Ready to open. Ready to print. No signup wall.',
    chips: ['Field guides', 'Printer-friendly', 'Free to open'],
  },
  listing: {
    eyebrow: 'Local Directory',
    headline: 'A warm local directory of the places locals actually recommend.',
    description:
      'Verified businesses, quick facts and honest contact details — the neighbourhood you would show a visitor.',
    filterLabel: 'Filter neighbourhood',
    secondaryNote: 'Verified addresses. Verified hours. Real recommendations.',
    chips: ['Verified places', 'Real hours', 'Local favourites'],
  },
  image: {
    eyebrow: 'Field gallery',
    headline: 'A visual reel of storefronts, streets and standout moments.',
    description:
      'Image-led posts that let the light and the frame do most of the talking.',
    filterLabel: 'Filter visual',
    secondaryNote: 'Photography first. Copy holds the door.',
    chips: ['Storefronts', 'Street level', 'Portfolio mood'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
