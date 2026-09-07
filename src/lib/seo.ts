import { siteConfig } from "../../site.config";

/**
 * BreadcrumbList JSON-LD for hierarchical pages.
 * Pass items in order from Home down to the current page; the current
 * (last) item carries no URL per Google's guidelines.
 */
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined
        ? { item: `${siteConfig.domain}${item.path}` }
        : {}),
    })),
  };
}
