import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
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
