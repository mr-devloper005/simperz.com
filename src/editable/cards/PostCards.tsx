import Link from 'next/link'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/* --------------------------- EditorialFeatureCard ---------------------------
   The hero of a grid — dark surface, tan eyebrow, large display title,
   soft-rounded corner, warm hover. Used for pinned/marquee posts. */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[520px] p-8 sm:p-10 lg:min-h-[600px]">
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:opacity-55 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,35,35,0.15)_0%,rgba(35,35,35,0.86)_82%)]" />
        <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end lg:min-h-[520px]">
          <span className="editable-eyebrow" style={{ color: 'var(--slot4-accent-fill)' }}>{label}</span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] text-white sm:text-5xl lg:text-[64px]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-[1.7] text-white/70 sm:text-base">
            {getEditableExcerpt(post, 190)}
          </p>
          <span className="mt-9 inline-flex w-fit items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition group-hover:bg-white group-hover:text-[var(--slot4-dark-bg)]">
            Read the story <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------ RailPostCard --------------------------------
   Portrait card used inside horizontal rails. Warm surface, hover lift. */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} ${dc.media.ratio}`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
        />
        <span className={`absolute left-4 top-4 ${dc.badge.darkPill}`}>
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={dc.type.eyebrow}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] ${pal.panelText}`}>
          {post.title}
        </h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-[1.65] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 130)}
        </p>
        <span className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold ${pal.accentSoftText}`}>
          Read more <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

/* --------------------------- CompactIndexCard -------------------------------
   Numbered index-style card. Small footprint, ordered discovery. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-5">
        <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-[14px] bg-[var(--slot4-accent-soft)] text-lg font-semibold text-[var(--slot4-accent-strong)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`flex items-center gap-2 ${dc.type.eyebrow}`}>
            <Clock3 className="h-3.5 w-3.5" /> {getEditableCategory(post)}
          </p>
          <h3 className={`editable-display mt-3 line-clamp-2 text-xl font-semibold leading-[1.2] tracking-[-0.02em] ${pal.panelText}`}>
            {post.title}
          </h3>
          <p className={`mt-2.5 line-clamp-2 text-sm leading-[1.6] ${pal.softMutedText}`}>
            {getEditableExcerpt(post, 105)}
          </p>
        </div>
      </div>
    </Link>
  )
}

/* --------------------------- ArticleListCard --------------------------------
   Wide split-media card — image left, copy right. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[240px_minmax(0,1fr)]`}
    >
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[210px]`}>
        <img
          src={getEditablePostImage(post)}
          alt={post.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className={dc.type.eyebrow}>Read {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-[1.1] tracking-[-0.02em] ${pal.panelText} sm:text-3xl`}>
          {post.title}
        </h2>
        <p className={`mt-4 line-clamp-3 text-[15px] leading-[1.7] ${pal.softMutedText}`}>
          {getEditableExcerpt(post, 190)}
        </p>
        <span className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${pal.panelText}`}>
          Open article <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
