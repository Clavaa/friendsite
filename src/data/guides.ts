/**
 * Parent guides — the /resources library.
 *
 * These are evergreen help articles for parents, NOT a blog: no dates,
 * no bylines, no news. Written to a 5th–7th grade reading level, warm
 * and plain. The "start here" guides form an ordered path for a parent
 * who is brand new to all of this (modeled on the best parent-education
 * hubs in the field); the rest answer everyday practical questions.
 *
 * Content rules (same as everywhere on this site):
 * - Only promise timelines we control: the 15-minute call and the
 *   free benefit check (usually within a business day).
 * - Insurance/Medicaid content stays general. Never claim in-network
 *   status for any payer — the free benefit check is always the answer.
 * - No invented statistics, reviews, or outcomes claims.
 */

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface GlossaryTerm {
  term: string;
  def: string;
}

export interface Guide {
  slug: string;
  /** Guides with startHere form the numbered "new here" path, in order. */
  startHere?: boolean;
  cardTitle: string;
  cardBlurb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  minutes: number;
  sections: GuideSection[];
  /** Glossary guide only. */
  terms?: GlossaryTerm[];
}

export const guides: Guide[] = [
  // ————————————————————————— Start-here path —————————————————————————
  {
    slug: "what-is-aba",
    startHere: true,
    cardTitle: "What is ABA therapy?",
    cardBlurb:
      "The plain-words version: what ABA is, what a session looks like, and what it should feel like for your child.",
    metaTitle: "What is ABA therapy? A plain-words guide for parents",
    metaDescription:
      "ABA therapy explained in plain words for parents in Kansas and Colorado: what it is, what a session really looks like, who's on the team, and what good ABA should feel like.",
    h1: "What is ABA therapy? The plain-words version.",
    intro:
      "ABA stands for Applied Behavior Analysis. That's a mouthful, so here's the short version: ABA is one-on-one teaching, built around your child, that helps them learn the skills that make daily life easier — talking, playing, dressing, waiting, asking for help. This guide walks through what it is and what it looks like, without the jargon.",
    minutes: 6,
    sections: [
      {
        heading: "The idea behind it",
        paragraphs: [
          "Every child learns. ABA starts from a simple question: what helps this child learn best? A trained therapist watches closely, finds what motivates your child, and uses it to teach new skills one small step at a time.",
          "When your child tries something hard — saying a word, pointing to what they want, putting on a shoe — they get warm, immediate encouragement. Small wins get celebrated, so your child wants to try again. Over weeks and months, small wins stack into big ones.",
        ],
      },
      {
        heading: "What a session actually looks like",
        paragraphs: [
          "From the outside, a good session mostly looks like play. A therapist sits on the floor with your child, follows their interests — blocks, bubbles, a favorite song — and folds teaching into the fun.",
          "Underneath the play, there's a plan. Every goal your child works on was chosen ahead of time and written down, and the therapist tracks how it's going in every single session. That's what makes ABA different from just playing: the play has a purpose, and the progress gets measured.",
        ],
      },
      {
        heading: "What kinds of skills can it teach?",
        paragraphs: [
          "The plan is built around what your child and your family need most. Common goals include:",
        ],
        list: [
          "Communication — using words, pictures, or gestures to ask for things instead of melting down",
          "Daily living — dressing, tooth-brushing, mealtimes, toilet training",
          "Play and friendship — taking turns, sharing space, joining other kids",
          "Flexibility — handling changes in routine without a hard moment",
          "Safety — responding to their name, staying close in a parking lot",
        ],
      },
      {
        heading: "Who's on the team",
        paragraphs: [
          "Two roles matter most. A BCBA (Board Certified Behavior Analyst) is the clinician with a graduate degree who assesses your child, writes the plan, and adjusts it as your child grows. A behavior technician is the person who works with your child in most sessions, following the BCBA's plan, with the BCBA supervising closely.",
          "And then there's you. In good ABA, parents are part of the team — you help pick the goals, you get coached on the strategies, and you see the data. If a provider treats you like a bystander, that's a red flag.",
        ],
      },
      {
        heading: "What good ABA should feel like",
        paragraphs: [
          "Modern ABA is built on your child's yes. It follows their interests, respects their pace, and never punishes them for being who they are. Your child should generally like going to sessions — and like their therapist.",
          "If you visit a session, you should see warmth, play, and patience. You should also see notes being taken, because feelings alone aren't a plan. Warm hearts, careful data: that's the combination to look for.",
        ],
      },
      {
        heading: "Is ABA right for my child?",
        paragraphs: [
          "ABA is designed for children with an autism diagnosis, and most families start between ages 2 and 6 — though older children benefit too. If you're not sure where your child stands, you don't have to figure it out alone: call us, tell us what you're seeing, and we'll help you find the right next step, whether that's ABA or something else first.",
        ],
      },
    ],
  },
  {
    slug: "first-steps-after-a-diagnosis",
    startHere: true,
    cardTitle: "First steps after a diagnosis",
    cardBlurb:
      "Just got the news? Breathe. Here's a short, do-able list for the first few weeks — and what can wait.",
    metaTitle: "First steps after an autism diagnosis: a calm checklist for parents",
    metaDescription:
      "A calm, practical checklist for Kansas and Colorado parents in the first weeks after an autism diagnosis: what to do now, what can wait, and how to start ABA therapy.",
    h1: "Your child was just diagnosed with autism. Here's what to do first.",
    intro:
      "The day of the diagnosis is heavy, even when you saw it coming. Here's the truth nobody says clearly enough: you don't have to do everything this week. This guide is a short list of what actually helps in the first few weeks — and permission to let the rest wait.",
    minutes: 7,
    sections: [
      {
        heading: "First: nothing about your child changed",
        paragraphs: [
          "Your child is the same kid today they were before the appointment. The diagnosis didn't change them — it gave you information, and information opens doors: therapy coverage, school supports, and a clearer picture of how your child experiences the world.",
          "It's okay to grieve the plan you had and love the child you have at the same time. Both are normal. Neither makes you a bad parent.",
        ],
      },
      {
        heading: "Week one: just two jobs",
        paragraphs: ["In the first week, only two things really need doing:"],
        list: [
          "Get the written report. Ask the evaluator when the full diagnostic report will be ready and how you'll receive it. Insurance will want it before covering therapy, so this piece of paper matters.",
          "Take a photo of your insurance card, front and back. That one photo is enough for a provider like us to start a free benefit check — you don't have to decode the plan yourself.",
        ],
      },
      {
        heading: "Weeks two and three: line up the help",
        paragraphs: [
          "Once the report is on its way, you can start the therapy conversation. Call one or two ABA providers and pay attention to how the call feels. A good provider will ask about your child, answer your questions in plain words, and check your benefits for free before asking you to commit to anything.",
          "If your doctor also mentioned speech or occupational therapy, you can get on those lists in parallel — waitlists move at their own speed, and being on one costs nothing.",
        ],
      },
      {
        heading: "What can wait",
        paragraphs: [
          "Plenty of things feel urgent and aren't. These can all wait until you have your feet under you:",
        ],
        list: [
          "Reading every book and blog — one good source at a time is plenty",
          "Big decisions about school — supports can be added any time, not just in August",
          "Explaining the diagnosis to everyone you know — share on your own schedule",
          "Special diets, supplements, or anything a stranger on the internet swears by — talk to your child's doctor first",
        ],
      },
      {
        heading: "A note on the waitlist trap",
        paragraphs: [
          "Some families are told to expect long waits everywhere, so they stop calling. Don't. Wait times vary a lot between providers and towns, and they change month to month. The only way to know a real number is to ask — and a provider should give you an honest answer on the first call, not a vague one.",
        ],
      },
      {
        heading: "How we can help this week",
        paragraphs: [
          "If you're in Kansas or Colorado, one 15-minute call gets you an intake advocate who stays with you from first hello to first session. We'll run your free benefit check — usually back within a business day — and tell you honestly what the path and timing look like. No pressure, no jargon, and you'll hang up knowing your next step.",
        ],
      },
    ],
  },
  {
    slug: "paying-for-aba",
    startHere: true,
    cardTitle: "Paying for ABA: insurance basics",
    cardBlurb:
      "Commercial plans, KanCare, Health First Colorado — how coverage usually works, and the one shortcut that skips the confusion.",
    metaTitle: "Paying for ABA therapy: insurance and Medicaid basics for KS & CO",
    metaDescription:
      "How families in Kansas and Colorado usually pay for ABA therapy: commercial insurance, KanCare, and Health First Colorado explained gently — plus the free benefit check that gives you a real answer.",
    h1: "Paying for ABA: how coverage usually works.",
    intro:
      "Here's the good news up front: most families who start ABA with a confirmed diagnosis end up paying far less than they feared, and many pay little or nothing. The bad news is that insurance paperwork is genuinely confusing. This guide explains the shape of it in plain words — and then shows you the shortcut.",
    minutes: 5,
    sections: [
      {
        heading: "The three things every plan wants",
        paragraphs: [
          "Whatever insurance you have, coverage for ABA almost always rests on three things:",
        ],
        list: [
          "A formal autism diagnosis, in writing, from a qualified evaluator",
          "A treatment plan written by a BCBA, sent to the plan for approval (this is called an authorization)",
          "Ongoing progress reports, so the plan keeps approving care over time",
        ],
      },
      {
        heading: "If you have insurance through work",
        paragraphs: [
          "Most commercial plans cover ABA for children with an autism diagnosis. What changes from family to family is the fine print: your deductible, your copay or coinsurance, and how many hours the plan approves. Two families with the same insurance company can have very different costs.",
          "That's why nobody — including us — should quote you a price from a plan name alone. The real answer lives in your specific plan, and checking it is exactly what a benefit check is for.",
        ],
      },
      {
        heading: "If your child has Medicaid",
        paragraphs: [
          "In Kansas, Medicaid is called KanCare. In Colorado, it's Health First Colorado. Both are public programs, and children's therapy services are the kind of care these programs exist for. Some children qualify through family income; some qualify because of a disability, regardless of income — a door many families don't know exists.",
          "Medicaid rules have their own steps and their own paperwork rhythm. The honest summary: it's navigable, families do it every day, and you shouldn't have to become an expert. Ask the provider you're talking to — checking what your child's coverage means for ABA is part of their job, not yours.",
        ],
      },
      {
        heading: "The shortcut: a free benefit check",
        paragraphs: [
          "You could spend an evening on hold with your insurance company. Or you can send us a photo of your insurance card — front and back — and let us do the digging.",
          "We come back to you, usually within a business day, with a plain-English summary: what your plan covers, what the approval steps are, and what it's likely to cost your family. It's free, and it doesn't commit you to anything. It just replaces fear-of-the-unknown with a real answer.",
        ],
      },
      {
        heading: "One honest caveat",
        paragraphs: [
          "General guides — this one included — can't promise what your plan will do. Coverage details are set by your specific plan and confirmed during authorization. That's not us hedging; it's how insurance works, and it's exactly why we verify every family's coverage individually before care begins.",
        ],
      },
    ],
  },
  {
    slug: "preparing-for-your-first-session",
    startHere: true,
    cardTitle: "Preparing for your first session",
    cardBlurb:
      "What happens on day one, what to have ready (almost nothing), and how to help your child feel at ease.",
    metaTitle: "How to prepare for your child's first ABA session",
    metaDescription:
      "What actually happens at your child's first ABA session, what parents should have ready, and how to help your child feel comfortable — a plain guide for Kansas and Colorado families.",
    h1: "Your first ABA session: what to expect, how to prepare.",
    intro:
      "The first session is mostly about one thing: your child deciding this new person is safe and fun. There's no test to pass and almost nothing to prepare. Here's what day one really looks like, so nobody in your house has to be nervous about it.",
    minutes: 5,
    sections: [
      {
        heading: "What day one is for",
        paragraphs: [
          "Therapists call it pairing: the therapist spends the first sessions becoming someone your child likes. That means following your child's lead — playing with the toys they love, joining the games they invent, keeping demands low and fun high.",
          "It can look like 'just playing.' It's supposed to. A child who trusts their therapist will try hard things for them later. Rushing this step is how therapy goes wrong, so a slow, warm start is a good sign, not a slow one.",
        ],
      },
      {
        heading: "What to have ready",
        paragraphs: ["Honestly, very little. It helps to have:"],
        list: [
          "A few favorite toys or snacks nearby — the fastest map to what motivates your child",
          "A rough sense of your child's day — nap times, meal times, when they're at their best",
          "Any questions you've been saving — write them down; day one is a great time to ask",
          "Nothing tidied. Really. Sessions happen in real homes with real laundry. Nobody is grading your house.",
        ],
      },
      {
        heading: "How to prep your child",
        paragraphs: [
          "Keep it light and simple: \"Someone new is coming to play with you.\" For kids who do better with pictures, some families ask for a photo of the therapist ahead of time to show their child once or twice before the visit.",
          "If your child hides, warms up slowly, or ignores the new person entirely — that's fine and expected. Good therapists have seen every version of a first meeting and take none of it personally.",
        ],
      },
      {
        heading: "What parents do during sessions",
        paragraphs: [
          "In the early days, being nearby helps — your presence tells your child this new person is okay. Over time, you'll find the rhythm that works: sometimes joining, sometimes catching your breath in the next room while the session runs.",
          "You'll never be shut out. Parent coaching is part of every Sunbird plan, so as therapy settles in, part of the work is teaching you the same strategies — because you're with your child far more hours than we are.",
        ],
      },
      {
        heading: "After the first few sessions",
        paragraphs: [
          "Expect a check-in about how it's going — what your child loved, what felt off, what to adjust. Speak up about all of it. The plan bends around your child, and a first week's worth of honest feedback makes month one much stronger.",
        ],
      },
    ],
  },

  // ————————————————————————— Everyday guides —————————————————————————
  {
    slug: "parent-training-explained",
    cardTitle: "Parent training, explained",
    cardBlurb:
      "It's coaching, not homework — and it's the part of ABA with the longest reach. Here's what it involves.",
    metaTitle: "What is parent training in ABA? Coaching for parents, explained",
    metaDescription:
      "Parent training in ABA isn't a class or homework — it's practical coaching on your real routines. What it looks like, why insurance plans include it, and what parents actually learn.",
    h1: "Parent training: the part of ABA that's for you.",
    intro:
      "The phrase 'parent training' makes it sound like you're the one being graded. You're not. It's coaching — a BCBA teaching you the same strategies that work in sessions, on the routines you live every day. It's also, quietly, the part of ABA with the longest reach: therapists come and go over the years, and you remain.",
    minutes: 5,
    sections: [
      {
        heading: "Why it exists",
        paragraphs: [
          "Your child spends a handful of hours a week in therapy — and the rest of the week with you. Skills learned only in sessions can fade at home; skills that parents reinforce stick. Coaching you is how progress escapes the therapy hour and moves into mornings, mealtimes, and Target runs.",
          "This is why insurance plans almost always include parent training in the treatment plan: the evidence says therapy works better when parents are equipped, and plans want therapy that works.",
        ],
      },
      {
        heading: "What it actually looks like",
        paragraphs: [
          "Forget a classroom. Coaching usually looks like this: you pick a real moment that's hard — getting shoes on, leaving the playground, bedtime — and your BCBA works on that exact moment with you. You talk it through, they model a strategy, you practice it, and they cheer you on and fine-tune.",
          "Sessions happen at home or by video, and video matters more than people expect: after bedtime, in comfy clothes, no sitter needed. Coaching that fits your life is coaching that happens.",
        ],
      },
      {
        heading: "Things parents actually learn",
        paragraphs: ["Every family's list is different, but common ones include:"],
        list: [
          "How to spot what's fueling a hard behavior — and change the fuel instead of fighting the fire",
          "How to break a task into steps small enough that your child wins",
          "What to do in the middle of a meltdown — and what makes the next one less likely",
          "How to use praise so it actually lands for your child",
          "How to fold teaching into routines you're already doing anyway",
        ],
      },
      {
        heading: "What it isn't",
        paragraphs: [
          "It isn't a judgment of your parenting, a stack of worksheets, or one more thing to fail at. A good coach meets you where you are — exhausted is a fine place to start — and never hands you a plan you can't actually run on a Tuesday.",
          "If a strategy doesn't fit your family, say so. Adjusting the plan to fit real life is the job, and telling us it doesn't fit is data we need, not complaining.",
        ],
      },
    ],
  },
  {
    slug: "home-vs-daycare-sessions",
    cardTitle: "Home vs. daycare sessions",
    cardBlurb:
      "Both work — they're just good at different things. How to think about the choice, and why many families mix.",
    metaTitle: "ABA at home vs. at daycare: how to choose the right setting",
    metaDescription:
      "Should ABA sessions happen at home or at your child's daycare? What each setting does best, how a mix works, and how the choice gets made — a plain guide for parents.",
    h1: "Home or daycare? Choosing where sessions happen.",
    intro:
      "Families sometimes think there's one right answer here. There isn't — there's a right answer for your child, this season. Home and daycare sessions are each good at different things, and plenty of families use both. Here's how to think about it, minus the pressure.",
    minutes: 5,
    sections: [
      {
        heading: "What home sessions do best",
        paragraphs: [
          "Home is where daily-living skills live. Getting dressed happens by your child's dresser; mealtime skills happen at your table; sibling play happens on your living room floor. Teaching those skills where they're actually used means nothing has to 'transfer' later — it was learned in the real place from day one.",
          "Home also makes parent coaching natural. The BCBA is right there in your routines, seeing what mornings really look like, which makes their advice concrete instead of theoretical.",
        ],
      },
      {
        heading: "What daycare sessions do best",
        paragraphs: [
          "Daycare is where other kids are. Sharing, turn-taking, circle time, playing near and then with other children — these are hard to practice in an empty living room. A therapist at daycare can catch teachable moments with real peers as they happen.",
          "There's a practical win too: therapy folds into a day your child is already having. No extra driving, no schedule surgery, and your child's daycare teachers and their therapist can get on the same page — one set of strategies across the whole day.",
        ],
      },
      {
        heading: "The honest trade-offs",
        paragraphs: [
          "Home sessions put more on your calendar and your energy — someone's home during them, usually you. Daycare sessions depend on the daycare being open to it (most are, once they understand it, and we handle that conversation). And some skills simply belong to one setting: potty training rarely gets solved at circle time.",
        ],
      },
      {
        heading: "Why many families mix",
        paragraphs: [
          "A common shape: some sessions at daycare for peer time, some at home for daily-living goals and parent coaching. The mix shifts as your child grows — more peer work as school gets close, more home work when a routine gets bumpy.",
          "The setting serves the plan, never the other way around. Your BCBA will recommend a starting shape based on your child's goals, and you'll adjust together as real life votes.",
        ],
      },
      {
        heading: "If your child isn't in daycare",
        paragraphs: [
          "No problem — home sessions carry the whole plan, and peer skills can be woven in other ways: siblings, cousins, playground time with your therapist along. And when preschool or school enters the picture, the plan is built to travel with your child.",
        ],
      },
    ],
  },
  {
    slug: "who-is-on-the-team",
    cardTitle: "BCBA, RBT... who's who?",
    cardBlurb:
      "The letters, decoded: who designs the plan, who runs the sessions, and how everyone stays in sync.",
    metaTitle: "BCBA, RBT, behavior technician: your child's ABA team, decoded",
    metaDescription:
      "What a BCBA does, what an RBT or behavior technician does, how supervision works, and what parents can expect from each — the ABA team explained in plain words.",
    h1: "Who's who on your child's team.",
    intro:
      "ABA comes with an alphabet: BCBA, RBT, BT. Behind the letters is a simple structure — one person designs and steers the plan, another runs most of the sessions, and they stay tightly in sync. Here's who does what, and what you can expect from each.",
    minutes: 4,
    sections: [
      {
        heading: "The BCBA: the architect",
        paragraphs: [
          "BCBA stands for Board Certified Behavior Analyst. This is a clinician with a graduate degree, supervised field experience, and a national board exam behind them. Your BCBA assesses your child, writes the treatment plan, chooses the goals with you, and adjusts the plan as the data comes in.",
          "They also supervise every session your child receives and run your parent coaching. Think of them as the architect and the general contractor in one: they design the plan and make sure it's built right.",
        ],
      },
      {
        heading: "The behavior technician: the daily teammate",
        paragraphs: [
          "Most session hours are delivered by a behavior technician — you'll also see RBT, which means Registered Behavior Technician, a national credential with required training, an exam, and ongoing supervision. This is the person on the floor with your child: running the plan's teaching programs, taking data, and turning goals into games.",
          "Your child will probably adore them. That's by design — the relationship is the engine of the whole thing.",
        ],
      },
      {
        heading: "How they stay in sync",
        paragraphs: [
          "The technician doesn't improvise the plan; they run what the BCBA wrote, and the BCBA supervises regularly — reviewing session data, watching sessions, and coaching the technician just like the technician coaches your child. When the data says a goal is mastered or stuck, the BCBA updates the plan.",
          "For you, this means two things: consistency (everyone teaches the same way) and a clear door to knock on — plan questions go to your BCBA, day-to-day notes flow through your technician, and nothing gets lost between them.",
        ],
      },
      {
        heading: "Your seat at the table",
        paragraphs: [
          "You're not staff, but you are on the team — the member with the most hours and the most history. Expect to help choose goals, hear progress in plain English, and get coached on the strategies. If anything about the plan doesn't sit right, say it out loud; the plan works for your family, not the other way around.",
        ],
      },
    ],
  },
  {
    slug: "aba-glossary",
    cardTitle: "ABA words, translated",
    cardBlurb:
      "A pocket glossary of the terms you'll hear in reports and meetings — each one in one plain sentence or two.",
    metaTitle: "ABA glossary for parents: the terms, translated to plain words",
    metaDescription:
      "A parent's glossary of ABA terms — BCBA, RBT, reinforcement, prompting, pairing, mand, authorization, and more — each translated into one or two plain sentences.",
    h1: "ABA words, translated.",
    intro:
      "Therapy comes with vocabulary, and reports sometimes read like they were written for other clinicians (they sort of were). Keep this page handy. Each term below gets a plain-words translation — and if you ever hear a word that isn't here, ask your BCBA to translate. Making it make sense is part of their job.",
    minutes: 6,
    sections: [],
    terms: [
      {
        term: "ABA (Applied Behavior Analysis)",
        def: "The therapy itself: one-on-one teaching that uses what motivates your child to build skills step by step, with progress measured at every session.",
      },
      {
        term: "BCBA (Board Certified Behavior Analyst)",
        def: "The graduate-level clinician who assesses your child, writes the treatment plan, supervises every session, and coaches you.",
      },
      {
        term: "RBT / behavior technician",
        def: "The teammate who runs most sessions with your child, following the BCBA's plan. RBT is a national credential with required training and supervision.",
      },
      {
        term: "Assessment",
        def: "The getting-to-know-your-child phase: observation, play, and parent interviews that show where skills are strong and where help is needed. The plan is built from this.",
      },
      {
        term: "Treatment plan",
        def: "The written plan listing your child's goals and how each will be taught. Your insurance approves it, and it gets updated as your child progresses.",
      },
      {
        term: "Authorization",
        def: "Your insurance plan's formal yes — approval of the treatment plan and a set number of therapy hours for a period of time.",
      },
      {
        term: "Benefit check",
        def: "Finding out what your specific insurance plan covers and what it may cost you, before care starts. Ours is free and usually comes back within a business day.",
      },
      {
        term: "Reinforcement",
        def: "Following a good try with something your child loves — praise, a tickle, a turn with a favorite toy — so they want to try again. The engine of ABA.",
      },
      {
        term: "Reinforcer",
        def: "The specific thing your child will work for: bubbles, a song, chase. Finding strong ones is a real part of the job.",
      },
      {
        term: "Pairing",
        def: "The first job of any new therapist: becoming someone your child likes and trusts, mostly through play, before asking them to do hard things.",
      },
      {
        term: "Prompt",
        def: "A helping nudge — a gesture, a modeled word, a gentle hand-over-hand — that lets your child succeed while they're still learning.",
      },
      {
        term: "Prompt fading",
        def: "Gradually shrinking those nudges until your child does the skill on their own. Independence is always the goal.",
      },
      {
        term: "Mand",
        def: "Clinician word for a request — asking for what you want with a word, sign, or picture. Early plans focus here, because asking beats melting down.",
      },
      {
        term: "Tact",
        def: "Clinician word for labeling — naming what you see ('dog!', 'bus!'). A building block of conversation.",
      },
      {
        term: "NET (Natural Environment Teaching)",
        def: "Teaching inside normal play and daily routines — practicing 'more' during tickles, colors during snack — instead of only at a table.",
      },
      {
        term: "Task analysis",
        def: "Breaking a big skill like hand-washing into small steps, then teaching the steps one at a time until the whole chain works.",
      },
      {
        term: "Generalization",
        def: "Using a skill everywhere it's needed — not just with one person, one toy, or one room. Good plans build this in on purpose.",
      },
      {
        term: "Data",
        def: "The notes taken during every session that show what's working. Ask to see yours in plain English — you're entitled to it.",
      },
      {
        term: "Parent training",
        def: "Coaching for you: learning the same strategies the team uses, practiced on your real routines, at home or by video.",
      },
      {
        term: "Telehealth",
        def: "Sessions or coaching over secure video. Especially handy for parent coaching after bedtime.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}

export const startHereGuides = guides.filter((g) => g.startHere);
export const everydayGuides = guides.filter((g) => !g.startHere);
