import type { MetadataRoute } from "next";
import { caseStudies } from "@/content/projects";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: SITE_URL, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/curriculo`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    ...caseStudies.map((project) => ({
      url: `${SITE_URL}/projetos/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
