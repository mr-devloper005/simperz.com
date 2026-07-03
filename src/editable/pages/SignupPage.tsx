import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/signup',
    title: 'Create an account',
    description: pagesContent.auth.signup.metadataDescription,
  })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid min-h-[calc(100vh-10rem)] max-w-[var(--editable-container)] items-center gap-16 px-6 py-20 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:px-10 lg:py-28">
          <div className="rounded-[28px] border border-[var(--editable-border)] bg-white p-8 shadow-[0_28px_60px_-30px_rgba(35,35,35,0.24)] sm:p-10">
            <h1 className="editable-display text-2xl font-semibold tracking-[-0.02em]">{pagesContent.auth.signup.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-8 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[var(--slot4-accent-strong)] underline-offset-4 hover:underline">
                {pagesContent.auth.signup.loginCta}
              </Link>
            </p>
          </div>
          <div className="max-w-lg">
            <p className={dc.badge.accentPill}>{pagesContent.auth.signup.badge}</p>
            <h2 className={`mt-7 ${dc.type.heroTitle}`}>{pagesContent.auth.signup.title}</h2>
            <p className={`mt-7 ${dc.type.body}`}>{pagesContent.auth.signup.description}</p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
