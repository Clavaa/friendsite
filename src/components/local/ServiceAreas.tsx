import Link from "next/link";
import Faq, { faqJsonLd } from "../Faq";
import JsonLd from "../JsonLd";
import { siteConfig, stateSlugs } from "../../../site.config";
import { getCounty } from "../../data/counties";
import type { FaqItem } from "../../data/states";
import type { Service } from "../../data/services";
import { cityLocal, fmt, pctStr, stateRates, stateTotals } from "../../lib/local";

/**
 * "Where we offer this" block for /services/[slug]: real statewide figures
 * relevant to the service (working parents for daycare-based, broadband for
 * telehealth, young children for in-home/parent training), every team city
 * with the counties it covers, and service-specific FAQs with schema.
 * Coverage language stays vague per the client rule.
 */

function dataLine(s: Service): string {
  const parts = stateSlugs.map((st) => {
    const name = siteConfig.states[st].name;
    const r = stateRates(st);
    const t = stateTotals(st);
    if (s.slug === "daycare-based" && r.under6AllParentsWorkPct !== null)
      return `about ${pctStr(r.under6AllParentsWorkPct)} of ${name} children under 6 live in homes where every parent works`;
    if (s.slug === "telehealth" && r.broadbandPct !== null)
      return `about ${pctStr(r.broadbandPct)} of ${name} households have broadband`;
    return `${name} is home to about ${fmt(t.under5)} children under 5 and ${fmt(t.under18)} under 18`;
  });
  const lead =
    s.slug === "daycare-based"
      ? "Why daycare-based support matters here: "
      : s.slug === "telehealth"
        ? "Why telehealth works here: "
        : "Who we're here for: ";
  return `${lead}${parts.join("; ")} (Census ACS 2023 estimates).`;
}

const SERVICE_FAQS: Record<string, FaqItem[]> = {
  "in-home-aba": [
    { q: "Do I have to be home during in-home ABA sessions?", a: "In most cases an adult caregiver is home during sessions — your intake advocate will walk through the details for your family. You don't have to sit in on every minute, but being nearby and joining for coaching moments is a big part of why in-home ABA works." },
    { q: "How far will your ABA therapists travel for in-home sessions?", a: "We serve families across Kansas and Colorado. In and near our team cities, in-home visits are routine; farther out, we plan visits in blocks and add telehealth between them. Tell us your ZIP code and we'll give you an honest answer for your address." },
    { q: "What does an in-home ABA session look like?", a: "Your child's ABA therapist works on goals your BCBA wrote — often woven into everyday routines like meals, dressing, play and transitions — and records progress so the BCBA can adjust the plan." },
    { q: "Is in-home ABA covered by insurance?", a: "It depends on your plan, so we check yours for free. Send a photo of your insurance card and we'll verify your ABA benefits and explain them in plain English, usually within a business day." },
  ],
  "daycare-based": [
    { q: "Can my child get ABA therapy at daycare?", a: "Yes — with the daycare's agreement, your child's ABA therapist can work alongside the daycare routine, focusing on skills like joining group activities, transitions and communicating needs." },
    { q: "Do you need the daycare's permission?", a: "Yes — sessions need your written consent and the daycare's agreement to host them. Tell us where your child spends the day; we're happy to make the first call to the director ourselves." },
    { q: "Can we mix daycare and in-home sessions?", a: "Many families do — daycare hours for group and transition skills, home sessions for routines that live at home, like bedtime and mealtimes." },
    { q: "Is daycare-based ABA covered by insurance?", a: "Coverage depends on your plan, so we verify your benefits for free before anything starts and explain what's covered in plain English." },
  ],
  "parent-training": [
    { q: "What is ABA parent training?", a: "Regular coaching sessions with your child's BCBA, so you can use the same strategies the ABA therapist uses — at dinner, at bedtime, at the store. It's offered in person and by video." },
    { q: "Do I have to do parent training?", a: "It's a core part of how we work, because skills stick when they're practiced outside sessions too. We schedule it around your life, and video sessions make it easier for busy families." },
    { q: "Can both parents or other caregivers join?", a: "Yes — grandparents, nannies and other caregivers are welcome. The more of your child's world that uses the same approach, the better." },
    { q: "Is parent training covered by insurance?", a: "Often, but it depends on the plan. Our free benefit check covers it along with the rest of your child's ABA plan." },
  ],
  "center-based-aba": [
    { q: "Do you have an ABA center open now?", a: "Not yet — in-center ABA is coming soon. Today we provide in-home ABA, daycare-based support, parent training and telehealth across Kansas and Colorado." },
    { q: "Can we start with in-home ABA and move to a center later?", a: "Yes. Starting at home now is common, and we'll talk with you about the right setting as your child's needs change." },
    { q: "How do I hear when in-center ABA opens?", a: "Call or send the short form and mention you're interested in center-based care — your intake advocate will note it." },
  ],
  telehealth: [
    { q: "Does telehealth replace in-person ABA?", a: "No. We use telehealth for BCBA check-ins and parent coaching alongside in-person sessions — it adds support between visits rather than replacing them." },
    { q: "What do we need for a telehealth session?", a: "A phone, tablet or computer with a camera and a reasonably steady internet connection. If your connection is unreliable, tell us and we'll plan around it." },
    { q: "Is telehealth useful if we live far from your team?", a: "Especially then. For families far from our team cities, telehealth keeps BCBA time and parent coaching on a regular schedule between in-home visits." },
    { q: "Is telehealth ABA covered by insurance?", a: "Many plans cover it, but it depends on yours — so we check for free before anything starts." },
  ],
};

export default function ServiceAreas({ service }: { service: Service }) {
  const faqs = SERVICE_FAQS[service.slug] ?? [];
  return (
    <>
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            Where we offer {service.nameLower}
          </h2>
          <p className="mt-3 max-w-3xl text-ink-soft">
            {service.comingSoon
              ? `${service.name} is coming soon. Until then, families in every Kansas and Colorado county can start with in-home ABA, daycare-based support, parent training and telehealth.`
              : `We offer ${service.nameLower} to families in every Kansas and Colorado county, coordinated by the team nearest you. Pick your team city or county for local numbers, schools, ZIP codes and nearby towns.`}
          </p>
          <p className="mt-3 max-w-3xl text-[15px] text-ink-soft">{dataLine(service)}</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {stateSlugs.map((st) => {
              const cfg = siteConfig.states[st];
              return (
                <div key={st} className="rounded-3xl bg-white p-6 shadow-card">
                  <Link href={`/${st}`} className="font-display text-2xl text-brand-teal hover:underline">
                    {service.cardTitle} in {cfg.name} →
                  </Link>
                  <ul className="mt-4 space-y-3">
                    {cfg.cities.map((c) => {
                      const cl = cityLocal(st, c.slug);
                      const counties = (cl?.countiesServed ?? [])
                        .map((s) => getCounty(st, s))
                        .filter((x): x is NonNullable<typeof x> => Boolean(x))
                        .slice(0, 6);
                      return (
                        <li key={c.slug} className="text-[15px] leading-relaxed">
                          <Link href={`/${st}/${c.slug}`} className="font-bold hover:text-brand-teal hover:underline">
                            {c.name}
                          </Link>
                          {counties.length > 0 && (
                            <span className="text-ink-soft">
                              {" — "}
                              {counties.map((k, i) => (
                                <span key={k.slug}>
                                  {i > 0 && ", "}
                                  <Link href={`/${st}/${k.slug}`} className="hover:text-brand-teal hover:underline">
                                    {k.full}
                                  </Link>
                                </span>
                              ))}
                              {(cl?.countiesServed.length ?? 0) > counties.length && " and more"}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {faqs.length > 0 && (
        <>
          <JsonLd data={faqJsonLd(faqs)} />
          <Faq items={faqs} heading={`${service.name}: questions parents ask`} />
        </>
      )}
    </>
  );
}
