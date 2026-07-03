import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Warm editorial task surfaces (moveflow-template inspired).

  All tasks share one visual language via `--tk-*` tokens.
  Only the kicker/note copy varies per task so pages have a little voice
  while the palette, typography and spacing stay cohesive.

  Display-label vocabulary (user-visible):
    listing → Local Directory
    pdf     → Reference Library
    (task keys and routes stay unchanged)
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const WARM_FONT = "'Satoshi', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: WARM_FONT,
  fontBody: WARM_FONT,
  bg: '#f5f4f3',
  surface: '#ffffff',
  raised: '#f0e9dc',
  text: '#232323',
  muted: '#636362',
  line: '#e5dfd7',
  accent: '#c7985a',
  accentSoft: '#fceacf',
  onAccent: '#232323',
  glow: 'rgba(199,152,90,0.10)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: {
    ...base,
    kicker: 'Editorial',
    note: 'Slow reads, field notes and long-form perspective from the platform.',
  },
  listing: {
    ...base,
    kicker: 'Local Directory',
    note: 'Trusted places, verified neighbours and the businesses locals recommend.',
  },
  classified: {
    ...base,
    kicker: 'Community Board',
    note: 'Fresh offers, community swaps and time-sensitive notices worth acting on.',
  },
  image: {
    ...base,
    kicker: 'Field Gallery',
    note: 'A visual reel of standout imagery, storefronts and street-level moments.',
  },
  sbm: {
    ...base,
    kicker: 'Saved Shelf',
    note: 'Curated links, references and tools worth keeping on hand.',
  },
  pdf: {
    ...base,
    kicker: 'Reference Library',
    note: 'Downloadable guides, primers and briefs — everything printer-friendly.',
  },
  profile: {
    ...base,
    kicker: 'People & Makers',
    note: 'Creators, small teams and independents behind the work.',
  },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/*
  User-visible display label for a task key.
  Always use this instead of SITE_CONFIG.tasks[].label anywhere in the editable UI
  — the rename to "Local Directory" / "Reference Library" lives here.
*/
export function taskDisplayLabel(task: TaskKey): string {
  return getTaskTheme(task).kicker
}

/** Singular chip (e.g. "directory listing", "reference document") */
export function taskDisplayItem(task: TaskKey): string {
  switch (task) {
    case 'listing': return 'directory listing'
    case 'pdf': return 'reference document'
    case 'article': return 'editorial piece'
    case 'classified': return 'community post'
    case 'image': return 'gallery entry'
    case 'sbm': return 'saved link'
    case 'profile': return 'profile'
    default: return 'entry'
  }
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
