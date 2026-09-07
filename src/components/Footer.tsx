import Link from "next/link";
import Logo from "./Logo";
import { siteConfig } from "../../site.config";

export default function Footer() {
  const year = new Date().getFullYear();
  const { kansas, colorado } = siteConfig.states;

  return (
    <footer className="bg-ink pb-24 text-white lg:pb-0">
      {/* Signature rainbow strip along the footer's top edge */}
      <div className="rainbow-strip" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo variant="reverse" />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-white/70">
              {siteConfig.descriptor}. One local team, two states, and a
              phone that gets answered.
            </p>
            <a
              href={siteConfig.phoneHref}
              className="mt-4 inline-block rounded-full bg-white px-5 py-2.5 text-[15px] font-bold text-brand-teal-deep transition-colors hover:bg-cream"
            >
              Call {siteConfig.phone}
            </a>
            <p className="mt-3 text-sm text-white/60">
              <a href={`mailto:${siteConfig.email}`} className="underline decoration-white/30 underline-offset-2 hover:text-white">
                {siteConfig.email}
              </a>
            </p>
          </div>

          <nav aria-label="Services">
            <p className="text-sm font-bold tracking-wide text-white/50">
              Services
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><Link className="text-white/80 hover:text-white" href="/services/in-home-aba">In-home ABA</Link></li>
              <li><Link className="text-white/80 hover:text-white" href="/services/center-based-aba">Center-based ABA</Link></li>
              <li><Link className="text-white/80 hover:text-white" href="/services/school-based-aba">School-based support</Link></li>
              <li><Link className="text-white/80 hover:text-white" href="/services/early-intervention">Early intervention</Link></li>
              <li><Link className="text-white/80 hover:text-white" href="/services/telehealth">Telehealth</Link></li>
            </ul>
          </nav>

          <nav aria-label="Kansas locations">
            <p className="text-sm font-bold tracking-wide text-white/50">
              Kansas
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><Link className="text-white/80 hover:text-white" href="/kansas">ABA in Kansas</Link></li>
              {kansas.cities.map((c) => (
                <li key={c.slug}>
                  <Link className="text-white/80 hover:text-white" href={`/kansas/${c.slug}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Colorado locations">
            <p className="text-sm font-bold tracking-wide text-white/50">
              Colorado
            </p>
            <ul className="mt-3 space-y-2 text-[15px]">
              <li><Link className="text-white/80 hover:text-white" href="/colorado">ABA in Colorado</Link></li>
              {colorado.cities.map((c) => (
                <li key={c.slug}>
                  <Link className="text-white/80 hover:text-white" href={`/colorado/${c.slug}`}>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="hover:text-white" href="/insurance">Insurance</Link>
            <Link className="hover:text-white" href="/get-a-diagnosis">Get a diagnosis</Link>
            <Link className="hover:text-white" href="/getting-started">Getting started</Link>
            <Link className="hover:text-white" href="/questions">Parent questions</Link>
            <Link className="hover:text-white" href="/careers">Careers</Link>
            <Link className="hover:text-white" href="/about">About</Link>
          </div>
        </div>
        <p className="mt-4 text-[13px] leading-relaxed text-white/40">
          Insurance and Medicaid details on this site are general information
          for families, not benefits advice for your specific plan. We verify
          every family&rsquo;s coverage individually before care begins.
        </p>
      </div>
    </footer>
  );
}
