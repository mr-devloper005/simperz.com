'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BookOpenText, Bookmark, Camera, CheckCircle2, FileText, Lock, PlusCircle, Send, Sparkles, Store, UserRound } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { taskDisplayLabel } from '@/editable/theme/task-themes'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Store,
  classified: PlusCircle,
  image: Camera,
  profile: UserRound,
  pdf: BookOpenText,
  sbm: Bookmark,
}

const fieldClass =
  'rounded-[12px] border border-[var(--editable-border)] bg-white px-4 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorised',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
          <section className={`${dc.shell.section} py-20 sm:py-28`}>
            <div className="grid gap-10 rounded-[28px] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.2)] md:grid-cols-[0.9fr_1.1fr] md:p-14">
              <div className="flex min-h-72 items-center justify-center rounded-[24px] bg-[var(--slot4-dark-bg)] text-[var(--slot4-cream)]">
                <Lock className="h-16 w-16 opacity-80" />
              </div>
              <div className="self-center">
                <p className={dc.badge.accentPill}>{pagesContent.create.locked.badge}</p>
                <h1 className={`mt-6 ${dc.type.heroTitle}`}>{pagesContent.create.locked.title}</h1>
                <p className={`mt-6 max-w-xl ${dc.type.body}`}>{pagesContent.create.locked.description}</p>
                <div className="mt-9 flex flex-wrap gap-4">
                  <Link href="/login" className={dc.button.accent}>
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className={dc.button.secondary}>
                    Create account
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className={`${dc.shell.section} py-16 sm:py-24`}>
          <div className="grid gap-10 rounded-[28px] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.2)] lg:grid-cols-[0.85fr_1.15fr] lg:p-14">
            <aside>
              <p className={dc.badge.accentPill}>{pagesContent.create.hero.badge}</p>
              <h1 className={`mt-6 ${dc.type.heroTitle}`}>{pagesContent.create.hero.title}</h1>
              <p className={`mt-6 max-w-xl ${dc.type.body}`}>{pagesContent.create.hero.description}</p>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-[16px] border p-5 text-left transition duration-300 ${
                        active
                          ? 'border-[var(--slot4-dark-bg)] bg-[var(--slot4-dark-bg)] text-[var(--slot4-cream)]'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-cream)] hover:-translate-y-0.5'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="editable-display mt-4 block text-[15px] font-semibold tracking-[-0.01em]">
                        {taskDisplayLabel(item.key)}
                      </span>
                      <span className="mt-1 block text-xs opacity-70">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-cream)] p-6 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className={dc.type.eyebrow}>Submitting to {taskDisplayLabel(activeTask?.key || 'article')}</p>
                  <h2 className={`mt-2 ${dc.type.subheading}`}>{pagesContent.create.formTitle}</h2>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--slot4-page-text)]">
                  <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[var(--slot4-accent-strong)]" />
                  {session.name}
                </span>
              </div>

              <div className="mt-7 grid gap-4">
                <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <input className={fieldClass} value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
                  <input className={fieldClass} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Website or source URL" />
                </div>
                <input className={fieldClass} value={image} onChange={(e) => setImage(e.target.value)} placeholder="Featured image URL" />
                <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Short summary" required />
                <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Full description, details, or notes" required />
              </div>

              {created ? (
                <div className="mt-6 rounded-[14px] border border-[var(--slot4-accent-strong)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-accent-strong)]">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-1.5 text-sm">{created.title}</p>
                </div>
              ) : null}

              <button type="submit" className={`mt-6 h-12 w-full justify-center ${dc.button.accent}`}>
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
