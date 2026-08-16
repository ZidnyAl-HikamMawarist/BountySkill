import { PrismaClient, Role, BountyStatus, SubmissionStatus, EscrowStatus, DisputeStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Clearing existing database tables...');
  await prisma.review.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.escrow.deleteMany();
  await prisma.bounty.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.withdrawal.deleteMany();
  await prisma.user.deleteMany();

  console.log('👤 Seeding Users with hashed passwords...');
  const passwordHash = await bcrypt.hash('password123', 10);

  const talent1 = await prisma.user.create({
    data: {
      id: 'user-talent-1',
      email: 'budi.dev@gmail.com',
      passwordHash,
      name: 'Budi Pratama',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
      role: Role.TALENT,
      bio: 'Junior Developer & Frontend Specialist. Membangun karya nyata berbasis demo live dan repositori kode bersih.',
      githubUsername: 'budipratama-dev',
      reputationScore: 4.9,
      balance: 2450000,
      completedBountiesCount: 14
    }
  });

  const talent2 = await prisma.user.create({
    data: {
      id: 'user-talent-2',
      email: 'siti.ui@gmail.com',
      passwordHash,
      name: 'Siti Rahma',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      role: Role.TALENT,
      bio: 'React & Tailwind CSS Enthusiast. Fokus pada UI interaktif dan aksesibilitas web.',
      githubUsername: 'sitirahma-ui',
      reputationScore: 5.0,
      balance: 1800000,
      completedBountiesCount: 8
    }
  });

  const client1 = await prisma.user.create({
    data: {
      id: 'user-client-1',
      email: 'hendra.kopi@gmail.com',
      passwordHash,
      name: 'Hendra Wijaya (Kopi Nusantara)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      role: Role.CLIENT,
      bio: 'Owner Kopi Nusantara & UMKM Digital Platform.',
      balance: 5000000,
      reputationScore: 5.0
    }
  });

  const admin1 = await prisma.user.create({
    data: {
      id: 'user-admin-1',
      email: 'admin@skillbounty.dev',
      passwordHash,
      name: 'Admin Moderasi & Compliance',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      role: Role.ADMIN,
      balance: 0
    }
  });

  console.log('🎨 Seeding Portfolios for Talents...');
  await prisma.portfolioItem.createMany({
    data: [
      {
        userId: talent1.id,
        title: 'POS Kasir Mini UMKM Kopi',
        description: 'Aplikasi kasir responsif dengan sistem keranjang belanja lokal, cetak struk virtual, dan ringkasan omset harian.',
        demoUrl: 'https://nextjs.org',
        repoUrl: 'https://github.com/budipratama-dev/pos-kasir',
        techTags: ['Next.js', 'Tailwind CSS', 'Prisma', 'TypeScript'],
        lastCheckedAt: '200 OK Live',
        status: 'LIVE'
      },
      {
        userId: talent1.id,
        title: 'E-Commerce Slicing Landing Page',
        description: 'Slicing presisi tinggi dari desain Figma dengan micro-interactions, dark mode, dan animasi framer-motion.',
        demoUrl: 'https://tailwindcss.com',
        repoUrl: 'https://github.com/budipratama-dev/ecommerce-landing',
        techTags: ['React', 'TypeScript', 'Tailwind CSS'],
        lastCheckedAt: '200 OK Live',
        status: 'LIVE'
      },
      {
        userId: talent1.id,
        title: 'Realtime Chat Widget WebSocket',
        description: 'Komponen chat widget ringan untuk customer support dengan status pesan real-time dan notifikasi suara.',
        demoUrl: 'https://socket.io',
        repoUrl: 'https://github.com/budipratama-dev/chat-widget',
        techTags: ['Node.js', 'WebSocket', 'Tailwind CSS'],
        lastCheckedAt: '200 OK Live',
        status: 'LIVE'
      },
      {
        userId: talent2.id,
        title: 'Fintech Dashboard Dark Mode',
        description: 'Dashboard keuangan modern dengan visualisasi data grafik responsif dan validasi transaksi.',
        demoUrl: 'https://nextjs.org',
        repoUrl: 'https://github.com/sitirahma-ui/fintech-dashboard',
        techTags: ['Next.js', 'Tailwind CSS', 'Lucide Icons'],
        lastCheckedAt: '200 OK Live',
        status: 'LIVE'
      }
    ]
  });

  console.log('💰 Seeding Bounties, Escrows, Submissions, Disputes & Reviews...');

  // 1. Bounty 1: In Review
  const bounty1 = await prisma.bounty.create({
    data: {
      id: 'bounty-1',
      clientId: client1.id,
      title: 'Slicing Landing Page Figma ke Next.js 14 & Tailwind',
      category: 'Frontend Slicing',
      description: 'Dibutuhkan developer junior untuk melakukan slicing landing page promosi produk kopi UMKM dari file Figma. Harus 100% responsif di mobile & desktop.',
      budget: 1500000,
      daysEstimate: 3,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: BountyStatus.IN_REVIEW,
      criteria: [
        'Struktur kode modular dan rapi sesuai best-practice Next.js',
        'Responsive di layar mobile (375px) dan desktop (1440px)',
        'Live Demo URL dapat diakses lancar di Vercel / Netlify'
      ],
      techTags: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Responsive Design'],
      escrow: {
        create: {
          amount: 1500000,
          feePlatform: 150000,
          netAmount: 1350000,
          paymentMethod: 'QRIS',
          status: EscrowStatus.HOLD
        }
      },
      submissions: {
        create: {
          id: 'sub-1',
          talentId: talent1.id,
          talentName: talent1.name,
          demoUrl: 'https://nextjs.org',
          repoUrl: 'https://github.com/budipratama-dev/slicing-landing',
          notes: 'Halo pak Hendra, hasil slicing landing page kopi sudah selesai 100% responsif dengan komponen modular.',
          status: SubmissionStatus.PENDING,
          revisionCount: 0
        }
      }
    }
  });

  // 2. Bounty 2: Open
  await prisma.bounty.create({
    data: {
      id: 'bounty-2',
      clientId: client1.id,
      title: 'Integrasi Payment Gateway Midtrans Snap API',
      category: 'Backend Integration',
      description: 'Membutuhkan integrasi checkout transaksi QRIS & Virtual Account menggunakan backend Node.js Express dan webhook handler terverifikasi.',
      budget: 2000000,
      daysEstimate: 4,
      deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      status: BountyStatus.OPEN,
      criteria: [
        'Endpoint generate Snap Token berfungsi',
        'Webhook notifikasi transaksi terenkripsi dengan server key',
        'Simulasi pembayaran QRIS & VA sukses mengupdate status order'
      ],
      techTags: ['Node.js', 'Express', 'Midtrans', 'REST API', 'TypeScript'],
      escrow: {
        create: {
          amount: 2000000,
          feePlatform: 200000,
          netAmount: 1800000,
          paymentMethod: 'VIRTUAL_ACCOUNT',
          status: EscrowStatus.HOLD
        }
      }
    }
  });

  // 3. Bounty 3: Completed with Review
  const bounty3 = await prisma.bounty.create({
    data: {
      id: 'bounty-3',
      clientId: client1.id,
      title: 'Fix Bug Infinite Re-render React Table Filter',
      category: 'Bug Fixing',
      description: 'Memperbaiki performa render tabel transaksi yang mengalami lagging saat filter kategori dan sorting diterapkan bersamaan.',
      budget: 800000,
      daysEstimate: 1,
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: BountyStatus.COMPLETED,
      criteria: [
        'Eliminasi infinite re-render dengan useMemo / useCallback',
        'Filter dan pencarian berjalan instan (<50ms)',
        'Kode bebas lint warning'
      ],
      techTags: ['React', 'TypeScript', 'Performance', 'Bug Fixing'],
      escrow: {
        create: {
          amount: 800000,
          feePlatform: 80000,
          netAmount: 720000,
          paymentMethod: 'QRIS',
          status: EscrowStatus.RELEASED
        }
      },
      submissions: {
        create: {
          id: 'sub-3',
          talentId: talent1.id,
          talentName: talent1.name,
          demoUrl: 'https://react.dev',
          repoUrl: 'https://github.com/budipratama-dev/react-table-fix',
          notes: 'Bug terselesaikan dengan stabilisasi state handler dan pagination virtualized.',
          status: SubmissionStatus.ACCEPTED
        }
      },
      review: {
        create: {
          reviewerId: client1.id,
          receiverId: talent1.id,
          rating: 5,
          comment: 'Luar biasa cepat! Dalam 3 jam bug re-render langsung beres dan kodenya rapi sekali sesuai best-practice React.'
        }
      }
    }
  });

  // 4. Bounty 4: Disputed Case
  const bounty4 = await prisma.bounty.create({
    data: {
      id: 'bounty-4',
      clientId: client1.id,
      title: 'Slicing Dashboard Analytics Sentry Style',
      category: 'Frontend Slicing',
      description: 'Slicing UI dashboard metrik dengan chart responsif dan filter rentang tanggal.',
      budget: 1800000,
      daysEstimate: 3,
      deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      status: BountyStatus.DISPUTED,
      criteria: [
        'Chart responsif di mobile',
        'Filter rentang tanggal berfungsi',
        'Komponen UI bertema gelap'
      ],
      techTags: ['Next.js', 'Chart.js', 'Tailwind CSS'],
      escrow: {
        create: {
          amount: 1800000,
          feePlatform: 180000,
          netAmount: 1620000,
          paymentMethod: 'QRIS',
          status: EscrowStatus.HOLD
        }
      }
    }
  });

  const sub4 = await prisma.submission.create({
    data: {
      id: 'sub-4',
      bountyId: bounty4.id,
      talentId: talent1.id,
      talentName: talent1.name,
      demoUrl: 'https://tailwindcss.com',
      repoUrl: 'https://github.com/budipratama-dev/analytics-dash',
      notes: 'Submission versi 2 dengan perbaikan chart wrapper.',
      status: SubmissionStatus.REVISION_REQUESTED,
      revisionCount: 2,
      revisionNotes: [
        'Chart breakdown masih terpotong di layar HP 375px.',
        'Tombol filter tanggal error saat dipilih rentang 30 hari.'
      ]
    }
  });

  await prisma.dispute.create({
    data: {
      id: 'disp-1',
      bountyId: bounty4.id,
      submissionId: sub4.id,
      initiatedBy: 'Hendra Wijaya (Klien)',
      reason: 'Talenta tidak menyelesaikan perbaikan chart mobile setelah 2 kali permintaan revisi.',
      clientNotes: 'Saya meminta chart mobile bisa discroll horizontal dan tidak overflow layar, tapi sampai batas waktu habis masih belum sempurna.',
      talentNotes: 'Layout sudah diperbaiki menggunakan flex-wrap dan scroll horizontal, namun klien menolak dan meminta perubahan di luar lingkup awal.',
      status: DisputeStatus.PENDING_REVIEW
    }
  });

  console.log('💳 Seeding Withdrawals...');
  await prisma.withdrawal.createMany({
    data: [
      {
        id: 'wd-1',
        userId: talent1.id,
        amount: 1000000,
        bankName: 'BCA (Bank Central Asia)',
        accountNum: '8820194821',
        accountName: 'BUDI PRATAMA',
        status: 'PENDING'
      },
      {
        id: 'wd-2',
        userId: talent1.id,
        amount: 720000,
        bankName: 'GoPay',
        accountNum: '081239847291',
        accountName: 'BUDI PRATAMA',
        status: 'SELESAI'
      }
    ]
  });

  console.log('✅ Database seeded successfully with 100% realistic SkillBounty data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
