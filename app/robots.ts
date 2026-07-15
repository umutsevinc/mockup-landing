import type { MetadataRoute } from "next";

// AI answer engines allowed explicitly — being cited by ChatGPT,
// Perplexity & co is a distribution channel, not a threat.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
    ],
    sitemap: "https://mockup.memselon.com/sitemap.xml",
  };
}
