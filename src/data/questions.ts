/**
 * The 6 parent-question answer pages. Each entry backs one card in the
 * home-page triage grid and one page at /questions/[slug]/.
 * Copy target: 5th–7th grade reading level, plain and kind.
 */

export interface QuestionPage {
  slug: string;
  cardTitle: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  ctaHeading: string;
  ctaBody: string;
}

export const questionPages: QuestionPage[] = [
  {
    slug: "think-my-child-might-have-asd",
    cardTitle: "I think my child might have ASD — what should I do?",
    h1: "I think my child might have autism. What should I do first?",
    metaTitle: "I think my child might have autism — first steps for parents",
    metaDescription:
      "A calm, step-by-step guide for Kansas and Colorado parents who suspect autism: what to watch for, who to call, and how to get an evaluation without waiting a year.",
    intro:
      "First, take a breath. Noticing something early is a good thing — it means your child can get help sooner. Here is a simple path forward, one step at a time.",
    sections: [
      {
        heading: "Trust what you're seeing",
        paragraphs: [
          "Parents are usually the first to notice. Maybe your child isn't using words yet, doesn't point at things they want, doesn't respond to their name, or lines up toys the same way every time. Maybe eye contact feels rare, or changes in routine cause big meltdowns.",
          "None of these signs means your child definitely has autism. But together, they are a reason to ask a professional — not a reason to wait and see.",
        ],
      },
      {
        heading: "Talk to your child's doctor",
        paragraphs: [
          "Start with your pediatrician or family doctor. Say exactly what you've noticed and when. Ask two things: “Can you screen my child for autism?” and “Can you refer us for a full evaluation?”",
          "Doctors use a short checklist (often called the M-CHAT) for toddlers. It takes a few minutes and it's free. If the screen raises concern, the next step is a full evaluation by a specialist.",
        ],
      },
      {
        heading: "Get on an evaluation list now, not later",
        paragraphs: [
          "Evaluation waitlists in Kansas and Colorado can run months long. Get on a list right away — you can always cancel if you change your mind. If one clinic's wait is long, ask to be on two or three lists at once. That's normal and allowed.",
        ],
        list: [
          "Ask your doctor for evaluation referrals in your area",
          "Call your insurance and ask which evaluators are in-network",
          "If your child is under 3, also call your state's early intervention program — it's free to be evaluated",
          "If your child is 3 or older, your public school district must evaluate for free too",
        ],
      },
      {
        heading: "You don't have to wait to do something",
        paragraphs: [
          "While you wait for an evaluation, you can talk to us. We'll explain what an autism diagnosis would and wouldn't change, what ABA therapy actually looks like day to day, and what your insurance would cover. There's no cost and no commitment to any of it.",
          "If your child does get a diagnosis, you'll already know your next step — and you'll skip weeks of figuring things out from scratch.",
        ],
      },
    ],
    ctaHeading: "Want a person to walk you through it?",
    ctaBody:
      "Our intake advocates talk to parents at this exact stage every day. Tell us what you're seeing and we'll map out your next two steps — no diagnosis required to call.",
  },
  {
    slug: "just-got-a-diagnosis",
    cardTitle: "We just got a diagnosis. What happens now?",
    h1: "We just got an autism diagnosis. What happens now?",
    metaTitle: "After an autism diagnosis — a parent's next steps in KS & CO",
    metaDescription:
      "Your child was just diagnosed with autism. Here's what to do in the first 30 days in Kansas or Colorado: insurance, therapy options, school, and support.",
    intro:
      "A diagnosis day is heavy, even when you expected it. Here's the honest truth: the diagnosis changed the paperwork, not your child. Your kid is the same kid they were yesterday — and now doors open.",
    sections: [
      {
        heading: "Give yourself a minute",
        paragraphs: [
          "You don't have to do everything this week. The first useful thing you can do is read the evaluation report once, note the recommendations page, and put the report somewhere you can find it — you'll be asked for it a lot.",
        ],
      },
      {
        heading: "The first 30 days, in order",
        paragraphs: [
          "Here's the sequence that saves families the most time:",
        ],
        list: [
          "Ask the diagnosing provider for a prescription or referral for ABA therapy — insurance will want it",
          "Call your insurance (or let us do it free) to confirm ABA benefits",
          "Pick an ABA provider and start intake — assessments and approvals take a few weeks, so starting now means starting therapy sooner",
          "If your child is under 3: connect with your state's early intervention program. If 3+: request a school evaluation in writing for an IEP",
        ],
      },
      {
        heading: "What ABA intake looks like",
        paragraphs: [
          "When you call us, an intake advocate collects the basics, verifies your insurance for free, and schedules a BCBA assessment. The BCBA meets your child, writes a treatment plan with you, and we submit it for approval. Then sessions start — in your home, in a center, or both.",
          "You approve everything before it's submitted. You are the expert on your child; we're the experts on the process.",
        ],
      },
      {
        heading: "One thing to skip",
        paragraphs: [
          "Skip the 2 a.m. internet spiral. There is a lot of scary, outdated, and just plain wrong content about autism online. Your child's team — the evaluator, your doctor, your BCBA — knows your actual child. Bring them your questions, even the hard ones.",
        ],
      },
    ],
    ctaHeading: "Start the process this week",
    ctaBody:
      "Send us your info and an intake advocate will call you back, verify your coverage for free, and get your child on the schedule for an assessment.",
  },
  {
    slug: "what-is-aba-therapy",
    cardTitle: "What actually happens in ABA therapy?",
    h1: "What actually happens in ABA therapy?",
    metaTitle: "What actually happens in ABA therapy? A plain-English guide",
    metaDescription:
      "What ABA therapy really looks like day to day: who's in the room, what a session includes, how goals are chosen, and what a parent's role is.",
    intro:
      "ABA stands for applied behavior analysis. Strip away the jargon and it's this: a structured, one-on-one way to teach your child skills that make daily life easier — communication, play, getting dressed, handling frustration — using lots of practice and lots of encouragement.",
    sections: [
      {
        heading: "Who is in the room",
        paragraphs: [
          "Your child works one-on-one with a behavior technician — a trained, background-checked professional who runs the day-to-day sessions. A Board Certified Behavior Analyst (BCBA) designs the plan, trains the technician, and checks progress in person, usually every week or two.",
          "You're part of the team too. Parent sessions are built into every plan, because skills that only work with the therapist aren't the goal — skills that work at grandma's house are.",
        ],
      },
      {
        heading: "What a session looks like",
        paragraphs: [
          "To a visitor, a good session mostly looks like playing. The technician follows your child's interests — cars, bubbles, a favorite song — and works learning into it. Practice a word, get the bubbles. Try a puzzle piece, get a high five and a silly cheer.",
          "Between the play, there's structure: each goal gets short, focused practice, and the technician records how it went. That data is how the BCBA knows what's working and what to change.",
        ],
      },
      {
        heading: "How goals get chosen",
        paragraphs: [
          "Goals come from an assessment plus one very important source: you. What would make your family's mornings easier? What does your child want to say and can't yet? A good plan mixes big skills (asking for help, using the bathroom) with the small ones that unlock them.",
          "You'll see every goal before the plan is submitted, and you can say no to any of them. Modern ABA is built around your child's happiness in the session — technicians are trained to make therapy something kids run toward, not away from.",
        ],
      },
      {
        heading: "How you'll know it's working",
        paragraphs: [
          "You should never have to wonder. Your BCBA reviews progress with you regularly, with real numbers — words used, skills mastered, meltdowns shrinking. If something isn't moving after honest effort, the plan changes. That's the “analysis” part of applied behavior analysis.",
        ],
      },
    ],
    ctaHeading: "See it for yourself",
    ctaBody:
      "The fastest way to understand ABA is to talk to someone who does it. Ask us anything — including the skeptical questions. We like those.",
  },
  {
    slug: "will-insurance-pay",
    cardTitle: "Will my insurance actually pay for this?",
    h1: "Will my insurance actually pay for ABA therapy?",
    metaTitle: "Does insurance pay for ABA therapy in Kansas & Colorado?",
    metaDescription:
      "How ABA gets paid for in Kansas and Colorado: why coverage varies by plan, what most families actually end up paying, and how to get your plan's real answer free.",
    intro:
      "Here's the honest answer: coverage varies by plan, so nobody can tell you from a website — but most Kansas and Colorado families end up paying little or nothing for ABA once their benefits are confirmed. Here's how to get your plan's real answer without weeks of hold music.",
    sections: [
      {
        heading: "Why we won't guess at your coverage",
        paragraphs: [
          "Every plan writes its own rules — Medicaid or private, big employer or marketplace. Two families on the same street can have completely different benefits. Any provider who promises coverage before checking your specific plan is guessing, and guessing is how families get surprise bills.",
          "So we don't guess. We check. The plan documents tell the truth, and reading them for families is our intake team's daily work.",
        ],
      },
      {
        heading: "Medicaid and private plans both welcome",
        paragraphs: [
          "We work with families on Medicaid and families with private insurance across both states, and the process is the same either way: we confirm your child's benefits first, then handle whatever approvals your plan requires before therapy starts.",
          "That approval paperwork is ours to prepare, submit, and chase — not yours.",
        ],
      },
      {
        heading: "What you might pay",
        paragraphs: [
          "Your share depends on your plan's deductible, copays, and out-of-pocket maximum — not on ABA specifically. Many families hit their out-of-pocket max early in the year and pay nothing after that. Medicaid families typically pay nothing at all.",
          "Before your child starts, we give you a plain-English summary of your specific benefits: what's covered, what you'd owe, and when. No surprises is a rule here, not a slogan.",
        ],
      },
      {
        heading: "The free way to find out for sure",
        paragraphs: [
          "Send us the front and back of your insurance card. Within about a business day, our team verifies your ABA benefits directly with your plan and calls you with the answer. It's free whether or not you ever work with us.",
        ],
      },
    ],
    ctaHeading: "Verify my coverage",
    ctaBody:
      "One photo of your insurance card. One business day. One clear answer about what ABA would cost your family.",
  },
  {
    slug: "home-or-center",
    cardTitle: "Should therapy happen at home or in a center?",
    h1: "Should my child's therapy happen at home or in a center?",
    metaTitle: "In-home vs. center-based ABA — which is right for your child?",
    metaDescription:
      "An honest comparison of in-home and center-based ABA therapy: what each is best at, how families choose, and why many kids do both.",
    intro:
      "There's no universally right answer — there's a right answer for your child, this year. Here's how the two settings actually differ, and how families usually decide.",
    sections: [
      {
        heading: "What in-home therapy is best at",
        paragraphs: [
          "Home is where real life happens, so home is where real-life skills stick fastest: mealtimes, getting dressed, brushing teeth, playing with a sibling, staying calm when the tablet turns off.",
          "In-home also removes barriers — no commute, easier for younger kids and packed family schedules, and parents can join sessions naturally because you're already there.",
        ],
      },
      {
        heading: "What center-based therapy is best at",
        paragraphs: [
          "A center brings things a living room can't: other kids to practice social skills with, purpose-built spaces with fewer distractions, more team members on hand, and a school-like structure that eases the transition to preschool or kindergarten.",
          "Research and clinical experience both suggest many children make faster progress on social and readiness goals in a center, simply because those goals need peers and structure to practice on.",
        ],
      },
      {
        heading: "Many families do both",
        paragraphs: [
          "A very common plan: center mornings for structure and peers, home afternoons for daily-living skills — or center weekdays with home-based parent sessions. The mix can change as your child grows. Nothing is locked in.",
        ],
        list: [
          "Choose home when daily-living skills, young age, or logistics lead",
          "Choose center when social goals, school readiness, or focus lead",
          "Choose both when the goals list says both — the mix can change as your child grows",
        ],
      },
      {
        heading: "How we'll help you decide",
        paragraphs: [
          "Your BCBA will recommend a setting based on your child's assessment and your goals — and will tell you the why, not just the what. You make the final call, and you can change it as your child changes.",
          "One honest note about Sunbird specifically: our in-center program is coming soon, while in-home, daycare-based, and telehealth services are running today. Many center-bound skills start beautifully at home — and we'll tell you the moment a center opens near you.",
        ],
      },
    ],
    ctaHeading: "Talk through your options",
    ctaBody:
      "Tell an intake advocate about your child and your week. We'll tell you honestly which setting we'd start with and why.",
  },
  {
    slug: "how-fast-can-we-start",
    cardTitle: "How fast can we actually start?",
    h1: "How fast can my child actually start therapy?",
    metaTitle: "How fast can my child start ABA therapy? The honest timeline",
    metaDescription:
      "The real timeline from first call to first ABA session: what each step takes, what can slow it down, and how to speed it up.",
    intro:
      "Here's the honest answer most providers won't put in writing: the timeline depends on insurance approval and staffing in your area — and on how fast the first phone call happens. Here's the whole sequence, step by step.",
    sections: [
      {
        heading: "The steps between “hello” and session one",
        paragraphs: ["Every family goes through the same five steps:"],
        list: [
          "First call — about 15 minutes. We collect basics and answer your questions.",
          "Benefits check — about a business day. We verify your ABA coverage free.",
          "BCBA assessment — scheduled within days, not weeks, whenever we can.",
          "Insurance authorization — the step we can't fully control. Plans take days to a few weeks to approve.",
          "First session — scheduled the moment approval lands.",
        ],
      },
      {
        heading: "What can slow it down",
        paragraphs: [
          "Three things cause most delays: a missing diagnosis report (get a copy from your evaluator now), a missing doctor's referral or prescription (ask at your next visit — or ask us what to request), and slow insurance review. We chase authorizations daily so they don't sit in a queue.",
        ],
      },
      {
        heading: "What you can do today to start sooner",
        paragraphs: [
          "Families who gather three documents early start weeks sooner: the diagnostic evaluation report, the doctor's ABA prescription or referral, and a photo of the insurance card. That's the whole packet. If you have all three, the clock is mostly insurance review time.",
        ],
      },
      {
        heading: "We'll give you a real date, not a vibe",
        paragraphs: [
          "Once we know your zip code, your insurance, and your child's schedule needs, we'll tell you our honest expected start window in your area — before you commit to anything. If another provider can genuinely start your child sooner, we'll tell you that too. Kids come first; market share second.",
        ],
      },
    ],
    ctaHeading: "Start the clock today",
    ctaBody:
      "The first step takes 15 minutes on the phone. Every week sooner that step happens is a week sooner therapy starts.",
  },
];

export function getQuestion(slug: string): QuestionPage | undefined {
  return questionPages.find((q) => q.slug === slug);
}
