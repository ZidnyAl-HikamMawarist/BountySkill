# Product Requirement Document (PRD)

**Project Name:** SkillBounty (Micro-Bounty & Portfolio Matcher Platform)  
**Version:** 1.0.0  
**Target Platform:** Web Responsive (Desktop & Mobile)  
**Primary Tech Stack:** Next.js (Frontend), Node.js Express + TypeScript (Backend), PostgreSQL + Prisma ORM (Database), Tailwind CSS + shadcn/ui (UI Kit), Render (Backend Hosting), Vercel (Frontend Hosting).

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement
* **Resume Tradisional Usang:** Perekrut dan klien UMKM/startup kesulitan memvalidasi kemampuan teknis talenta muda (Gen Z & Alpha) hanya dari berkas teks PDF/CV yang rentan klaim palsu.
* **Friksi Masuk Freelance Tinggi:** Platform freelance konvensional memberlakukan sistem proposal berbelit-belit, potongan biaya tinggi, dan sistem verifikasi rumit bagi pemula.
* **Risiko Penipuan Dua Arah:** 
  * Klien takut hasil pengerjaan tidak selesai atau tidak sesuai spesifikasi jika membayar di muka.
  * Talenta takut mengerjakan tugas terlebih dahulu karena risiko klien menghilang (*ghosting*) tanpa membayar.

### 1.2 Solution & Value Proposition
Platform web dua sisi (*two-sided marketplace*) yang menghubungkan **Klien** (pemberi tugas mikro) dan **Talenta** (eksekutor tugas teknis) dengan mekanisme:
* **Proof-of-Work Portofolio:** Tampilan kartu proyek interaktif berbasis URL demo aktif dan repositori kode asli (bukan sekadar teks CV).
* **Automated Micro-Escrow (Rekening Bersama):** Dana tugas dikunci di awal oleh sistem sebelum talenta mulai bekerja, dan otomatis dicairkan saat hasil kerja disetujui.
* **Tugas Berbasis Milestone Mikro (Bounty):** Spesifikasi tugas jelas, terukur, dan berjangka pendek (1–5 hari pengerjaan).

---

## 2. User Personas & Roles

* **Talent (Pencari Tugas / Pembangun Portofolio):** Mahasiswa, siswa SMK TI, atau developer junior/otodidak yang ingin membangun portofolio terverifikasi dan mencari penghasilan tambahan (*side-hustle*).
* **Client (Pemberi Tugas / UMKM / Startup / Individu):** Pemilik bisnis kecil, developer senior, atau pengelola proyek digital yang ingin mendelegasikan tugas teknis spesifik (slicing UI, fix endpoint API, pembuatan modul kecil).
* **Admin (Pengelola Platform):** Pengawas sistem yang memoderasi sengketa (*dispute*), audit transaksi, dan memverifikasi permohonan penarikan dana manual.

---

## 3. End-to-End System Workflow

### 3.1 Diagram Alur Bisnis (State Flow)

```text
[Klien Membuat Bounty]
         │
         ▼
[Payment Gateway: Deposit Escrow] ──(Gagal)──► [Bounty Batal / Draft]
         │ (Sukses)
         ▼
[Bounty Berstatus 'OPEN']
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
[Talenta Mengirim Submission]             [Batas Waktu Habis]
(Live Demo URL + Repo Link)                        │
         │                                         ▼
         ▼                                [Refund ke Klien]
[Klien Review Hasil Submission]
         │
         ├───► [Revisi Diminta (Maks. 2x)] ──► [Talenta Submit Ulang]
         │
         ├───► [Disetujui] ──► [Backend Release Escrow ke Saldo Talenta]
         │
         └───► [Sengketa / Dispute] ──► [Moderasi Admin]

```

### 3.2 Alur Rinci Tiap Tahap

1. **Pendaftaran & Profil:** Talenta masuk via OAuth GitHub atau Email/Password, lalu mengunggah item portofolio (Judul, deskripsi singkat, tag teknologi, URL demo live, dan URL repositori).
2. **Posting Bounty:** Klien membuat deskripsi tugas, menentukan deadline, dan menyetor dana budget via Payment Gateway (Virtual Account/QRIS). Dana terkunci di sistem escrow.
3. **Pengerjaan & Submission:** Talenta mengirimkan bukti pengerjaan berupa live demo URL dan tautan repositori.
4. **Verifikasi & Pencairan:** Klien meninjau hasil live demo. Jika disetujui, backend otomatis memotong komisi platform (misal 10%) dan memindahkan dana bersih ke saldo dompet talenta.
5. **Rating & Ulasan:** Klien dan talenta saling memberikan ulasan serta rating performa teknis (1–5 bintang).
6. **Penarikan Dana (Withdrawal):** Talenta mengajukan pencairan saldo ke rekening bank atau e-wallet lokal.

---

## 4. Functional Specifications (Fitur Inti)

### 4.1 Modul Otentikasi & Pengguna

* **AUTH-01:** Registrasi & Login via Email/Password (Hash bcrypt) dan OAuth GitHub.
* **AUTH-02:** Manajemen Sesi menggunakan JWT (Access Token & Refresh Token di HTTP-Only Cookie).
* **AUTH-03:** Role-based Access Control (`TALENT`, `CLIENT`, `ADMIN`).

### 4.2 Modul Portofolio (Talent)

* **PORT-01:** CRUD Item Portofolio (Judul, deskripsi, tech tags, demo URL, repo URL).
* **PORT-02:** Kartu Portofolio Interaktif (Menampilkan embed iframe responsif atau live preview).
* **PORT-03:** Live Status Health Checker (Memeriksa status respon HTTP 200 dari link demo).

### 4.3 Modul Bounty & Marketplace

* **BNTY-01:** Listing Bounty publik dengan fitur pencarian dan filter kategori/budget.
* **BNTY-02:** Detail Bounty (deskripsi lengkap, kriteria lulus, status escrow, daftar pendaftar).
* **BNTY-03:** Dashboard Klien untuk monitoring status tugas yang dibuka.
* **BNTY-04:** Dashboard Talenta untuk monitoring riwayat pengerjaan tugas.

### 4.4 Modul Escrow & Transaksi Finansial

* **FIN-01:** Integrasi Payment Gateway (Midtrans / Xendit) untuk deposit dana.
* **FIN-02:** Webhook Handler terproteksi signature token.
* **FIN-03:** Saldo internal dompet talenta.
* **FIN-04:** Sistem permohonan penarikan dana (*Payout Request*).

### 4.5 Modul Rating & Reputasi

* **REP-01:** Rating dua arah pasca penyelesaian bounty.
* **REP-02:** Kalkulasi skor reputasi publik pada profil talenta.

---

## 5. Database Schema Design (PostgreSQL / Prisma)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  TALENT
  CLIENT
  ADMIN
}

enum BountyStatus {
  DRAFT
  PENDING_PAYMENT
  OPEN
  IN_REVIEW
  COMPLETED
  CANCELLED
  DISPUTED
}

enum SubmissionStatus {
  PENDING
  ACCEPTED
  REVISION_REQUESTED
  REJECTED
}

enum EscrowStatus {
  HOLD
  RELEASED
  REFUNDED
}

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  passwordHash  String?
  name          String
  avatarUrl     String?
  role          Role            @default(TALENT)
  balance       Decimal         @default(0.00) @db.Decimal(12, 2)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  portfolios    PortfolioItem[]
  bountiesOwned Bounty[]        @relation("ClientBounties")
  submissions   Submission[]    @relation("TalentSubmissions")
  reviewsGiven  Review[]        @relation("ReviewsGiven")
  reviewsRecv   Review[]        @relation("ReviewsReceived")
  withdrawals   Withdrawal[]
}

model PortfolioItem {
  id          String   @id @default(uuid())
  userId      String
  title       String
  description String   @db.Text
  demoUrl     String
  repoUrl     String?
  techTags    String[]
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Bounty {
  id          String         @id @default(uuid())
  clientId    String
  title       String
  description String         @db.Text
  budget      Decimal        @db.Decimal(12, 2)
  deadline    DateTime
  status      BountyStatus   @default(PENDING_PAYMENT)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt

  client      User           @relation("ClientBounties", fields: [clientId], references: [id])
  escrow      Escrow?
  submissions Submission[]
  review      Review?
}

model Submission {
  id            String           @id @default(uuid())
  bountyId      String
  talentId      String
  demoUrl       String
  repoUrl       String?
  notes         String?          @db.Text
  status        SubmissionStatus @default(PENDING)
  revisionCount Int              @default(0)
  createdAt     DateTime         @default(now())
  updatedAt     DateTime         @updatedAt

  bounty        Bounty           @relation(fields: [bountyId], references: [id], onDelete: Cascade)
  talent        User             @relation("TalentSubmissions", fields: [talentId], references: [id])
}

model Escrow {
  id                 String       @id @default(uuid())
  bountyId           String       @unique
  amount             Decimal      @db.Decimal(12, 2)
  feePlatform        Decimal      @db.Decimal(12, 2)
  netAmount          Decimal      @db.Decimal(12, 2)
  paymentGatewayRef  String?
  status             EscrowStatus @default(HOLD)
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt

  bounty             Bounty       @relation(fields: [bountyId], references: [id], onDelete: Cascade)
}

model Review {
  id          String   @id @default(uuid())
  bountyId    String   @unique
  reviewerId  String
  receiverId  String
  rating      Int
  comment     String?  @db.Text
  createdAt   DateTime @default(now())

  bounty      Bounty   @relation(fields: [bountyId], references: [id])
  reviewer    User     @relation("ReviewsGiven", fields: [reviewerId], references: [id])
  receiver    User     @relation("ReviewsReceived", fields: [receiverId], references: [id])
}

model Withdrawal {
  id          String   @id @default(uuid())
  userId      String
  amount      Decimal  @db.Decimal(12, 2)
  bankName    String
  accountNum  String
  accountName String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())

  user        User     @relation(fields: [userId], references: [id])
}

```

---

## 6. Backend Engineering Setup & Hosting Guidelines (Render)

### 6.1 Server Code Architecture (`src/server.ts`)

Konfigurasi port dinamis dan CORS untuk deployment PaaS tanpa Docker:

```typescript
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL || ""
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Health check endpoint (Render ping)
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});

```

### 6.2 Konfigurasi `package.json` Backend

```json
{
  "name": "skill-bounty-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc && prisma generate",
    "start": "node dist/server.js",
    "prisma:migrate": "prisma migrate deploy"
  },
  "dependencies": {
    "@prisma/client": "^5.14.0",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "jsonwebtoken": "^9.0.2",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/node": "^20.12.12",
    "prisma": "^5.14.0",
    "tsx": "^4.10.5",
    "typescript": "^5.4.5"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

```

### 6.3 Form Konfigurasi Deploy di Render (Web Service)

* **Name:** `bounty-api`
* **Runtime:** `Node`
* **Build Command:** `npm install && npm run build`
* **Start Command:** `npm start`
* **Instance Type:** `Free`
* **Environment Variables:**
* `NODE_ENV` = `production`
* `DATABASE_URL` = `postgresql://user:password@host:port/dbname?sslmode=require`
* `JWT_SECRET` = `kunci_rahasia_jwt_produksi`
* `FRONTEND_URL` = `https://nama-aplikasi-frontend.vercel.app`
* `PAYMENT_SERVER_KEY` = `kunci_rahasia_payment_gateway`



---

## 7. REST API Endpoints Specification

### 7.1 Authentication (`/api/v1/auth`)

* `POST /register` — Pendaftaran akun baru (Body: email, password, name, role).
* `POST /login` — Otentikasi & pengembalian JWT token.
* `GET /me` — Mendapatkan profil pengguna yang sedang login.

### 7.2 Portfolio (`/api/v1/portfolios`)

* `GET /talent/:talentId` — Mengambil seluruh portofolio publik milik talenta tertentu.
* `POST /` — Menambahkan portofolio baru (Protected: Talent).
* `PUT /:id` — Memperbarui data portofolio.
* `DELETE /:id` — Menghapus item portofolio.

### 7.3 Bounties (`/api/v1/bounties`)

* `GET /` — Mengambil daftar bounty publik aktif.
* `GET /:id` — Mengambil detail spesifik bounty beserta status escrow.
* `POST /` — Membuat bounty baru (Protected: Client) -> Menghasilkan token transaksi payment.
* `POST /:id/submit` — Mengirim bukti pengerjaan demo URL & repo (Protected: Talent).
* `POST /:id/approve` — Menyetujui submission & mencairkan dana escrow (Protected: Client).
* `POST /:id/request-revision` — Meminta revisi submission (Protected: Client).

### 7.4 Webhook (`/api/v1/webhooks`)

* `POST /payment` — Menerima callback status pembayaran dari Payment Gateway untuk mengaktifkan status bounty ke `OPEN` dan mengunci dana di `Escrow`.

---

## 8. Non-Functional Requirements (NFR)

* **Data Integrity:** Mutasi saldo dan update status escrow wajib dibungkus dalam Database Transaction (`prisma.$transaction`) untuk mencegah inkonsistensi data atau double spending.
* **Security:** Password di-hash menggunakan `bcrypt` (salt rounds 10). Endpoint publik dilindungi rate-limiter, dan input divalidasi ketat menggunakan skema `Zod`.
* **Cold Start Handling:** Sisi frontend Next.js menyediakan skeleton loading & toast notifikasi informatif untuk mengantisipasi masa bangun server (~30–50 detik) pada hosting backend tier gratis.

---

## 9. Implementation Roadmap

* **Minggu 1:** Inisialisasi Repositori, Skema Prisma PostgreSQL, Setup Modul Auth JWT, dan Endpoint Profile.
* **Minggu 2:** Modul Portofolio Interaktif (CRUD + Live URL checker) dan Modul CRUD Bounty.
* **Minggu 3:** Integrasi Payment Gateway Sandbox, Endpoint Webhook, dan Logika Escrow Lock/Release.
* **Minggu 4:** Slicing UI Frontend (Next.js + shadcn/ui), Dashboard Client/Talent, dan Sistem Review.
* **Minggu 5:** Deploy Backend ke Render, Deploy Frontend ke Vercel, Uji Coba Transaksi End-to-End.

```