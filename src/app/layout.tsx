import type { Metadata } from 'next'
import '../styles/globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'JEN Remodeling Inc - Professional Home Remodeling Services',
  description: 'Quality home remodeling services. Expert craftsmanship for kitchens, bathrooms, basements, and living rooms. Trusted remodeling experts with years of experience.',
  keywords: 'home remodeling, kitchen remodeling, bathroom remodeling, basement remodeling, home renovation, remodeling contractor',
  authors: [{ name: 'JEN Remodeling Inc' }],
  openGraph: {
    title: 'JEN Remodeling Inc - Professional Home Remodeling',
    description: 'Transform your home with quality remodeling services',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: 'width=device-width, initial-scale=1',
}

const criticalCSS = `
:root{--paper:#f4f1ea;--ink:#1a1a1a;--ink-light:#333;--rule:#1a1a1a;--rule-light:#999}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Libre Baskerville',Georgia,'Times New Roman',serif;color:var(--ink);background-color:var(--paper);line-height:1.6;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4,h5,h6{font-family:'Libre Baskerville',Georgia,serif;font-weight:700;color:var(--ink);line-height:1.3}
h1{font-size:clamp(1.75rem,4vw,2.5rem)}h2{font-size:clamp(1.5rem,3vw,2rem)}h3{font-size:clamp(1.25rem,2.5vw,1.5rem)}
p{font-size:1rem;line-height:1.7;color:var(--ink-light)}
a{color:var(--ink);text-decoration:underline;text-underline-offset:2px}a:hover{text-decoration-thickness:2px}
section{padding:3rem 0}section:not(:last-child){border-bottom:1px solid var(--rule-light)}
.container{max-width:720px;margin:0 auto;padding:0 1.5rem}
main{min-height:calc(100vh - 140px);width:100%}
img{max-width:100%;height:auto;display:block}
.header{background-color:var(--paper);border-bottom:2px solid var(--ink);padding:0;position:sticky;top:0;z-index:1000}
.header-container{max-width:720px;margin:0 auto;padding:1rem 1.5rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.header h1{font-size:1.5rem;font-weight:700;margin:0}.header h1 a{color:var(--ink);text-decoration:none}.header h1 a:hover{text-decoration:underline}
.header nav ul{list-style:none;padding:0;margin:0;display:flex;gap:0 1.5rem;flex-wrap:wrap}
.header nav ul li a{font-size:0.9rem;text-decoration:none;color:var(--ink)}.header nav ul li a:hover,.header nav ul li a.active{text-decoration:underline;text-decoration-thickness:2px}
.footer{background-color:var(--paper);border-top:1px solid var(--rule);padding:2rem 1.5rem;text-align:center;margin-top:2rem}
.footer p{font-size:0.875rem;color:var(--ink-light);margin:0}.footer-container{max-width:720px;margin:0 auto}
.landing-page{min-height:100vh;background-color:var(--paper);width:100%}
.landing-hero{padding:3rem 0}.hero-headline{font-size:clamp(1.75rem,4vw,2.5rem);margin-bottom:1rem;line-height:1.2}
.hero-subtext{font-size:1rem;margin-bottom:1.5rem;line-height:1.7}.hero-links .sep{margin:0 .5rem;color:var(--rule-light)}
.section-label{font-size:.75rem;text-transform:uppercase;letter-spacing:.1em;color:var(--ink-light);margin-bottom:.5rem}
.section-title{font-size:clamp(1.5rem,3vw,2rem);margin-bottom:1.5rem}
.about-description{margin-bottom:1rem}.about-features{font-size:.9rem;color:var(--ink-light);margin-top:1.5rem}
.project-images{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin:1.5rem 0}
.project-image-wrapper{border:1px solid var(--rule)}.image-caption{display:block;padding:.5rem;font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;border-top:1px solid var(--rule);text-align:center}
.project-title{margin:1rem 0 .5rem}.project-description{margin-bottom:1rem}
.testimonial-text{font-style:italic;margin-bottom:1rem}.testimonial-author{font-size:.9rem;color:var(--ink-light)}
.cta-title{margin-bottom:.75rem}.cta-description{margin-bottom:1rem}.cta-links .sep{margin:0 .5rem;color:var(--rule-light)}
.cta-contact{font-size:.9rem;color:var(--ink-light);margin-top:1rem}
@media(max-width:640px){.header-container{flex-direction:column;align-items:flex-start}.project-images{grid-template-columns:1fr}}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
