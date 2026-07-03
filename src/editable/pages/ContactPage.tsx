'use client'

import { BookOpenText, MapPin, Store, Mail, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const lanes = [
  {
    icon: Store,
    title: 'Add a place to the Directory',
    body: 'Have a business, café, workshop or venue worth listing? Send the essentials and we verify from there.',
  },
  {
    icon: BookOpenText,
    title: 'Contribute to the Reference Library',
    body: 'Field guides, briefs, primers, checklists — anything printer-friendly you would rather not lose to a hard drive.',
  },
  {
    icon: MapPin,
    title: 'Suggest a neighbourhood',
    body: 'A street, block or hamlet we should be covering? Tell us — we can shape the directory around it.',
  },
  {
    icon: Sparkles,
    title: 'Everything else',
    body: 'Feedback, corrections, partnerships or a quiet hello — same warm inbox.',
  },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className={`${dc.shell.section} py-24 sm:py-28 lg:py-32`}>
          <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <EditableReveal>
                <p className={dc.badge.accentPill}>{pagesContent.contact.eyebrow}</p>
                <h1 className={`mt-7 ${dc.type.heroTitle}`}>{pagesContent.contact.title}</h1>
                <p className={`mt-7 max-w-xl ${dc.type.body}`}>{pagesContent.contact.description}</p>
              </EditableReveal>
              <div className="mt-12 grid gap-4">
                {lanes.map((lane, i) => (
                  <EditableReveal key={lane.title} index={i}>
                    <div className="group flex items-start gap-5 rounded-[18px] border border-[var(--editable-border)] bg-white p-6 transition duration-500 hover:-translate-y-0.5 hover:border-[var(--slot4-accent-strong)]">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-strong)] transition group-hover:bg-[var(--slot4-dark-bg)] group-hover:text-[var(--slot4-cream)]">
                        <lane.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h2 className="editable-display text-lg font-semibold leading-[1.25] tracking-[-0.015em]">
                          {lane.title}
                        </h2>
                        <p className="mt-2 text-[15px] leading-[1.65] text-[var(--slot4-muted-text)]">{lane.body}</p>
                      </div>
                    </div>
                  </EditableReveal>
                ))}
              </div>
            </div>

            <EditableReveal index={1}>
              <div className="rounded-[28px] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.24)] sm:p-10">
                <p className={dc.type.eyebrow}>
                  <Mail className="mr-1 inline h-3.5 w-3.5" /> Warm inbox
                </p>
                <h2 className="editable-display mt-3 text-3xl font-semibold leading-[1.15] tracking-[-0.02em]">
                  {pagesContent.contact.formTitle}
                </h2>
                <EditableContactLeadForm />
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
