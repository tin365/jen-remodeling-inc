import type { Metadata } from 'next'
import BrandLogo from '@/components/BrandLogo'

export const metadata: Metadata = {
  title: 'Brand Preview - JEN Remodeling Inc',
  description: 'Professional logo system and navbar preview for JEN Remodeling Inc.',
}

const menuItems = ['Home', 'Services', 'Projects', 'Reviews', 'Contact']

function LogoCard({
  title,
  detail,
  children,
  dark = false,
}: {
  title: string
  detail: string
  children: React.ReactNode
  dark?: boolean
}) {
  return (
    <div className={`border rounded-[28px] p-6 sm:p-8 ${dark ? 'bg-slate-900 border-slate-700' : 'bg-white border-stone-200'}`}>
      <p className={`text-xs uppercase tracking-[0.22em] mb-4 ${dark ? 'text-slate-300' : 'text-stone-500'}`}>
        {title}
      </p>
      <div className="min-h-[160px] flex items-center justify-center">
        {children}
      </div>
      <p className={`mt-5 text-sm leading-7 ${dark ? 'text-slate-300' : 'text-stone-600'}`}>
        {detail}
      </p>
    </div>
  )
}

export default function BrandPreviewPage() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-stone-900">
      <section className="border-b border-stone-300/80 bg-[radial-gradient(circle_at_top,_rgba(30,58,95,0.08),_transparent_42%),linear-gradient(180deg,#f7f2e9_0%,#f2ece1_100%)]">
        <div className="max-w-[1220px] mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-12 sm:pb-16">
          <div className="mb-10 sm:mb-14">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-3">Brand System</p>
            <h1 className="text-[clamp(2.3rem,5vw,4.4rem)] leading-[1.05] tracking-[-0.03em] text-[#1E3A5F] font-[Cormorant_Garamond] italic">
              Premium remodeling identity built for a real website header
            </h1>
            <p className="mt-5 max-w-[52rem] text-[1rem] sm:text-[1.06rem] leading-8 text-stone-600">
              The new direction keeps JEN as the hero, adds architectural cues without clip-art,
              and uses a compact horizontal structure so the brand reads clearly in navigation,
              hero sections, footer areas, favicon contexts, and dark backgrounds.
            </p>
          </div>

          <div className="rounded-[30px] border border-stone-300 bg-[#f7f2e9] shadow-[0_24px_70px_rgba(30,58,95,0.08)] overflow-hidden">
            <div className="px-5 sm:px-8 lg:px-10 py-5 sm:py-6 flex items-center justify-between gap-6 border-b-2 border-[#2D3138]">
              <BrandLogo variant="primary" className="w-[210px] h-[58px] sm:w-[260px] sm:h-[68px]" />
              <nav className="hidden md:block">
                <ul className="flex items-center gap-7 lg:gap-10 text-[0.98rem] text-stone-800">
                  {menuItems.map((item) => (
                    <li key={item} className={item === 'Home' ? 'underline decoration-2 underline-offset-4' : ''}>
                      {item}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="px-5 sm:px-8 lg:px-10 py-10 sm:py-14">
              <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-start">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-3">Primary Logo</p>
                  <BrandLogo variant="primary" className="w-[250px] h-[68px] sm:w-[360px] sm:h-[88px]" />
                  <p className="mt-5 max-w-[36rem] text-stone-600 leading-7">
                    Horizontal lockup optimized for 60px to 90px header usage. The serif italic
                    wordmark gives premium character while the uppercase subtitle keeps the
                    construction-remodeling category explicit and readable.
                  </p>
                </div>
                <div className="bg-white/70 border border-stone-200 rounded-[24px] p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-stone-500 mb-4">Navbar Guidance</p>
                  <ul className="space-y-3 text-sm leading-7 text-stone-700">
                    <li>Recommended desktop logo height: `64px`</li>
                    <li>Recommended mobile logo height: `54px`</li>
                    <li>Recommended space after logo before menu: `40px` to `56px`</li>
                    <li>Minimum clear space around logo: half the height of the icon block</li>
                    <li>Best header background: warm off-white or light beige</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="max-w-[1220px] mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid gap-6 lg:grid-cols-2">
            <LogoCard
              title="Primary Horizontal"
              detail="This is the production-ready navbar logo: compact, premium, and balanced for desktop and mobile headers."
            >
              <BrandLogo variant="primary" className="w-[280px] h-[72px] sm:w-[370px] sm:h-[90px]" />
            </LogoCard>

            <LogoCard
              title="Stacked Brand"
              detail="Use this version in hero sections, footer blocks, proposal covers, signage, or social profile layouts where more vertical presence is welcome."
            >
              <BrandLogo variant="stacked" className="w-[180px] h-[148px] sm:w-[210px] sm:h-[170px]" />
            </LogoCard>

            <LogoCard
              title="Icon / Favicon Mark"
              detail="A refined architectural monogram for favicon, avatar, social badge, hard-hat decal, truck icon, or app tile usage."
            >
              <BrandLogo variant="mark" className="w-[84px] h-[84px] sm:w-[96px] sm:h-[96px]" />
            </LogoCard>

            <LogoCard
              title="Monochrome"
              detail="For embossing, invoices, construction drawings, permits, uniforms, and single-color print applications."
            >
              <BrandLogo variant="primary" scheme="mono" className="w-[280px] h-[72px] sm:w-[370px] sm:h-[90px]" />
            </LogoCard>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] mt-6">
            <LogoCard
              title="Dark Background"
              detail="For yard signs, premium dark hero sections, social banners, and nighttime photography overlays."
              dark
            >
              <BrandLogo variant="primary" scheme="inverse" className="w-[280px] h-[72px] sm:w-[370px] sm:h-[90px]" />
            </LogoCard>

            <LogoCard
              title="Transparent Background Concept"
              detail="The logo itself is vector-based and background-free, so it can sit on white, beige, navy, photography, or printed materials without needing a boxed container."
            >
              <div className="w-full rounded-[22px] p-6 bg-[linear-gradient(45deg,#ece5d8_25%,transparent_25%),linear-gradient(-45deg,#ece5d8_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ece5d8_75%),linear-gradient(-45deg,transparent_75%,#ece5d8_75%)] bg-[length:28px_28px] bg-[position:0_0,0_14px,14px_-14px,-14px_0px]">
                <div className="bg-white/60 rounded-[18px] p-5 flex items-center justify-center">
                  <BrandLogo variant="primary" className="w-[250px] h-[66px] sm:w-[320px] sm:h-[80px]" />
                </div>
              </div>
            </LogoCard>
          </div>

          <div className="mt-10 rounded-[28px] border border-stone-200 bg-white px-6 sm:px-8 py-7">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500 mb-3">Implementation Ready</p>
            <p className="text-stone-700 leading-7 max-w-[58rem]">
              The live site header and footer now use this logo system directly as inline SVG, which
              means no tall PNG cropping issues, crisp rendering on high-density displays, and easy
              support for default, monochrome, and dark-background variants.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
