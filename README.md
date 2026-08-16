# ⚡ SkillBounty

<div align="center">

![SkillBounty Banner](https://img.shields.io/badge/Platform-SkillBounty-4f46e5?style=for-the-badge&logo=rocket&logoColor=white)
![Next.js 16](https://img.shields.io/badge/Next.js%2016-App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.x-2d3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20RLS-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-18%20Passed%20(100%25)-45ba4b?style=for-the-badge&logo=playwright&logoColor=white)

<br/>

**Marketplace Micro-Bounty Bergaransi Rekber Otomatis (Escrow) & Proof-of-Work Live Interaktif.**  
*Menghubungkan UMKM / Klien dengan Talenta Developer & Desainer secara aman, cepat, dan transparan.*

[Demo & Showcase](#-fitur-utama) • [Tech Stack](#-arsitektur--tech-stack) • [Instalasi Cepat](#-panduan-instalasi--menjalankan-proyek) • [Skema Database](#-arsitektur-database--keamanan) • [Dokumentasi API](#-dokumentasi-endpoint-api)

</div>

---

## 📖 Ringkasan Proyek

**SkillBounty** adalah platform marketplace tugas mikro (*micro-task bounty*) yang dirancang khusus untuk memecahkan masalah klasik *freelance* di Indonesia: **ketidakpastian pembayaran untuk talenta** dan **kualitas hasil kerja yang tidak sesuai bagi klien**.

Dengan **Sistem Rekening Bersama (Escrow)** terintegrasi dan **Proof-of-Work (Live Preview Embed)**, setiap rupiah yang disetor klien dikunci secara aman sebelum pengerjaan dimulai, dan talenta membuktikan hasil kerjanya secara *realtime* melalui URL aplikasi interaktif sebelum dana dicairkan.

---

## 🌟 Fitur Utama

### 🛡️ 1. Rekening Bersama (Escrow Lock & Auto-Release)
- Dana tugas 100% dikunci di akun rekber saat bounty dibuat.
- Dana otomatis cair ke saldo talenta begitu hasil tugas disetujui klien.
- Dilengkapi **Cron Background Worker** untuk pelepasan dana otomatis jika klien tidak merespons submission dalam waktu 48 jam.

### 👁️ 2. Proof-of-Work & Live Sandbox Preview
- Talenta mengunggah hasil kerja berupa **Live Demo URL** dan repositori GitHub.
- Klien dapat mencoba langsung hasil aplikasi di dalam bingkai *iframe* yang aman (*sandboxed*) tanpa perlu mengunduh file atau clone repo secara manual.

### ⚖️ 3. Pusat Mediasi & Resolusi Sengketa (Dispute Resolution Hub)
- Jika terjadi ketidaksesuaian hasil kerja atau deadlock komunikasi, Admin bertindak sebagai mediator netral.
- Opsi penyelesaian fleksibel: **Pencairan Penuh ke Talenta**, **Pengembalian Dana (Refund) ke Klien**, atau **Pembagian Adil (Split 50/50)**.

### 💸 4. Dompet Talenta & Antrian Verifikasi Penarikan (Payout)
- Manajemen saldo bersih talenta dengan riwayat transaksi transparan.
- Form penarikan dana ke rekening bank / e-wallet dengan proteksi *anti-race-condition* dan antrian audit verifikasi admin.

### 💬 5. Notifikasi Realtime WebSocket & Heartbeat Keeper
- Notifikasi push instan saat ada tugas baru, submission masuk, revisi diminta, atau penarikan dana diproses.
- Dilengkapi audio alert dinamis dan mekanisme *ping/pong heartbeat* 30 detik untuk mencegah kebocoran memori (*memory leaks*).

### 🎨 6. UI/UX Bersih & Desain Modern
- Tema visual gelap (*dark mode*) terinspirasi GitHub Dark & Stitch Design System.
- **Menu Aksi Titik 3 (*3-Dots Kebab Action Menu*)** yang rapi dengan penutupan otomatis saat klik di luar area (*click-outside listener*).
- **Pagination responsif** dengan indikator nomor halaman aktif dan filter kategori instan.

---

## 🏗️ Arsitektur & Tech Stack

```mermaid
graph TD
    User([Pengguna: Klien / Talenta / Admin])
    
    subgraph Frontend [Frontend - Next.js 16 (Port 3000)]
        UI[App Router & Tailwind UI Components]
        Store[Zustand / LocalStore Hybrid State]
        WSClient[WebSocket Realtime Toast Provider]
    end

    subgraph Backend [Backend - Express.js API (Port 5000)]
        Router[REST Endpoints & Controllers]
        Cron[48h Auto-Release Background Worker]
        WSServer[WebSocket Server + Heartbeat Keeper]
        Prisma[Prisma ORM Client]
    end

    subgraph CloudDB [Cloud Database - Supabase PostgreSQL]
        DB[(PostgreSQL Database)]
        RLS[Row Level Security Active on 8 Tables]
        Indexes[12 B-Tree Performance Indexes]
    end

    User --> UI
    UI --> Router
    UI <--> WSClient
    WSClient <--> WSServer
    Router --> Prisma
    Cron --> Prisma
    Prisma --> RLS
    RLS --> DB
```

| Layer | Teknologi | Keterangan |
|---|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript | Server Components & Client Interactive Pages |
| **Styling** | Tailwind CSS, Lucide React Icons | Dark modern GitHub-inspired UI tokens |
| **Backend API** | Node.js, Express.js, TypeScript (`tsx`) | RESTful modular controllers & middlewares |
| **Database & ORM** | Supabase (PostgreSQL 15), Prisma ORM 6 | Pooler & Direct Connection URLs, RLS Protected |
| **Realtime** | WebSocket (`ws`), Web Audio API | Live broadcast updates & notification toasts |
| **Automation** | Node-Cron Worker | 48-hour auto-release escrow lifecycle |
| **Testing** | Playwright Test Runner (Chromium) | 18 Full E2E Integration Test Cases (100% Passed) |

---

## 📁 Struktur Direktori

```text
skill-bounty/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Skema database relasional & indeks performa
│   │   ├── seed.ts              # Seeder data awal (User, Bounty, Submission, dll)
│   │   └── enable-rls.ts        # Script aktivasi Supabase Row Level Security
│   ├── src/
│   │   ├── controllers/         # Logika bisnis (Auth, Bounty, Escrow, Wallet, Dispute)
│   │   ├── lib/                 # Prisma client, WebSocket server, Cron worker
│   │   ├── routes/              # Express API route declarations
│   │   └── server.ts            # Entry point backend server
│   ├── .env                     # Variabel lingkungan database & server
│   └── package.json
├── frontend/
│   ├── e2e/
│   │   └── skill-bounty.spec.ts # 18 skenario pengujian Playwright E2E
│   ├── src/
│   │   ├── app/                 # Next.js App Router pages
│   │   │   ├── admin/           # Dashboard Admin, Disputasi, & Penarikan Dana
│   │   │   ├── bounties/        # Marketplace Bounty, Detail, Submission, Review
│   │   │   ├── client/          # Dashboard Klien & Form Pembuatan Bounty
│   │   │   ├── talent/          # Dashboard Talenta, Portofolio CRUD, Dompet
│   │   │   ├── login/           # Halaman Login & Role Toggle Demo
│   │   │   └── register/        # Halaman Pendaftaran Akun
│   │   ├── components/          # Komponen UI, Navbar, Toast, State Kit
│   │   ├── lib/                 # Store Zustand, Web Audio, Utilities
│   │   └── types/               # TypeScript interfaces & types
│   └── package.json
├── docs/                        # Dokumentasi PRD & spesifikasi desain
└── README.md                    # Dokumentasi utama proyek
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 📋 Prasyarat
- **Node.js**: Versi `>= 18.18.0` atau `20.x`
- **npm** atau **pnpm**
- **Git**

---

### 1️⃣ Clone Repositori
```bash
git clone https://github.com/your-username/skill-bounty.git
cd skill-bounty
```

---

### 2️⃣ Konfigurasi & Jalankan Backend

1. Buka folder `backend` dan pasang dependensi:
   ```bash
   cd backend
   npm install
   ```

2. Buat file `.env` di dalam folder `backend/`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
   JWT_SECRET="skillbounty-super-secret-jwt-key"
   CLIENT_URL="http://localhost:3000"
   ```

3. Sinkronisasi skema ke database & jalankan seeder:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

4. Jalankan backend server:
   ```bash
   npm run dev
   # Server aktif di http://localhost:5000 (REST API) & ws://localhost:5000 (WebSocket)
   ```

---

### 3️⃣ Konfigurasi & Jalankan Frontend

1. Buka terminal baru, masuk ke folder `frontend`:
   ```bash
   cd frontend
   npm install
   ```

2. Buat file `.env.local` di dalam folder `frontend/`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_WS_URL=ws://localhost:5000
   ```

3. Jalankan server pengembangan Next.js:
   ```bash
   npm run dev
   # Buka browser di http://localhost:3000
   ```

---

## 🧪 Menjalankan Pengujian Otomatis (E2E Tests)

SkillBounty dilengkapi dengan rangkaian uji otomatis **Playwright** yang menguji seluruh 18 alur pengguna dari hulu ke hilir:

```bash
cd frontend
npx playwright test
```

Hasil pengujian:
```text
Running 18 tests using 1 worker
  ✓ Page 1: Landing Page renders Hero, Pipeline, Showcase & Trust
  ✓ Page 2: Register Page - Role Toggle & Form Validation
  ✓ Page 3: Login Page - Role Redirection & Quick Login Demo
  ✓ Page 4: Marketplace Bounty - Search & Filters
  ✓ Page 5: Detail Bounty & Criteria Checklist
  ✓ Page 6: Public Talent Profile & Live Iframe Preview
  ✓ Page 7: Talent Dashboard - Balance & Task History Tabs
  ✓ Page 8: Portfolio CRUD - Add & Live URL Preview
  ✓ Page 9: Form Submission Tugas with Revision Tracker
  ✓ Page 10: Talent Wallet - Balance & Payout Request Form
  ✓ Page 11: Client Dashboard - Escrow Monitoring & Review Action
  ✓ Page 12: Buat Bounty - 2-Step Wizard & Escrow Deposit
  ✓ Page 13: Client Review Submission - Approve, Revision & Dispute
  ✓ Page 14: Review & Rating (2-Way Feedback)
  ✓ Page 15: Admin Dashboard - Dispute & Payout Metrics
  ✓ Page 16: Admin Dispute Moderation Case & Decision
  ✓ Page 17: Admin Withdrawal Verification Queue
  ✓ Page 18: Design System & State Kit Showcase

  18 passed (100% SUCCESS)
```

---

## 🔐 Arsitektur Database & Keamanan

### 1. Perlindungan Row Level Security (RLS)
Seluruh 8 tabel database pada Supabase dilindungi oleh kebijakan RLS:
- `User`
- `PortfolioItem`
- `Bounty`
- `Submission`
- `Escrow`
- `Dispute`
- `Review`
- `Withdrawal`

### 2. Transaksi Finansial ACID (`prisma.$transaction`)
Semua mutasi saldo dompet, pelepasan escrow, penarikan dana, dan pembagian mediasi diselesaikan dalam satu transaksi basis data atomik untuk mencegah *race condition* dan *overdraft*.

### 3. Keamanan Iframe Sandbox
Semua pratinjau live demo yang disubmit oleh talenta diisolasi dengan:
```html
<iframe sandbox="allow-scripts allow-same-origin" src="..." />
```
Mencegah potensi serangan *parent-window hijacking*, pembobolan cookie sesi, atau eksekusi *untrusted popups*.

---

## 📡 Dokumentasi Endpoint API

| Metode | Endpoint | Deskripsi | Hak Akses |
|---|---|---|---|
| `POST` | `/api/auth/register` | Mendaftarkan akun baru (Klien / Talenta) | Publik |
| `POST` | `/api/auth/login` | Otentikasi dan penerbitan token sesi | Publik |
| `GET` | `/api/bounties` | Mendapatkan daftar tugas mikro dengan filter | Publik |
| `GET` | `/api/bounties/:id` | Detail bounty beserta kriteria & submission | Publik |
| `POST` | `/api/bounties` | Membuat bounty baru dan mengunci dana rekber | Klien |
| `POST` | `/api/submissions` | Mengirim submission tugas (Demo URL + Repo) | Talenta |
| `PATCH` | `/api/submissions/:id/approve` | Menyetujui hasil kerja & mencairkan escrow | Klien (Pemilik) |
| `PATCH` | `/api/submissions/:id/revision` | Meminta perbaikan tugas dengan catatan revisi | Klien (Pemilik) |
| `POST` | `/api/disputes` | Membuka tiket mediasi sengketa tugas | Klien / Talenta |
| `PATCH` | `/api/disputes/:id/resolve` | Keputusan mediasi (Release / Refund / Split) | Admin |
| `GET` | `/api/wallet/balance` | Memeriksa saldo bersih dompet talenta | Talenta |
| `POST` | `/api/wallet/withdraw` | Mengajukan penarikan dana ke rekening bank | Talenta |
| `PATCH` | `/api/admin/withdrawals/:id` | Menyetujui atau menolak permohonan penarikan | Admin |

---

## 👥 Demo Akun Siap Pakai

Untuk mempermudah eksplorasi lokal, seeder telah menyediakan 3 peran akun:

| Peran | Email | Password | Kegunaan |
|---|---|---|---|
| 🏢 **Klien (UMKM)** | `budi@client.id` | `password123` | Buat tugas baru, setujui hasil kerja, minta revisi |
| 💻 **Talenta (Dev)** | `alex@talent.id` | `password123` | Ambil bounty, kelola portofolio, ajukan penarikan saldo |
| 🛡️ **Admin (Mediator)** | `admin@skillbounty.id` | `password123` | Selesaikan sengketa mediasi & audit penarikan dana |

---

## 📄 Lisensi & Kontribusi

Proyek ini dirilis di bawah lisensi **[MIT License](LICENSE)**.  
Kontribusi, *pull requests*, dan pelaporan isu sangat disambut dengan hangat!

<div align="center">
  <sub>Dibangun dengan ❤️ untuk memberdayakan talenta digital & UMKM Indonesia.</sub>
</div>
