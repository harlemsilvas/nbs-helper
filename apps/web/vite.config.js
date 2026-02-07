import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/app/",
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      // Esses assets precisam existir em /public do app web (apps/web/public)
      includeAssets: [
        "index.json",
        "politica-privacidade.html",
        "favicon.ico",
        "icon-192.png",
        "icon-512.png",
        "og-image.png",
      ],

      devOptions: {
        enabled: false,
      },

      manifest: {
        name: "NBS Helper - Busca de Códigos NBS 2.0",
        short_name: "NBS Helper",
        description:
          "Ferramenta gratuita para busca de códigos NBS 2.0 para emissão de NFS-e",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",

        // ✅ IMPORTANTE: start_url deve bater com basePath
        start_url: "/app/",
        scope: "/app/",

        icons: [
          // ✅ DICA: aqui use caminhos relativos ao scope
          // (sem /app) pra funcionar melhor em PWA
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        cleanupOutdatedCaches: true,
        skipWaiting: false,
        clientsClaim: false,

        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin === "https://fonts.googleapis.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.endsWith("/index.json"),
            handler: "NetworkFirst",
            options: {
              cacheName: "nbs-index",
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            urlPattern: ({ url }) => url.origin === "https://fonts.gstatic.com",
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-static-cache",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
