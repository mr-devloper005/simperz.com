import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { formatRichHtml } from '@/components/shared/rich-content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { taskDisplayLabel } from '@/editable/theme/task-themes'
import { Ads, getSlotSizes } from '@/lib/ads'

export const revalidate = 3

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) =>
  post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images)
    ? (content.images.find((item) => typeof item === 'string') as string | undefined)
    : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) =>
  post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [
    post.title,
    post.summary,
    content.description,
    content.body,
    content.excerpt,
    content.category,
    Array.isArray(post.tags) ? post.tags.join(' ') : '',
  ].some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const displayLabel = task ? taskDisplayLabel(task) : 'Entry'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-[20px] border border-[var(--editable-border)] bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-24px_rgba(35,35,35,0.22)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <span className={`absolute left-5 top-5 ${dc.badge.accentPill}`}>{displayLabel}</span>
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {!image ? <span className={dc.badge.pill}>{displayLabel}</span> : null}
        <h2 className="editable-display mt-4 line-clamp-3 text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--slot4-page-text)]">
          {post.title}
        </h2>
        {summary ? (
          <div
            className="mt-3 line-clamp-3 flex-1 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]"
            dangerouslySetInnerHTML={{ __html: formatRichHtml(summary) }}
          />
        ) : null}
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--slot4-page-text)]">
          Open result{' '}
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(
    useMaster ? 1000 : 300,
    useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined,
  )
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
      ? []
      : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-16 sm:py-20 lg:py-28`}>
          <div className="grid gap-10 rounded-[28px] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.18)] md:grid-cols-[0.85fr_1.15fr] lg:p-12">
            <EditableReveal>
              <p className={dc.badge.accentPill}>{pagesContent.search.hero.badge}</p>
              <h1 className={`mt-6 ${dc.type.heroTitle}`}>{pagesContent.search.hero.title}</h1>
              <p className={`mt-6 max-w-xl ${dc.type.body}`}>{pagesContent.search.hero.description}</p>
            </EditableReveal>
            <EditableReveal index={1}>
              <form
                action="/search"
                className="self-end rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-5"
              >
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-[14px] border border-[var(--editable-border)] bg-white px-4 py-3.5">
                  <Search className="h-5 w-5 text-[var(--slot4-accent-strong)]" />
                  <input
                    name="q"
                    defaultValue={query}
                    placeholder={pagesContent.search.hero.placeholder}
                    className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                  />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 rounded-[14px] border border-[var(--editable-border)] bg-white px-4 py-3">
                    <Filter className="h-4 w-4 text-[var(--slot4-accent-strong)]" />
                    <input
                      name="category"
                      defaultValue={category}
                      placeholder="Category"
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-[var(--slot4-muted-text)]"
                    />
                  </label>
                  <select
                    name="task"
                    defaultValue={task}
                    className="rounded-[14px] border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold outline-none"
                  >
                    <option value="">Every shelf</option>
                    {enabledTasks.map((item) => (
                      <option key={item.key} value={item.key}>
                        {taskDisplayLabel(item.key)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className={`mt-3 h-12 w-full justify-center ${dc.button.accent}`}
                  type="submit"
                >
                  Look up
                </button>
              </form>
            </EditableReveal>
          </div>

          <EditableReveal>
            <div className="mt-14 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className={dc.type.eyebrow}>{results.length} results</p>
                <h2 className={`mt-3 ${dc.type.sectionTitle}`}>
                  {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
                </h2>
              </div>
              <Link href="/listings" className={dc.button.secondary}>
                Browse the Directory <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </EditableReveal>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <EditableReveal key={post.id || post.slug} index={index} step={50}>
                  <SearchResultCard post={post} index={index} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[24px] border border-dashed border-[var(--editable-border)] bg-white p-14 text-center">
              <p className="editable-display text-3xl font-semibold tracking-[-0.02em]">Nothing matched.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">
                Try another keyword, another shelf, or another category.
              </p>
            </div>
          )}

          <EditableReveal>
            <div className="mt-16">
              <Ads slot="footer" size={pickRandom(getSlotSizes('footer'))} showLabel className="mx-auto w-full" />
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
