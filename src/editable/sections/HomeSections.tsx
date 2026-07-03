import Link from 'next/link'
import {
  ArrowUpRight,
  BookOpenText,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Download,
  Layers,
  MapPin,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'
import { taskDisplayLabel } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

function excerptOf(post?: SitePost | null, limit = 140) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = stripHtml(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ============================== Hero split ============================== */

export function EditableHomeHero({ primaryTask: _primaryTask, primaryRoute: _primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImage = pool.map(getEditablePostImage).find((url) => url && !url.includes('placeholder')) || '/placeholder.svg?height=900&width=1400'
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `A calmer way to look things up on ${SITE_CONFIG.name}`
  const [primaryCta, secondaryCta] = [pagesContent.home.hero.primaryCta, pagesContent.home.hero.secondaryCta]
  const pinned = pool.slice(0, 3)

  return (
    <section className="relative overflow-hidden bg-[var(--slot4-page-bg)]">
      <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(70%_60%_at_50%_0%,var(--slot4-accent-soft),transparent_65%)]" />
      <div className={`${dc.shell.section} relative pt-24 pb-24 sm:pt-28 sm:pb-28 lg:pt-32 lg:pb-32`}>
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <EditableReveal index={0}>
              <p className={dc.badge.accentPill}>
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.home.hero.badge}
              </p>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-7 ${dc.type.heroTitle}`}>{heroTitle}</h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mt-7 max-w-xl ${dc.type.body}`}>{pagesContent.home.hero.description}</p>
            </EditableReveal>
            <EditableReveal index={3}>
              <form
                action="/search"
                className="mt-8 flex w-full max-w-xl overflow-hidden rounded-[14px] border border-[var(--editable-border)] bg-white shadow-[0_20px_45px_-24px_rgba(35,35,35,0.18)]"
              >
                <label className="flex flex-1 items-center gap-3 px-5">
                  <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent-strong)]" />
                  <input
                    name="q"
                    placeholder={pagesContent.home.hero.searchPlaceholder}
                    className="w-full bg-transparent py-4 text-[15px] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <button className="shrink-0 bg-[var(--slot4-dark-bg)] px-6 text-sm font-semibold text-[var(--slot4-cream)] transition hover:bg-[var(--slot4-accent-strong)]">
                  Look up
                </button>
              </form>
            </EditableReveal>
            <EditableReveal index={4}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href={primaryCta.href} className={dc.button.primary}>
                  {primaryCta.label} <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <Link href={secondaryCta.href} className={dc.button.ghost}>
                  {secondaryCta.label} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </div>
            </EditableReveal>
          </div>

          <EditableReveal index={2} className="relative">
            <div className={`${dc.media.frameFull} aspect-[4/5] w-full max-w-md justify-self-end lg:max-w-none`}>
              <img
                src={heroImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[20px] bg-white/95 p-5 backdrop-blur sm:inset-x-6 sm:bottom-6 sm:p-6">
                <p className={dc.type.eyebrow}>{pagesContent.home.hero.featureCardBadge}</p>
                <p className="editable-display mt-3 text-lg font-semibold leading-[1.25] tracking-[-0.015em] text-[var(--slot4-page-text)] sm:text-xl">
                  {pinned[0]?.title || pagesContent.home.hero.featureCardTitle}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-[var(--slot4-muted-text)]">
                  {pinned[0] ? excerptOf(pinned[0], 120) : pagesContent.home.hero.featureCardDescription}
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-4 -top-4 hidden h-32 w-32 rounded-full bg-[var(--slot4-accent-soft)] sm:block" />
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ============================== Stats band ============================== */

export function EditableStoryRail({ primaryTask: _primaryTask, primaryRoute: _primaryRoute, posts, timeSections }: HomeSectionProps) {
  const total = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)]).length
  const directoryCount = SITE_CONFIG.tasks.find((t) => t.key === 'listing')?.enabled ? Math.max(24, total) : total
  const libraryCount = SITE_CONFIG.tasks.find((t) => t.key === 'pdf')?.enabled ? Math.max(18, Math.floor(total * 0.7)) : Math.floor(total * 0.7)
  const enabledTasks = SITE_CONFIG.tasks.filter((t) => t.enabled).length

  const stats = [
    { value: `${directoryCount}+`, label: 'Verified places in the directory' },
    { value: `${libraryCount}+`, label: 'Reference guides in the library' },
    { value: '100%', label: 'Verified before publication' },
    { value: `${enabledTasks}`, label: 'Content shelves, one calm home' },
  ]

  return (
    <section className="bg-[var(--slot4-cream)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <EditableReveal>
            <p className={dc.type.eyebrow}>By the numbers</p>
            <h2 className={`mt-4 ${dc.type.sectionTitle}`}>
              A small, deliberate platform — verified one entry at a time.
            </h2>
          </EditableReveal>
          <EditableReveal index={1}>
            <p className={`max-w-xl ${dc.type.body}`}>
              Every place in the directory and every guide in the library is checked by a human before it lands here. No auto-scraping, no aggregator lists, no fake urgency.
            </p>
          </EditableReveal>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <EditableReveal key={stat.label} index={i}>
              <div className="border-t border-[var(--editable-border-strong)] pt-6">
                <p className="editable-display text-[56px] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-accent-strong)] sm:text-[64px]">
                  {stat.value}
                </p>
                <p className={`mt-4 text-sm ${dc.type.label}`}>{stat.label}</p>
              </div>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ========================== Feature showcase (split) ========================== */

export function EditableMagazineSplit({ primaryTask: _primaryTask, primaryRoute: _primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((s) => s.posts)])
  const feature = pool[0]
  const featureImage = feature ? getEditablePostImage(feature) : '/placeholder.svg?height=900&width=1200'
  const bullets = [
    { icon: ShieldCheck, title: 'Verified by hand', body: 'Every entry is checked before it lands — hours, addresses, files.' },
    { icon: Printer, title: 'Printer-friendly', body: 'Reference documents open cleanly and save cleanly for offline use.' },
    { icon: MapPin, title: 'Neighbourhood first', body: 'The directory reads like a walk-through, not a search-result list.' },
  ]

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-32`}>
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <EditableReveal className="order-2 lg:order-1">
            <div className={`${dc.media.frameFull} aspect-[4/5]`}>
              <img src={featureImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </EditableReveal>
          <EditableReveal index={1} className="order-1 lg:order-2">
            <p className={dc.type.eyebrow}>What you can do here</p>
            <h2 className={`mt-4 ${dc.type.sectionTitle}`}>
              Two shelves. One warm architecture.
            </h2>
            <p className={`mt-6 max-w-xl ${dc.type.body}`}>
              The Local Directory and the Reference Library share a spine — same warm palette, same generous spacing, same verified-before-published rule. Use one, use both, use them together.
            </p>
            <div className="mt-9 grid gap-6">
              {bullets.map((b, i) => (
                <EditableReveal key={b.title} index={i} step={70}>
                  <div className="flex items-start gap-5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
                      <b.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="editable-display text-lg font-semibold tracking-[-0.015em] text-[var(--slot4-page-text)]">
                        {b.title}
                      </p>
                      <p className="mt-1.5 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{b.body}</p>
                    </div>
                  </div>
                </EditableReveal>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/listings" className={dc.button.primary}>
                Browse the Directory <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* ========================= 3-up card gallery + capability tiles ========================= */

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
          { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((s) => s.posts.length)
  const first = visible[0]
  const capabilities = [
    { icon: Compass, title: 'Neighbourhood browse' },
    { icon: BookOpenText, title: 'Reference reading' },
    { icon: Download, title: 'One-tap downloads' },
    { icon: MapPin, title: 'Verified addresses' },
    { icon: ClipboardCheck, title: 'Hand-checked entries' },
    { icon: Layers, title: 'Grouped by shelf' },
    { icon: Sprout, title: 'Fresh weekly' },
    { icon: CheckCircle2, title: 'No signup wall' },
  ]

  return (
    <>
      {/* Latest across the platform (3-up gallery) */}
      {first ? (
        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <EditableReveal>
                <p className={dc.type.eyebrow}>Freshly added</p>
                <h2 className={`mt-3 ${dc.type.sectionTitle}`}>
                  The most recent additions to the platform.
                </h2>
              </EditableReveal>
              <EditableReveal index={1}>
                <Link href={first.href || primaryRoute} className={dc.button.ghost}>
                  See every {taskDisplayLabel(primaryTask).toLowerCase()} <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </EditableReveal>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {first.posts.slice(0, 6).map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index} step={80}>
                  <FeatureTile post={post} href={postHref(primaryTask, post, primaryRoute)} />
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Capability tiles (8-up on cream) */}
      <section className="bg-[var(--slot4-cream)]">
        <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <EditableReveal>
              <p className={dc.type.eyebrow}>Everything under one warm roof</p>
              <h2 className={`mt-3 ${dc.type.sectionTitle}`}>Small, useful, opinionated.</h2>
            </EditableReveal>
            <EditableReveal index={1}>
              <p className={`max-w-xl ${dc.type.body}`}>
                Eight quiet promises the platform keeps. No dark patterns, no growth-hack timers, no cookie carousel.
              </p>
            </EditableReveal>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {capabilities.map((c, i) => (
              <EditableReveal key={c.title} index={i} step={60}>
                <div className="group flex h-full flex-col items-start gap-5 rounded-[18px] border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent-strong)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)] transition group-hover:bg-[var(--slot4-dark-bg)] group-hover:text-[var(--slot4-cream)]">
                    <c.icon className="h-5 w-5" />
                  </span>
                  <p className="editable-display text-[17px] font-semibold leading-[1.3] tracking-[-0.015em] text-[var(--slot4-page-text)]">
                    {c.title}
                  </p>
                </div>
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Second latest strip (index cards) */}
      {visible[1] ? (
        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <EditableReveal>
                <p className={dc.type.eyebrow}>From the archive</p>
                <h2 className={`mt-3 ${dc.type.sectionTitle}`}>Evergreen picks worth keeping open.</h2>
              </EditableReveal>
              <EditableReveal index={1}>
                <Link href={visible[1].href || primaryRoute} className={dc.button.ghost}>
                  Open the shelf <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </Link>
              </EditableReveal>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {visible[1].posts.slice(0, 6).map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index} step={70}>
                  <IndexRow post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function FeatureTile({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = categoryOf(post)
  return (
    <Link href={href} className={`group flex h-full flex-col overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={image}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        {category ? (
          <span className={`absolute left-4 top-4 ${dc.badge.accentPill}`}>{category}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">
          {excerptOf(post, 150)}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)]">
          Open entry
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

function IndexRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid gap-6 rounded-[20px] border border-[var(--editable-border)] bg-white p-5 sm:grid-cols-[64px_minmax(0,1fr)] ${dc.motion.lift}`}>
      <div className="editable-display flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--slot4-accent-soft)] text-lg font-semibold text-[var(--slot4-accent-strong)]">
        {String(index + 1).padStart(2, '0')}
      </div>
      <div className="min-w-0">
        <p className={dc.type.eyebrow}>{categoryOf(post) || 'Featured'}</p>
        <h3 className="editable-display mt-3 line-clamp-2 text-xl font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.6] text-[var(--slot4-muted-text)]">{excerptOf(post, 130)}</p>
      </div>
    </Link>
  )
}

/* ============================ Dark promo band ============================ */

export function EditableHomeCta() {
  return (
    <section className="bg-[var(--slot4-page-bg)] pb-24 sm:pb-28 lg:pb-32">
      <div className={`${dc.shell.section}`}>
        <div className="relative overflow-hidden rounded-[32px] bg-[var(--slot4-dark-bg)] px-8 py-16 text-center sm:px-14 sm:py-20 lg:py-28">
          <div className="pointer-events-none absolute inset-x-0 -top-20 h-64 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(229,183,121,0.35),transparent_70%)]" />
          <div className="relative mx-auto max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
              {pagesContent.home.cta.badge}
            </p>
            <h2 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[56px]">
              {pagesContent.home.cta.title}
            </h2>
            <p className="mt-6 text-[17px] leading-[1.7] text-white/70">
              {pagesContent.home.cta.description.replace('{name}', SITE_CONFIG.name)}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href={pagesContent.home.cta.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-7 py-4 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-white"
              >
                {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href={pagesContent.home.cta.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-[12px] border border-white/25 px-7 py-4 text-sm font-semibold text-white transition hover:border-white/60 hover:bg-white/5"
              >
                {pagesContent.home.cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
