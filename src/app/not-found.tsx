import Image from "next/image";
import Link from "next/link";
import StickyCallBar from "../components/StickyCallBar";
import { siteConfig } from "../../site.config";

/**
 * Converting 404: apologize briefly, then hand the visitor the three paths
 * they most likely wanted — with the phone number front and center, and
 * the plush Sunbird mascot keeping the dead end friendly.
 */
export default function NotFound() {
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-center lg:py-28">
        <div>
          <p className="text-sm font-bold tracking-wide text-brand-teal">
            Page not found
          </p>
          <h1 className="font-display mt-3 max-w-2xl text-4xl sm:text-5xl">
            That page moved — your next step didn&rsquo;t.
          </h1>
          <p className="prose-measure mt-4 text-lg text-ink-soft">
            The link you followed doesn&rsquo;t exist anymore. If you were
            looking for help for your child, any of these will get you there —
            or just call, and a person will point you right.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/getting-started"
              className="rounded-full bg-brand-teal px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
            >
              Match me with an advocate
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="rounded-full border border-ink/25 px-7 py-3.5 text-center text-[16px] font-bold transition-colors hover:border-ink"
            >
              Call {siteConfig.phone}
            </a>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
            {[
              { href: "/kansas", label: "ABA in Kansas" },
              { href: "/colorado", label: "ABA in Colorado" },
              { href: "/questions", label: "Parent questions, answered" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-2xl bg-white p-4 text-center text-[15px] font-bold text-brand-teal shadow-card transition-colors hover:text-brand-teal-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* The mascot, gently pointing you back */}
        <div className="relative mx-auto hidden aspect-[2/3] w-full max-w-[18rem] overflow-hidden rounded-3xl lg:block">
          <Image
            src="/brand/plush-side.jpg"
            alt="Sunbird's plush mascot, seen from the side"
            fill
            sizes="18rem"
            className="object-cover"
          />
        </div>
        </div>
      </section>
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
