import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/siteConfig";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: `${SITE_TAGLINE}. Free, open-source, no signup required.`,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8434F3",
    orientation: "portrait-primary",
    scope: "/",
    id: SITE_URL,
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["productivity", "utilities"],
    lang: "en",
  };
}
