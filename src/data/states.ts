import type { StateSlug } from "../../site.config";

/**
 * State-level program content, sourced from research/aba_states_ALL.csv
 * (Kansas and Colorado rows) and rewritten at a parent-friendly reading
 * level. Facts flagged "(verify)" in the research file are either omitted
 * from display copy or rendered without the marker after being softened
 * to non-specific language. Sources retained below for the review team.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface StateContent {
  slug: StateSlug;
  name: string;
  abbr: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  medicaidProgramName: string;
  medicaidIntro: string[];
  medicaidPlans: string[];
  medicaidPlansNote: string;
  priorAuthHeading: string;
  priorAuthIntro: string;
  priorAuthSteps: { title: string; body: string }[];
  mandateHeading: string;
  mandateBody: string[];
  hoursHeading: string;
  hoursBody: string[];
  waiversHeading: string;
  waivers: { name: string; body: string }[];
  licensureNote: string;
  faqs: FaqItem[];
  sources: string[];
}

export const stateContent: Record<StateSlug, StateContent> = {
  kansas: {
    slug: "kansas",
    name: "Kansas",
    abbr: "KS",
    metaTitle: "ABA therapy in Kansas — KanCare, insurance & getting started",
    metaDescription:
      "How ABA therapy works for Kansas families: KanCare (Medicaid) coverage, prior authorization in plain English, the Kansas autism insurance mandate, and how to start.",
    heroHeadline: "ABA therapy in Kansas, explained like a neighbor would.",
    heroSub:
      "From Wichita to Overland Park, we walk Kansas families through coverage, paperwork, and first sessions — in plain English, with a real person on the phone.",
    medicaidProgramName: "KanCare (Kansas Medicaid)",
    medicaidIntro: [
      "If your child has KanCare — that's the name for Medicaid in Kansas — ABA therapy is a covered benefit for children with an autism diagnosis. Kansas added this coverage back in 2017, so the pathway is well established.",
      "KanCare doesn't run your child's care directly. Instead, you're enrolled with one of three health plans: Sunflower Health Plan, UnitedHealthcare Community Plan, or Healthy Blue. Your plan is the one that says yes to services, and we handle that conversation for you.",
      "The program is overseen by the Kansas Department of Health & Environment. You don't need to know how any of that works — that's our job. What matters for you: KanCare families can get ABA, and we know the process.",
    ],
    medicaidPlans: [
      "Sunflower Health Plan",
      "UnitedHealthcare Community Plan",
      "Healthy Blue",
    ],
    medicaidPlansNote:
      "These are the three KanCare managed-care plans. Not sure which one your child has? It's printed on their KanCare card — or send us a photo of the card and we'll figure it out.",
    priorAuthHeading: "Prior authorization, without the headache",
    priorAuthIntro:
      "“Prior authorization” just means your child's KanCare plan has to approve ABA before it starts. Every plan requires it. Here's the whole process — we do the heavy lifting at each step.",
    priorAuthSteps: [
      {
        title: "A doctor writes the prescription",
        body: "Your child's physician prescribes ABA therapy. If your child already has an autism diagnosis, this is usually a quick visit. No diagnosis yet? We'll point you to evaluation options first.",
      },
      {
        title: "We complete a BCBA assessment",
        body: "One of our Board Certified Behavior Analysts meets your child and builds a treatment plan — real goals, written for your kid, not a template.",
      },
      {
        title: "We submit everything to your KanCare plan",
        body: "The prescription, the diagnosis paperwork, and the BCBA-supervised treatment plan go to your plan for approval. We chase it so you don't have to.",
      },
      {
        title: "Approval comes back and sessions start",
        body: "Once the plan approves, we schedule your child's first sessions and set a review date so therapy never lapses while paperwork renews.",
      },
    ],
    mandateHeading: "Kansas law says insurance must cover ABA",
    mandateBody: [
      "In 2014, Kansas passed an autism insurance law (House Bill 2744). It requires state-regulated health plans to cover ABA therapy for children diagnosed with autism before age 12.",
      "The law was written with yearly hour caps — higher in the first four years after diagnosis, lower after that. In practice, federal mental-health parity rules can limit how strictly those caps are applied, so don't assume a cap ends the conversation. If your plan pushes back, ask us — benefit denials are often reversible.",
      "The same 2014 law also created licensing for behavior analysts in Kansas, which means the people leading your child's care are state-licensed professionals, not just certificate holders.",
    ],
    hoursHeading: "How many hours of therapy will my child get?",
    hoursBody: [
      "There's no single answer — hours are matched to your child's needs, not a menu. In Kansas Medicaid, plans typically start technician-delivered therapy around 25 hours per week, and more hours can be approved when your child's team shows they're medically necessary.",
      "Your BCBA will recommend a number based on your child's assessment, your family's schedule, and what the research supports for kids like yours. You'll always know the recommendation and the reason before anything is submitted.",
    ],
    waiversHeading: "Kansas waiver programs worth knowing about",
    waivers: [
      {
        name: "HCBS Autism Waiver (ages 0–5)",
        body: "A small program for young children that funds parent support and respite care. It does not pay for ABA itself, but it can support your family alongside therapy — and time on its list can open other doors.",
      },
      {
        name: "I/DD Waiver",
        body: "The intellectual/developmental disability waiver funds long-term supports. Waitlists are real, so families are usually advised to apply early even if services feel far off.",
      },
      {
        name: "SED Waiver",
        body: "For children with serious emotional disturbance. Some autistic children qualify here when behavioral-health needs are the driving concern.",
      },
    ],
    licensureNote:
      "Behavior analysts in Kansas are licensed by the Behavioral Sciences Regulatory Board. Every treatment plan we run is supervised by a Licensed Behavior Analyst.",
    faqs: [
      {
        q: "Does KanCare (Kansas Medicaid) cover ABA therapy?",
        a: "Yes. ABA has been a covered KanCare benefit for children with an autism diagnosis since January 2017. Coverage runs through your child's KanCare health plan — Sunflower, UnitedHealthcare Community Plan, or Healthy Blue — and requires prior authorization, which we handle for you.",
      },
      {
        q: "What do I need before ABA can start in Kansas?",
        a: "Three things: an autism diagnosis, a prescription for ABA from your child's doctor, and an approved treatment plan written by a BCBA. If you're missing any of the three, call us — helping families get from “not sure” to “started” is most of what our intake team does.",
      },
      {
        q: "Does private insurance in Kansas cover ABA?",
        a: "Kansas has had an autism insurance law since 2014, so most state-regulated plans cover ABA for children diagnosed before age 12. Employer self-funded plans follow their own rules, but many cover ABA too. The fastest way to know is to let us verify your specific plan — it's free and takes about a day.",
      },
      {
        q: "How many hours per week is typical?",
        a: "It depends on your child's assessment. Kansas Medicaid plans commonly begin around 25 hours per week of technician-delivered therapy, with more available when medically necessary. Your BCBA recommends hours based on your child, and you approve the plan before it's submitted.",
      },
      {
        q: "Is there a waitlist for ABA in Kansas?",
        a: "Waitlists vary by provider and city. Tell us your zip code and schedule and we'll give you an honest answer about start timing in your area before you commit to anything.",
      },
      {
        q: "My child is on the Kansas Autism Waiver waitlist. Can we still do ABA?",
        a: "Yes. The Autism Waiver funds parent support and respite — not ABA — so it doesn't block or replace therapy. ABA itself is covered through KanCare or private insurance regardless of waiver status.",
      },
    ],
    sources: [
      "https://www.kslegislature.gov/li_2014/b2013_14/measures/documents/summary_hb_2744_2014.pdf",
      "https://portal.kmap-state-ks.us/PublicPage/ProviderPricing/FeeSchedules",
      "https://www.sunflowerhealthplan.com/newsroom/kmap-19029.html",
    ],
  },

  colorado: {
    slug: "colorado",
    name: "Colorado",
    abbr: "CO",
    metaTitle: "ABA therapy in Colorado — Health First Colorado & insurance",
    metaDescription:
      "How ABA therapy works for Colorado families: the Health First Colorado Pediatric Behavioral Therapies benefit, prior authorization step by step, the state insurance mandate, and waivers.",
    heroHeadline: "ABA therapy in Colorado, from a team that lives here.",
    heroSub:
      "From Denver to Colorado Springs, we help Colorado families turn a diagnosis into a plan — coverage checked, paperwork filed, sessions on the calendar.",
    medicaidProgramName: "Health First Colorado (Colorado Medicaid)",
    medicaidIntro: [
      "If your child has Health First Colorado — Colorado's Medicaid program — ABA is covered through something called the Pediatric Behavioral Therapies (PBT) benefit. It's available to members age 20 and under, under the federal rule that says Medicaid must cover medically necessary care for kids.",
      "Colorado reviews each child's plan individually. A state review partner called Acentra looks at the request your provider submits and approves therapy for up to six months at a time. Your Regional Accountable Entity (RAE) — the organization that coordinates your child's Medicaid care — helps connect the pieces.",
      "That's a lot of acronyms, and you don't need to remember any of them. The short version: Health First Colorado covers ABA for kids, approvals are individualized rather than capped, and we prepare and submit the whole request for you.",
    ],
    medicaidPlans: ["Health First Colorado (Pediatric Behavioral Therapies benefit)"],
    medicaidPlansNote:
      "Colorado runs ABA as a fee-for-service benefit reviewed by the state's partner, with your Regional Accountable Entity coordinating care. One program, one pathway — and we know it well.",
    priorAuthHeading: "Prior authorization, one step at a time",
    priorAuthIntro:
      "Every ABA request in Colorado Medicaid needs a prior authorization request — a “PAR” — approved before therapy starts. Here's what actually happens, and who does the work (mostly: us).",
    priorAuthSteps: [
      {
        title: "We assess your child",
        body: "A BCBA meets your child and completes a standardized assessment of everyday skills — the kind of measure the state expects to see — plus a plan of care written for your child specifically.",
      },
      {
        title: "We gather the referral",
        body: "Colorado wants a referral for services in the packet. If your child's doctor hasn't written one yet, we'll tell you exactly what to ask for at the visit.",
      },
      {
        title: "We submit the PAR to the state's reviewer",
        body: "The assessment, referral, and plan of care go to Acentra through the state portal. This is the step families dread doing alone — it's routine for us.",
      },
      {
        title: "Approval covers up to six months",
        body: "Once approved, sessions start and the authorization runs for up to six months. We calendar the renewal early so therapy doesn't pause while the next approval processes.",
      },
    ],
    mandateHeading: "Colorado law says insurance must cover ABA — with no caps",
    mandateBody: [
      "Colorado passed its autism insurance law in 2009 (Senate Bill 09-244), requiring state-regulated health plans to cover ABA therapy for children with autism.",
      "Then Colorado went further: in 2017 the state removed every age cap and dollar cap from the mandate. If your child's plan is state-regulated, coverage can't be cut off just because your child had a birthday or therapy passed a spending line.",
      "Employer self-funded plans set their own rules, but many mirror the state standard. If you're not sure which kind of plan you have, that's exactly what our free benefits check answers.",
    ],
    hoursHeading: "How many hours of therapy will my child get?",
    hoursBody: [
      "Colorado doesn't use a hard cap — hours are approved child-by-child through the PAR. Authorizations commonly land anywhere from around 10 to 40 hours per week depending on the child's needs and the plan of care.",
      "Your BCBA recommends hours based on your child's assessment and your family's real schedule, and you'll see and approve the plan before it goes to the state.",
    ],
    waiversHeading: "Colorado waiver programs worth knowing about",
    waivers: [
      {
        name: "Children's Extensive Support (CES) waiver",
        body: "For children with significant support needs, CES funds services beyond what regular Medicaid covers — things like respite and home modifications that make daily life workable alongside therapy.",
      },
      {
        name: "Children with Complex Health Needs (CwCHN) waiver",
        body: "Formerly known as CHCBS, this waiver supports children with complex medical needs at home. Some autistic children qualify when medical complexity is part of the picture.",
      },
    ],
    licensureNote:
      "Colorado created a Behavior Analyst Licensing Board in 2026, and individual behavior analyst licensure is being phased in statewide. Our clinical leads are Board Certified Behavior Analysts.",
    faqs: [
      {
        q: "Does Health First Colorado (Medicaid) cover ABA therapy?",
        a: "Yes. ABA is covered for members age 20 and under through the Pediatric Behavioral Therapies benefit. Every request needs a prior authorization reviewed by the state's partner, and approvals are individualized rather than capped. We prepare and submit the full request for you.",
      },
      {
        q: "What paperwork does Colorado Medicaid require before ABA starts?",
        a: "Three pieces: a standardized assessment of your child's everyday skills, a referral for services, and a plan of care written by the treating provider. Our team completes the assessment and plan and tells you exactly what to request from your child's doctor.",
      },
      {
        q: "Does private insurance in Colorado cover ABA?",
        a: "Colorado's autism insurance mandate dates to 2009, and since 2017 it has had no age or dollar caps for state-regulated plans. Self-funded employer plans vary. Send us your insurance card and we'll verify your exact benefits, free.",
      },
      {
        q: "How long does a Colorado ABA authorization last?",
        a: "Approvals are valid for up to six months. We track every renewal date and submit the next request early, so your child's therapy doesn't stop while paperwork is in review.",
      },
      {
        q: "How many hours a week will Colorado approve?",
        a: "There's no fixed cap — hours are set child-by-child through the prior authorization. Authorizations commonly range from roughly 10 to 40 hours per week depending on the plan of care your BCBA writes with you.",
      },
      {
        q: "What is a RAE and do I need to call mine?",
        a: "A Regional Accountable Entity coordinates care for Health First Colorado members in your region. You usually don't need to call them about ABA — your provider works the process. If your RAE ever does need something, we'll tell you exactly what to say.",
      },
    ],
    sources: [
      "https://hcpf.colorado.gov/pediatric-behavioral-therapies-information-providers",
      "https://hcpf.colorado.gov/childrens-extensive-support-waiver-ces",
      "https://www.autismspeaks.org/colorado-state-regulated-insurance-coverage",
    ],
  },
};
