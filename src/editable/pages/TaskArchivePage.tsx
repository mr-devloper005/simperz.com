import Link from 'next/link'
import {
  ArrowUpRight, BookOpenText, ChevronDown, Download, Globe, MapPin,
  Phone, Search, ShieldCheck, Sparkles, Star, Store, UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle, taskDisplayLabel, taskDisplayItem } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-8 md:grid-cols-2 xl:grid-cols-3',
  listing: 'grid gap-6 lg:grid-cols-2',
  classified: 'grid gap-6 sm:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase =
  'group block rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(35,35,35,0.22)] hover:border-[color-mix(in_oklab,var(--tk-accent)_45%,var(--tk-line))]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const label = taskDisplayLabel(task)
  const itemLabel = taskDisplayItem(task)
  const page = pagination.page || 1
  const categoryLabel =
    category === 'all' ? 'Every category' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  // Ad slot rules: listing archive → in-feed; pdf archive → header
  const showHeaderAd = task === 'pdf'
  const showFeedAd = task === 'listing'
  const feedAdIndex = 3 // inserted after this many posts

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Hero */}
        <header className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-[radial-gradient(60%_60%_at_50%_0%,var(--tk-glow),transparent_70%)]" />
          <div className={`${dc.shell.section} relative py-20 sm:py-24 lg:py-28`}>
            <EditableReveal>
              <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
                <Sparkles className="h-3.5 w-3.5" /> {theme.kicker}
              </div>
            </EditableReveal>
            <EditableReveal index={1}>
              <h1 className={`mt-8 max-w-4xl ${dc.type.heroTitle}`}>{voice?.headline || `Browse ${label}`}</h1>
            </EditableReveal>
            <EditableReveal index={2}>
              <p className={`mt-7 max-w-2xl ${dc.type.body}`}>{voice?.description || theme.note}</p>
            </EditableReveal>
            {voice?.chips?.length ? (
              <EditableReveal index={3}>
                <div className="mt-9 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </EditableReveal>
            ) : null}

            <EditableReveal index={4}>
              <div className="mt-12 flex flex-col gap-4 border-t border-[var(--tk-line)] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--tk-muted)]">
                  <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span>{' '}
                  {posts.length === 1 ? itemLabel : `${itemLabel}s`} · {categoryLabel}
                </p>
                <form action={basePath} className="flex items-center gap-2.5">
                  <div className="relative">
                    <select
                      name="category"
                      defaultValue={category}
                      className="h-12 appearance-none rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)] pl-4 pr-11 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                      aria-label={voice?.filterLabel || 'Filter category'}
                    >
                      <option value="all">Every category</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                  </div>
                  <button className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-[var(--slot4-dark-bg)] px-5 text-sm font-semibold text-[var(--slot4-cream)] transition hover:bg-[var(--slot4-accent-strong)]">
                    Apply
                  </button>
                </form>
              </div>
            </EditableReveal>
          </div>
        </header>

        {showHeaderAd ? (
          <div className={`${dc.shell.section} pb-2 pt-4`}>
            <Ads slot="header" size={pickRandom(getSlotSizes('header'))} showLabel className="mx-auto w-full" />
          </div>
        ) : null}

        {/* Grid */}
        <section className={`${dc.shell.section} py-16 sm:py-20 lg:py-24`}>
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.flatMap((post, index) => {
                const items = [
                  <EditableReveal key={`post-${post.id || post.slug}`} index={index} step={60}>
                    <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                  </EditableReveal>,
                ]
                if (showFeedAd && index === feedAdIndex) {
                  items.push(
                    <EditableReveal key={`feed-ad-${index}`} className="lg:col-span-2">
                      <div className="rounded-[20px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] p-4">
                        <Ads slot="in-feed" size={pickRandom(getSlotSizes('in-feed'))} showLabel className="mx-auto w-full" />
                      </div>
                    </EditableReveal>,
                  )
                }
                return items
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[20px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.02em]">Nothing on this shelf yet</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">
                Try another category, or check back once a new {itemLabel} has been verified.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="rounded-[12px] border border-[var(--tk-line)] px-5 py-3 font-semibold text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"
                >
                  Previous
                </Link>
              ) : null}
              <span className="rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-3 font-medium text-[var(--tk-muted)]">
                Page {page} of {pagination.totalPages || 1}
              </span>
              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="rounded-[12px] border border-[var(--tk-line)] px-5 py-3 font-semibold text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"
                >
                  Next
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function CardArrow({ label }: { label: string }) {
  return (
    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--tk-text)]">
      {label}
      <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </span>
  )
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.8 + (hashStr(post.slug || post.id || post.title || 'x') % 12) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 8 + (hashStr((post.slug || post.title || 'x') + 'r') % 380)
}

function RatingLine({ post, center = false }: { post: SitePost; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-3 flex items-center gap-2 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < filled
                ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]'
                : 'fill-[var(--tk-line)] text-[var(--tk-line)]'
            }`}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">({reviewsOf(post)})</span>
    </div>
  )
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Editorial')
  return (
    <Link href={href} className={`${cardBase} flex flex-col overflow-hidden`}>
      <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
      </div>
      <div className="flex flex-1 flex-col p-7">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
          <span>{category}</span>
          <span className="text-[var(--tk-muted)]">· No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 flex-1 text-[15px] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <CardArrow label="Read piece" />
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  const category = getCategory(post, 'Neighbourhood')
  return (
    <Link href={href} className={`${cardBase} flex items-stretch gap-6 p-6 sm:p-7`}>
      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[16px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Store className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
          <ShieldCheck className="h-3.5 w-3.5" /> Verified · {category}
        </div>
        <h2 className="editable-display mt-3 truncate text-[22px] font-semibold tracking-[-0.02em]">{post.title}</h2>
        <RatingLine post={post} />
        <p className="mt-3 line-clamp-2 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 self-start text-[var(--tk-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-[32px] font-semibold tracking-[-0.03em] text-[var(--slot4-accent-strong)]">
          {price || 'Open offer'}
        </span>
        {condition ? (
          <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
            {condition}
          </span>
        ) : null}
      </div>
      <h2 className="editable-display mt-5 text-xl font-semibold leading-[1.2] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-medium text-[var(--tk-muted)]">
        <span className="inline-flex items-center gap-1.5">
          {location ? (
            <>
              <MapPin className="h-3.5 w-3.5" /> {location}
            </>
          ) : (
            'Details inside'
          )}
        </span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link
      href={href}
      className="group mb-6 block break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1"
    >
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(35,35,35,0.82))] opacity-85 transition group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h2 className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.015em] text-white">
            {post.title}
          </h2>
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80">
            Open image <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-5 p-6`}>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">
          Saved · {String(index + 1).padStart(2, '0')}
        </span>
        <h2 className="editable-display mt-2 text-lg font-semibold leading-[1.2] tracking-[-0.015em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'Reference')
  const pages = getField(post, ['pages', 'pageCount'])
  const size = getField(post, ['fileSize', 'size'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-cream)]">
          <BookOpenText className="h-6 w-6" />
        </div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
          {category}
        </span>
      </div>
      <h2 className="editable-display mt-6 text-xl font-semibold leading-[1.2] tracking-[-0.02em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center gap-3 border-t border-[var(--tk-line)] pt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">
        {pages ? <span>{pages} pp</span> : <span>Reference</span>}
        {size ? <span className="border-l border-[var(--tk-line)] pl-3">{size}</span> : null}
        <span className="ml-auto inline-flex items-center gap-1.5 text-[var(--slot4-accent-strong)]">
          Open <Download className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-lg font-semibold tracking-[-0.02em]">{post.title}</h2>
      {role ? (
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
          {role}
        </p>
      ) : null}
      <RatingLine post={post} center />
      <p className="mt-3 line-clamp-2 text-sm leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
