import type { Metadata } from "next";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Careers — BCBA & RBT roles in Kansas & Colorado",
  description: `Behavior analyst and behavior technician careers with ${siteConfig.brandName} across Kansas and Colorado.`,
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <>
      <header className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="font-display max-w-2xl text-4xl sm:text-5xl">
            Do the version of this job you got certified for.
          </h1>
          <p className="prose-measure mt-4 text-lg text-ink-soft">
            Reasonable caseloads, real supervision hours, and clinical
            leadership that still sees clients. We hire BCBAs and behavior
            technicians across Kansas and Colorado.
          </p>
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-4 md:grid-cols-2 lg:max-w-4xl">
            {[
              {
                role: "Board Certified Behavior Analyst (BCBA)",
                blurb:
                  "Lead a caseload you can actually serve well, with admin support that keeps you in the clinical work.",
              },
              {
                role: "Behavior Technician (RBT)",
                blurb:
                  "Paid training toward certification, consistent supervision, and a team that treats this as a career, not a gig.",
              },
            ].map((job) => (
              <div key={job.role} className="rounded-3xl bg-sun-wash p-6 sm:p-8">
                <h2 className="font-display text-2xl">{job.role}</h2>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {job.blurb}
                </p>
                {/* TODO (required before launch): real openings with city,
                    schedule, and published pay range + JobPosting schema. */}
                <p className="mt-4 rounded-xl bg-white/70 px-3 py-2 text-[13px] font-semibold text-ink-soft">
                  Openings, cities, and pay ranges are posted here as roles
                  open. Production note: role details pending.
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-ink-soft">
            Interested before a posting goes up? Email{" "}
            <a href={`mailto:${siteConfig.email}`} className="font-bold text-brand-teal hover:underline">
              {siteConfig.email}
            </a>{" "}
            with &ldquo;Careers&rdquo; in the subject and tell us where you are
            and what you&rsquo;re looking for.
          </p>
        </div>
      </section>
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
