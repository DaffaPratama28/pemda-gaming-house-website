# CLAUDE.md

Konteks proyek untuk sesi Claude Code berikutnya. Bahasa komunikasi dengan pemilik repo: **Indonesia santai**.

## Ringkasan

Website single-page "PEMDA GAMING HOUSE": markas digital 5 sahabat (Daffa, Ridho, Agung, Jojo, Abip) di Komplek Pemda Jalur 1, Pontianak. Gaya visual terinspirasi landonorris.com: tipografi raksasa, satu aksen neon (acid lime `#c6ff3d`, sekunder papaya `#ff7a1a`), scroll-driven storytelling, aset 3D prosedural, HUD gaming. Deploy target: Vercel (pemilik repo yang deploy sendiri, **jangan jalankan perintah `vercel`**).

## Perintah

```bash
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build  (wajib lolos sebelum commit)
npm run lint         # ESLint (wajib 0 error/warning)
npm run format:check # Prettier
npm run preview      # http://localhost:4173
```

Debug 3D: `?gl=off` (paksa fallback DOM), `?gl=force` (paksa WebGL walau renderer software).

## Aturan kerja

- Branch kerja: **`dev`**. Jangan force push. Jangan commit `.env*`.
- Conventional Commits (`feat:`, `fix:`, `perf:`, `refactor:`, `chore:`, `docs:`), commit kecil & bertahap.
- Sebelum commit: `npm run lint && npm run build && npm run format:check`.
- Semua konten (teks, angka, foto, link) hanya di `src/data/content.ts`. Jangan hardcode konten di komponen.
- Foto Ridho dirujuk lewat satu konstanta `RIDHO_PHOTO`. Foto saat ini punya teks "MAN 1" di dagu → banner bawah (`crop.banner`) wajib selalu menutupinya di setiap frame (DOM `CroppedPhoto`, shader `uBanner`, HUD canvas, og-image).
- Jangan mengarang fakta pribadi anggota; placeholder diberi `// TODO`.

## Arsitektur

```
src/
├─ data/content.ts        # sumber konten tunggal
├─ lib/
│  ├─ gsap.ts             # register ScrollTrigger + useGSAP, EASE & MEDIA (matchMedia)
│  ├─ motion.ts           # state gerak mutable (pointer, scroll velocity, progress hero/spotlight)
│  ├─ smoothScroll.ts     # Lenis ↔ gsap.ticker ↔ ScrollTrigger, scrollToTarget, setScrollLocked
│  ├─ loader.ts           # progres preloader (boot/fonts/photo/scene)
│  ├─ device.ts           # deteksi WebGL (failIfMajorPerformanceCaveat), kualitas, DPR
│  └─ photo.ts            # crop foto konsisten untuk semua rasio frame
├─ components/            # UI global & primitive
├─ sections/              # 12 section (urutan di App.tsx)
├─ three/                 # semua kode R3F (di-lazy-load, tidak boleh diimpor statis dari luar)
└─ styles/                # Tailwind v4 @theme + effects.css
```

Konsep penting:

- **State gerak tanpa re-render**: event/ScrollTrigger menulis ke `motion` (`lib/motion.ts`), `useFrame`/`gsap.ticker` membacanya.
- **PhotoPlane** (`three/PhotoPlane.tsx`): plane WebGL yang menempel ke rect elemen DOM jangkar. Layout tetap diatur CSS; elemen DOM juga berfungsi sebagai LCP & fallback (disembunyikan saat `glReady`).
- **SceneWarmup**: env map hasil bake (`three/studio-env.png`, CubeUV, skala HDR `ENV_SCALE`) dipasang dulu, lalu `renderer.compileAsync()`; frameloop `'never'` sampai siap. Ini yang menjaga TBT rendah.
- Canvas: `resize={{ offsetSize: true }}` (transform CSS tidak boleh mengecilkan canvas), frameloop `'never'` saat di luar layar.
- Chunk: `vendor-react`, `vendor-motion`, `vendor-three` (lazy) di `vite.config.ts`. Jangan masukkan paket bersama (react, scheduler) ke grup vendor-three dan jangan masukkan `@gsap/react` ke vendor-motion (bikin siklus chunk).

## Konvensi kode

- TypeScript strict + `noUncheckedIndexedAccess`; tanpa `any`; `import type` untuk tipe.
- Komponen kecil; logika ke hook (`src/hooks`). File komponen hanya mengekspor komponen (react-refresh).
- Rule React Compiler (`eslint-plugin-react-hooks` v7) aktif:
  - jangan mutasi nilai hasil hook (`useThree`, `useMemo`, state). Mutasi objek three.js lewat ref di `useFrame`, lewat argumen `state` di `useFrame`, atau lewat `useThree((s) => s.get)()` di effect.
  - jangan `setState` sinkron di effect → pakai `useSyncExternalStore` (lihat `useMediaQuery`, `useClock`).
  - jangan `Math.random()`/`Date.now()` saat render → di handler/effect atau konstanta modul.
- Animasi GSAP selalu di `useGSAP` + `gsap.matchMedia()` dengan `MEDIA.motion`/`MEDIA.reduce`; reduced motion = tanpa pin, tanpa Lenis, tampilan statis.
- Tailwind v4: utilitas `translate-*`/`scale-*` memakai properti CSS terpisah (`translate`, `scale`) yang tergabung dengan transform GSAP → jangan pasang keduanya di elemen yang sama.
- Tekstur canvas & material bersama di-cache di modul (dibuat sekali). Geometri/material JSX di-dispose otomatis oleh R3F.

## Dependensi yang sengaja dipin

- `three` dipin `^0.182.0`: r183+ men-deprecate `THREE.Clock` yang masih dipakai R3F 9 (warning di console). Upgrade bersama R3F v10.

## Verifikasi visual

Belum ada test otomatis. Untuk cek tampilan: `npm run build && npm run preview`, buka di browser desktop & mobile (DevTools device mode), cek console bersih, coba `prefers-reduced-motion` (DevTools → Rendering), dan Lighthouse desktop (target Performance ≥ 85).
