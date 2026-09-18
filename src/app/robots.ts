import type { MetadataRoute } from "next";
import { siteConfig } from "../../site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: [
      `${siteConfig.domain}/sitemap/core.xml`,
      `${siteConfig.domain}/sitemap/kansas.xml`,
      `${siteConfig.domain}/sitemap/colorado.xml`,
    ],
  };
}
