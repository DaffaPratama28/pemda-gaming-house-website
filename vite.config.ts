import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Resolves the public origin used for absolute Open Graph URLs.
 * Order: SITE_URL (manual) → Vercel production domain → Vercel deployment URL → '' (relative).
 * Nothing here is secret and nothing is required for the build to succeed.
 */
function resolveSiteUrl(env: Record<string, string>): string {
  const raw =
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (env.VERCEL_URL && `https://${env.VERCEL_URL}`) ||
    ''
  return raw.replace(/\/+$/, '')
}

/** Replaces the `__SITE_URL__` token in index.html (og:image, og:url, canonical). */
function siteUrlPlugin(siteUrl: string): Plugin {
  return {
    name: 'pgh:site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
  }
}

/**
 * Preloads the two above-the-fold font files (Anton + Space Grotesk, latin subset).
 * Fontsource emits hashed file names, so the tags are injected after bundling.
 */
function preloadFontsPlugin(patterns: RegExp[]): Plugin {
  return {
    name: 'pgh:preload-fonts',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx) {
        if (!ctx.bundle) return
        const files = Object.keys(ctx.bundle).filter((file) =>
          patterns.some((pattern) => pattern.test(file)),
        )
        return files.map((file) => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: `/${file}`,
            as: 'font',
            type: 'font/woff2',
            crossorigin: '',
          },
          injectTo: 'head' as const,
        }))
      },
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      siteUrlPlugin(resolveSiteUrl(env)),
      preloadFontsPlugin([
        /anton-latin-400-normal.*\.woff2$/,
        /space-grotesk-latin-wght-normal.*\.woff2$/,
      ]),
    ],
    build: {
      // three.js + R3F memang besar (~240 KB gzip), tapi di-lazy-load setelah first paint.
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        output: {
          // Vendor dipisah dari kode aplikasi agar cache browser tetap valid antar-deploy.
          // vendor-react punya prioritas tertinggi supaya dependensi bersama (scheduler)
          // tidak tersedot ke vendor-three, yang harus tetap lazy (tidak dimuat di awal).
          codeSplitting: {
            groups: [
              {
                name: 'vendor-react',
                test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                priority: 30,
              },
              {
                name: 'vendor-three',
                test: /node_modules[\\/](three|three-stdlib|@react-three|react-reconciler|its-fine|suspend-react|react-use-measure|zustand)[\\/]/,
                priority: 20,
              },
              {
                // Tanpa @gsap/react: ia bergantung pada react (CJS) di chunk utama → siklus.
                name: 'vendor-motion',
                test: /node_modules[\\/](gsap|lenis)[\\/]/,
                priority: 10,
              },
            ],
          },
        },
      },
    },
  }
})
