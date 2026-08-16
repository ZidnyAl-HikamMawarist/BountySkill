import { User, PortfolioItem, Bounty, Withdrawal, DisputeCase, Review } from '@/types';

export const initialUsers: User[] = [
  {
    id: 'user-talent-1',
    email: 'budi.dev@gmail.com',
    name: 'Budi Pratama',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'TALENT',
    balance: 2450000,
    bio: 'Junior Frontend Specialist (React / Next.js / Tailwind) & SMKN 1 Jakarta Graduate.',
    githubUsername: 'budipratama-dev',
    reputationScore: 4.9,
    completedBountiesCount: 14,
    createdAt: '2026-01-10T08:00:00.000Z'
  },
  {
    id: 'user-talent-2',
    email: 'siti.alpha@gmail.com',
    name: 'Siti Rahma',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'TALENT',
    balance: 850000,
    bio: 'Backend & API Builder (Node.js Express / PostgreSQL / Prisma).',
    githubUsername: 'sitirahma-code',
    reputationScore: 4.8,
    completedBountiesCount: 8,
    createdAt: '2026-02-14T09:00:00.000Z'
  },
  {
    id: 'user-client-1',
    email: 'hendra@kopiindonesia.co.id',
    name: 'Hendra Wijaya (Kopi Nusantara)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'CLIENT',
    balance: 15000000,
    bio: 'Owner of Kopi Nusantara Network & Digital Business Builder.',
    reputationScore: 5.0,
    createdAt: '2026-01-05T10:00:00.000Z'
  },
  {
    id: 'user-admin-1',
    email: 'admin@skillbounty.id',
    name: 'System Admin SkillBounty',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'ADMIN',
    balance: 0,
    bio: 'SkillBounty Dispute Moderator & Financial Compliance Officer.',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const initialPortfolios: PortfolioItem[] = [
  {
    id: 'port-1',
    userId: 'user-talent-1',
    title: 'POS Kasir Mini UMKM Kopi',
    description: 'Aplikasi kasir web responsif terintegrasi cetak struk Bluetooth dan kalkulasi pajak otomatis.',
    demoUrl: 'https://react.dev',
    repoUrl: 'https://github.com/budipratama-dev/pos-kasir-umkm',
    techTags: ['Next.js', 'Tailwind CSS', 'IndexedDB', 'Zustand'],
    isHealthy: true,
    lastCheckedAt: '5 menit yang lalu',
    createdAt: '2026-02-01T12:00:00.000Z'
  },
  {
    id: 'port-2',
    userId: 'user-talent-1',
    title: 'Dashboard Analitik Penjualan E-Commerce',
    description: 'Sistem monitoring grafik penjualan real-time dengan chart interaktif dan filter multi-cabang.',
    demoUrl: 'https://tailwindcss.com',
    repoUrl: 'https://github.com/budipratama-dev/ecommerce-analytics-dashboard',
    techTags: ['React', 'Recharts', 'Tailwind CSS', 'TypeScript'],
    isHealthy: true,
    lastCheckedAt: '10 menit yang lalu',
    createdAt: '2026-02-10T14:00:00.000Z'
  },
  {
    id: 'port-3',
    userId: 'user-talent-1',
    title: 'Slicing Landing Page Figma ke Web Responsive',
    description: 'Implementasi pixel-perfect dari file Figma dengan animasi micro-interactions halus.',
    demoUrl: 'https://nextjs.org',
    repoUrl: 'https://github.com/budipratama-dev/pixel-perfect-landing',
    techTags: ['Next.js', 'Framer Motion', 'Tailwind CSS'],
    isHealthy: true,
    lastCheckedAt: '1 jam yang lalu',
    createdAt: '2026-02-15T15:30:00.000Z'
  }
];

export const initialBounties: Bounty[] = [
  {
    id: 'bounty-1',
    clientId: 'user-client-1',
    clientName: 'Hendra Wijaya (Kopi Nusantara)',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientRating: 5.0,
    title: 'Slicing Landing Page Figma ke Next.js & Tailwind',
    description: 'Mencari talent untuk mengubah desain Figma landing page company profile kami menjadi kode Next.js yang responsif dan pixel-perfect. Komponen harus bersih dan mudah dimaintain.',
    criteria: [
      'Struktur kode modular menggunakan App Router Next.js 15+',
      'Responsive di mobile viewport (375px) dan desktop (1440px)',
      'Telah lulus verifikasi Lighthouse performance minimal skor 90',
      'Live demo URL aktif di Vercel / Netlify beserta link repositori publik'
    ],
    budget: 1500000,
    deadline: '2026-08-25T23:59:59.000Z',
    daysEstimate: 3,
    category: 'Frontend Slicing',
    techTags: ['Next.js', 'Tailwind CSS', 'Figma', 'TypeScript'],
    status: 'OPEN',
    applicantsCount: 4,
    escrow: {
      id: 'escrow-1',
      bountyId: 'bounty-1',
      amount: 1500000,
      feePlatform: 150000,
      netAmount: 1350000,
      paymentMethod: 'QRIS',
      status: 'HOLD',
      createdAt: '2026-08-14T10:00:00.000Z',
      updatedAt: '2026-08-14T10:05:00.000Z'
    },
    submissions: [],
    createdAt: '2026-08-14T10:00:00.000Z',
    updatedAt: '2026-08-14T10:05:00.000Z'
  },
  {
    id: 'bounty-2',
    clientId: 'user-client-1',
    clientName: 'Hendra Wijaya (Kopi Nusantara)',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientRating: 5.0,
    title: 'Integrasi API Midtrans Payment Gateway Node.js',
    description: 'Dibutuhkan pembuatan endpoint Express.js untuk create transaction token Snap Midtrans dan webhook listener yang memverifikasi signature key untuk update order status.',
    criteria: [
      'Endpoint POST /api/payment/create-snap mengembalikan transaction token',
      'Webhook handler POST /api/payment/webhook dengan validasi hash SHA512 signature',
      'Database query Prisma terproteksi transaction lock',
      'Dilengkapi file testing Postman / Bruno collection'
    ],
    budget: 900000,
    deadline: '2026-08-20T23:59:59.000Z',
    daysEstimate: 2,
    category: 'Backend Integration',
    techTags: ['Node.js', 'Express', 'Midtrans', 'Prisma'],
    status: 'IN_REVIEW',
    applicantsCount: 2,
    escrow: {
      id: 'escrow-2',
      bountyId: 'bounty-2',
      amount: 900000,
      feePlatform: 90000,
      netAmount: 810000,
      paymentMethod: 'VIRTUAL_ACCOUNT',
      status: 'HOLD',
      createdAt: '2026-08-15T09:00:00.000Z',
      updatedAt: '2026-08-15T09:00:00.000Z'
    },
    submissions: [
      {
        id: 'sub-1',
        bountyId: 'bounty-2',
        talentId: 'user-talent-1',
        talentName: 'Budi Pratama',
        talentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        demoUrl: 'https://expressjs.com',
        repoUrl: 'https://github.com/budipratama-dev/midtrans-express-integration',
        notes: 'Sudah selesai mengintegrasikan Snap sandbox dan webhook handler dengan signature hashing terverifikasi. Mohon direview!',
        status: 'PENDING',
        revisionCount: 0,
        createdAt: '2026-08-16T14:30:00.000Z',
        updatedAt: '2026-08-16T14:30:00.000Z'
      }
    ],
    createdAt: '2026-08-15T09:00:00.000Z',
    updatedAt: '2026-08-16T14:30:00.000Z'
  },
  {
    id: 'bounty-3',
    clientId: 'user-client-1',
    clientName: 'Hendra Wijaya (Kopi Nusantara)',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientRating: 5.0,
    title: 'Fix Bug Infinite Re-render React Table Filter',
    description: 'Ada infinite loop re-rendering di dashboard saat memilih filter cabang kopi ganda. Butuh talent React berpengalaman untuk optimasi useEffect / useMemo.',
    criteria: [
      'Menghilangkan warning re-render pada console browser',
      'Filter cabang kopi berfungsi lancar tanpa lag',
      'Menjaga konsistensi state URL search params'
    ],
    budget: 450000,
    deadline: '2026-08-18T18:00:00.000Z',
    daysEstimate: 1,
    category: 'Bug Fixing',
    techTags: ['React', 'Hooks', 'Bugfix', 'Performance'],
    status: 'COMPLETED',
    applicantsCount: 1,
    escrow: {
      id: 'escrow-3',
      bountyId: 'bounty-3',
      amount: 450000,
      feePlatform: 45000,
      netAmount: 405000,
      status: 'RELEASED',
      createdAt: '2026-08-10T08:00:00.000Z',
      updatedAt: '2026-08-11T12:00:00.000Z'
    },
    review: {
      id: 'rev-1',
      bountyId: 'bounty-3',
      bountyTitle: 'Fix Bug Infinite Re-render React Table Filter',
      reviewerId: 'user-client-1',
      reviewerName: 'Hendra Wijaya (Kopi Nusantara)',
      receiverId: 'user-talent-1',
      receiverName: 'Budi Pratama',
      rating: 5,
      comment: 'Luar biasa cepat! Dalam 3 jam bug re-render langsung beres dan kodenya rapi sekali.',
      createdAt: '2026-08-11T12:05:00.000Z'
    },
    createdAt: '2026-08-10T08:00:00.000Z',
    updatedAt: '2026-08-11T12:05:00.000Z'
  },
  {
    id: 'bounty-4',
    clientId: 'user-client-1',
    clientName: 'Hendra Wijaya (Kopi Nusantara)',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    clientRating: 5.0,
    title: 'Slicing Desain Checkout Form Mobile QRIS',
    description: 'Slicing form pembayaran mobile-first lengkap dengan timer countdown 15 menit dan tombol unduh QRIS.',
    criteria: [
      'Mobile responsive layout (tested di Chrome DevTools iPhone 14)',
      'Countdown timer reaktif dengan format MM:SS',
      'Downloadable dynamic QR image generator component'
    ],
    budget: 650000,
    deadline: '2026-08-22T23:59:59.000Z',
    daysEstimate: 2,
    category: 'Frontend Slicing',
    techTags: ['Next.js', 'Tailwind CSS', 'QRIS'],
    status: 'DISPUTED',
    applicantsCount: 3,
    escrow: {
      id: 'escrow-4',
      bountyId: 'bounty-4',
      amount: 650000,
      feePlatform: 65000,
      netAmount: 585000,
      status: 'HOLD',
      createdAt: '2026-08-12T11:00:00.000Z',
      updatedAt: '2026-08-12T11:00:00.000Z'
    },
    submissions: [
      {
        id: 'sub-4',
        bountyId: 'bounty-4',
        talentId: 'user-talent-2',
        talentName: 'Siti Rahma',
        talentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        demoUrl: 'https://qris.id',
        repoUrl: 'https://github.com/sitirahma-code/mobile-qris-checkout',
        notes: 'Demo sudah live. Timer dan QRIS download sudah berfungsi.',
        status: 'REVISION_REQUESTED',
        revisionCount: 2,
        revisionNotes: [
          'Revisi 1: Tampilan di iPhone SE masih terpotong di bagian tombol bayar.',
          'Revisi 2: Timer belum reset saat halaman di-reload.'
        ],
        createdAt: '2026-08-13T16:00:00.000Z',
        updatedAt: '2026-08-14T18:00:00.000Z'
      }
    ],
    createdAt: '2026-08-12T11:00:00.000Z',
    updatedAt: '2026-08-15T08:00:00.000Z'
  }
];

export const initialWithdrawals: Withdrawal[] = [
  {
    id: 'wd-1',
    userId: 'user-talent-1',
    userName: 'Budi Pratama',
    amount: 1200000,
    bankName: 'BCA (Bank Central Asia)',
    accountNum: '8820194821',
    accountName: 'BUDI PRATAMA',
    status: 'PENDING',
    createdAt: '2026-08-16T11:20:00.000Z'
  },
  {
    id: 'wd-2',
    userId: 'user-talent-2',
    userName: 'Siti Rahma',
    amount: 500000,
    bankName: 'GoPay / Mandiri',
    accountNum: '081239847291',
    accountName: 'SITI RAHMA',
    status: 'SELESAI',
    createdAt: '2026-08-14T09:15:00.000Z'
  }
];

export const initialDisputes: DisputeCase[] = [
  {
    id: 'disp-1',
    bountyId: 'bounty-4',
    bounty: initialBounties[3],
    submission: initialBounties[3].submissions![0],
    reason: 'Batas revisi maksimal (2x) telah tercapai namun kriteria countdown timer belum sesuai spesifikasi.',
    initiatedBy: 'CLIENT',
    clientNotes: 'Talent belum memperbaiki bug timer yang tidak sinkron, dan sisa kuota revisi sudah habis.',
    talentNotes: 'Timer sudah berfungsi di local dan Vercel demo, mungkin ada cache di browser client.',
    status: 'PENDING_REVIEW',
    createdAt: '2026-08-15T08:30:00.000Z'
  }
];
