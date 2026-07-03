'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, MapPin, Send } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const description =
    globalContent.footer?.description ||
    SITE_CONFIG.description ||
    'A directory and reference library for local businesses and downloadable guides.'

  return (
    <footer className="mt-24 bg-[var(--slot4-dark-bg)] text-[var(--slot4-cream)]">
      {/* Top CTA strip */}
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-6 pt-20 pb-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 rounded-[28px] bg-[color-mix(in_oklab,var(--slot4-dark-bg)_55%,black)] p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:p-14">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--slot4-accent-fill)]">
              Join {SITE_CONFIG.name}
            </p>
            <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-[42px]">
              List your business, share a resource, or download the next guide.
            </h2>
            <p className="mt-4 max-w-xl text-[15px] leading-[1.65] text-white/70">
              A single warm home for verified places and useful reference material —
              no clutter, no chase.
            </p>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" action="/contact">
            <label className="flex flex-1 items-center gap-2 rounded-[12px] border border-white/15 bg-white/5 px-4 py-3.5 backdrop-blur">
              <Mail className="h-4 w-4 text-[var(--slot4-accent-fill)]" />
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-white hover:text-[var(--slot4-dark-bg)]"
            >
              Get updates <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main columns */}
      <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-12 px-6 pb-16 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--slot4-accent-fill)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
            </span>
            <span className="editable-display text-xl font-semibold tracking-[-0.01em] text-white">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="mt-6 max-w-md text-[14px] leading-[1.7] text-white/60">{description}</p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            <MapPin className="h-3.5 w-3.5 text-[var(--slot4-accent-fill)]" />
            {globalContent.site?.domain || SITE_CONFIG.baseUrl}
          </div>
        </div>

        <FooterColumn title="Discover">
          <FooterLink href="/listing?sort=top">Top Rated</FooterLink>
        </FooterColumn>

        <FooterColumn title="Resources">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/search">Search everything</FooterLink>
        </FooterColumn>

        <FooterColumn title="Account">
          {session ? (
            <>
              <FooterLink href="/create">Submit an entry</FooterLink>
              <button
                type="button"
                onClick={logout}
                className="text-left text-[14px] font-medium text-white/60 transition hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <FooterLink href="/login">Sign in</FooterLink>
              <FooterLink href="/signup">Create account</FooterLink>
              <FooterLink href="/create">Submit an entry</FooterLink>
            </>
          )}
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center gap-4 px-6 py-6 text-center text-[12px] font-medium text-white/45 sm:flex-row sm:justify-between sm:text-left sm:px-8 lg:px-10">
          <p>© {year} {SITE_CONFIG.name}. Every entry curated, every guide verified.</p>
          <p className="tracking-[0.12em] uppercase">
            {globalContent.footer?.bottomNote || 'Warm, useful, findable.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">{children}</div>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-white/60 transition hover:text-white"
    >
      {children}
      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
    </Link>
  )
}
