import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | JEN Remodeling Inc',
  description: 'Terms of use for the JEN Remodeling Inc website.',
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-content mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-6">Terms of Service</h1>
        <p className="text-sm text-ink-light mb-8">Last updated: [Add date]. By using this website, you agree to these terms.</p>

        <section className="prose prose-stone max-w-none space-y-6 text-ink-light">
          <h2 className="text-lg font-semibold text-ink">Use of website</h2>
          <p>
            This website is owned and operated by JEN Remodeling Inc. You may use it for lawful purposes only. You may not use the site to submit false information, spam, or harmful content.
          </p>

          <h2 className="text-lg font-semibold text-ink">Estimates and consultations</h2>
          <p>
            Free estimates or consultations offered through this site are subject to our availability and eligibility criteria. Any estimates provided online or by phone are approximate; a written estimate after an on-site visit (if applicable) may be required for formal pricing.
          </p>

          <h2 className="text-lg font-semibold text-ink">Reviews and content</h2>
          <p>
            Reviews and other content you submit must be accurate and not misleading. We reserve the right to remove content that violates these terms or is otherwise inappropriate.
          </p>

          <h2 className="text-lg font-semibold text-ink">Disclaimer</h2>
          <p>
            Information on this website is for general purposes only. It does not constitute a contract or guarantee of specific results. For project-specific terms, see your signed agreement with JEN Remodeling Inc.
          </p>

          <h2 className="text-lg font-semibold text-ink">Limitation of liability</h2>
          <p>
            To the extent permitted by law, JEN Remodeling Inc is not liable for any indirect, incidental, or consequential damages arising from your use of this website.
          </p>

          <h2 className="text-lg font-semibold text-ink">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-lg font-semibold text-ink">Contact</h2>
          <p>
            For questions about these terms, contact JEN Remodeling Inc using the contact information on our website.
          </p>
        </section>

        <p className="mt-10 text-sm text-ink-light">
          <strong>Note:</strong> This is a template. Have your attorney review and customize your Terms of Service before publishing.
        </p>

        <p className="mt-6">
          <Link href="/" className="text-ink underline hover:decoration-2">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
