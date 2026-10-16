// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";
import { imagetools } from "vite-imagetools";

// Nitro selects a different public directory for Vercel builds.
const publicDir = !process.env.LOVABLE_NITRO_PRESET &&
  (process.env.VERCEL || process.env.NITRO_PRESET === "vercel")
  ? ".vercel/output/static"
  : ".output/public";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [
      imagetools(),
      VitePWA({
        strategies: "generateSW",
        outDir: publicDir,
        registerType: "prompt",
        injectRegister: null,
        filename: "sw.js",
        includeAssets: ["offline.html"],
        devOptions: { enabled: false },
        manifest: {
          name: "CA-ADS IFSP São Paulo",
          short_name: "CA-ADS",
          start_url: "/",
          display: "standalone",
          background_color: "#0b0714",
          theme_color: "#7c3aed",
          icons: [{ src: "/favicon.ico.jpg", sizes: "any", type: "image/jpeg" }],
        },
        workbox: {
          // Cache the app shell, but fetch optional sections/WebGL only when used.
          globDirectory: publicDir,
          globPatterns: ["**/*.{js,css}"],
          globIgnores: ["**/ParticleField-*.js", "**/MapaCampus-*.js", "**/Comunidades-*.js", "**/Tutoriais-*.js"],
          navigateFallback: null,
          navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          skipWaiting: false,
          runtimeCaching: [
            {
              urlPattern: ({ request }: { request: Request }) => request.mode === "navigate",
              handler: "NetworkFirst",
              options: {
                cacheName: "html-navigations",
                networkTimeoutSeconds: 4,
                expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
                precacheFallback: { fallbackURL: "/offline.html" },
              },
            },
            {
              urlPattern: ({ request, sameOrigin }: { request: Request; sameOrigin: boolean }) =>
                sameOrigin && ["script", "style", "font", "image"].includes(request.destination),
              handler: "CacheFirst",
              options: {
                cacheName: "static-assets",
                expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "google-fonts" },
            },
          ],
        },
      }).map((plugin) => ({
        ...plugin,
        // Generate once, before Nitro snapshots the public asset metadata.
        applyToEnvironment: (environment: { name: string }) => environment.name === "client",
      })),
    ],
  },
});
