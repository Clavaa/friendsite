import type { Guide } from "./guides";

/**
 * Bigger-decision guides — the questions families weigh before and
 * during ABA: how it compares to speech therapy, the honest answer to
 * "is ABA harmful?", and how hours get decided. Same house rules:
 * 5th–7th grade, warm, no promises we can't keep, insurance stays
 * benefit-check-vague. The is-aba-harmful page takes criticism
 * seriously on purpose — honesty is the trust play.
 */
export const decisionLibrary: Guide[] = [
  {
    slug: "aba-vs-speech-therapy",
    cardTitle: "ABA vs. speech therapy",
    cardBlurb:
      "They're teammates, not rivals — what each one does, where they overlap, and whether your child needs both.",
    metaTitle: "ABA vs. speech therapy: does my child need both?",
    metaDescription:
      "ABA therapy and speech therapy do different jobs — one builds skills across daily life, the other specializes in communication — and many children with autism do both. How they differ, how they work together, and how to decide where to start.",
    h1: "ABA vs. speech therapy: does my child need both?",
    intro:
      "ABA therapy and speech therapy aren't competitors — they do different jobs. Speech therapy specializes in how a child communicates. ABA teaches skills across all of daily life, communication included, and works on the behaviors that get in learning's way. Many children with autism do both, and the two work best coordinated.",
    minutes: 6,
    related: [
      "what-is-aba",
      "how-many-hours-of-aba",
      "who-is-on-the-team",
      "first-steps-after-a-diagnosis",
    ],
    sections: [
      {
        heading: "What does speech therapy do?",
        paragraphs: [
          "A speech-language pathologist (SLP) is a specialist in communication — all of it. Speech sounds, first words, building sentences, understanding language, conversation skills, and feeding or swallowing issues too. If your child's communication uses pictures, signs, or a talker device, the SLP is usually the expert who sets that up.",
          "Sessions are typically short and focused — often 30 to 60 minutes, once or twice a week — and go deep on communication in a way no other therapy does. For a child whose main challenge is speech and language itself, an SLP is the specialist you want.",
        ],
      },
      {
        heading: "What does ABA therapy do?",
        paragraphs: [
          "[ABA therapy](/resources/what-is-aba) is broader and more woven into daily life. A BCBA designs a plan across whatever your child needs most — asking for things instead of melting down, dressing, playing with other kids, handling changes in routine, staying safe — and a therapist works that plan one-on-one for multiple hours a week, usually in your home or daycare.",
          "Communication goals live inside ABA too, but the angle is different: ABA focuses on making communication work — teaching your child that words, signs, or pictures get real results, and practicing them across the whole messy day, not just in a session room.",
        ],
      },
      {
        heading: "How do they overlap — and differ?",
        paragraphs: [
          "The overlap is communication, and that's by design, not a turf war. A helpful way to hold it: the SLP is the specialist in how your child communicates — sounds, words, sentences, devices. ABA is the generalist in making skills stick — motivation, practice, and using skills everywhere they're needed.",
          "The differences are dosage and scope. Speech therapy is a scalpel: an hour or two a week, aimed precisely at communication. ABA is scaffolding: more hours, spread across daily routines, catching skills and behavior at the same time. A child who learns a new word with their SLP on Tuesday can practice it fifty times inside ABA sessions by Friday.",
        ],
      },
      {
        heading: "Do many children do both?",
        paragraphs: [
          "Yes — for many children with autism, both at once is the standard recommendation, not the deluxe package. The evaluation report that diagnosed your child probably recommends some mix of ABA, speech, and sometimes occupational therapy on the same page.",
          "When both are running, coordination matters more than anything. Good providers share goals: the BCBA folds the SLP's communication targets into daily ABA practice, and the SLP hears what's working at home. Ask any ABA provider you're considering how they coordinate with speech therapists — a good answer is specific, and 'we're happy to connect with them' should be the floor.",
        ],
      },
      {
        heading: "How do you decide where to start?",
        paragraphs: [
          "Start from the evaluator's recommendations — that report was written for exactly this decision. From there, practical wisdom: if waitlists differ, get on all of them now and start whichever opens first; one therapy running beats two therapies pending. Insurance details differ by plan too, which is why we [check benefits for free](/insurance) before any family commits to anything.",
          "And if you're still sorting out what your child needs, ask us — honestly, even if the answer is 'start with speech first.' Our intake team talks through exactly this question with [Kansas](/kansas) and [Colorado](/colorado) families every week, no strings attached.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can my child do ABA and speech therapy at the same time?",
        a: "Yes — and for many children with autism, that combination is exactly what the diagnostic evaluation recommends. The two complement each other: the SLP goes deep on communication, and ABA gives those skills hours of real-life practice. Good providers coordinate goals so both push in the same direction.",
      },
      {
        q: "Does insurance cover both ABA and speech therapy?",
        a: "Coverage depends on your specific plan, and the two therapies are usually covered under different parts of it. Rather than guess, we check: send us a photo of your insurance card and we'll tell you where your family stands on ABA benefits — free, usually within a business day.",
      },
      {
        q: "Is ABA just speech therapy with more hours?",
        a: "No. Speech therapy is a communication specialty run by an SLP. ABA covers communication and everything around it — daily-living skills, play, behavior, safety — with a BCBA designing the plan. Many children need the specialist and the scaffolding at the same time, which is why both often appear in the same recommendation.",
      },
    ],
    cta: {
      heading: "Not sure which your child needs first?",
      body: "Tell us what you're seeing and what the evaluator recommended. We'll give you an honest read — including when speech therapy should come first — in one 15-minute call.",
      primaryLabel: "Talk it through with us",
      primaryHref: "/getting-started",
    },
  },

  {
    slug: "is-aba-therapy-harmful",
    cardTitle: "Is ABA therapy harmful?",
    cardBlurb:
      "An honest answer — where the criticism comes from, how modern ABA differs, and the red flags to watch for in any provider. Ours included.",
    metaTitle: "Is ABA therapy harmful? An honest answer for parents",
    metaDescription:
      "Some autistic adults describe real harm from the rigid ABA of decades past — criticism worth taking seriously. How modern, assent-based ABA is different, the red flags to watch for in any provider, and a parent's right to pause. An honest answer.",
    h1: "Is ABA therapy harmful? An honest answer.",
    intro:
      "Honest answer: ABA done badly can be harmful, and some autistic adults carry real hurt from the rigid ABA of decades past. ABA done well today looks very different — built on the child's assent, aimed at skills instead of masking. This guide covers both truths, and the red flags to watch for in any provider.",
    minutes: 8,
    related: [
      "what-is-aba",
      "how-many-hours-of-aba",
      "preparing-for-your-first-session",
      "who-is-on-the-team",
    ],
    sections: [
      {
        heading: "Where does the criticism come from?",
        paragraphs: [
          "If you've searched about ABA, you've found autistic adults describing therapy that hurt them — and they deserve to be heard, not argued with. Early ABA, especially decades ago, could be rigid and compliance-driven: long hours at a table, drills repeated until the child obeyed, and in its worst early forms, punishment. Some programs aimed at making children look less autistic — suppressing harmless stimming, forcing eye contact — instead of making their lives genuinely easier.",
          "Teaching a child to hide who they are is called masking, and it's exhausting; adults who grew up doing it describe real damage. So when critics say 'that version of ABA caused harm,' the honest response from our field isn't defensiveness. It's agreement — and proof, in daily practice, that we've learned.",
        ],
      },
      {
        heading: "How is modern ABA different?",
        paragraphs: [
          "Good modern ABA starts from a different premise: your child isn't a problem to fix — they're a learner to support. In practice, that means sessions built on assent: the therapist watches your child's yes and no, in words or body language, and adjusts. A child who's done gets a break, not a battle. Play leads, the child's interests steer, and encouragement — never punishment — does the teaching.",
          "Goals changed too. Modern plans target skills that make your child's own life better — asking for what they want, handling change without panic, making a friend — chosen with parents, not imposed. Harmless stimming isn't a target. Eye contact isn't drilled for its own sake. And 'indistinguishable from peers' is nobody's goal here; a child who can tell you what they need, in their own way, is.",
        ],
      },
      {
        heading: "Red flags in any ABA provider",
        paragraphs: [
          "The gap between good and bad ABA is real, so judge providers — ours included — against this list. Walk away, or push back hard, if you see:",
        ],
        list: [
          "Your child dreads sessions week after week, and the team's answer is to push through rather than change the approach",
          "Compliance is treated as the goal — 'he needs to learn to obey' — instead of communication and skills",
          "Goals target making your child look less autistic: suppressing harmless stims, drilling eye contact for its own sake",
          "You're discouraged from observing sessions, or parent questions are treated as interference",
          "No data, or data you never see — progress claims with nothing behind them",
          "Any use of punishment, or 'pushing through' a distressed child instead of listening to the distress",
          "One-size plans — every child gets the same goals and the same hours regardless of who they are",
        ],
      },
      {
        heading: "Your right to pause — always",
        paragraphs: [
          "Here's something providers should say out loud more often: you can pause. If something feels wrong — this week, this month, this therapist — you can stop sessions, ask hard questions, and change course. A good provider treats that as parenting, not as a problem. Any provider who makes quitting feel impossible, or guilt-trips you about 'lost progress,' has told you what you needed to know.",
          "The same right belongs to your child. When a child protests a session, modern ABA treats that as communication to honor and learn from — figure out what's wrong, fix the approach — not resistance to overcome.",
        ],
      },
      {
        heading: "How to choose a provider you can trust",
        paragraphs: [
          "Interview them like it matters, because it does. Ask: Can I observe any session, anytime? How do you know when my child isn't enjoying therapy, and what changes when that happens? What happens when I disagree with a goal? How do you feel about stimming? A good provider answers all four warmly and specifically — and the eye-contact question makes a bad one flinch.",
          "Then trust what you see. Visit a session. A child who likes their therapist, play that looks like play, notes being taken, and a team that welcomes your eyes on everything — that's what good looks like. If you want the fuller picture of what sessions involve, start with [what ABA actually looks like](/resources/what-is-aba) and [what the first session involves](/resources/preparing-for-your-first-session).",
        ],
      },
    ],
    faqs: [
      {
        q: "Does ABA try to make my child 'not autistic'?",
        a: "Good ABA doesn't, and won't. Your child is autistic and will be after therapy too. Modern goals are about your child's own quality of life — communicating what they need, handling daily life with less distress, doing more of what they enjoy — never about performing 'normal' for other people's comfort.",
      },
      {
        q: "What if my child cries or resists sessions?",
        a: "A rough day happens; a pattern is information. Modern ABA treats a child's protest as communication: the team should investigate what's wrong and change the approach — different activities, slower pace, a different therapist if needed. If a provider's only answer is to push through your child's distress, that's a red flag worth acting on.",
      },
      {
        q: "Is ABA safe for my child?",
        a: "With a good provider, yes — modern ABA is play-based, assent-based, and built on encouragement, with parents welcome in every session. The honest caveat: quality varies across providers, so use the red-flag list, observe sessions, and keep your right to pause. Good providers expect exactly that scrutiny.",
      },
    ],
    cta: {
      heading: "Ask us the skeptical questions.",
      body: "Seriously — bring the hard ones. How we handle a child's 'no,' what we think about stimming, what you'd see if you dropped in unannounced. Fifteen minutes, no script, and you can watch how we answer.",
      primaryLabel: "Talk to a real person",
      primaryHref: "/getting-started",
    },
  },

  {
    slug: "how-many-hours-of-aba",
    cardTitle: "How many hours of ABA?",
    cardBlurb:
      "The honest answer: it depends on your child. How hours get decided, what the ranges mean, and why more isn't automatically better.",
    metaTitle: "How many hours of ABA does my child need?",
    metaDescription:
      "There's no universal number: ABA hours are set child by child, from a BCBA's assessment. What focused vs. comprehensive plans mean, what shapes the recommendation, why more hours isn't automatically better, and how parents approve the final plan.",
    h1: "How many hours of ABA does my child need?",
    intro:
      "There's no universal number, and any provider who quotes one before meeting your child is guessing. ABA hours are set child by child: a BCBA assesses your child, weighs goals and your family's real life, and recommends a number — commonly somewhere between 10 and 40 hours a week — that you approve together.",
    minutes: 6,
    related: [
      "what-is-aba",
      "aba-vs-speech-therapy",
      "paying-for-aba",
      "home-vs-daycare-sessions",
    ],
    sections: [
      {
        heading: "The honest answer: it depends on your child",
        paragraphs: [
          "We know that's not the number you came for. But it's the true answer, and here's why: hours follow goals. A 5-year-old working on conversation and school readiness needs a different dose than a 3-year-old building first words, communication, and daily routines all at once. The child sets the plan; the plan sets the hours.",
          "So the real question isn't 'how many hours is normal?' It's 'how does the number get chosen for my child?' — and that has a clear answer.",
        ],
      },
      {
        heading: "What do focused and comprehensive plans mean?",
        paragraphs: [
          "You'll hear two shapes of plan. A focused plan — often roughly 10 to 25 hours a week — targets a specific set of goals: communication and mealtime battles, say, or safety and transitions. A comprehensive plan — often roughly 26 to 40 hours — works across most areas of development at once, and is more common for younger children with goals in many areas.",
          "Treat those ranges as vocabulary, not a menu. Your child won't be assigned a bucket; they'll get an assessment, and the number will come out of what it finds. Plenty of children thrive on plans that fit neither range neatly.",
        ],
      },
      {
        heading: "What shapes the recommendation?",
        paragraphs: [
          "When a BCBA recommends hours, they're weighing real factors, and you should hear the reasoning out loud:",
        ],
        list: [
          "What the assessment found — how many areas need work, and how foundational they are",
          "Your child's age and stamina — a 2-year-old's day has room a kindergartner's doesn't",
          "Your family's actual life — school, naps, siblings, work schedules; a plan that can't be lived isn't a plan",
          "What the research supports for children with similar goals",
          "Other therapies in the mix — [speech or OT hours](/resources/aba-vs-speech-therapy) count in a child's week too",
        ],
      },
      {
        heading: "Is more hours automatically better?",
        paragraphs: [
          "No — and be wary of anyone who implies it is. The goal is the right dose: enough hours to move the goals, not so many that therapy swallows childhood. Naps, park time, cousins, and boredom are part of a good life at three, and a plan that leaves no room for them costs more than it gives.",
          "Watch the incentives, too. Providers bill by the hour, so a recommendation should come with reasons attached, not just a big number. Ask 'why this many, and what would make it change?' A good BCBA loves that question. Vague answers to it are a red flag — we keep [a whole list of those](/resources/is-aba-therapy-harmful).",
        ],
      },
      {
        heading: "What about insurance — and your approval",
        paragraphs: [
          "Insurance plans approve hours as part of authorizing the treatment plan, and each plan handles that its own way. That's a paperwork job, and it's ours: we submit the plan, chase the approval, and [check your benefits free](/insurance) up front so cost surprises don't happen.",
          "The part that belongs to you: nothing is submitted until you've seen it. You'll know every goal and the reasoning behind the hours, and you approve the plan before it goes anywhere. Hours also get revisited as your child progresses — up when a push would help, down as independence grows. The number serves your child, never the other way around.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is 40 hours of ABA required?",
        a: "No. Forty hours is the ceiling of the comprehensive range, not a requirement — and no fixed number fits every child. Your child's hours should come from a BCBA's assessment of your child, explained to you with reasons, and approved by you before anything starts.",
      },
      {
        q: "Can my child's hours change over time?",
        a: "Yes, and they should. Hours get revisited as the data comes in — up for a season when a push would help, down as your child masters skills and needs less support. The long-term direction of good ABA is always toward fewer hours and more independence.",
      },
      {
        q: "Will insurance limit how many hours my child gets?",
        a: "Plans approve hours when they authorize the treatment plan, and every plan runs its own process. We handle that paperwork, and the free benefit check tells you up front how your specific plan works — one photo of your insurance card, a plain-English answer usually within a business day.",
      },
    ],
    cta: {
      heading: "Want a real number for your child?",
      body: "That takes an assessment, not a website — but the path there starts with one 15-minute call. We'll explain how the recommendation gets made for families in [Kansas](/kansas) and [Colorado](/colorado), and check your benefits free.",
      primaryLabel: "Start with the 15-minute call",
      primaryHref: "/getting-started",
    },
  },
];
