/**
 * ─────────────────────────────────────────────────────────────────────
 *  PEMDA GAMING HOUSE — pusat semua konten situs.
 *  Mau ganti teks, angka, warna aksen anggota, atau foto? Cukup di sini.
 *  Semua yang bertanda `TODO` masih placeholder lucu-lucuan: ganti dengan
 *  data asli geng sebelum dipamerkan ke grup keluarga.
 * ─────────────────────────────────────────────────────────────────────
 */

/* ───────────────────────────── Tipe ───────────────────────────── */

/**
 * Cara foto di-crop di semua frame potret (kartu, spotlight, galeri).
 * Nilai 0..1 relatif ke ukuran asli foto. Lebar crop dihitung otomatis
 * dari rasio frame, jadi wajah tetap utuh di frame 3:4 maupun 4:5.
 */
export type PhotoCrop = {
  /** Batas atas crop (0 = atas foto). */
  top: number
  /** Tinggi crop (0..1). */
  height: number
  /** Titik tengah horizontal crop (0.5 = tengah). */
  centerX: number
  /** Porsi bawah frame (0..1) yang selalu tertutup banner nama. */
  banner: number
}

export type Photo = {
  src: string
  alt: string
  width: number
  height: number
  crop: PhotoCrop
}

export type Stat = { label: string; value: number }

export type Member = {
  id: string
  name: string
  number: string
  role: string
  tagline: string
  game: string
  /** Warna aksen kecil khusus anggota (stat bar, nomor, glitch). */
  accent: string
  /** Kosongkan untuk memakai placeholder bergaya "NO SIGNAL". */
  photo?: Photo
  stats: Stat[]
}

export type GameAsset = 'crystal' | 'keycaps' | 'ball' | 'grass' | 'crate' | 'crewmate' | 'pawn'

export type Game = {
  title: string
  genre: string
  quip: string
  /** Aset 3D prosedural yang muncul mengikuti kursor saat baris di-hover. */
  asset: GameAsset
}

export type CounterStat = {
  value: number
  /** Nilai awal animasi (default 0). Pakai angka lebih besar untuk efek hitung mundur. */
  from?: number
  suffix?: string
  label: string
  note: string
}

export type GalleryItem = {
  caption: string
  date: string
  /** Isi dengan `Photo` saat foto asli sudah ada. */
  photo?: Photo
  icon: 'controller' | 'trophy' | 'coffee' | 'bolt' | 'camera' | 'moon'
}

/* ─────────────────────────── Identitas situs ─────────────────────────── */

export const SITE = {
  name: 'PEMDA GAMING HOUSE',
  short: 'PGH',
  location: 'Komplek Pemda Jalur 1',
  city: 'Pontianak',
  province: 'Kalimantan Barat',
  /** Koordinat kota Pontianak (bukan alamat rumah), dipakai sebagai hiasan HUD. */
  coords: { lat: "0°01'S", lng: "109°20'E" },
  timeZone: 'Asia/Pontianak',
  season: 'Season 01',
  est: 'Est. zaman wifi masih 1 Mbps', // TODO: ganti dengan tahun berdiri kalau mau serius
  /** Dipakai untuk counter "hari tongkrongan". Format YYYY-MM-DD. */
  foundedOn: '2019-07-01', // TODO: ganti dengan tanggal geng terbentuk
}

export const NAV_LINKS = [
  { id: 'manifesto', label: 'Manifesto' },
  { id: 'squad', label: 'Squad' },
  { id: 'ridho', label: 'Spotlight' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'markas', label: 'Markas' },
  { id: 'galeri', label: 'Galeri' },
] as const

/* ─────────────────────────── Foto Ridho ─────────────────────────── */

/**
 * SATU-SATUNYA sumber foto Ridho. Semua komponen (hero 3D, squad, spotlight,
 * galeri, og:image) merujuk ke konstanta ini. Mau ganti foto? Timpa saja file
 * `public/images/ridho.jpg` dengan nama yang sama.
 *
 * Catatan: foto saat ini punya teks "MAN 1" tertanam di area dagu, makanya
 * `banner` menutup 11.5% bagian bawah frame. Kalau sudah pakai foto bersih,
 * nilai crop boleh disesuaikan (cek tampilannya di semua section).
 */
export const RIDHO_PHOTO: Photo = {
  src: '/images/ridho.jpg',
  alt: 'Potret Ridho, Player 02 PEMDA GAMING HOUSE, menatap kamera',
  width: 1024,
  height: 1536,
  crop: { top: 0.128, height: 0.64, centerX: 0.5, banner: 0.115 },
}

/* ─────────────────────────── Squad ─────────────────────────── */

// TODO: ganti role, tagline, game favorit, dan stat dengan data asli.
// Untuk foto anggota lain: taruh file di public/images/ (mis. daffa.jpg),
// lalu isi `photo: { src: '/images/daffa.jpg', alt: '...', width, height, crop }`.
export const MEMBERS: Member[] = [
  {
    id: 'daffa',
    name: 'Daffa',
    number: '01',
    role: 'The Strategist',
    tagline: 'Rapat strategi 10 menit, eksekusinya 10 detik. Yang penting ada rencana.',
    game: 'Mobile Legends',
    accent: '#3de0ff',
    stats: [
      { label: 'Otak strategi', value: 92 },
      { label: 'Aim', value: 64 },
      { label: 'Ngemil', value: 71 },
      { label: 'Ngaret', value: 58 },
    ],
  },
  {
    id: 'ridho',
    name: 'Ridho',
    number: '02',
    role: 'The Carry',
    tagline:
      'Gendong tim dari early game sampai pulang ke warkop. Pundaknya kuat, sinyalnya kadang.',
    game: 'Valorant',
    accent: '#c6ff3d',
    photo: RIDHO_PHOTO,
    stats: [
      { label: 'Aim', value: 94 },
      { label: 'Clutch', value: 90 },
      { label: 'Gaya', value: 99 },
      { label: 'Jam tidur', value: 23 },
    ],
  },
  {
    id: 'agung',
    name: 'Agung',
    number: '03',
    role: 'The Support',
    tagline: 'Rela mati duluan demi tim. Atau demi kebagian gorengan terakhir.',
    game: 'EA Sports FC',
    accent: '#ffd23d',
    stats: [
      { label: 'Heal', value: 95 },
      { label: 'Sabar', value: 99 },
      { label: 'Ngemil', value: 82 },
      { label: 'Aim', value: 52 },
    ],
  },
  {
    id: 'jojo',
    name: 'Jojo',
    number: '04',
    role: 'The Rage Quitter',
    tagline: 'Pemegang rekor stik terbanting terbanyak se-Jalur 1. Tapi comeback-nya nyata.',
    game: 'Free Fire',
    accent: '#ff7a1a',
    stats: [
      { label: 'Emosi', value: 100 },
      { label: 'Aim', value: 77 },
      { label: 'Sabar', value: 12 },
      { label: 'Comeback', value: 86 },
    ],
  },
  {
    id: 'abip',
    name: 'Abip',
    number: '05',
    role: 'The Wildcard',
    tagline: 'Ndak ada yang tahu dia mau ngapain. Termasuk dia sendiri. Itu senjatanya.',
    game: 'Minecraft',
    accent: '#ff4fa3',
    stats: [
      { label: 'Random', value: 100 },
      { label: 'Hoki', value: 88 },
      { label: 'Strategi', value: 33 },
      { label: 'Gaya', value: 76 },
    ],
  },
]

/* ─────────────────────────── Spotlight Ridho ─────────────────────────── */

// TODO: semua ini fiktif & lucu-lucuan. Ganti dengan versi asli Ridho.
export const RIDHO_PROFILE = {
  rank: 'Sepuh Komplek',
  level: 99,
  role: 'The Carry',
  bio: 'Alasan grup chat rame jam dua pagi. Spesialis clutch menit terakhir, ahli menghilang pas disuruh beli es. Konon pernah menang 1v5, saksinya cuma dia sendiri.',
  quote: 'Tenang, aku gendong.',
  callouts: [
    { label: 'Aim', value: '94 (kata dia)' },
    { label: 'Mental', value: 'Baja ringan' },
    { label: 'Ping', value: '24ms, kalau ndak hujan' },
    { label: 'Skill pasif', value: 'Hilang pas disuruh beli es' },
  ],
}

/* ─────────────────────────── Preloader ─────────────────────────── */

export const PRELOADER_TIPS = [
  'Kalau kalah, salahkan sinyal. Kalau menang, jelas skill.',
  'Es teh = +10 stamina, +5 fokus, -2 isi dompet.',
  'Jangan mabar pas jadwal pemadaman bergilir.',
  '"Bentar lagi, satu match" adalah satuan waktu resmi Jalur 1.',
  'Kalau ditanya mamak, bilang lagi kerja kelompok.',
  'Headset boleh dipakai, panggilan makan tetap kedengaran.',
]

/* ─────────────────────────── Marquee ─────────────────────────── */

export const MARQUEE = {
  roster: MEMBERS.map((member) => member.name.toUpperCase()),
  slogans: ['No lag', 'No mercy', 'Jalur 1', 'Pontianak', 'Khatulistiwa', 'Mabar sampai subuh'],
}

/* ─────────────────────────── Manifesto ─────────────────────────── */

/** Kata di antara `**...**` akan menyala dengan warna aksen. */
export const MANIFESTO =
  'Berawal dari satu colokan T dan lima HP lowbat di teras rumah, lahirlah **PEMDA GAMING HOUSE**: markas paling sok epik di **Komplek Pemda Jalur 1, Pontianak.** Kamek bukan tim esports. Kamek lebih bahaya: lima sahabat dengan wifi pas-pasan, **es teh tanpa batas,** dan mental juara yang muncul tiap lawannya bot. Kalah? Salah sinyal. Menang? Jelas **skill.**'

export const MANIFESTO_FACTS = [
  { value: '05', label: 'Player aktif' },
  { value: '01', label: 'Colokan T' },
  { value: '∞', label: 'Es teh' },
]

/* ─────────────────────────── Arsenal ─────────────────────────── */

// TODO: sesuaikan dengan game yang beneran sering dimainkan.
export const GAMES: Game[] = [
  {
    title: 'Mobile Legends',
    genre: 'MOBA',
    quip: 'Rank Epic abadi. Sudah jadi alamat tetap.',
    asset: 'crystal',
  },
  {
    title: 'Valorant',
    genre: 'FPS Taktis',
    quip: 'Aim 50% skill, 50% doa ibu.',
    asset: 'keycaps',
  },
  {
    title: 'EA Sports FC',
    genre: 'Sepak Bola',
    quip: 'Taktik andalan: oper ke Agung, lalu berdoa.',
    asset: 'ball',
  },
  {
    title: 'Minecraft',
    genre: 'Sandbox',
    quip: 'Rumah impian sudah jadi. Rumah asli belum lunas.',
    asset: 'grass',
  },
  {
    title: 'Free Fire',
    genre: 'Battle Royale',
    quip: 'Booyah? Pernah. Sekali. Tahun lalu.',
    asset: 'crate',
  },
  {
    title: 'Among Us',
    genre: 'Party',
    quip: 'Selalu curiga sama Abip. Selalu benar.',
    asset: 'crewmate',
  },
  {
    title: 'Catur',
    genre: 'Strategi Klasik',
    quip: 'Lawan Pak RT. Belum pernah menang.',
    asset: 'pawn',
  },
]

/* ─────────────────────────── The House ─────────────────────────── */

export const HOUSE = {
  title: ['Markas', 'Jalur 1'],
  description:
    'Bukan gedung kaca, bukan arena esports. Cuma teras rumah, satu colokan T, dan sinyal yang muncul kalau berdiri dekat pagar. Tapi di sinilah sejarah (dan rage quit) tercipta.',
  facts: [
    { label: 'Lokasi', value: 'Komplek Pemda Jalur 1' },
    { label: 'Kota', value: 'Pontianak, Kalbar' },
    { label: 'Lintang', value: '±0°, tetangga khatulistiwa' },
    { label: 'Sinyal', value: '2 bar (dekat pagar)' },
    { label: 'Logistik', value: 'Es teh, gorengan, mi instan' },
    { label: 'Jam buka', value: 'Habis Ashar sampai dicari mamak' },
  ],
  /** Titik di radar. x/y dalam persen (0..100) dari kotak radar. Posisi fiktif. */
  blips: [
    { label: 'Warkop', x: 68, y: 34, tone: 'papaya' },
    { label: 'Warung es teh', x: 30, y: 63, tone: 'bone' },
    { label: 'Lapangan', x: 74, y: 70, tone: 'bone' },
    { label: 'Rumah Pak RT', x: 24, y: 30, tone: 'bone' },
  ],
} as const

/* ─────────────────────────── Stats ─────────────────────────── */

// TODO: angka asal-asalan dengan penuh percaya diri. Ganti kalau ada data asli.
export const STATS: CounterStat[] = [
  { value: 4380, suffix: '+', label: 'Jam mabar / tahun', note: 'Dihitung pakai perasaan.' },
  { value: 1337, label: 'Rage quit', note: 'Mayoritas sumbangan Jojo.' },
  { value: 2190, label: 'Gelas es teh', note: 'Belum termasuk yang tumpah.' },
  { value: 404, label: 'Wifi putus', note: 'Error-nya pun hafal.' },
  { value: 99, suffix: '+', label: '"Bentar lagi, satu match"', note: 'Ndak pernah satu.' },
  { value: 0, from: 50, label: 'Trofi resmi', note: 'Belum. Sabar. Lagi proses.' },
]

/* ─────────────────────────── Galeri ─────────────────────────── */

// TODO: isi `photo` tiap item saat foto asli sudah ada di public/images/.
export const GALLERY: GalleryItem[] = [
  {
    caption: 'Selfie resmi sebelum ranked',
    date: 'P2 // Ridho',
    photo: RIDHO_PHOTO,
    icon: 'camera',
  },
  { caption: 'Mabar subuh, edisi sahur', date: 'Ramadan', icon: 'moon' },
  { caption: 'Turnamen antar gang', date: 'Agustusan', icon: 'trophy' },
  { caption: 'Rapat strategi di warkop', date: 'Tiap malam', icon: 'coffee' },
  { caption: 'Pas mati lampu bergilir', date: 'Sering', icon: 'bolt' },
  { caption: 'Juara 2 (dari 2 tim)', date: 'Musim lalu', icon: 'controller' },
]

/* ─────────────────────────── Footer CTA ─────────────────────────── */

export const FOOTER = {
  headline: ['Gabung?', 'Antri dulu.'],
  sub: 'Slot squad lagi penuh. Tapi kalau datang bawa es teh dan gorengan, permohonanmu kami pertimbangkan (sambil makan).',
  cta: 'Ambil nomor antrian',
  etas: [
    'setelah Jojo naik Mythic',
    'musim hujan depan',
    'kalau wifi sudah 100 Mbps',
    'habis Lebaran (tahunnya menyusul)',
    'setelah Pak RT kalah catur',
    'kalau Abip sudah punya rencana',
  ],
  // TODO: ganti href dengan akun asli. Biarkan '#' kalau belum ada.
  socials: [
    { label: 'Instagram', href: '#' },
    { label: 'TikTok', href: '#' },
    { label: 'YouTube', href: '#' },
    { label: 'Discord', href: '#' },
  ],
}
