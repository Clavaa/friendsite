import Image from "next/image";
import Link from "next/link";
import { BirdSpot, Sparkles, SunSpot } from "./Accents";
import { siteConfig } from "../../site.config";

/**
 * Mega footer on the mint wash: brand-bird spot beside the link columns +
 * teal contact card, the brand tagline block, then the real Sunbird
 * lockup and the small print. Rainbow strip keeps its place on the top
 * edge.
 */
export default function Footer() {
  const year = new Date().getFullYear();
  const { kansas, colorado } = siteConfig.states;

  const columns: { heading: string; links: { href: string; label: string }[] }[] = [
    {
      heading: "Getting started",
      links: [
        { href: "/getting-started", label: "How intake works" },
        { href: "/get-a-diagnosis", label: "Does my child have autism?" },
        { href: "/insurance", label: "Free benefit check" },
        { href: "/questions", label: "Parent questions" },
      ],
    },
    {
      heading: "About Sunbird",
      links: [
        { href: "/about", label: "Who we are" },
        { href: "/services", label: "Our services" },
        { href: "/careers", label: "Careers" },
        { href: "/questions", label: "FAQ" },
      ],
    },
    {
      heading: "Services",
      links: [
        { href: "/services/in-home-aba", label: "In-home ABA" },
        { href: "/services/daycare-based", label: "Daycare-based support" },
        { href: "/services/parent-training", label: "Parent training" },
        { href: "/services/telehealth", label: "Telehealth" },
        { href: "/services/center-based-aba", label: "In-center ABA (soon)" },
      ],
    },
    {
      heading: "Kansas",
      links: [
        { href: "/kansas", label: "ABA in Kansas" },
        ...kansas.cities.map((c) => ({ href: `/kansas/${c.slug}`, label: c.name })),
      ],
    },
    {
      heading: "Colorado",
      links: [
        { href: "/colorado", label: "ABA in Colorado" },
        ...colorado.cities.map((c) => ({ href: `/colorado/${c.slug}`, label: c.name })),
      ],
    },
  ];

  return (
    <footer className="bg-mint-wash pb-24 text-ink lg:pb-0">
      {/* Signature rainbow strip along the footer's top edge */}
      <div className="rainbow-strip" aria-hidden="true" />
      <div className="mx-auto max-w-[87rem] px-4 pt-16 sm:px-6">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          {/* Brand bird spot + sticker chip */}
          <div className="relative hidden lg:block" aria-hidden="true">
            <div className="relative mt-4 w-fit">
              <span className="absolute -left-10 top-6 block h-36 w-36 rounded-full bg-sun/50" />
              <BirdSpot className="relative w-48" />
              <Sparkles className="absolute -right-10 -top-8 w-16" />
            </div>
            <span className="sticker mt-8 inline-block rounded-full bg-cream px-4 py-2 text-[13px] font-extrabold shadow-chip">
              Helping every child soar
            </span>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-7">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="font-display text-[1.2rem]">{col.heading}</p>
                <ul className="mt-5 space-y-3 text-[15px]">
                  {col.links.map((l) => (
                    <li key={`${col.heading}-${l.href}`}>
                      <Link className="link-grow text-ink-soft hover:text-brand-teal" href={l.href}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Contact card — spans two columns so the phone and email
                never squeeze or overflow the teal panel. */}
            <div className="rounded-3xl bg-brand-teal p-7 text-white sm:col-span-2 lg:col-span-2">
              <p className="font-display text-[1.2rem]">Talk to us</p>
              <a
                href={siteConfig.phoneHref}
                className="mt-4 flex items-center gap-2.5 text-[15px] font-bold hover:underline"
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="shrink-0">
                  <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
                </svg>
                {siteConfig.phone}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-2.5 flex items-center gap-2.5 text-[13px] text-white/85 hover:text-white"
              >
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="shrink-0">
                  <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
                  <path d="M2 4l6 5 6-5" />
                </svg>
                <span className="break-all">{siteConfig.email}</span>
              </a>
              <Link
                href="/getting-started"
                className="mt-5 inline-block text-[15px] font-extrabold underline decoration-2 underline-offset-4 hover:text-sun"
              >
                Get help
              </Link>
            </div>
          </div>
        </div>

        {/* Tagline block */}
        <div className="mt-16 flex flex-col gap-10 border-t border-ink/10 pt-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-[2rem] leading-tight text-brand-teal sm:text-[2.4rem]">
              {siteConfig.taglineLead}{" "}
              <span className="italic">{siteConfig.taglineFeel}</span>
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
              {siteConfig.descriptor}. One local team, two states, and a phone
              that gets answered by a person.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-[16px] font-extrabold">Ready when you are.</p>
            <a
              href={siteConfig.phoneHref}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-brand-teal text-brand-teal transition-colors hover:bg-brand-teal hover:text-white"
              aria-label={`Call ${siteConfig.phone}`}
            >
              <svg aria-hidden="true" width="17" height="17" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
              </svg>
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="grid h-12 w-12 place-items-center rounded-full border-2 border-brand-teal text-brand-teal transition-colors hover:bg-brand-teal hover:text-white"
              aria-label={`Email ${siteConfig.email}`}
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
                <path d="M2 4l6 5 6-5" />
              </svg>
            </a>
            <SunSpot className="hidden w-14 sm:block" />
          </div>
        </div>

        {/* The real Sunbird lockup, big and proud */}
        <div className="mt-14 flex justify-center">
          <Image
            src="/brand/sunbird-lockup@2x.png"
            alt={siteConfig.brandName}
            width={1280}
            height={423}
            className="h-auto w-full max-w-[27rem] sm:max-w-[34rem]"
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-ink/10 py-6 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="link-grow hover:text-brand-teal" href="/insurance">Insurance</Link>
            <Link className="link-grow hover:text-brand-teal" href="/get-a-diagnosis">Get a diagnosis</Link>
            <Link className="link-grow hover:text-brand-teal" href="/careers">Careers</Link>
            <Link className="link-grow hover:text-brand-teal" href="/about">About</Link>
          </div>
        </div>
        <p className="pb-8 text-[13px] leading-relaxed text-ink-soft/80">
          Coverage information on this site is general information for
          families, not benefits advice for your specific plan. We verify
          every family&rsquo;s coverage individually before care begins.
        </p>
      </div>
    </footer>
  );
}
