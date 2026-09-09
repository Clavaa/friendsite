/**
 * The five service lines. Each backs a tinted card on the home page and a
 * full page at /services/[slug]/. Tints rotate through the Sunbird
 * washes (sun-wash butter, mint-wash, meadow-wash — all soft derivations
 * kept inside the brand palette family).
 *
 * Lineup per the client (Sept 2026): In-home ABA · Daycare-based support
 * (replaced school-based) · Parent training (in person AND telehealth) ·
 * In-center ABA (coming soon) · Telehealth (page + nav stay; not in the
 * homepage carousel). Early intervention was removed entirely — its route
 * 301s to in-home ABA (see next.config.ts).
 */

export interface Service {
  slug: string;
  name: string;
  /** Mid-sentence version of the name — keeps "ABA" capitalized. */
  nameLower: string;
  cardTitle: string;
  cardBlurb: string;
  /** Tailwind classes for the card tint + icon chip. */
  tintClass: string;
  chipClass: string;
  /** Renders a "Coming soon" badge on every card + a note on the page. */
  comingSoon?: boolean;
  /** Whether the service appears in the homepage carousel row. */
  inCarousel: boolean;
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
    nameLower: "in-home ABA",
    cardTitle: "In-home ABA therapy",
    cardBlurb:
      "Therapy where real life happens — mealtimes, mornings, siblings and all.",
    tintClass: "bg-sun-wash",
    chipClass: "bg-brand-teal/10 text-brand-teal",
    inCarousel: true,
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
    slug: "daycare-based",
    name: "Daycare-based support",
    nameLower: "daycare-based support",
    cardTitle: "Daycare-based support",
    cardBlurb:
      "Your child's plan travels to daycare — one set of strategies across their whole day.",
    tintClass: "bg-meadow-wash",
    chipClass: "bg-meadow/15 text-meadow-deep",
    inCarousel: true,
    h1: "Daycare-based ABA support",
    metaTitle: "Daycare-based ABA support in Kansas & Colorado",
    metaDescription:
      "ABA support that follows your child to daycare in Kansas and Colorado: on-site sessions, teacher collaboration, and one consistent plan across home and daycare.",
    intro:
      "Skills shouldn't stay home when your child doesn't. When your daycare or preschool partners with us, your child's therapy travels there — a technician works with your child right in their classroom, and everyone who spends the day with your child works from the same playbook.",
    bestFor: [
      "Children whose hardest moments happen at daycare or preschool",
      "Working parents who need therapy inside the childcare day",
      "One consistent plan across home and daycare",
      "Social goals that need real peers to practice with",
    ],
    sections: [
      {
        heading: "How daycare collaboration works",
        paragraphs: [
          "With your written consent and the daycare's partnership, our technician joins your child during their normal day — circle time, free play, snack, transitions. Your BCBA shares strategies with the teachers so the same supports carry through even when we're not in the room.",
          "Every center works a little differently, and availability depends on your daycare's agreement to host sessions. Tell us where your child spends their day and we'll tell you honestly what's possible there — and we're happy to make the first call to the director ourselves.",
        ],
      },
      {
        heading: "Therapy without another stop on your day",
        paragraphs: [
          "For working families, daycare-based support means your child gets their hours without you leaving work early or adding a third drop-off. Sessions happen inside the day your child already has, and you get the same session notes and progress reviews as every Sunbird family.",
        ],
      },
    ],
    photo: {
      src: "/images/picture-cards-classroom.jpg",
      alt: "A woman showing picture cards to a young child at a low classroom table",
    },
  },
  {
    slug: "parent-training",
    name: "Parent training",
    nameLower: "parent training",
    cardTitle: "Parent training",
    cardBlurb:
      "Practical coaching for the moments nobody else sees — in person or by video.",
    tintClass: "bg-mint-wash",
    chipClass: "bg-sun/30 text-ink",
    inCarousel: true,
    h1: "Parent training & coaching",
    metaTitle: "ABA parent training in Kansas & Colorado",
    metaDescription:
      "BCBA-led parent training for Kansas and Colorado families — practical strategies for mealtimes, mornings, and meltdowns, coached in person at home or over video.",
    intro:
      "You spend more waking hours with your child than any therapist ever will — which makes you the most powerful teacher on the team. Parent training turns that time into progress: practical, judgment-free strategies for your real routines, coached live by your BCBA.",
    bestFor: [
      "Mealtimes, mornings, bedtime, and public-place strategies",
      "Parents who want to understand the why, not just the what",
      "Grandparents, siblings, and caregivers who share the day",
      "Keeping skills growing between and beyond sessions",
    ],
    sections: [
      {
        heading: "In person, by video, or both",
        paragraphs: [
          "Parent training happens wherever it works for your family. Many parents like sessions at home, side by side with the BCBA during real moments — dinner, transitions, the bedtime routine. Others prefer video sessions after the kids are asleep. Most families end up mixing both, and either way it's the same coach and the same plan.",
          "This isn't a lecture series. Your BCBA watches a real routine, suggests one change, and practices it with you until it feels natural. Small adjustments, repeated in the moments that matter, are how home life actually gets easier.",
        ],
      },
      {
        heading: "Built into every plan — and available on its own",
        paragraphs: [
          "Every Sunbird treatment plan includes parent training, because skills that only work with the therapist were never the goal. And if what your family needs most right now is coaching for you, ask us — we'll tell you honestly what your insurance covers and what we'd recommend.",
        ],
      },
    ],
    photo: {
      src: "/images/family-puzzle-kitchen.jpg",
      alt: "Two women and a young boy working on a colorful shape puzzle at a kitchen table",
    },
  },
  {
    slug: "center-based-aba",
    name: "In-center ABA",
    nameLower: "in-center ABA",
    cardTitle: "In-center ABA",
    cardBlurb:
      "Purpose-built spaces, peers to practice with, and a gentle on-ramp to school.",
    tintClass: "bg-sun-wash",
    chipClass: "bg-brand-teal/10 text-brand-teal",
    comingSoon: true,
    inCarousel: true,
    h1: "In-center ABA therapy",
    metaTitle: "In-center ABA therapy in Kansas & Colorado — coming soon",
    metaDescription:
      "In-center ABA is coming soon to Sunbird: structured learning spaces, social practice with peers, and school-readiness routines — all BCBA-led. Join the list.",
    intro:
      "A center gives your child what a living room can't: other kids to practice social skills with, learning spaces designed for focus, and the kind of daily structure that makes the jump to preschool or kindergarten feel familiar instead of frightening. Our centers are coming soon — here's what they'll offer, and how to be first in line.",
    bestFor: [
      "Social-skills goals that need real peers",
      "School readiness: circle time, transitions, group instruction",
      "Children who thrive on structure and routine",
      "Families who want a full team on-site every day",
    ],
    sections: [
      {
        heading: "What a day at the center will look like",
        paragraphs: [
          "The day runs on a visual schedule your child learns to follow — one-on-one learning blocks, small-group practice, snack, play, and outdoor time. Every child still has an individual plan; the center is the setting, not the curriculum.",
          "Because BCBAs, technicians, and support staff share one roof, plans get adjusted quickly and coverage never depends on a single person's calendar.",
        ],
      },
      {
        heading: "Want in when doors open?",
        paragraphs: [
          "In-center ABA isn't open yet — but in-home, daycare-based, and telehealth services are, and many center-bound skills start there. Call us and we'll build the right plan for your child now, and add you to the list to hear the moment a center opens near you.",
        ],
      },
    ],
  },
  {
    slug: "telehealth",
    name: "Telehealth",
    nameLower: "telehealth",
    cardTitle: "Telehealth ABA services",
    cardBlurb:
      "Expert BCBA guidance over video — for far-flung towns and full calendars.",
    tintClass: "bg-mint-wash",
    chipClass: "bg-sun/30 text-ink",
    inCarousel: false,
    h1: "Telehealth ABA services",
    metaTitle: "Telehealth ABA services in Kansas & Colorado",
    metaDescription:
      "Video-based ABA services for Kansas and Colorado families: BCBA coaching, remote supervision, and support for families far from a metro area.",
    intro:
      "Kansas and Colorado are big states, and expertise shouldn't require a two-hour drive. Telehealth brings your BCBA to your kitchen table by video — for coaching, caregiver training, and remote supervision that keeps in-person therapy sharp.",
    bestFor: [
      "Families outside the metro areas",
      "BCBA coaching that fits after bedtime",
      "Keeping momentum during travel, illness, or weather weeks",
      "Supplementing in-person sessions with more BCBA time",
    ],
    sections: [
      {
        heading: "What works well over video",
        paragraphs: [
          "Coaching sessions genuinely shine on telehealth: your BCBA watches real moments in your real home and coaches you live — often more naturally than in a clinic. Remote BCBA supervision of in-person sessions also works well, adding expert eyes without adding drive time.",
          "We're honest about limits, too: most young children still need in-person technician hours for direct therapy, and parent training works beautifully in person as well as on video. Telehealth is a powerful part of a plan, not usually the whole plan.",
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
