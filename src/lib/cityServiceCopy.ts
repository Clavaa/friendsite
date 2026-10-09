import type { FaqItem } from "../data/states";
import { siteConfig, type StateSlug } from "../../site.config";
import { autismEstimate, about, cityLocal, CDC_RATE, fmt, hashSeed, pctStr, pick, type CityLocal } from "./local";
import type { CopySection } from "./localCopy";
import { cityZips, zipLabel, type CityService } from "./metro";

/**
 * Copy for /{state}/{city}/{service} — e.g. "In-home ABA therapy in Denver".
 * These target the city+service searches that show real volume and
 * high ad value ("in home aba therapy colorado springs", "autism testing
 * kansas city"). Every page mixes the service's substance with that city's
 * own numbers and ZIP map, so no two read alike. Client rules hold: vague
 * coverage, no invented staff/offices/wait times, nobody named.
 */

interface Ctx {
  state: StateSlug;
  stateName: string;
  city: { name: string; slug: string };
  loc: CityLocal;
  seed: number;
}

function zipLinks(c: Ctx, n = 12): string {
  const zs = cityZips(c.state, c.city.slug)
    .sort((a, b) => (b[1].stats?.under18 ?? 0) - (a[1].stats?.under18 ?? 0))
    .slice(0, n);
  return zs
    .map(([z, r]) => {
      const l = zipLabel(r, 2);
      return `[${z}${l ? ` (${l})` : ""}](/${c.state}/${c.city.slug}/${z})`;
    })
    .join(", ");
}

function kidsLine(c: Ctx): string {
  const s = c.loc.stats;
  if (!s) return "";
  return `${c.city.name} is home to about ${fmt(s.under18)} children, ${about(s.under5)} of them under 5. At the CDC's 1-in-${CDC_RATE} estimate, roughly ${fmt(autismEstimate(s.under18))} ${c.city.name} kids may be on the autism spectrum.`;
}

/**
 * Where families in each team city get autism evaluations — named because
 * the pages that rank for "autism testing {city}" name them. Verified 10/8
 * from each organization's own site or a county resource list; no phone
 * numbers (they go stale). We are not affiliated with any of them.
 */
const KC_EVAL = [
  { name: "The University of Kansas Health System", url: "https://www.kansashealthsystem.com/", note: "in Kansas City, Kan. — the state's primary autism diagnostic center, with screening and full diagnostic evaluations" },
  { name: "Children's Mercy Kansas City", url: "https://www.childrensmercy.org/Autism", note: "developmental and behavioral health evaluations, just across the state line" },
];
const DENVER_EVAL = [
  { name: "Children's Hospital Colorado — Developmental Pediatrics", url: "https://www.childrenscolorado.org/doctors-and-departments/departments/neuroscience-institute/programs/developmental-pediatrics/", note: "on the Anschutz campus in Aurora, with diagnostic assessments run with JFK Partners at CU Anschutz" },
  { name: "JFK Partners (CU Anschutz)", url: "https://medschool.cuanschutz.edu/jfk-partners/clinical-services/assessment-and-treatment-services", note: "interdisciplinary autism and developmental assessments" },
];
const EVAL_RESOURCES: Record<string, { name: string; url: string; note: string }[]> = {
  "kansas-city": KC_EVAL,
  "overland-park": KC_EVAL,
  olathe: KC_EVAL,
  wichita: [
    { name: "Wichita State University's Autism Interdisciplinary Diagnostic Team", url: "https://wichita.edu/academics/health_professions/slhclinic/outreach.php", note: "through WSU's speech-language-hearing clinic" },
    ...KC_EVAL.slice(0, 1),
  ],
  topeka: [
    { name: "Family Service & Guidance Center", url: "https://www.fsgctopeka.com/autism-assessments-in-topeka/", note: "autism assessments in Topeka for children and teens up to 18" },
    ...KC_EVAL.slice(0, 1),
  ],
  denver: DENVER_EVAL,
  aurora: DENVER_EVAL,
  lakewood: DENVER_EVAL,
  "colorado-springs": DENVER_EVAL.slice(0, 1),
  "fort-collins": DENVER_EVAL.slice(0, 1),
};

function evalResources(c: Ctx): CopySection | null {
  const list = EVAL_RESOURCES[c.city.slug];
  if (!list) return null;
  return {
    id: "where-evaluated",
    heading: `Where ${c.city.name} families get autism evaluations`,
    paragraphs: [
      `Options ${c.city.name} families commonly use — ask your pediatrician which fits your child, and get on more than one list if waits are long:`,
    ],
    bullets: [
      ...list.map((r) => `[${r.name}](${r.url}) — ${r.note}.`),
      `**Developmental-behavioral pediatricians and licensed psychologists** in private practice — your pediatrician or insurance plan can point you to in-network diagnosticians.`,
      `**Your school district** (${c.loc.districts[0]?.name ?? "your local district"} in ${c.city.name}) — evaluates children 3 and older for special-education services.`,
      `We're not affiliated with these organizations, and details change — confirm hours, ages and insurance with them directly.`,
    ],
  };
}

function sectionsFor(svc: CityService, c: Ctx): CopySection[] {
  const s = c.loc.stats;
  const city = c.city.name;
  const nZips = cityZips(c.state, c.city.slug).length;
  const towns30 = c.loc.within30.slice(0, 10).map((t) => `[${t.name}](/${c.state}/${t.path})`).join(", ");
  const areaSection: CopySection = {
    id: "where",
    heading: `Where in ${city} we come to`,
    paragraphs: [
      `Our ${city} team serves every part of the city — ${nZips} ZIP codes, each with its own page of local numbers. The ones with the most children: ${zipLinks(c)}.`,
      ...(towns30
        ? [`And just outside the city: ${towns30}${c.loc.within30.length > 10 ? ", and more" : ""}. Same team, same service.`]
        : []),
    ],
  };

  if (svc.slug === "in-home-aba-therapy") {
    return [
      {
        id: "what",
        heading: `What in-home ABA therapy looks like in ${city}`,
        paragraphs: [
          pick(c.seed, 1, [
            `In-home ABA means your child's ABA therapist — a trained behavior technician working from a plan your BCBA wrote — comes to your ${city} home. Skills get taught where they're used: getting dressed in the bedroom, waiting at the kitchen table, handling the doorbell, playing with a sibling.`,
            `With in-home ABA, therapy happens in your ${city} living room instead of a clinic across town. Your child's ABA therapist works from goals your BCBA set for your child, using the routines, toys and people that are already part of the day.`,
          ]),
          `Your BCBA visits regularly to update the plan and coach you, and [parent training](/services/parent-training) is built in — because the hours between sessions matter as much as the sessions. Read more on our [in-home ABA page](/services/in-home-aba) or our guide to [how many hours of ABA](/resources/how-many-hours-of-aba) a child needs.`,
        ],
      },
      {
        id: "fit",
        heading: `Is in-home ABA the right fit for your ${city} family?`,
        paragraphs: [
          kidsLine(c),
          s && s.under6AllParentsWorkPct !== null
            ? `About ${pctStr(s.under6AllParentsWorkPct)} of ${city} children under 6 live in homes where every parent works. If daytime at home is hard for your family, sessions can also happen at [daycare in ${city}](/${c.state}/${c.city.slug}/daycare-aba) — many families mix both.`
            : `If daytime at home is hard for your family, sessions can also happen at [daycare in ${city}](/${c.state}/${c.city.slug}/daycare-aba) — many families mix both.`,
          `In-home ABA tends to suit younger children, kids who find new places overwhelming, and families who want to learn the strategies right alongside the therapist. Our guide to [home vs. daycare sessions](/resources/home-vs-daycare-sessions) walks through the trade-offs.`,
        ],
      },
      ...(schoolsSection(c) ? [schoolsSection(c)!] : []),
      firstMonth(svc, c),
      areaSection,
      payingSection(c),
    ];
  }

  if (svc.slug === "autism-evaluation") {
    return [
      {
        id: "first",
        heading: `Wondering about autism? Start here, ${city} parents`,
        paragraphs: [
          kidsLine(c) + ` Many of those children aren't diagnosed yet — and the first step is usually a parent noticing something.`,
          `Common early signs: not pointing or waving by about 12–18 months, not answering to their name, few words, losing words they had, little pretend play, or very strong reactions to change. Our plain-English checklists cover [signs at 18 months](/resources/signs-of-autism-at-18-months), [age 2](/resources/signs-of-autism-at-age-2) and [age 3](/resources/signs-of-autism-at-age-3), and the [M-CHAT screening](/resources/the-m-chat-screening) many pediatricians use.`,
        ],
      },
      {
        id: "how",
        heading: `How to get an autism evaluation in ${city}`,
        paragraphs: [],
        ordered: [
          `**Talk to your pediatrician.** Share what you're seeing and ask for a developmental screening and a referral for a diagnostic evaluation. Write down examples beforehand — specifics help.`,
          `**Know who diagnoses.** Autism is usually diagnosed by a developmental-behavioral pediatrician, a child psychologist, a pediatric neurologist or a multidisciplinary clinic team.`,
          `**Ask about your school district, too.** Public school districts evaluate children 3 and older for special-education services. In ${city}, that's ${c.loc.districts.slice(0, 2).map((d) => d.name).join(" or ") || "your local district"}. A school evaluation is not a medical diagnosis, but it can get support started.`,
          `**Call us while you wait.** We help ${city} families find an evaluation, check insurance benefits in the meantime, and line up ABA so therapy can start as soon as the diagnosis is in hand. [Start with our diagnosis guide →](/get-a-diagnosis)`,
        ],
      },
      ...(evalResources(c) ? [evalResources(c)!] : []),
      {
        id: "after",
        heading: "After the evaluation",
        paragraphs: [
          `If the evaluation confirms autism, the report usually recommends services — often including ABA. Our guide to [first steps after a diagnosis](/resources/first-steps-after-a-diagnosis) covers what to do in the first weeks, and [what the autism levels mean](/resources/what-does-level-2-autism-mean) explains the language you'll see in the report. If ABA is the next step, [in-home ABA in ${city}](/${c.state}/${c.city.slug}/in-home-aba-therapy) can begin once benefits are confirmed.`,
        ],
      },
      areaSection,
    ];
  }

  if (svc.slug === "daycare-aba") {
    return [
      {
        id: "what",
        heading: `How ABA at daycare works in ${city}`,
        paragraphs: [
          `With your written consent and your daycare's agreement, your child's ABA therapist joins them during the normal day — circle time, free play, snack, transitions. Your BCBA shares strategies with the teachers, so the same supports carry through even when we're not in the room.`,
          `Every ${city} daycare works a little differently, and sessions depend on the daycare agreeing to host them. Tell us where your child spends the day; we're happy to make the first call to the director ourselves. More on our [daycare-based support page](/services/daycare-based).`,
        ],
      },
      {
        id: "why",
        heading: `Why so many ${city} families ask about daycare sessions`,
        paragraphs: [
          s && s.under6AllParentsWorkPct !== null
            ? `In ${city}, about ${pctStr(s.under6AllParentsWorkPct)} of children under 6 live in homes where every parent works — about ${fmt(Math.round((s.under6 * s.under6AllParentsWorkPct) / 100))} young kids whose weekday hours are mostly daycare hours. For those families, therapy that happens where the child already is can be the difference between fitting ABA in and not.`
            : `For working parents, therapy that happens where the child already is can be the difference between fitting ABA in and not.`,
          `Daycare is also where many of the skills ABA builds actually get tested: joining a group, waiting a turn, handling a change in plans, asking for help. Many families pair daycare sessions with [in-home ABA](/${c.state}/${c.city.slug}/in-home-aba-therapy) for evenings and home routines.`,
        ],
      },
      ...(schoolsSection(c) ? [schoolsSection(c)!] : []),
      firstMonth(svc, c),
      areaSection,
      payingSection(c),
    ];
  }

  // parent-training
  return [
    {
      id: "what",
      heading: `What ABA parent training looks like in ${city}`,
      paragraphs: [
        `Parent training is regular coaching with your child's BCBA — not a class, not homework. You practice the same strategies the ABA therapist uses, on your real routines: mornings, mealtimes, bedtime, the grocery store.`,
        `It happens in person at your ${city} home, by video after the kids are asleep, or both. Grandparents, nannies and other caregivers are welcome to join. More on our [parent training page](/services/parent-training) and in [parent training, explained](/resources/parent-training-explained).`,
      ],
    },
    {
      id: "why",
      heading: `Why it matters for ${city} families`,
      paragraphs: [
        kidsLine(c),
        s && s.broadbandPct !== null
          ? `About ${pctStr(s.broadbandPct)} of ${city} households have broadband, so video coaching works for most families here — handy when a babysitter for an in-person session isn't realistic.`
          : `Video coaching makes parent training easy to fit in, even when a babysitter isn't realistic.`,
        `Sessions alone can't cover every hour of the week. When parents and caregivers use the same approach, skills show up at dinner time, not just during therapy.`,
      ],
    },
    firstMonth(svc, c),
    areaSection,
    payingSection(c),
  ];
}

function firstMonth(svc: CityService, c: Ctx): CopySection {
  const city = c.city.name;
  const setting =
    svc.slug === "daycare-aba" ? "at your child's daycare" : svc.slug === "parent-training" ? "at home or by video" : "at your home";
  return {
    id: "first-month",
    heading: `Your first month with Sunbird in ${city}`,
    paragraphs: [
      pick(c.seed, 40, [
        `No two families start exactly the same way, but here's the usual path for ${city} families — no phone trees, and a real person at every step.`,
        `Here's what typically happens between your first call and your first session in ${city}.`,
      ]),
    ],
    ordered: [
      `**The call and the benefit check.** Tell us your ZIP code and what you're seeing. Send a photo of your insurance card and we'll explain your ABA coverage in plain English.`,
      `**Diagnosis paperwork.** Have a diagnosis already? Send the report. Still waiting on one? We'll help you [find an evaluation in ${city}](/${c.state}/${c.city.slug}/autism-evaluation) and get everything else ready meanwhile.`,
      `**The BCBA assessment.** A BCBA from our ${city} team meets your child ${svc.slug === "daycare-aba" ? "at home and, with permission, at daycare" : "at home"}, talks with you about goals, and writes a plan with you — not for you.`,
      `**Sessions begin ${setting}.** ${svc.slug === "parent-training" ? "Coaching sessions start on your schedule, alongside your child's therapy." : "Your child's ABA therapist starts regular one-on-one sessions, and parent coaching is built in from day one."}`,
    ],
  };
}

function schoolsSection(c: Ctx): CopySection | null {
  const ds = c.loc.districts.slice(0, 4);
  if (!ds.length) return null;
  const list = ds.map((d) => `${d.name} (about ${fmt(Math.round(d.enrollment / 100) * 100)} students)`).join(", ");
  return {
    id: "schools",
    heading: `${c.city.name} schools and ABA`,
    paragraphs: [
      `Most ${c.city.name} public-school students attend ${list}. If your child has an IEP or a school evaluation, share it with your BCBA: when home goals and school goals line up, kids hear the same expectations in both places and progress tends to stick.`,
    ],
  };
}

function payingSection(c: Ctx): CopySection {
  const s = c.loc.stats;
  return {
    id: "paying",
    heading: `Paying for ABA in ${c.city.name}`,
    paragraphs: [
      (s && s.kidsPublicOnlyPct !== null
        ? `In ${c.city.name}, about ${pctStr(s.kidsPublicOnlyPct)} of children are covered only by Medicaid or another public plan; most of the rest have private insurance. `
        : "") +
        `Coverage depends on your plan, so we check yours for free: send a photo of your insurance card and we'll call back with a plain-English answer, usually within a business day. Most ${c.stateName} families pay little or nothing once benefits are confirmed. [More on paying for ABA](/resources/paying-for-aba).`,
    ],
  };
}

function faqsFor(svc: CityService, c: Ctx): FaqItem[] {
  const city = c.city.name;
  const base: FaqItem[] = [
    {
      q: `Do you have an ABA team in ${city}?`,
      a: `Yes — our ${city} team serves families across the city and nearby towns, with sessions at home or daycare and BCBA check-ins by video between visits.`,
    },
    {
      q: `Does insurance cover ${svc.label.charAt(0).toLowerCase() + svc.label.slice(1)} in ${city}?`,
      a: `It depends on your plan, so we check yours for free. Send a photo of your insurance card and we'll tell you what's covered and what you'd owe, usually within a business day.`,
    },
    {
      q: `How fast can we start in ${city}?`,
      a: `It depends on your child's plan and our current capacity in your part of ${city}, so we won't quote a number we can't keep. Tell us your ZIP code and schedule and an intake advocate will give you an honest timeline, usually on the first call.`,
    },
  ];
  const specific: Record<string, FaqItem[]> = {
    "in-home-aba-therapy": [
      { q: `Do I need to be home during in-home ABA sessions in ${city}?`, a: `In most cases an adult caregiver is home during sessions — your intake advocate will walk through the details. You don't have to sit in on every minute, but joining for coaching moments is a big part of why in-home ABA works.` },
      { q: `Which parts of ${city} do you come to?`, a: `All of them — every ${city} ZIP code, plus the surrounding towns. Give us your address when you call and we'll confirm your schedule.` },
    ],
    "autism-evaluation": [
      { q: `Do you do autism evaluations in ${city}?`, a: `We help you get one: we point you to diagnostic evaluation options, check your insurance benefits while you wait, and line up ABA so therapy can start once the diagnosis is in hand.` },
      { q: `Can my child start ABA without a diagnosis?`, a: `Most insurance plans need a diagnosis before ABA is covered. That's why we help ${city} families book the evaluation first — and get everything else ready in the meantime.` },
      { q: `At what age can a child be evaluated for autism?`, a: `Autism can often be diagnosed reliably by around age 2, and sometimes earlier. Screening with tools like the M-CHAT usually happens at the 18- and 24-month checkups, but it's never too late to ask.` },
    ],
    "daycare-aba": [
      { q: `Will my ${city} daycare allow ABA sessions?`, a: `Many do, but it's the daycare's decision. Sessions need your written consent and the daycare's agreement — we're happy to make the first call to the director.` },
      { q: `Can we do daycare and in-home sessions together?`, a: `Yes. Many families use daycare hours for group and transition skills, and home sessions for routines like bedtime and meals.` },
    ],
    "parent-training": [
      { q: `Can ABA parent training happen by video in ${city}?`, a: `Yes — sessions happen in person at your home, by video, or a mix. Many parents prefer video after the kids are asleep.` },
      { q: `Can grandparents or a nanny join parent training?`, a: `Absolutely. The more of your child's caregivers use the same approach, the better.` },
    ],
  };
  return [...base.slice(0, 1), ...(specific[svc.slug] ?? []), ...base.slice(1)];
}

export function buildCityService(state: StateSlug, city: { name: string; slug: string }, svc: CityService) {
  const loc = cityLocal(state, city.slug)!;
  const c: Ctx = {
    state,
    stateName: siteConfig.states[state].name,
    city,
    loc,
    seed: hashSeed(`${state}/${city.slug}/${svc.slug}`),
  };
  return { sections: sectionsFor(svc, c), faqs: faqsFor(svc, c) };
}
