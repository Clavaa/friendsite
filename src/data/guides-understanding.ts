import type { Guide } from "./guides";

/**
 * The "understanding autism" shelf — guides for parents who are still at
 * the wondering stage: signs by age, what the levels mean, and the
 * M-CHAT screening. Same content rules as the whole library (5th–7th
 * grade, warm, honest, insurance stays benefit-check-vague), plus one
 * more: these pages meet worried parents, so the tone is calm and kind,
 * never alarming. Every guide here routes to the diagnosis funnel.
 *
 * Inline links use [text](/path) — see the guide template's renderer.
 */
export const understandingLibrary: Guide[] = [
  {
    slug: "what-does-level-2-autism-mean",
    shelf: "understanding",
    cardTitle: "What does Level 2 autism mean?",
    cardBlurb:
      "The three levels, translated to plain words — what Level 2 looks like day to day, and what it doesn't mean.",
    metaTitle: "What does Level 2 autism mean? A plain-words guide for parents",
    metaDescription:
      "Level 2 autism means a child needs substantial support, especially with communication and change. What the three autism levels mean in plain words, what Level 2 looks like day to day, and what it doesn't say about your child's future.",
    h1: "What does Level 2 autism mean?",
    intro:
      "Level 2 autism means a child needs substantial support — more than Level 1, less than Level 3. It usually shows up as real difficulty with back-and-forth communication and with handling change, even with help in place. It describes the support your child needs today. It does not predict who they will become.",
    minutes: 6,
    related: [
      "signs-of-autism-at-age-2",
      "signs-of-autism-at-age-3",
      "first-steps-after-a-diagnosis",
      "what-is-aba",
    ],
    sections: [
      {
        heading: "Where the levels come from",
        paragraphs: [
          "When a specialist diagnoses autism, they use a manual called the DSM-5. It asks one practical question: how much support does this child need right now? The answer becomes a level — 1, 2, or 3.",
          "That's all a level is. It's not a grade, not a rank, and not a fixed label your child carries for life. It's a snapshot of support needs at the time of the evaluation, written so doctors, schools, and insurance plans describe your child the same way.",
        ],
      },
      {
        heading: "The three levels, in plain words",
        paragraphs: ["Here's the plain-words version of each level:"],
        list: [
          "Level 1 — needs support. Your child can speak and manage many situations, but social back-and-forth is hard, and switching plans or handling surprises takes real effort.",
          "Level 2 — needs substantial support. Communication struggles are obvious even with help. Your child may use short sentences, single words, or few words at all, and changes in routine are genuinely distressing.",
          "Level 3 — needs very substantial support. Very limited communication, and daily life needs a lot of hands-on help. Change is extremely hard.",
        ],
      },
      {
        heading: "What does Level 2 look like day to day?",
        paragraphs: [
          "Every child is different, so no list fits everyone. But parents of children with Level 2 autism often recognize days like this: your child communicates in short phrases or single words, mostly about the things they care about. Starting a back-and-forth conversation — or keeping one going — is hard even with your help.",
          "Routines matter a lot. A changed plan, a new route to school, or a cancelled activity can bring big distress, not just disappointment. You may see repeated movements or strong, narrow interests that fill much of the day. And social situations that seem simple to other kids — joining a game, reading a friend's face — take teaching, not just time.",
        ],
      },
      {
        heading: "Can a child's level change?",
        paragraphs: [
          "Yes. The level describes support needs, and support needs change as a child learns. A child evaluated at Level 2 at age three may need much less support at seven, especially with early, consistent help. Some evaluators re-assess over time, and the level can be revised.",
          "Here's the more important truth: your child's progress is not capped by a number in a report. The level tells the team how much help to bring today. What your child does with that help is their own story, still being written.",
        ],
      },
      {
        heading: "What Level 2 means for therapy and support",
        paragraphs: [
          "Practically, a Level 2 diagnosis usually means the evaluator is recommending real, consistent support — often including [ABA therapy](/resources/what-is-aba), and sometimes speech or occupational therapy alongside it. The level helps insurance plans and schools understand that your child needs more than a light touch.",
          "If you're wondering what that support would cost your family, that answer lives in your specific insurance plan — which is why we [check benefits for free](/insurance) instead of guessing. And if you're at the very start, our [first-steps guide](/resources/first-steps-after-a-diagnosis) walks the first few weeks with you.",
        ],
      },
      {
        heading: "What Level 2 doesn't mean",
        paragraphs: [
          "It doesn't mean your child won't talk, won't learn, or won't have friends. It doesn't mean 'severe' — that word isn't in the diagnosis, and it isn't a prediction. And it doesn't say anything about how much your child understands, feels, or loves. Support needs and inner life are two different things.",
          "If the report used words that scared you, bring them to someone who can translate. That's a normal ask, and any good clinician — ours included — will walk you through the report in plain words.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Level 2 autism mild or severe?",
        a: "Neither word really fits. Level 2 means your child needs substantial support right now — more than Level 1, less than Level 3. It measures support needs, not intelligence, feelings, or potential, and it can change as your child learns and grows.",
      },
      {
        q: "Can Level 2 autism improve?",
        a: "The level describes support needs, and support needs can shrink as a child gains skills. Many children evaluated at Level 2 need noticeably less support a few years later, especially with early, consistent help. Progress looks different for every child, and no honest provider promises a specific outcome.",
      },
      {
        q: "Does a Level 2 diagnosis qualify my child for ABA therapy?",
        a: "A formal autism diagnosis — at any level — is the key that most insurance plans look for before covering ABA. What your specific plan covers is its own question, so we check it for free: send us a photo of your insurance card and we'll tell you where you stand, usually within a business day.",
      },
    ],
    cta: {
      heading: "Have the report but not the plan?",
      body: "If your child was just evaluated — at any level — we'll help you turn the report into next steps in [Kansas](/kansas) or [Colorado](/colorado): coverage checked free, questions answered in plain words, no pressure.",
      primaryLabel: "Talk through the report with us",
      primaryHref: "/getting-started",
    },
  },

  {
    slug: "signs-of-autism-at-18-months",
    shelf: "understanding",
    cardTitle: "Signs of autism at 18 months",
    cardBlurb:
      "What to watch for at a year and a half, what's usually nothing, and the one move that costs you nothing: asking.",
    metaTitle: "Signs of autism in an 18-month-old: what to watch for",
    metaDescription:
      "Early signs of autism at 18 months: not pointing, not responding to their name, few words, limited eye contact. What's usually not a red flag, why the 18-month checkup matters, and what to do next — a calm guide for parents.",
    h1: "Signs of autism at 18 months.",
    intro:
      "At 18 months, the early signs of autism are mostly about connection: a toddler who doesn't point at things to show you, doesn't turn when you call their name, uses few or no words, and rarely brings you into their play. One sign alone proves nothing — but together, they're a reason to ask, not to wait.",
    minutes: 6,
    related: [
      "signs-of-autism-at-age-2",
      "the-m-chat-screening",
      "signs-of-autism-at-age-3",
      "what-is-aba",
    ],
    sections: [
      {
        heading: "Why 18 months matters",
        paragraphs: [
          "Eighteen months is the age when the early social skills — pointing, showing, sharing a look with you — are expected to be up and running. It's also when your child's doctor is supposed to screen for autism: checkup guidelines call for a short screening questionnaire, usually [the M-CHAT](/resources/the-m-chat-screening), at the 18- and 24-month visits.",
          "That makes this checkup the easiest moment to raise what you've noticed. You don't need to arrive certain. 'I've been wondering about a few things' is exactly how these conversations are supposed to start.",
        ],
      },
      {
        heading: "What are the signs of autism at 18 months?",
        paragraphs: [
          "No single item on this list is a diagnosis. What matters is the pattern — several of these, showing up most days:",
        ],
        list: [
          "Not pointing at things to show you — no 'look at that!' finger, no holding toys up for you to see",
          "Not turning when you call their name, even though their hearing is fine",
          "Few or no words, and not making up for it with gestures like waving or reaching",
          "Little back-and-forth — you smile, they don't smile back; you point, they don't look where you're pointing",
          "Playing alone in a way that shuts others out, or playing with toys in one repeated way — lining up, spinning, dropping",
          "Strong reactions to sounds, textures, or changes that other toddlers shrug off",
          "Losing words or skills they used to have — this one deserves a call to the doctor this week, not someday",
        ],
      },
      {
        heading: "What's usually not a red flag",
        paragraphs: [
          "Plenty of things worry parents at 18 months and turn out to be nothing. A toddler who is slow to talk but points, gestures, and drags you to what they want is communicating fine — just not with words yet. Tantrums are standard toddler equipment. Loving a favorite show, insisting on a favorite cup, or being shy with strangers are all ordinary.",
          "The difference is connection. A late talker who is tuned in to you — checking your face, showing you things, following your point — has a bridge that words can cross later. When that bridge itself looks thin, that's the thing worth asking about.",
        ],
      },
      {
        heading: "What should you do if you're seeing these signs?",
        paragraphs: [
          "Two moves, both free. First, tell your child's doctor exactly what you've noticed and ask two direct questions: 'Can you screen my child for autism?' and 'Can you refer us for a full evaluation?' Second, call your state's early intervention program — every child under three is entitled to a free developmental evaluation, no doctor's referral needed.",
          "And if you want a person to help you sort out where to call first, that's what we do all day. Our [get-a-diagnosis guide](/get-a-diagnosis) maps the evaluation path for families in [Kansas](/kansas) and [Colorado](/colorado), and the phone call costs nothing.",
        ],
      },
      {
        heading: "The wait-and-see trap",
        paragraphs: [
          "You may hear 'boys talk late,' 'his cousin was the same way,' or 'let's look again at two.' Sometimes those reassurances turn out right. But waiting has a real cost and checking has none: evaluation waitlists run long, and a toddler's brain learns faster now than it ever will again.",
          "So do both. Keep loving the wait-and-see optimism of the people around you — and get your child's name on an evaluation list anyway. If the worry turns out to be nothing, you've lost nothing. If it's something, you've saved months.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can autism be diagnosed at 18 months?",
        a: "Yes. Experienced specialists can reliably diagnose autism from about 18 to 24 months, and screening is recommended at the 18-month checkup for every child. There's no benefit to waiting — and if an evaluation says it isn't autism, you'll have answers instead of months of worry.",
      },
      {
        q: "My 18-month-old isn't talking yet. Is that autism?",
        a: "Not by itself. Plenty of late talkers develop typically. The bigger question is connection: does your child point, gesture, respond to their name, and pull you into what they're doing? A late talker who connects is usually just late. If the connecting pieces are missing too, ask for a screening.",
      },
      {
        q: "Who do I call first — the doctor or early intervention?",
        a: "Either works, and you can do both in the same week. Your child's doctor can screen and refer; your state's early intervention program will evaluate a child under three for free without a referral. Starting both puts you on two paths at once, and there's no rule against that.",
      },
    ],
    cta: {
      heading: "Wondering is exhausting. Asking is 15 minutes.",
      body: "Tell us what you're seeing. We'll help you get a real screening and evaluation lined up in Kansas or Colorado — free, and with no pressure to do anything else.",
      primaryLabel: "Get diagnostic help",
      primaryHref: "/get-a-diagnosis",
    },
  },

  {
    slug: "signs-of-autism-at-age-2",
    shelf: "understanding",
    cardTitle: "Signs of autism at age 2",
    cardBlurb:
      "What most 2-year-olds do, the signs that stand out at this age, and the next step that costs nothing.",
    metaTitle: "Signs of autism in a 2-year-old: a parent's plain-words guide",
    metaDescription:
      "Signs of autism at age 2: few or no words, not responding to their name, little pretend play, repeated routines, or losing skills. What's typical at two, what stands out, and how to get a free evaluation — explained calmly for parents.",
    h1: "Signs of autism in a 2-year-old.",
    intro:
      "At age 2, the signs of autism that stand out most are few or no words, not responding to their name, little pointing or showing, not much pretend play, and strong distress at small changes. Losing words a child once had matters most of all. A pattern of these signs is a reason to get a free evaluation — not to wait.",
    minutes: 7,
    related: [
      "signs-of-autism-at-18-months",
      "signs-of-autism-at-age-3",
      "the-m-chat-screening",
      "first-steps-after-a-diagnosis",
    ],
    sections: [
      {
        heading: "What most 2-year-olds are doing",
        paragraphs: [
          "It helps to know the baseline. By age two, most children use dozens of words and are starting to stack them — 'more milk,' 'daddy go.' They point at planes, bring you things just to show you, copy what you do around the house, and start simple pretend play, like feeding a stuffed animal.",
          "Ranges are wide, and no child does everything on schedule. But that picture — words growing, pretend starting, and a child who keeps pulling you into their world — is what the checkup milestones are looking for at two.",
        ],
      },
      {
        heading: "What are the signs of autism at age 2?",
        paragraphs: [
          "Autism at this age usually shows up as a pattern across talking, connecting, and playing. Signs parents and doctors look for:",
        ],
        list: [
          "Few or no words — and few gestures standing in for words (no pointing, waving, or nodding)",
          "Not responding to their name most of the time, though hearing checks out fine",
          "Rarely pointing at things to show you, or bringing things over just to share them",
          "Little or no pretend play — toys get lined up, spun, or sorted instead of 'fed' or 'driven'",
          "Not much interest in other children, or playing near them without ever playing with them",
          "Repeating the same movements — hand-flapping, rocking, spinning — much of the day",
          "Big distress at small changes: a different cup, a rearranged room, a new route in the car",
          "Losing words or skills they once had — the one sign that should skip the waitlist thinking entirely and go straight to the doctor",
        ],
      },
      {
        heading: "One sign alone isn't the story",
        paragraphs: [
          "Every toddler flaps with excitement sometimes, loves routines, or ignores their name mid-cartoon. One behavior from the list, on its own, usually means nothing. What deserves attention is a cluster — several signs, most days, across different situations.",
          "You don't have to score this yourself. A screening tool like [the M-CHAT](/resources/the-m-chat-screening) takes five minutes at the doctor's office, it's free, and it exists exactly so parents don't have to guess from lists on the internet — including this one.",
        ],
      },
      {
        heading: "Why age 2 is a good moment to act",
        paragraphs: [
          "Two things are true at once. First, a 2-year-old can absolutely be evaluated: specialists reliably diagnose autism from about 18 months on, and checkup guidelines call for autism screening at 18 and 24 months. Second, this is the season when help works hardest — a toddler's brain is at its most flexible, and skills taught now compound for years.",
          "Evaluation waitlists are the enemy of that math. They can run months long, which is why the smartest move is getting on a list the same week you start wondering. You can always cancel. You can't get the months back.",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Start with three calls, in any order. Your child's doctor: describe what you see and ask for an autism screening and a referral for a full evaluation. Your state's early intervention program: children under three get a free developmental evaluation, no referral needed. And one or two evaluation clinics directly — being on more than one waitlist is normal and allowed.",
          "If that list already feels like a lot on top of your actual life, hand it to us. Our [diagnosis guide](/get-a-diagnosis) breaks down the path for [Kansas](/kansas) and [Colorado](/colorado) families, and our intake team helps parents at exactly this stage every day — before any diagnosis exists.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is late talking at age 2 always autism?",
        a: "No. Many late talkers catch up on their own, and others have a speech delay without autism. The key difference is connection: a late talker who points, gestures, responds to their name, and pulls you into play is communicating without words. When those connecting behaviors are missing too, ask for a screening.",
      },
      {
        q: "Can a 2-year-old really be evaluated for autism?",
        a: "Yes. Specialists can reliably evaluate children from about 18 months, and screening at 18 and 24 months is standard checkup guidance. If your child is under three, your state's early intervention program will also evaluate for free — no doctor's referral required.",
      },
      {
        q: "What if the doctor says 'let's wait and see'?",
        a: "You're allowed to keep going anyway. Ask for the screening at this visit, call early intervention yourself, and get on an evaluation list — all free, and none of it requires the doctor to agree with your worry. If the concern fades, cancel. Waiting is the only move you can't undo.",
      },
    ],
    cta: {
      heading: "Seeing some of this in your 2-year-old?",
      body: "You don't need to be sure — that's what evaluations are for. We help Kansas and Colorado families get screened, get on the shortest evaluation waitlists, and know what happens next. Free.",
      primaryLabel: "Get diagnostic help",
      primaryHref: "/get-a-diagnosis",
    },
  },

  {
    slug: "signs-of-autism-at-age-3",
    shelf: "understanding",
    cardTitle: "Signs of autism at age 3",
    cardBlurb:
      "Why some signs only show up around preschool, what stands out at three, and the free school-district evaluation many parents don't know about.",
    metaTitle: "Signs of autism in a 3-year-old: what parents notice at preschool age",
    metaDescription:
      "Signs of autism at age 3: one-sided conversations, little pretend play, trouble joining other kids, rigid routines, and big reactions to sensory stuff. Why signs often surface at preschool, plus the free evaluation your school district must provide.",
    h1: "Signs of autism in a 3-year-old.",
    intro:
      "At age 3, signs of autism often show up in conversation and play: talk that's one-sided or scripted, little pretend play, trouble joining other kids, rigid routines, and big reactions to sounds or textures. Preschool often makes these visible for the first time. From age three on, your school district must evaluate for free.",
    minutes: 7,
    related: [
      "signs-of-autism-at-age-2",
      "what-does-level-2-autism-mean",
      "first-steps-after-a-diagnosis",
      "aba-vs-speech-therapy",
    ],
    sections: [
      {
        heading: "Why do some signs show up 'late'?",
        paragraphs: [
          "Plenty of parents first wonder about autism at three, not two — and then feel guilty for 'missing it.' Don't. Some children genuinely show few signs earlier. Others had signs that were easy to read as personality: 'she's just shy,' 'he's just particular,' 'he's an only child.'",
          "And some signs simply need company to appear. A child at home with loving adults who anticipate every need can look smooth. Put the same child in a room of fifteen 3-year-olds who don't anticipate anything, and the hard parts surface. That's not a missed diagnosis — that's the first real test of skills that hadn't been needed yet.",
        ],
      },
      {
        heading: "What are the signs of autism at age 3?",
        paragraphs: [
          "By three, most children hold little conversations, pretend constantly, and seek out other kids. Autism at this age tends to show up as a pattern like this:",
        ],
        list: [
          "Talking at people more than with them — long stretches about a favorite topic, but hard to pull into back-and-forth",
          "Speech that's mostly borrowed — lines from shows or books, repeated questions, or echoing what you just said",
          "Little pretend play — no feeding the bear or driving the truck to the store; play is sorting, lining up, or repeating",
          "Watching other children without joining, or joining in a way that keeps going wrong",
          "Rules and routines with real teeth — a changed plan or broken ritual brings a meltdown, not a shrug",
          "Big responses to sensory stuff: covering ears at ordinary sounds, refusing whole categories of food or clothing",
          "Rarely sharing attention — not bringing you things to show you, not following your point, limited eye contact",
          "Any lost skill — words or abilities your child had and doesn't anymore always deserves a prompt call to the doctor",
        ],
      },
      {
        heading: "Preschool is where it often surfaces",
        paragraphs: [
          "If a teacher has gently raised concerns, take it seriously — not because teachers are always right, but because they see something you can't: your child next to twenty age-mates, all day. Circle time, transitions, and free play are exactly the situations where autism-related differences show.",
          "It works the other way too. If you have concerns and the teacher hasn't noticed, that doesn't cancel your worry. Ask specific questions: Does he play with the other kids or near them? How does she handle the schedule changing? What happens at circle time? The answers are data worth bringing to an evaluator.",
        ],
      },
      {
        heading: "The free evaluation your school district owes you",
        paragraphs: [
          "Here's the piece many parents don't know: from age three, your public school district is legally required to evaluate a child suspected of a developmental delay — free, whether or not your child attends their schools. This is called Child Find, and it can lead to free preschool services and supports.",
          "Put the request in writing (email counts), say you're requesting an evaluation for a suspected developmental delay, and keep a copy. Do this alongside — not instead of — a medical evaluation: the school evaluation unlocks school services, while a medical diagnosis is what [insurance plans look for](/resources/paying-for-aba) before covering therapy like ABA. Families usually want both doors open.",
        ],
      },
      {
        heading: "What to do next",
        paragraphs: [
          "Three moves this week, all free: tell your child's doctor exactly what you and any teachers have noticed, and ask for a referral for an autism evaluation. Send the written evaluation request to your school district. And get on an evaluation clinic's waitlist — or two; being on multiple lists is normal.",
          "If you'd rather have a person walk the path with you, start with our [diagnosis guide](/get-a-diagnosis). We help families across [Kansas](/kansas) and [Colorado](/colorado) figure out who to call, in what order, at no cost — diagnosis or not.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is it too late to catch autism at age 3?",
        a: "Not at all. Three is one of the most common ages for a first diagnosis, and help started now lands in a brain that's still remarkably flexible. The window for making a big difference is wide open at three — the only expensive move is waiting longer.",
      },
      {
        q: "My 3-year-old talks a lot. Could it still be autism?",
        a: "Yes. Autism isn't only about how many words a child has — it's about how words connect people. A 3-year-old can have a big vocabulary and still struggle with back-and-forth conversation, rely on scripted lines, or talk mostly about one topic. An evaluator looks at how language is used, not just how much.",
      },
      {
        q: "Should I ask the school or a doctor for an evaluation?",
        a: "Both, honestly. The school district's free evaluation (required from age three) unlocks school-based services. A medical evaluation gives the formal diagnosis that insurance plans generally look for before covering therapy like ABA. The two run on separate tracks, and smart families start both.",
      },
    ],
    cta: {
      heading: "A teacher said something? You noticed something?",
      body: "Either one is enough of a reason to check. We'll help you line up the right evaluations in Kansas or Colorado — school and medical — and tell you honestly what comes after.",
      primaryLabel: "Get diagnostic help",
      primaryHref: "/get-a-diagnosis",
    },
  },

  {
    slug: "the-m-chat-screening",
    shelf: "understanding",
    cardTitle: "The M-CHAT, explained",
    cardBlurb:
      "The free 5-minute autism screening for toddlers — what it is, what the result means, and what happens after.",
    metaTitle: "The M-CHAT screening: the free 5-minute autism check, explained",
    metaDescription:
      "The M-CHAT is a free, 5-minute autism screening questionnaire for toddlers 16–30 months, usually given at the 18- and 24-month checkups. What it asks, what the score means and doesn't, and what to do after a positive screen.",
    h1: "The M-CHAT: the free 5-minute screening, explained.",
    intro:
      "The M-CHAT is a free screening questionnaire that checks a toddler's risk for autism. A parent answers about 20 yes-or-no questions — five minutes, usually at the 18- or 24-month checkup. It is not a diagnosis. It simply tells you whether a full evaluation is worth doing. Here's how it works.",
    minutes: 5,
    related: [
      "signs-of-autism-at-18-months",
      "signs-of-autism-at-age-2",
      "first-steps-after-a-diagnosis",
      "what-is-aba",
    ],
    sections: [
      {
        heading: "What is the M-CHAT?",
        paragraphs: [
          "M-CHAT stands for Modified Checklist for Autism in Toddlers. It's a short questionnaire — filled out by you, not your child — designed for toddlers between about 16 and 30 months. The current version is called the M-CHAT-R/F (revised, with follow-up).",
          "It exists to solve a real problem: early signs of autism are easy to miss, and toddlers who would benefit from help often wait years for it. A five-minute checklist at a routine checkup catches many of those kids early. That's why checkup guidelines call for autism screening for every child at the 18- and 24-month visits — not just children someone is already worried about.",
        ],
      },
      {
        heading: "How does the screening work?",
        paragraphs: [
          "You answer roughly 20 yes-or-no questions about things you see every day: Does your child point to show you something interesting? Respond to their name? Look where you point? Pretend, wave, and check your reactions? No test is done on your child — you're the expert witness, and your everyday observations are the data.",
          "The answers add up to a risk score: low, medium, or high. Medium scores usually get a short follow-up conversation with the doctor — the 'F' in M-CHAT-R/F — which sorts out toddlers who missed a question for ordinary reasons from those who should be evaluated. The questionnaire itself is copyrighted (free for clinical use), so we won't reproduce it here — and you shouldn't self-score from random websites either. Take it with your child's doctor, where the follow-up questions and the next steps come attached.",
        ],
      },
      {
        heading: "What the score means — and doesn't",
        paragraphs: [
          "A high or medium score does not mean your child has autism. It means the screen found enough to make a real evaluation worthwhile. Plenty of children who screen positive turn out not to be autistic — some have hearing issues, a language delay, or just an off day at 18 months old.",
          "A low score, in turn, doesn't guarantee everything is fine — screens miss some children, which is why the checkup repeats it at 24 months. The rule that serves parents best: the M-CHAT can open the evaluation door, but your own gut can too. If your worry persists after a low score, ask for the referral anyway. Screens are a floor, not a ceiling, on parental concern.",
        ],
      },
      {
        heading: "What happens after a positive screen?",
        paragraphs: [
          "The next step is a full diagnostic evaluation with a specialist — the real, careful look that a checklist can't provide. Ask your child's doctor for referrals, and get on a list quickly; evaluation waitlists can run months. If your child is under three, also call your state's early intervention program, which evaluates free of charge and doesn't need a referral.",
          "This in-between stretch — screened positive, waiting for the evaluation — is exactly where we spend our days helping families. Our [get-a-diagnosis guide](/get-a-diagnosis) maps the path in [Kansas](/kansas) and [Colorado](/colorado), and a 15-minute call gets you a person who knows which waitlists near you are actually moving.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the M-CHAT a diagnosis?",
        a: "No. The M-CHAT is a screening — a quick check of whether a full evaluation is worth doing. Only a proper diagnostic evaluation by a qualified specialist can diagnose autism. Think of the M-CHAT as the smoke detector, not the fire department.",
      },
      {
        q: "My child screened positive on the M-CHAT. What now?",
        a: "Breathe first — many children who screen positive are not autistic. Then act: ask your child's doctor for a referral to a diagnostic evaluation, get on a waitlist now (they run long), and call your state's early intervention program if your child is under three. Checking is free; only waiting costs anything.",
      },
      {
        q: "Where can I take the M-CHAT?",
        a: "The best place is your child's doctor's office, where it's part of the standard 18- and 24-month checkups and the follow-up questions come attached. If your child's checkup didn't include it, just ask — 'Can we do the autism screening today?' is a complete sentence.",
      },
    ],
    cta: {
      heading: "Screened positive and not sure what's next?",
      body: "That's the exact moment we're built for. We'll help you get a real evaluation lined up in Kansas or Colorado, on the shortest waitlist we can find — free, no diagnosis required to call.",
      primaryLabel: "Get diagnostic help",
      primaryHref: "/get-a-diagnosis",
    },
  },
];
