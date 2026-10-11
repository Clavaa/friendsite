import type { Metadata } from "next";
import { Suspense } from "react";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import TrafficBeacon from "../components/TrafficBeacon";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import ScrollBird from "../components/ScrollBird";
import JsonLd from "../components/JsonLd";
import GoogleAnalytics from "../components/GoogleAnalytics";
import MetaPixel from "../components/MetaPixel";
import { siteConfig } from "../../site.config";
import "./globals.css";

/**
 * Sunbird ABA type system:
 * Fraunces display serif (sentence case only — enforced in CSS/components,
 * never uppercase), Nunito Sans variable for body at 17/1.65.
 *
 * Fraunces is self-hosted from src/fonts as two pinned instances: the site
 * only ever sets it at weight 600 with SOFT 100, so the Google variable
 * files (wght + SOFT + opsz: 121 KB roman, 149 KB italic) were instanced to
 * wght=600, SOFT=100 with the optical-size axis kept (33 KB + 42 KB,
 * identical rendering). Rebuild with fontTools:
 *   instancer.instantiateVariableFont(font, {"wght": 600, "SOFT": 100})
 * The declared weight range is 100–900 so the browser never fakes a bold.
 * Both are small enough to preload now (the italic carries the accent
 * words in the homepage H1).
 */
const fraunces = localFont({
  src: "../fonts/fraunces-roman-600.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-fraunces",
  display: "swap",
});

const frauncesItalic = localFont({
  src: "../fonts/fraunces-italic-600.woff2",
  weight: "100 900",
  style: "italic",
  variable: "--font-fraunces-italic",
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: `In-Home ABA Therapy in Kansas & Colorado – Sunbird ABA`,
    template: `%s – Sunbird ABA`,
  },
  description:
    "BCBA-led ABA therapy for kids with autism — at home or daycare across Kansas & Colorado. Insurance checked free. Talk to a real person today.",
  openGraph: {
    siteName: siteConfig.brandName,
    type: "website",
    locale: "en_US",
    // og:title / og:description resolve from each page's title/description.
    images: [
      {
        url: "/images/family-puzzle-kitchen.jpg",
        width: 1600,
        height: 1066,
        alt: "Two women and a young boy working on a colorful shape puzzle together at a sunny kitchen table",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  // Search-engine ownership verification — each tag renders only when its
  // env var is set (Vercel project env), so dev/preview builds stay clean.
  verification: {
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? {
          other: {
            "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION,
          },
        }
      : {}),
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  "@id": `${siteConfig.domain}/#organization`,
  name: siteConfig.brandName,
  url: siteConfig.domain,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  description:
    "BCBA-led ABA therapy provider serving families across Kansas and Colorado.",
  areaServed: [
    { "@type": "State", name: "Kansas" },
    { "@type": "State", name: "Colorado" },
  ],
  medicalSpecialty: "Psychiatric",
  // Ruth is the only named person on the site (client rule) — she also
  // appears as `reviewedBy` on every guide/question article. LBA is her
  // state behavior-analyst license.
  founder: {
    "@type": "Person",
    name: siteConfig.clinicalReviewer.name,
    jobTitle: "MSEd, BCBA, LBA",
  },
  // Social profiles land here as the client sends them (site.config).
  ...(siteConfig.instagramUrl ? { sameAs: [siteConfig.instagramUrl] } : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${frauncesItalic.variable} ${nunitoSans.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:font-bold focus:text-brand-teal focus:shadow-card-lg"
        >
          Skip to main content
        </a>
        <JsonLd data={organizationJsonLd} />
        <TopBar />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollBird />
        <Analytics />
        <GoogleAnalytics />
        <MetaPixel />
        {/* First-party beacon → BigQuery. useSearchParams needs a boundary
            or every page opts out of static rendering; it renders nothing,
            so the fallback is null. */}
        <Suspense fallback={null}>
          <TrafficBeacon />
        </Suspense>
      </body>
    </html>
  );
}
