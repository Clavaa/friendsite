import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Header from "../components/Header";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import ScrollBird from "../components/ScrollBird";
import JsonLd from "../components/JsonLd";
import GoogleAnalytics from "../components/GoogleAnalytics";
import { siteConfig } from "../../site.config";
import "./globals.css";

/**
 * Sunbird ABA type system:
 * Fraunces 600 display serif with the SOFT + optical-size axes loaded
 * (sentence case only — enforced in CSS/components, never uppercase),
 * Nunito Sans variable for body at 17/1.65.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  // Italic loaded for the tagline's "Support you can feel." treatment.
  style: ["normal", "italic"],
  variable: "--font-fraunces",
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
    default: `ABA therapy for children in Kansas & Colorado | ${siteConfig.brandName}`,
    template: `%s | ${siteConfig.brandName}`,
  },
  description:
    "BCBA-led ABA therapy for children with autism across Kansas and Colorado — in-home, daycare-based and telehealth, from a family-run practice. Free benefit check. Talk to an intake advocate today.",
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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${nunitoSans.variable}`}>
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
      </body>
    </html>
  );
}
