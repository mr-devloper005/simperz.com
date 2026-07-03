'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, LogOut, ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const staticLinks = [
  { label: 'Discover', href: '/listing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const shell = `sticky top-0 z-50 transition-all duration-500 ${
    scrolled
      ? 'bg-[color-mix(in_oklab,var(--slot4-page-bg)_92%,white)]/95 backdrop-blur-md border-b border-[var(--editable-border)]'
      : 'bg-[var(--editable-nav-bg)] backdrop-blur-sm border-b border-transparent'
  }`

  return (
    <header className={shell}>
      <nav className="mx-auto flex min-h-[80px] w-full max-w-[var(--editable-container)] items-center gap-6 px-6 sm:px-8 lg:px-10">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--slot4-dark-bg)] transition group-hover:bg-[var(--slot4-accent-strong)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden min-w-0 md:block">
            <span className="editable-display block max-w-[220px] truncate text-[19px] font-semibold leading-none tracking-[-0.01em]">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1.5 block max-w-[220px] truncate text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="mx-auto hidden items-center gap-1 lg:flex">
          {staticLinks.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  active
                    ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]'
                    : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-cream)]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)]"
          >
            <Search className="h-[18px] w-[18px]" />
          </Link>
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-[10px] bg-[var(--slot4-accent-fill)] px-4 py-2.5 text-[13px] font-semibold text-[var(--slot4-on-accent)] transition hover:bg-[var(--slot4-accent-strong)] hover:text-white sm:inline-flex"
              >
                <PlusCircle className="h-4 w-4" /> Submit
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden items-center gap-1.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-1.5 rounded-[10px] px-3 py-2.5 text-[13px] font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-[10px] bg-[var(--slot4-dark-bg)] px-4 py-2.5 text-[13px] font-semibold text-[var(--slot4-cream)] transition hover:bg-[var(--slot4-accent-strong)] sm:inline-flex"
              >
                <UserPlus className="h-4 w-4" /> Get started
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-6 lg:hidden">
          <div className="grid gap-1.5">
            {[{ label: 'Home', href: '/' }, ...staticLinks, ...(session
              ? [{ label: 'Submit', href: '/create' }]
              : [{ label: 'Sign in', href: '/login' }, { label: 'Get started', href: '/signup' }])].map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-[12px] px-4 py-3.5 text-sm font-semibold transition ${
                    active
                      ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)]'
                      : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-cream)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center gap-2 rounded-[12px] border border-[var(--editable-border)] px-4 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)]"
            >
              <Search className="h-4 w-4" /> Search everything
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => { logout(); setOpen(false) }}
                className="mt-1 rounded-[12px] px-4 py-3.5 text-left text-sm font-semibold text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-cream)]"
              >
                Logout
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
