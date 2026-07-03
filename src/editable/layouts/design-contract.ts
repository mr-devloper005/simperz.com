import type { CSSProperties } from 'react'

/*
  Warm editorial-corporate design contract.
  Reference: https://moveflow-template.webflow.io/
  Palette:
    page   #f5f4f3   surface #ffffff   border #e5dfd7
    ink    #232323   body    #636362
    accent #e5b779   soft    #fceacf   hover  #8a5712
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#f5f4f3',
  '--slot4-page-text': '#232323',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#636362',
  '--slot4-soft-muted-text': '#8f8b85',
  '--slot4-accent': '#c7985a',
  '--slot4-accent-fill': '#e5b779',
  '--slot4-accent-soft': '#fceacf',
  '--slot4-accent-strong': '#8a5712',
  '--slot4-on-accent': '#232323',
  '--slot4-dark-bg': '#232323',
  '--slot4-dark-text': '#fceacf',
  '--slot4-media-bg': '#efe9df',
  '--slot4-cream': '#fceacf',
  '--slot4-warm': '#f0e9dc',
  '--slot4-lavender': '#f5f4f3',
  '--slot4-gray': '#f1ede6',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#f5f4f3',
  '--editable-page-text': '#232323',
  '--editable-container': '1200px',
  '--editable-container-wide': '1360px',
  '--editable-border': '#e5dfd7',
  '--editable-border-strong': '#d6ccbc',
  '--editable-nav-bg': 'rgba(245,244,243,0.86)',
  '--editable-nav-text': '#232323',
  '--editable-nav-active': '#8a5712',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#232323',
  '--editable-cta-text': '#fceacf',
  '--editable-search-bg': '#ffffff',
  '--editable-footer-bg': '#232323',
  '--editable-footer-text': '#f5f4f3',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-strong)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_3px_rgba(35,35,35,0.05)]',
  shadowStrong: 'shadow-[0_20px_60px_-24px_rgba(35,35,35,0.28)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(35,35,35,0.04),rgba(35,35,35,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10',
    sectionWide: 'mx-auto w-full max-w-[var(--editable-container-wide)] px-6 sm:px-8 lg:px-10',
    sectionY: 'py-20 sm:py-24 lg:py-32',
    sectionYSm: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow:
      'text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-strong)]',
    eyebrowSoft:
      'text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]',
    heroTitle:
      'editable-display text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[76px]',
    sectionTitle:
      'editable-display text-4xl font-semibold leading-[1.06] tracking-[-0.028em] sm:text-5xl lg:text-[56px]',
    subheading:
      'editable-display text-2xl font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[28px]',
    body: 'text-base leading-[1.65] text-[var(--slot4-muted-text)] sm:text-[17px]',
    emphasis:
      'editable-display text-[22px] font-medium leading-[1.5] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-[26px]',
    label: 'text-xs font-medium tracking-[0.02em] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-2xl border ${editablePalette.border} bg-[color-mix(in_oklab,var(--slot4-page-bg)_60%,white)]`,
    dark: `rounded-[28px] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
    cream: `rounded-2xl bg-[var(--slot4-cream)] text-[var(--slot4-page-text)]`,
  },
  button: {
    primary:
      'group inline-flex items-center justify-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold tracking-[0.005em] text-[var(--slot4-on-accent)] transition duration-300 hover:bg-[var(--slot4-accent-strong)] hover:text-white active:scale-[0.98]',
    secondary:
      'group inline-flex items-center justify-center gap-2 rounded-[12px] border border-[var(--slot4-page-text)] bg-transparent px-6 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)] active:scale-[0.98]',
    accent:
      'group inline-flex items-center justify-center gap-2 rounded-[12px] bg-[var(--slot4-dark-bg)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-300 hover:bg-[var(--slot4-accent-strong)] active:scale-[0.98]',
    ghost:
      'group inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-300 hover:text-[var(--slot4-accent-strong)]',
  },
  badge: {
    pill: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-page-text)]',
    accentPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent-strong)]',
    darkPill:
      'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-cream)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    frameFull: `relative overflow-hidden rounded-[28px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
    ratioWide: 'aspect-[16/9]',
    ratioSquare: 'aspect-square',
    ratioPortrait: 'aspect-[3/4]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_45px_-18px_rgba(35,35,35,0.24)]',
    fade: 'transition duration-500 hover:opacity-85',
    zoom: 'transition duration-700 hover:scale-[1.02]',
  },
} as const

export const aiLayoutRules = [
  'Change the full site color palette in editableRootStyle first; all sections cascade from those CSS vars.',
  'Section rhythm follows moveflow-template — hero split, stats band, feature showcase, grid, capability tiles, dark promo, footer.',
  'Buttons are soft-corner rounded (12px), never pill and never sharp.',
  'Cards use warm bordered soft surfaces with gentle hover lift.',
  'All motion uses var(--ease-premium) with reduced-motion guards.',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
