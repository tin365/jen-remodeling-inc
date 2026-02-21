import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | JEN Remodeling Inc',
  description: 'Privacy policy for JEN Remodeling Inc. How we collect, use, and protect your information.',
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6">Privacy Policy</h1>
        <p className="text-sm text-ink-light mb-8">Last updated: [Add date]. JEN Remodeling Inc (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects your privacy.</p>

        <section className="prose prose-stone max-w-none space-y-6 text-ink-light">
          <h2 className="text-lg font-semibold text-ink">Information we collect</h2>
          <p>
            When you use our contact form or submit a review, we collect the information you provide (such as name, email, phone, and message). This information is used to respond to your inquiry, provide estimates, and improve our services.
          </p>

          <h2 className="text-lg font-semibold text-ink">How we use your information</h2>
          <p>
            We use your information to communicate with you, process requests, and send notifications related to your submission (e.g. confirmation that we received your message). We do not sell your personal information to third parties.
          </p>

          <h2 className="text-lg font-semibold text-ink">Data storage and security</h2>
          <p>
            Form and review data are stored securely using Supabase. We may use email services (e.g. Resend) to send notifications. We take reasonable steps to protect your information.
          </p>

          <h2 className="text-lg font-semibold text-ink">Your rights</h2>
          <p>
            You may contact us to request access to, correction of, or deletion of your personal information. Contact us at the email or address on our Contact page.
          </p>

          <h2 className="text-lg font-semibold text-ink">Cookies and tracking</h2>
          <p>
            We may use cookies or similar technologies for site functionality and error reporting (e.g. Sentry). See your browser settings to manage cookies.
          </p>

          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p>
            For privacy-related questions, contact JEN Remodeling Inc at the contact information on our website.
          </p>
        </section>

        <p className="mt-10 text-sm text-ink-light">
          <strong>Note:</strong> This is a template. Have your attorney review and customize your Privacy Policy before publishing.
        </p>

        <p className="mt-6">
          <Link href="/" className="text-ink underline hover:decoration-2">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
