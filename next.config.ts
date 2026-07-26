import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next 16 : toute qualité next/image non listée ici → 400 sur
  // /_next/image (le carousel utilise quality={95}).
  images: {
    qualities: [75, 95],
  },
  async redirects() {
    return [
      // Rebrand Mockiosa : l'ancien domaine redirige intégralement
      // (chemin + query préservés) vers mockiosa.memselon.com.
      {
        source: "/:path*",
        has: [{ type: "host", value: "mockup.memselon.com" }],
        destination: "https://mockiosa.memselon.com/:path*",
        permanent: true,
      },
      // "/free" — promis dans le Launch Kit (PH comment, FAQ annuaires) :
      // le goût gratuit = les mockups 3D interactifs des pages SEO.
      { source: "/free", destination: "/mockups", permanent: false },
      // Launch 26/07/2026 : la home est ouverte au public. Tout le trafic
      // /waitlist (bookmarks, backlinks des annuaires) redirect vers `/`
      // pour que les visiteurs atterrissent sur le hero live 3D.
      { source: "/waitlist", destination: "/", permanent: true },
      { source: "/waitlist/:path*", destination: "/", permanent: true },
      // /blog vit sur Framer (memselon.com) — l'article de launch est
      // là-bas. Redirect permanent pour éviter la 404 côté landing.
      {
        source: "/blog",
        destination:
          "https://www.memselon.com/blog/mockiosa-launch-real-3d-mockups-in-framer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
