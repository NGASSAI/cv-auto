import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CV Auto",
    short_name: "CV Auto",
    description: "Créez un CV professionnel en quelques minutes",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#2D5A4A",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}