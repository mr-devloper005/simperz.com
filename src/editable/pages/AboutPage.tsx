import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { ArrowUpRight, ShieldCheck, Printer, Sprout } from 'lucide-react'
import Link from 'next/link'

const valueIcons = [ShieldCheck, Printer, Sprout]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        {/* Hero */}
        <section className={`${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <EditableReveal>
              <p className={dc.badge.accentPill}>{pagesContent.about.badge}</p>
              <h1 className={`mt-7 ${dc.type.heroTitle}`}>{pagesContent.about.title}</h1>
            </EditableReveal>
            <EditableReveal index={1}>
              <p className={`max-w-xl ${dc.type.body}`}>{pagesContent.about.description}</p>
              <p className="mt-8 text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                Built by {SITE_CONFIG.name} · Verified daily
              </p>
            </EditableReveal>
          </div>
        </section>

        {/* Narrative */}
        <section className="bg-[var(--slot4-cream)]">
          <div className={`${dc.shell.section} py-20 sm:py-24 lg:py-28`}>
            <div className="grid gap-16 lg:grid-cols-2">
              {pagesContent.about.paragraphs.map((paragraph, i) => (
                <EditableReveal key={paragraph} index={i}>
                  <div className="border-t border-[var(--editable-border-strong)] pt-8">
                    <span className="editable-display text-4xl font-semibold leading-none text-[var(--slot4-accent-strong)]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className={`mt-6 ${dc.type.emphasis}`}>{paragraph}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className={`${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
          <EditableReveal>
            <p className={dc.type.eyebrow}>How we work</p>
            <h2 className={`mt-3 max-w-3xl ${dc.type.sectionTitle}`}>Three quiet promises the platform keeps.</h2>
          </EditableReveal>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pagesContent.about.values.map((value, i) => {
              const Icon = valueIcons[i] || ShieldCheck
              return (
                <EditableReveal key={value.title} index={i}>
                  <div className="group flex h-full flex-col gap-6 rounded-[24px] border border-[var(--editable-border)] bg-white p-8 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-accent-strong)]">
                    <span className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)] transition group-hover:bg-[var(--slot4-dark-bg)] group-hover:text-[var(--slot4-cream)]">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="editable-display text-2xl font-semibold leading-[1.2] tracking-[-0.02em]">
                      {value.title}
                    </h3>
                    <p className="text-[15px] leading-[1.7] text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                </EditableReveal>
              )
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 sm:pb-28">
          <div className={dc.shell.section}>
            <div className="grid gap-8 rounded-[32px] bg-[var(--slot4-dark-bg)] p-10 text-[var(--slot4-cream)] sm:p-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--slot4-accent-fill)]">
                  Ready to explore?
                </p>
                <h2 className="editable-display mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-[40px]">
                  Two shelves worth opening — the Directory and the Library.
                </h2>
              </div>
              <div className="flex flex-wrap gap-4 lg:justify-end">
                <Link href="/listings" className="inline-flex items-center gap-2 rounded-[12px] bg-[var(--slot4-accent-fill)] px-6 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition hover:bg-white">
                  Browse the Directory <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/pdf" className="inline-flex items-center gap-2 rounded-[12px] border border-white/25 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/60">
                  Open the Library
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
