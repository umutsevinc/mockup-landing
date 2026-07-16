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
      // LOCK temporaire : la landing n'est pas prête pour le public — tout
      // le trafic root part sur la waiting list. À retirer au lancement.
      { source: "/", destination: "/waitlist", permanent: false },
    ];
  },
};

export default nextConfig;
