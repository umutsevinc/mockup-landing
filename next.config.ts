import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
