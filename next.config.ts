import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // LOCK temporaire : la landing n'est pas prête pour le public — tout
  // le trafic root part sur la waiting list. À retirer au lancement.
  async redirects() {
    return [{source: "/", destination: "/waitlist", permanent: false}];
  },
};

export default nextConfig;
