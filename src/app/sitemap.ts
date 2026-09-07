import type { MetadataRoute } from "next";
import { siteConfig, stateSlugs } from "../../site.config";
import { questionPages } from "../data/questions";
import { services } from "../data/services";
import { countiesByState } from "../data/counties";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

  const staticPaths = [
    "",
    "/services",
    "/get-a-diagnosis",
    "/insurance",
    "/getting-started",
    "/questions",
    "/about",
    "/careers",
  ];

  const statePaths = stateSlugs.flatMap((state) => [
    `/${state}`,
    ...siteConfig.states[state].cities.map((c) => `/${state}/${c.slug}`),
    ...countiesByState[state].map((c) => `/${state}/${c.slug}`),
  ]);

  const servicePaths = services.map((s) => `/services/${s.slug}`);
  const questionPaths = questionPages.map((q) => `/questions/${q.slug}`);

  return [...staticPaths, ...statePaths, ...servicePaths, ...questionPaths].map(
    (path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : path.split("/").length > 2 ? 0.7 : 0.8,
    })
  );
}
