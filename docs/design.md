# Design Document (design.md)
**Project:** SkillBounty — Micro-Bounty & Portfolio Matcher Platform
**Tujuan dokumen:** Memecah PRD menjadi daftar halaman yang dibutuhkan, lalu menyediakan *prompt desain* siap pakai per halaman (bisa dipakai satu-satu ke tools seperti v0, Lovable, Claude, Figma AI, dll).

Setiap bagian di bawah ini **berdiri sendiri** — bisa langsung di-copy-paste sebagai prompt untuk men-generate satu halaman. Semua bagian mengacu ke Design System yang sama di Bagian 0 agar hasilnya konsisten kalau dipakai berurutan.

---

## 0. Design System Dasar (pakai di semua prompt halaman)

```
Buat desain web app bernama "SkillBounty" — marketplace micro-bounty yang
menghubungkan Talent (developer junior/pelajar) dengan Client (UMKM/startup)
untuk tugas teknis singkat (1-5 hari) dengan sistem escrow otomatis.

Target user: Gen Z & Gen Alpha (talent) dan pemilik UMKM/startup (client) di Indonesia.
Nuansa: terpercaya, cepat, "proof-of-work bukan CV" — validasi lewat demo hidup & repo,
bukan klaim di kertas.

Stack render: Next.js + Tailwind CSS + shadcn/ui, responsive (mobile-first, breakpoint desktop).

Tentukan token desain berikut sekali di awal lalu pakai konsisten di semua halaman:
- Palet warna (4-6 hex, termasuk warna status: OPEN/success, PENDING/warning,
  DISPUTED/danger, netral untuk teks & background)
- Tipografi: 1 display face + 1 body face + 1 utility/mono face (untuk kode/URL/angka)
- Layout grid & spacing scale
- Elemen "signature" yang mencerminkan tema "proof-of-work" (mis. kartu portofolio
  dengan live-preview iframe, badge status escrow yang jelas, dsb.)

Hindari default AI generik (cream+serif+terracotta / dark+neon-green / broadsheet
hairline). Ambil identitas dari dunia developer/marketplace: monospace aksen,
status badge ala CI/CD, kartu proyek ala GitHub, dsb — tapi tetap ramah untuk
non-teknis (client UMKM).
```

---

## 1. Daftar Halaman (mapping dari PRD)

| # | Halaman | Role | Sumber PRD |
|---|---------|------|------------|
| 1 | Landing Page | Publik | 1.1–1.2 |
| 2 | Register (pilih role) | Publik | AUTH-01 |
| 3 | Login | Publik | AUTH-01, AUTH-02 |
| 4 | Marketplace Bounty (listing) | Publik/Client/Talent | BNTY-01 |
| 5 | Detail Bounty | Publik/Client/Talent | BNTY-02, 7.3 |
| 6 | Profil Publik & Portofolio Talent | Publik | PORT-01/02/03 |
| 7 | Dashboard Talent | Talent | BNTY-04 |
| 8 | Kelola Portofolio (CRUD) | Talent | PORT-01/02/03 |
| 9 | Form Submission Tugas | Talent | 3.2.3, 7.3 |
| 10 | Dompet & Penarikan Dana | Talent | FIN-03/04, 3.2.6 |
| 11 | Dashboard Client | Client | BNTY-03 |
| 12 | Buat Bounty + Deposit Escrow | Client | 3.2.2, FIN-01 |
| 13 | Review Submission (approve/revisi/dispute) | Client | 3.2.4, 7.3 |
| 14 | Form Rating & Ulasan | Client & Talent | REP-01/02, 3.2.5 |
| 15 | Dashboard Admin | Admin | 2, 3.2 |
| 16 | Moderasi Dispute | Admin | 2 |
| 17 | Verifikasi Penarikan Dana | Admin | FIN-04 |
| 18 | State Kosong / Error / Cold-Start Loading | Semua | 8 (NFR Cold Start) |

---

## 2. Prompt Desain per Halaman

### 2.1 Landing Page
```
Desain landing page SkillBounty untuk dua audiens sekaligus: Talent dan Client.

Struktur:
- Hero: value proposition utama — "portofolio dibuktikan lewat demo hidup,
  bukan CV" — dengan CTA ganda ("Cari Bounty" untuk talent, "Posting Tugas"
  untuk client).
- Section "Cara Kerja" dalam 3 langkah nyata (bukan angka dekoratif):
  Posting & Deposit Escrow → Talent Kerjakan & Submit → Review & Dana Cair.
  Tampilkan bahwa dana terkunci di escrow sejak awal (jawaban atas rasa takut
  ghosting dua arah dari problem statement).
- Section showcase kartu portofolio (contoh kartu dengan live-demo preview,
  tech tags, status "Live" dari health checker).
- Section showcase bounty terbuka (contoh card: judul tugas, budget, deadline,
  status escrow HOLD, jumlah pendaftar).
- Section kepercayaan: penjelasan singkat mekanisme escrow otomatis & moderasi
  admin untuk sengketa.
- Footer dengan link login/register terpisah untuk Talent vs Client.

State: hanya 1 state (publik, tidak login).
```

### 2.2 Register (Pilih Role)
```
Desain halaman registrasi SkillBounty.

Elemen:
- Toggle/step awal: pilih peran — "Talent" atau "Client" (role menentukan
  field & dashboard selanjutnya, sesuai AUTH-03).
- Form: nama, email, password (indikator kekuatan password, akan di-hash
  bcrypt di backend — tidak perlu ditampilkan ke user).
- Tombol "Daftar dengan GitHub" (OAuth) ditonjolkan khusus untuk role Talent
  karena relevan dengan portofolio kode (AUTH-01).
- Link ke halaman Login.
- Validasi inline (email sudah terdaftar, password lemah, dll) — gunakan
  bahasa error yang jelas dan actionable, bukan pesan generik.

States: default, loading saat submit, error validasi, error email sudah
terpakai.
```

### 2.3 Login
```
Desain halaman login SkillBounty.

Elemen:
- Form email + password.
- Tombol "Login dengan GitHub".
- Link "Lupa password" dan link ke halaman Register.
- Setelah login sukses, arahkan sesuai role (redirect ke Dashboard Talent
  atau Dashboard Client — role tersimpan di JWT/session, AUTH-02).

States: default, loading, error kredensial salah, error akun belum verifikasi
(jika ada).
```

### 2.4 Marketplace Bounty (Listing)
```
Desain halaman listing bounty publik SkillBounty (BNTY-01).

Elemen:
- Search bar + filter: kategori/skill, rentang budget, status (OPEN saja
  secara default), sisa waktu deadline.
- Grid/list card bounty. Tiap card menampilkan: judul tugas, ringkasan,
  budget (format Rupiah), sisa waktu ke deadline, jumlah pendaftar, badge
  status escrow (mis. "Dana Terkunci ✓" untuk menegaskan kepercayaan).
- Empty state saat filter tidak menghasilkan apa pun — beri saran ubah filter,
  bukan pesan kosong generik.
- Pagination atau infinite scroll.
- CTA berbeda tergantung siapa yang login: Talent melihat tombol "Lihat &
  Daftar", Client (belum login) diarahkan ke CTA "Posting Bounty Serupa".

States: loading (skeleton card), hasil kosong, hasil terisi, error fetch.
```

### 2.5 Detail Bounty
```
Desain halaman detail bounty SkillBounty (BNTY-02, endpoint GET /bounties/:id).

Elemen:
- Header: judul, klien pemberi tugas (nama + rating), budget, deadline
  countdown, badge status bounty (OPEN/IN_REVIEW/COMPLETED/DISPUTED dst,
  gunakan warna status dari design system).
- Body: deskripsi lengkap tugas & kriteria lulus (checklist format, karena
  ini yang dipakai untuk menilai submission).
- Panel status escrow: jumlah dana, status HOLD/RELEASED/REFUNDED —
  ditampilkan transparan ke kedua pihak.
- Daftar pendaftar/submission (untuk client) ATAU tombol "Kirim Submission"
  (untuk talent yang belum submit) — desain kedua varian dalam satu halaman
  dengan penanda role yang jelas.
- Riwayat revisi jika ada (maks. 2x sesuai alur PRD 3.1).

States: role=talent belum daftar, role=talent sudah submit (menunggu review),
role=client menunggu submission, role=client ada submission masuk, bounty
selesai/completed, bounty dispute.
```

### 2.6 Profil Publik & Portofolio Talent
```
Desain halaman profil publik talent SkillBounty (PORT-01/02/03, GET /portfolios/talent/:id).

Elemen:
- Header profil: avatar, nama, skor reputasi (rata-rata rating bintang 1-5,
  REP-02), jumlah bounty selesai.
- Grid kartu portofolio interaktif — tiap kartu menampilkan: judul, deskripsi
  singkat, tech tags, live preview (embed iframe responsif dari demoUrl),
  link repo, dan indikator health check (badge "Live" hijau jika HTTP 200,
  "Down" jika gagal — PORT-03).
- Section riwayat rating/ulasan dari client sebelumnya.

States: portofolio kosong (talent baru — beri ajakan isi portofolio jika
ini profil sendiri), live-preview gagal dimuat (fallback screenshot/placeholder
+ badge "Down"), profil dengan banyak item (perlu pagination/load more).
```

### 2.7 Dashboard Talent
```
Desain dashboard talent SkillBounty (BNTY-04).

Elemen:
- Ringkasan atas: saldo dompet saat ini, jumlah bounty aktif, jumlah bounty
  selesai, skor reputasi.
- Tab/daftar riwayat pengerjaan dengan filter status: Sedang Dikerjakan,
  Menunggu Review, Revisi Diminta, Selesai, Ditolak/Sengketa.
- Tiap baris/card riwayat: judul bounty, client, budget bersih (setelah
  potongan komisi platform 10%), status, tanggal.
- Shortcut ke "Kelola Portofolio" dan "Cari Bounty Baru".

States: belum pernah ambil bounty (empty state dengan CTA ke marketplace),
ada tugas yang butuh aksi (revisi diminta — beri highlight visual prioritas).
```

### 2.8 Kelola Portofolio (CRUD)
```
Desain halaman manajemen portofolio talent SkillBounty (PORT-01).

Elemen:
- List item portofolio milik sendiri dalam bentuk card, dengan aksi Edit/Hapus
  per item.
- Tombol "Tambah Portofolio Baru" membuka form (modal atau halaman terpisah):
  judul, deskripsi, tech tags (multi-select/chip input), URL demo live, URL
  repo (opsional).
- Preview live saat mengisi demoUrl (embed iframe responsif) sebelum disimpan,
  agar talent tahu tampilannya sebelum publish.
- Indikator status health check per item (re-check terakhir kapan).

States: form kosong/create, form edit terisi, validasi URL tidak valid,
konfirmasi hapus, live preview gagal dimuat.
```

### 2.9 Form Submission Tugas
```
Desain form/modal pengiriman submission tugas oleh talent SkillBounty
(POST /bounties/:id/submit, 3.2.3).

Elemen:
- Ringkasan singkat bounty yang dikerjakan (judul, kriteria lulus) sebagai
  konteks di atas form.
- Input: URL demo live, URL repositori, catatan tambahan untuk client
  (textarea).
- Jika ini submission ulang setelah revisi: tampilkan catatan revisi dari
  client sebelumnya dan nomor percobaan (mis. "Revisi 1 dari maks. 2").
- Tombol kirim dengan konfirmasi.

States: submission pertama kali, submission ulang (revisi), sudah mencapai
batas maksimal revisi (2x) — desain state ini dengan jelas menjelaskan
konsekuensi berikutnya (mis. lanjut ke dispute).
```

### 2.10 Dompet & Penarikan Dana
```
Desain halaman dompet talent SkillBounty (FIN-03/04, 3.2.6).

Elemen:
- Saldo saat ini (angka besar, jelas).
- Riwayat transaksi: dana masuk dari bounty selesai (net setelah komisi),
  penarikan yang sudah/sedang diproses.
- Form pengajuan penarikan: nominal, nama bank/e-wallet, nomor rekening,
  nama pemilik rekening.
- Status pengajuan penarikan: PENDING/DIPROSES/SELESAI/DITOLAK.

States: saldo 0 (empty state), ada pengajuan sedang diproses (nonaktifkan
form baru atau beri info), riwayat kosong.
```

### 2.11 Dashboard Client
```
Desain dashboard client SkillBounty (BNTY-03).

Elemen:
- Ringkasan atas: total bounty aktif, total dana ter-escrow saat ini, total
  bounty selesai.
- Daftar bounty yang dibuat dengan filter status (Draft/Pending Payment/Open/
  In Review/Completed/Cancelled/Disputed — sesuai enum BountyStatus).
- Tiap baris: judul, jumlah pendaftar/submission masuk, deadline, status,
  aksi cepat ("Lihat Submission" jika ada yang menunggu review — beri
  highlight prioritas).
- Tombol "Posting Bounty Baru".

States: belum pernah posting bounty (empty state + CTA), ada submission
menunggu review (badge notifikasi/highlight).
```

### 2.12 Buat Bounty + Deposit Escrow
```
Desain alur pembuatan bounty baru oleh client SkillBounty (3.2.2, FIN-01),
idealnya sebagai wizard 2 langkah karena melibatkan pembayaran.

Langkah 1 — Detail Tugas:
- Judul, deskripsi lengkap, kriteria lulus (list checklist), deadline
  (date picker, ingatkan rentang wajar 1-5 hari sesuai visi produk), budget.

Langkah 2 — Deposit Escrow:
- Ringkasan biaya: budget + estimasi komisi platform ditampilkan transparan.
- Pilihan metode pembayaran (Virtual Account / QRIS).
- Setelah bayar: state "Menunggu Konfirmasi Pembayaran" (menunggu webhook
  payment gateway mengubah status ke OPEN) — jelaskan ke user bahwa ini
  otomatis, tidak perlu refresh manual.
- State gagal bayar → jelaskan bounty tersimpan sebagai Draft dan bisa
  dicoba bayar lagi.

Desain harus menegaskan pesan kepercayaan: "dana Anda terkunci aman sampai
hasil kerja disetujui" — ini jawaban langsung ke problem statement PRD.
```

### 2.13 Review Submission (Approve / Revisi / Dispute)
```
Desain halaman review submission oleh client SkillBounty (3.2.4, 7.3).

Elemen:
- Panel kiri/atas: kriteria lulus bounty (checklist acuan).
- Panel utama: live preview submission (embed iframe dari demoUrl talent),
  link repo, catatan dari talent.
- Tiga aksi utama yang jelas dibedakan secara visual:
  1) Setujui & Cairkan Dana (approve) — beri konfirmasi karena ini
     final/tidak bisa dibatalkan, tampilkan jumlah yang akan cair ke talent.
  2) Minta Revisi — textarea catatan revisi wajib diisi, tampilkan sisa
     kuota revisi (maks. 2x).
  3) Ajukan Sengketa/Dispute — form alasan, jelaskan bahwa ini akan
     dieskalasi ke Admin untuk moderasi.

States: submission pertama, submission hasil revisi (tampilkan versi
sebelumnya untuk perbandingan), kuota revisi habis (sembunyikan/nonaktifkan
tombol revisi, arahkan ke approve/dispute saja).
```

### 2.14 Form Rating & Ulasan
```
Desain modal/halaman rating dua arah pasca bounty selesai SkillBounty
(REP-01, 3.2.5).

Elemen:
- Rating bintang 1-5.
- Textarea komentar (opsional).
- Konteks bounty yang dinilai (judul, lawan transaksi — nama client/talent).
- Muncul otomatis setelah status bounty menjadi COMPLETED, untuk kedua
  pihak (client menilai talent, talent menilai client).

States: belum menilai, sudah menilai (tampilkan read-only), pihak lawan
belum menilai (info saja, bukan blocker).
```

### 2.15 Dashboard Admin
```
Desain dashboard admin SkillBounty (role ADMIN, 2. User Personas).

Elemen:
- Ringkasan: jumlah dispute aktif, jumlah permohonan penarikan pending,
  total volume transaksi, jumlah bounty per status.
- Tab navigasi ke: Moderasi Dispute, Verifikasi Penarikan, Audit Transaksi.
- Tabel/list dengan prioritas visual pada item yang butuh aksi segera
  (dispute baru, penarikan menunggu lama).

States: semua antrian kosong (kondisi ideal), ada item mendesak (highlight).
```

### 2.16 Moderasi Dispute
```
Desain halaman detail moderasi sengketa oleh admin SkillBounty (3.1, 3.2).

Elemen:
- Ringkasan bounty & kronologi: deskripsi tugas, kriteria lulus, riwayat
  submission & revisi (timeline), alasan dispute dari pihak yang mengajukan.
- Bukti dari kedua pihak: live demo, repo, catatan client & talent.
- Aksi admin: putuskan dana cair ke talent / refund ke client / cair
  sebagian (jika didukung) — dengan catatan keputusan wajib diisi untuk
  transparansi ke kedua pihak.

States: dispute baru masuk, sedang diinvestigasi (admin menandai), sudah
diputuskan (read-only + hasil keputusan).
```

### 2.17 Verifikasi Penarikan Dana
```
Desain halaman antrian verifikasi withdrawal oleh admin SkillBounty (FIN-04).

Elemen:
- Tabel permohonan penarikan: nama talent, nominal, bank/e-wallet tujuan,
  tanggal pengajuan, status.
- Aksi per baris: Setujui / Tolak (dengan alasan wajib untuk penolakan).
- Filter status (Pending/Diproses/Selesai/Ditolak).

States: antrian kosong, ada permohonan menunggu lama (highlight prioritas).
```

### 2.18 State Kosong / Error / Cold-Start Loading
```
Desain kit komponen state bersama untuk seluruh app SkillBounty (NFR
Section 8: cold start hosting gratis ~30-50 detik).

Elemen yang perlu didesain sebagai komponen reusable:
- Skeleton loading untuk card bounty, card portofolio, dan list dashboard.
- Toast/banner informatif khusus saat memanggil backend pertama kali
  ("Menyiapkan server, mohon tunggu sebentar..." — bahasa ramah, bukan
  pesan error teknis, karena ini bukan kegagalan sungguhan).
- Empty state generik (ilustrasi/ikon + judul + deskripsi + CTA) untuk
  dipakai di semua listing kosong.
- Error state generik (gagal fetch/network) dengan tombol "Coba Lagi".

Pastikan komponen ini konsisten dipakai di semua halaman pada Bagian 2.
```

---

## 3. Cara Pakai Dokumen Ini
1. Jalankan Bagian 0 dulu (atau tempelkan sebagai instruksi sistem/di awal
   setiap prompt) supaya tone & token desain konsisten antar halaman.
2. Generate halaman satu per satu sesuai urutan alur user di Bagian 1 —
   disarankan mulai dari 2.1 → 2.4 → 2.5 → 2.6 (alur publik) baru lanjut ke
   halaman berbasis role (Talent, Client, Admin).
3. Bagian 2.18 (state kosong/error/loading) sebaiknya digenerate lebih awal
   sebagai *component kit*, lalu dipakai ulang di semua halaman lain.
