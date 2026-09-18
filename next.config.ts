import type { NextConfig } from "next";
import townsJson from "./src/data/towns.json";

/**
 * The ten places with first-class city pages (/kansas/wichita, …) are
 * excluded from the town layer; anyone linking their would-be town URL
 * (/kansas/sedgwick/wichita) lands on the real city page via a 301.
 */
const cityRedirects = Object.entries(townsJson).flatMap(([state, data]) =>
  data.cityRedirects.map((r) => ({
    source: `/${state}/${r.county}/${r.slug}`,
    destination: `/${state}/${r.city}`,
    permanent: true,
  }))
);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      ...cityRedirects,
      // The sitemap is sharded per state (see src/app/sitemap.ts); keep
      // the old single-sitemap URL working for anything that stored it.
      {
        source: "/sitemap.xml",
        destination: "/sitemap/core.xml",
        permanent: false,
      },
      // Early intervention was folded into in-home ABA (client request).
      {
        source: "/services/early-intervention",
        destination: "/services/in-home-aba",
        permanent: true,
      },
      // School-based support was reworked into daycare-based support.
      {
        source: "/services/school-based-aba",
        destination: "/services/daycare-based",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
