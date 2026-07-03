import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, BookOpenText, CheckCircle2, Clock,
  Download, ExternalLink, FileDown, FileText, Globe2, Layers, Mail, MapPin, Phone,
  Printer, ShieldCheck, Star, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle, taskDisplayLabel } from '@/editable/theme/task-themes'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media)
    ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const images = Array.isArray(content.images)
    ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url))
    : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar']
    .map((key) => asText(content[key]))
    .filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) =>
  post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) =>
  asText(getContent(post).category) || post.tags?.[0] || fallback

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---- shared building blocks ---- */

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link
      href={taskConfig?.route || '/'}
      className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]"
    >
      <ArrowLeft className="h-4 w-4" /> Back to {taskDisplayLabel(task)}
    </Link>
  )
}

function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-60" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
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

function DetailMeta({ post, category, center = false }: { post: SitePost; category?: string; center?: boolean }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 ${center ? 'justify-center' : ''}`}>
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star
            key={i}
            className={`h-[18px] w-[18px] ${
              i < filled
                ? 'fill-[var(--tk-accent)] text-[var(--tk-accent)]'
                : 'fill-[var(--tk-line)] text-[var(--tk-line)]'
            }`}
          />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} recommendations</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function BodyContent({ post, compact = false, twoColumn = false }: { post: SitePost; compact?: boolean; twoColumn?: boolean }) {
  return (
    <div
      className={`article-content mt-10 max-w-none text-[var(--tk-text)] ${
        compact ? 'text-[15px] leading-[1.75]' : 'text-[17px] leading-[1.8]'
      } ${twoColumn ? 'lg:columns-2 lg:gap-10 [&_p]:break-inside-avoid' : ''}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function Divider() {
  return <div className="my-12 h-px bg-[var(--tk-line)]" />
}

/* ==================== Article (quiet editorial column) ==================== */

function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <BackLink task="article" />
        <EditableReveal index={0}>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.24em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">
            {categoryOf(post, 'Editorial')}
          </p>
        </EditableReveal>
        <EditableReveal index={1}>
          <h1 className={`mt-6 ${dc.type.heroTitle}`}>{post.title}</h1>
        </EditableReveal>
        <EditableReveal index={2}>
          <div className="mt-8 flex items-center gap-3 text-sm text-[var(--tk-muted)]">
            <span className="editable-display font-semibold text-[var(--tk-text)]">{SITE_CONFIG.name}</span>
            <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-60" />
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> A slow read
            </span>
          </div>
        </EditableReveal>
        {images[0] ? (
          <EditableReveal index={3}>
            <img
              src={images[0]}
              alt=""
              className="mt-12 aspect-[16/9] w-full rounded-[24px] border border-[var(--tk-line)] object-cover"
            />
          </EditableReveal>
        ) : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* ==================== Listing detail (premium directory record) ==================== */

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0]
  const gallery = images.slice(1, 7)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const hours = getField(post, ['hours', 'openingHours', 'schedule'])
  const category = categoryOf(post, 'Neighbourhood favourite')
  const mapSrc = mapSrcFor(post)
  const lead = leadText(post)

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 pt-14 pb-6 sm:px-8 lg:px-10">
        <BackLink task="listing" />
      </section>

      {/* Hero image band */}
      {heroImage ? (
        <section className="mx-auto max-w-[var(--editable-container)] px-6 sm:px-8 lg:px-10">
          <EditableReveal>
            <div className="relative aspect-[21/9] w-full overflow-hidden rounded-[28px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              <img src={heroImage} alt={post.title} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(35,35,35,0.55)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-8">
                <div>
                  <span className={dc.badge.accentPill}>
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified · {category}
                  </span>
                  <h1 className="editable-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-5xl lg:text-[64px]">
                    {post.title}
                  </h1>
                </div>
              </div>
            </div>
          </EditableReveal>
        </section>
      ) : null}

      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 lg:px-10 lg:py-20">
        <article className="min-w-0">
          {!heroImage ? (
            <EditableReveal>
              <Kicker task="listing">{category}</Kicker>
              <h1 className="editable-display mt-5 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
                {post.title}
              </h1>
            </EditableReveal>
          ) : null}

          <EditableReveal index={1}>
            <DetailMeta post={post} category={category} />
          </EditableReveal>

          {/* Quick facts strip */}
          <EditableReveal index={2}>
            <div className="mt-10 grid gap-4 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-4">
              <QuickFact icon={MapPin} label="Location" value={address || 'On request'} />
              <QuickFact icon={Phone} label="Phone" value={phone || 'By enquiry'} />
              <QuickFact icon={Clock} label="Hours" value={hours || 'Verified daily'} />
              <QuickFact icon={ShieldCheck} label="Trust" value="Hand-verified" />
            </div>
          </EditableReveal>

          {lead ? (
            <EditableReveal index={3}>
              <p className={`mt-10 max-w-3xl ${dc.type.emphasis}`}>{lead}</p>
            </EditableReveal>
          ) : null}

          <Divider />

          <EditableReveal>
            <h2 className={`${dc.type.subheading} editable-display`}>About this listing</h2>
            <BodyContent post={post} />
          </EditableReveal>

          {/* Tag chips */}
          {post.tags && post.tags.length ? (
            <EditableReveal>
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </EditableReveal>
          ) : null}

          {/* Photo gallery */}
          {gallery.length ? (
            <EditableReveal>
              <div className="mt-14">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Field photos</p>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {gallery.map((image, i) => (
                    <img
                      key={`${image}-${i}`}
                      src={image}
                      alt=""
                      className="aspect-[4/3] w-full rounded-[16px] border border-[var(--tk-line)] object-cover"
                    />
                  ))}
                </div>
              </div>
            </EditableReveal>
          ) : null}

          {/* Inline map */}
          {mapSrc ? (
            <EditableReveal>
              <div className="mt-14 overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center gap-2 border-b border-[var(--tk-line)] p-5 text-sm font-semibold">
                  <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {address || 'Location'}
                </div>
                <iframe src={mapSrc} title="Map" loading="lazy" className="h-[380px] w-full border-0" />
              </div>
            </EditableReveal>
          ) : null}
        </article>

        {/* Sticky sidebar */}
        <aside className="mt-14 space-y-6 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
          <EditableReveal>
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.24)]">
              <p className={dc.type.eyebrow}>Contact this place</p>
              <div className="mt-5 grid gap-3">
                {address ? <ContactRow icon={MapPin} label={address} href={mapSrc ? `https://maps.google.com/maps?q=${encodeURIComponent(address)}` : undefined} /> : null}
                {phone ? <ContactRow icon={Phone} label={phone} href={`tel:${phone}`} /> : null}
                {email ? <ContactRow icon={Mail} label={email} href={`mailto:${email}`} /> : null}
                {website ? <ContactRow icon={Globe2} label={website.replace(/^https?:\/\//, '')} href={website} external /> : null}
                {hours ? <ContactRow icon={Clock} label={hours} /> : null}
              </div>
              <Link
                href={website || `mailto:${email || 'hello@' + SITE_CONFIG.domain}`}
                target={website ? '_blank' : undefined}
                rel={website ? 'noreferrer' : undefined}
                className={`mt-6 w-full justify-center ${dc.button.primary}`}
              >
                {website ? 'Visit the website' : phone ? 'Call now' : 'Enquire'}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--slot4-cream)] p-7">
              <p className={dc.type.eyebrow}>Why we listed it</p>
              <ul className="mt-5 grid gap-3 text-sm text-[var(--tk-text)]">
                {[
                  'Verified hours and address',
                  'Owner or contact reachable',
                  'Recommended by a neighbour',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent-strong)]" />
                    <span className="leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </EditableReveal>

          <EditableReveal index={2}>
            <Ads slot="sidebar" size={pickRandom(getSlotSizes('sidebar'))} showLabel className="mx-auto w-full" />
          </EditableReveal>

          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </section>

      <RelatedStrip task="listing" related={related} />
    </>
  )
}

function QuickFact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
        <Icon className="h-3.5 w-3.5 text-[var(--slot4-accent-strong)]" /> {label}
      </p>
      <p className="mt-2 line-clamp-2 text-[15px] font-medium leading-[1.45] text-[var(--tk-text)]">{value}</p>
    </div>
  )
}

function ContactRow({ icon: Icon, label, href, external }: { icon: typeof MapPin; label: string; href?: string; external?: boolean }) {
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1 break-words text-[13px] font-medium leading-[1.45] text-[var(--tk-text)]">
        {label}
      </span>
    </>
  )
  const baseCls =
    'flex min-w-0 items-start gap-3 rounded-[12px] border border-transparent px-2.5 py-2.5 transition hover:border-[var(--tk-line)] hover:bg-[var(--slot4-cream)]'
  if (!href) return <div className={baseCls}>{inner}</div>
  return (
    <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={baseCls}>
      {inner}
    </a>
  )
}

/* ==================== Classified ==================== */

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-6 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-10">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <BackLink task="classified" />
          <EditableReveal className="mt-8">
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 shadow-[0_22px_60px_-28px_rgba(35,35,35,0.22)]">
              <Kicker task="classified">{categoryOf(post, 'Community post')}</Kicker>
              <h1 className="editable-display mt-4 text-2xl font-semibold leading-[1.15] tracking-[-0.02em]">{post.title}</h1>
              <DetailMeta post={post} />
              <p className="editable-display mt-6 text-[44px] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-accent-strong)]">
                {price || 'Open offer'}
              </p>
              <div className="mt-6 space-y-2.5">
                {condition ? <BadgeLine label="Condition" value={condition} /> : null}
                {location ? <BadgeLine label="Location" value={location} /> : null}
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {phone ? (
                  <a href={`tel:${phone}`} className={dc.button.primary}>
                    <Phone className="h-4 w-4" /> Call
                  </a>
                ) : null}
                {email ? (
                  <a href={`mailto:${email}`} className={dc.button.secondary}>
                    <Mail className="h-4 w-4" /> Email
                  </a>
                ) : null}
              </div>
            </div>
          </EditableReveal>
        </aside>
        <article className="min-w-0">
          <ImageStrip images={images} label="Photos" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* ==================== Image gallery ==================== */

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-10">
        <BackLink task="image" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="columns-1 gap-6 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure
                key={`${image}-${index}`}
                className="mb-6 break-inside-avoid overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)]"
              >
                <img src={image} alt="" className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Kicker task="image">Field gallery</Kicker>
            <h1 className="editable-display mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
            {leadText(post) ? <p className={`mt-6 ${dc.type.body}`}>{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ==================== Bookmark ==================== */

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <article className="mx-auto max-w-3xl px-6 py-14 sm:py-20">
        <BackLink task="sbm" />
        <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-[16px] bg-[var(--tk-accent-soft)] text-[var(--slot4-accent-strong)]">
          <Bookmark className="h-7 w-7" />
        </div>
        <div className="mt-6"><Kicker task="sbm">Saved link</Kicker></div>
        <h1 className="editable-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">{post.title}</h1>
        {leadText(post) ? <p className={`mt-6 ${dc.type.body}`}>{leadText(post)}</p> : null}
        {website ? (
          <Link href={website} target="_blank" rel="noreferrer" className={`mt-9 ${dc.button.primary}`}>
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ==================== Reference Library detail (workspace) ==================== */

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const pages = getField(post, ['pages', 'pageCount']) || '—'
  const size = getField(post, ['fileSize', 'size']) || '—'
  const uploadedBy = getField(post, ['uploadedBy', 'author', 'submittedBy']) || SITE_CONFIG.name
  const updated = getField(post, ['updated', 'updatedAt', 'date'])
  const category = categoryOf(post, 'Reference')
  const lead = leadText(post) || stripHtml(summaryText(post)).slice(0, 240)
  const sections = getField(post, ['sections', 'toc'])
    .split(/\n|,|;/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6)
  const inside = sections.length
    ? sections
    : ['Overview', 'Key concepts', 'Worked examples', 'Checklists & tables', 'References', 'Appendix']

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 pt-14 sm:px-8 lg:px-10">
        <BackLink task="pdf" />
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-12 sm:px-8 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12 lg:px-10 lg:py-20">
        <article className="min-w-0">
          {/* Mono/label chip row */}
          <EditableReveal>
            <div className="flex flex-wrap items-center gap-2">
              <span className={dc.badge.accentPill}>
                <BookOpenText className="h-3.5 w-3.5" /> Reference document
              </span>
              <span className={dc.badge.darkPill}>Downloadable</span>
              <span className={dc.badge.pill}>{category}</span>
            </div>
          </EditableReveal>

          {/* Very large H1 — typographic centrepiece */}
          <EditableReveal index={1}>
            <h1 className="editable-display mt-8 text-[44px] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[80px]">
              {post.title}
            </h1>
          </EditableReveal>

          {/* Lead as pull-quote */}
          {lead ? (
            <EditableReveal index={2}>
              <blockquote className="mt-10 border-l-4 border-[var(--slot4-accent-strong)] bg-[var(--slot4-cream)] py-6 pl-6 pr-8 text-[22px] font-medium leading-[1.5] tracking-[-0.01em] text-[var(--tk-text)] editable-display italic">
                {lead}
              </blockquote>
            </EditableReveal>
          ) : null}

          {/* Primary + secondary CTA */}
          <EditableReveal index={3}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              {fileUrl ? (
                <a href={fileUrl} download className={dc.button.primary}>
                  <FileDown className="h-4 w-4" /> Download file
                </a>
              ) : null}
              {fileUrl ? (
                <a href={fileUrl} target="_blank" rel="noreferrer" className={dc.button.secondary}>
                  Open in new tab <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </EditableReveal>

          {/* Quick facts strip */}
          <EditableReveal index={4}>
            <div className="mt-12 grid gap-4 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 sm:grid-cols-2 lg:grid-cols-4">
              <QuickFact icon={Layers} label="Pages" value={pages} />
              <QuickFact icon={FileText} label="File size" value={size} />
              <QuickFact icon={BookOpenText} label="Format" value="Portable" />
              <QuickFact icon={Clock} label="Updated" value={updated || 'Recent'} />
            </div>
          </EditableReveal>

          {/* Embedded preview */}
          {fileUrl ? (
            <EditableReveal>
              <div className="mt-14 overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-5">
                  <span className={dc.type.eyebrow}>Preview</span>
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-accent-strong)]">
                    Open fullscreen <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
                <iframe
                  src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title={post.title}
                  className="h-[82vh] w-full bg-[var(--tk-raised)]"
                />
              </div>
            </EditableReveal>
          ) : (
            <EditableReveal>
              <div className="mt-14 rounded-[24px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] p-14 text-center">
                <BookOpenText className="mx-auto h-8 w-8 text-[var(--tk-muted)]" />
                <p className="mt-4 text-sm text-[var(--tk-muted)]">This reference is being prepared for the library.</p>
              </div>
            </EditableReveal>
          )}

          {/* Two-column body */}
          <EditableReveal>
            <h2 className={`mt-16 ${dc.type.subheading} editable-display`}>What this reference covers</h2>
            <BodyContent post={post} twoColumn />
          </EditableReveal>

          {/* Tag chips */}
          {post.tags && post.tags.length ? (
            <EditableReveal>
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.slice(0, 8).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--tk-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </EditableReveal>
          ) : null}

          {/* Repeated CTA callout */}
          {fileUrl ? (
            <EditableReveal>
              <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[24px] bg-[var(--slot4-dark-bg)] p-8 text-[var(--slot4-cream)] sm:flex-row sm:items-center sm:p-10">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">Ready to save?</p>
                  <p className="editable-display mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
                    Take this reference offline — one tap, no signup.
                  </p>
                </div>
                <a href={fileUrl} download className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-white">
                  Download the file <Download className="h-4 w-4" />
                </a>
              </div>
            </EditableReveal>
          ) : null}

          {/* article-bottom ad */}
          <EditableReveal>
            <div className="mt-14">
              <Ads slot="article-bottom" size={pickRandom(getSlotSizes('article-bottom'))} showLabel className="mx-auto w-full" />
            </div>
          </EditableReveal>
        </article>

        {/* Sticky sidebar — document identity + What's inside */}
        <aside className="mt-14 space-y-6 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
          <EditableReveal>
            <div className="overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_28px_60px_-30px_rgba(35,35,35,0.24)]">
              <div className="flex aspect-[3/4] items-center justify-center bg-[linear-gradient(180deg,var(--slot4-cream)_0%,var(--slot4-warm)_100%)]">
                <div className="editable-display text-[120px] font-semibold leading-none tracking-[-0.06em] text-[var(--slot4-accent-strong)]">
                  {(post.title || 'R').slice(0, 1).toUpperCase()}
                </div>
              </div>
              <div className="p-6">
                <p className="editable-display line-clamp-2 text-lg font-semibold leading-[1.2] tracking-[-0.015em]">
                  {post.title}
                </p>
                <div className="mt-5 grid gap-2.5 border-t border-[var(--tk-line)] pt-5 text-sm text-[var(--tk-muted)]">
                  <MetaRow label="Category" value={category} />
                  <MetaRow label="Pages" value={pages} />
                  <MetaRow label="File size" value={size} />
                  <MetaRow label="Uploaded by" value={uploadedBy} />
                  {updated ? <MetaRow label="Updated" value={updated} /> : null}
                </div>
                {fileUrl ? (
                  <a href={fileUrl} download className={`mt-6 w-full justify-center ${dc.button.primary}`}>
                    <Download className="h-4 w-4" /> Download
                  </a>
                ) : null}
              </div>
            </div>
          </EditableReveal>

          <EditableReveal index={1}>
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--slot4-cream)] p-7">
              <p className={dc.type.eyebrow}>What&apos;s inside</p>
              <ul className="mt-5 grid gap-3 text-sm text-[var(--tk-text)]">
                {inside.map((item, i) => (
                  <li key={`${item}-${i}`} className="flex items-start gap-3">
                    <span className="editable-display mt-0.5 shrink-0 text-xs font-semibold text-[var(--slot4-accent-strong)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="leading-[1.55]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                <Printer className="h-3.5 w-3.5" /> Printer-friendly · No signup wall
              </div>
            </div>
          </EditableReveal>
        </aside>
      </section>

      {/* Related documents strip — document-glyph tiles, no hero photography */}
      <PdfRelatedStrip related={related} />
    </>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{label}</span>
      <span className="truncate text-sm font-medium text-[var(--tk-text)]">{value}</span>
    </div>
  )
}

function PdfRelatedStrip({ related }: { related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig('pdf')
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:py-20 lg:px-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className={dc.type.eyebrow}>More from the Reference Library</p>
            <h2 className={`mt-3 ${dc.type.subheading}`}>References that pair well with this one.</h2>
          </div>
          <Link href={taskConfig?.route || '/pdf'} className={dc.button.ghost}>
            Open the library <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => {
            const href = `${taskConfig?.route || '/pdf'}/${item.slug}`
            const size = getField(item, ['fileSize', 'size'])
            const glyph = (item.title || 'R').slice(0, 1).toUpperCase()
            return (
              <EditableReveal key={item.id || item.slug} index={i} step={70}>
                <Link
                  href={href}
                  className="group block overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent-strong)]"
                >
                  <div className="flex aspect-[4/3] items-center justify-center bg-[var(--slot4-cream)]">
                    <span className="editable-display text-[72px] font-semibold leading-none tracking-[-0.05em] text-[var(--slot4-accent-strong)]">
                      {glyph}
                    </span>
                  </div>
                  <div className="p-5">
                    <p className={dc.type.eyebrow}>Reference document</p>
                    <h3 className="editable-display mt-3 line-clamp-2 text-[17px] font-semibold leading-[1.25] tracking-[-0.015em] text-[var(--tk-text)]">
                      {item.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-cream)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent-strong)]">
                      {size || 'Reference'}
                    </span>
                  </div>
                </Link>
              </EditableReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ==================== Profile ==================== */

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-10">
        <BackLink task="profile" />
        <div className="mt-10 grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 text-center shadow-[0_28px_60px_-30px_rgba(35,35,35,0.24)]">
              <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
              </div>
              <h1 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{post.title}</h1>
              {role ? <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[color-mix(in_oklab,var(--tk-accent)_75%,black)]">{role}</p> : null}
              <DetailMeta post={post} center />
              <ContactAction website={website} email={email} bare />
            </div>
          </aside>
          <article className="min-w-0">
            <Kicker task="profile">Maker profile</Kicker>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Portfolio" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

/* ---- Small building blocks ---- */

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-5 grid gap-4 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img
            key={`${image}-${index}`}
            src={image}
            alt=""
            className="aspect-[4/3] rounded-[16px] border border-[var(--tk-line)] object-cover"
          />
        ))}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-3 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <Link href={website} target="_blank" rel="noreferrer" className={dc.button.primary}>
          Website <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      {phone ? (
        <a href={`tel:${phone}`} className={dc.button.secondary}>
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a href={`mailto:${email}`} className={dc.button.secondary}>
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="mt-10 rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className={dc.type.eyebrow}>Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[12px] border border-[var(--tk-line)] bg-[var(--tk-raised)] px-4 py-3 text-sm">
      <span className="font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post: _post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  const label = taskDisplayLabel(task)
  return (
    <div className="rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editable-display text-lg font-semibold tracking-[-0.02em]">More from the {label}</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent-strong)]">
          View all
        </Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.slice(0, 3).map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  const label = taskDisplayLabel(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--slot4-page-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:py-20 lg:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className={dc.type.eyebrow}>You might also like</p>
            <h2 className={`mt-3 ${dc.type.subheading}`}>More from the {label}</h2>
          </div>
          <Link href={taskConfig?.route || '/'} className={dc.button.ghost}>
            View all <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i} step={70}>
              <RelatedCard task={task} post={item} grid />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link
        href={href}
        className="group block overflow-hidden rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1"
      >
        <div className="aspect-[4/3] overflow-hidden bg-[var(--tk-raised)]">
          {image ? (
            <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-[17px] font-semibold leading-[1.2] tracking-[-0.015em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-[1.6] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[14px] border border-[var(--tk-line)] p-3 transition hover:border-[var(--slot4-accent-strong)]">
      {image && task !== 'sbm' && task !== 'pdf' ? (
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-[10px] object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[10px] bg-[var(--tk-raised)]">
          <FileText className="h-5 w-5 text-[var(--tk-muted)]" />
        </div>
      )}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-[1.3] tracking-[-0.01em]">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-[1.5] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
