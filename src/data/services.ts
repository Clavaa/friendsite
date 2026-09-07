/**
 * The five service lines. Each backs a tinted card on the home page and a
 * full page at /services/[slug]/. Tints rotate through the Sunbird
 * washes (sun-wash butter, mint-wash, meadow-wash — all soft derivations
 * kept inside the brand palette family).
 */

export interface Service {
  slug: string;
  name: string;
  cardTitle: string;
  cardBlurb: string;
  /** Tailwind classes for the card tint + icon chip. */
  tintClass: string;
  chipClass: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  bestFor: string[];
  sections: { heading: string; paragraphs: string[] }[];
  /**
   * Optional hero photo. Alt text must honestly describe what's depicted —
   * never caption or imply the people shown are clients or staff. Services
   * without a well-matching photo keep the styled placeholder instead.
   */
  photo?: { src: string; alt: string };
}

export const services: Service[] = [
  {
    slug: "in-home-aba",
    name: "In-home ABA",
    cardTitle: "In-home ABA therapy",
    cardBlurb:
      "Therapy where real life happens — mealtimes, mornings, siblings and all.",
    tintClass: "bg-sun-wash",
    chipClass: "bg-brand-teal/10 text-brand-teal",
    h1: "In-home ABA therapy",
    metaTitle: "In-home ABA therapy in Kansas & Colorado",
    metaDescription:
      "One-on-one ABA therapy in your own home across Kansas and Colorado — daily-living skills taught where they're actually used, with parents in the loop.",
    intro:
      "Some skills only make sense where they're used. Getting dressed happens in a bedroom. Dinner-table patience happens at a dinner table. In-home ABA brings a trained behavior technician — and a BCBA-designed plan — to the place those skills live.",
    bestFor: [
      "Younger children and first-time therapy families",
      "Daily-living goals: dressing, meals, toileting, sleep routines",
      "Families where the commute is the barrier",
      "Parent coaching in the environment where it's used",
    ],
    sections: [
      {
        heading: "What a home session looks like",
        paragraphs: [
          "Your technician arrives with a plan built around your child's goals and your home's real rhythm. Sessions blend structured practice with play your child already loves — and because you're nearby, parent coaching happens naturally rather than in a conference room.",
          "The technician records progress at every session, and your BCBA visits regularly to watch, adjust the plan, and answer your questions face to face.",
        ],
      },
      {
        heading: "Your home stays your home",
        paragraphs: [
          "We work around naps, siblings, and schedules — not the other way. No furniture rearranging, no clinic-in-your-living-room takeover. If a session needs materials, we bring them and we take them back.",
        ],
      },
    ],
    photo: {
      src: "/images/magnetic-tiles-living-room.jpg",
      alt: "A woman and a toddler girl building a house out of colorful magnetic tiles together on a living room rug",
    },
  },
  {
    slug: "center-based-aba",
    name: "Center-based ABA",
    cardTitle: "Center-based ABA therapy",
    cardBlurb:
      "Purpose-built spaces, peers to practice with, and a gentle on-ramp to school.",
    tintClass: "bg-mint-wash",
    chipClass: "bg-sun/30 text-ink",
    h1: "Center-based ABA therapy",
    metaTitle: "Center-based ABA therapy in Kansas & Colorado",
    metaDescription:
      "Center-based ABA in Kansas and Colorado: structured learning spaces, social practice with peers, and school-readiness routines — all BCBA-led.",
    intro:
      "A center gives your child what a living room can't: other kids to practice social skills with, learning spaces designed for focus, and the kind of daily structure that makes the jump to preschool or kindergarten feel familiar instead of frightening.",
    bestFor: [
      "Social-skills goals that need real peers",
      "School readiness: circle time, transitions, group instruction",
      "Children who thrive on structure and routine",
      "Families who want a full team on-site every day",
    ],
    sections: [
      {
        heading: "A day at the center",
        paragraphs: [
          "The day runs on a visual schedule your child learns to follow — one-on-one learning blocks, small-group practice, snack, play, and outdoor time. Every child still has an individual plan; the center is the setting, not the curriculum.",
          "Because BCBAs, technicians, and support staff share one roof, plans get adjusted quickly and coverage never depends on a single person's calendar.",
        ],
      },
      {
        heading: "Built for the kindergarten handoff",
        paragraphs: [
          "Center routines are deliberately school-shaped: lining up, raising hands, sitting for group instruction, following a teacher's lead. For children heading to a classroom, we practice the exact skills their first teacher will hope to see on day one.",
        ],
      },
    ],
  },
  {
    slug: "school-based-aba",
    name: "School-based support",
    cardTitle: "School-based support",
    cardBlurb:
      "Your child's plan travels to the classroom — and we speak fluent IEP.",
    tintClass: "bg-meadow-wash",
    chipClass: "bg-meadow/15 text-meadow-deep",
    h1: "School-based ABA support",
    metaTitle: "School-based ABA support in Kansas & Colorado",
    metaDescription:
      "ABA support that follows your child to school in Kansas and Colorado: classroom collaboration, IEP-team participation, and consistent strategies across settings.",
    intro:
      "Skills shouldn't stay home when your child doesn't. When schools and districts partner with us, your child's ABA strategies travel into the classroom — and everyone teaching your child works from the same playbook.",
    bestFor: [
      "Children whose hardest moments happen at school",
      "Families who want one consistent plan across home and classroom",
      "IEP teams looking for behavior expertise at the table",
      "Transitions: new school, new grade, new aide",
    ],
    sections: [
      {
        heading: "How school collaboration works",
        paragraphs: [
          "With your written consent and the school's partnership, your BCBA can observe in the classroom, share strategies with teachers and paras, and join IEP meetings as part of your child's team. The goal is one consistent set of expectations and supports across your child's whole day.",
          "Every district works a little differently, and availability depends on your school's agreements. Tell us your district and we'll tell you honestly what's possible there.",
        ],
      },
      {
        heading: "We prepare you for the IEP table",
        paragraphs: [
          "IEP meetings can feel like a room full of acronyms deciding your child's year. We help you prepare: what the data shows, what to ask for, and how ABA goals and school goals can reinforce each other instead of competing.",
        ],
      },
    ],
  },
  {
    slug: "early-intervention",
    name: "Early intervention",
    cardTitle: "Early intervention (ages 1–5)",
    cardBlurb:
      "The earliest years matter most. Play-based therapy for the littlest learners.",
    tintClass: "bg-sun-wash",
    chipClass: "bg-brand-teal/10 text-brand-teal",
    h1: "Early intervention ABA (ages 1–5)",
    metaTitle: "Early intervention ABA for toddlers in Kansas & Colorado",
    metaDescription:
      "Play-based early intervention ABA for children ages 1–5 in Kansas and Colorado: first words, play skills, and parent coaching in the years that matter most.",
    intro:
      "Decades of research agree on one thing loudly: the earlier support starts, the bigger the difference it makes. Early intervention ABA is built for toddlers and preschoolers — heavy on play, light on tables, with parents woven into every plan.",
    bestFor: [
      "Toddlers with a new diagnosis or on an evaluation waitlist",
      "First words and first requests — communication before frustration",
      "Play skills, imitation, and early social connection",
      "Parents who want coaching, not just drop-off therapy",
    ],
    sections: [
      {
        heading: "What toddler therapy looks like",
        paragraphs: [
          "It looks like playing on the floor — because it is. Naturalistic teaching follows your toddler's attention: the therapist becomes the best part of bubbles, tickles, and trucks, and language and social skills grow inside the fun. Sessions are shorter, movement-filled, and built around your child's nap-and-snack reality.",
        ],
      },
      {
        heading: "Parents are half the program",
        paragraphs: [
          "At this age, you spend more waking hours with your child than any therapist ever will — which makes you the most powerful teacher on the team. Parent coaching is built into every early-intervention plan: simple strategies for meals, sleep, tantrums, and talking, practiced live with your BCBA.",
          "If your child is under 3, ask us how ABA works alongside your state's free early-intervention program — the two can and should coordinate.",
        ],
      },
    ],
    photo: {
      src: "/images/playground-bubbles.jpg",
      alt: "A woman blowing bubbles with a laughing young boy on a sunny playground while he reaches out to pop one",
    },
  },
  {
    slug: "telehealth",
    name: "Telehealth",
    cardTitle: "Telehealth & parent coaching",
    cardBlurb:
      "Expert guidance over video — for far-flung towns and full calendars.",
    tintClass: "bg-mint-wash",
    chipClass: "bg-sun/30 text-ink",
    h1: "Telehealth ABA & parent coaching",
    metaTitle: "Telehealth ABA & parent coaching in Kansas & Colorado",
    metaDescription:
      "Video-based ABA services for Kansas and Colorado families: BCBA parent coaching, remote supervision, and support for families far from a center.",
    intro:
      "Kansas and Colorado are big states, and expertise shouldn't require a two-hour drive. Telehealth brings your BCBA to your kitchen table by video — for parent coaching, caregiver training, and remote supervision that keeps in-person therapy sharp.",
    bestFor: [
      "Families outside the metro areas",
      "Parent coaching that fits after bedtime",
      "Keeping momentum during travel, illness, or weather weeks",
      "Supplementing in-person sessions with more BCBA time",
    ],
    sections: [
      {
        heading: "What works well over video",
        paragraphs: [
          "Parent coaching genuinely shines on telehealth: your BCBA watches real moments in your real home and coaches you live — often more naturally than in a clinic. Remote BCBA supervision of in-person sessions also works well, adding expert eyes without adding drive time.",
          "We're honest about limits, too: most young children still need in-person technician hours for direct therapy. Telehealth is a powerful part of a plan, not usually the whole plan.",
        ],
      },
      {
        heading: "Simple to join",
        paragraphs: [
          "If you can join a video call, you can do telehealth — a phone, tablet, or laptop is all it takes. Sessions run on a secure, healthcare-grade video platform, and our team helps you get set up before the first appointment.",
        ],
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
