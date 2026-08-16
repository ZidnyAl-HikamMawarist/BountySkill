'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  Search, 
  PlusCircle, 
  ShieldCheck, 
  Lock, 
  Code2, 
  CheckCircle2, 
  ArrowRight, 
  Timer, 
  ExternalLink, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Github } from '@/components/ui/icons';

export default function LandingPage() {
  const { bounties, portfolios } = useAppStore();
  const activeBounties = bounties.filter(b => b.status === 'OPEN' || b.status === 'IN_REVIEW').slice(0, 3);
  const featuredPortfolios = portfolios.slice(0, 3);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32 border-b border-outline-variant/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/15 via-background to-background pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/60 text-primary-fixed-dim font-mono text-xs mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>PROOF-OF-WORK MARKETPLACE v1.0</span>
          </div>

          <h1 className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight mb-6 text-white leading-tight">
            Bukti Nyata,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
              Bukan Sekadar CV
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-on-surface-variant max-w-3xl mx-auto mb-10 leading-relaxed font-light">
            Platform micro-bounty yang menghubungkan <strong className="text-white">Talenta Muda</strong> dengan <strong className="text-white">UMKM &amp; Startup</strong> untuk tugas teknis singkat (1–5 hari). Dana terlindungi otomatis di rekening bersama (Escrow).
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              href="/bounties"
              className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base hover:bg-primary-fixed transition-all hover:shadow-[0_0_25px_rgba(128,131,255,0.4)] active:scale-95 flex items-center justify-center gap-2.5"
            >
              <Search className="w-5 h-5" />
              Cari Bounty
            </Link>
            <Link
              href="/client/bounties/create"
              className="w-full sm:w-auto px-8 py-4 bg-surface-container-high text-white border border-outline-variant/80 rounded-xl font-bold text-base hover:bg-surface-variant transition-all active:scale-95 flex items-center justify-center gap-2.5"
            >
              <PlusCircle className="w-5 h-5 text-primary" />
              Posting Tugas
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16 pt-10 border-t border-outline-variant/30 text-left">
            <div>
              <div className="text-2xl sm:text-3xl font-headline font-black text-white">100%</div>
              <div className="text-xs font-mono text-on-surface-variant">Escrow Terkunci Aman</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-headline font-black text-white">1-5 Hari</div>
              <div className="text-xs font-mono text-on-surface-variant">Durasi Mikro Task</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-headline font-black text-white">Live URL</div>
              <div className="text-xs font-mono text-on-surface-variant">Validasi Demo Aktif</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-headline font-black text-white">0% Ghosting</div>
              <div className="text-xs font-mono text-on-surface-variant">Jaminan Dua Arah</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. How it Works (Pipeline 3 Langkah) */}
      <section className="py-20 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-primary uppercase tracking-widest">SISTEM KERJA</span>
            <h2 className="font-headline font-bold text-3xl sm:text-4xl text-white mt-1 mb-3">Pipeline Pengerjaan Transparan</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-sm">
              Menghilangkan risiko penipuan dan rasa takut ghosting dari sisi klien maupun talenta.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="github-card rounded-2xl p-8 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary font-mono font-bold text-xl">
                01
              </div>
              <h3 className="font-headline font-bold text-xl text-white mb-3">Posting &amp; Deposit Escrow</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Klien memposting spesifikasi tugas dan menyetor budget ke akun Escrow sistem via QRIS / VA. Dana terkunci aman.
              </p>
              <div className="status-badge status-warning mt-auto inline-flex">
                <Lock className="w-3 h-3" /> ESCROW_LOCKED
              </div>
            </div>

            {/* Step 2 */}
            <div className="github-card rounded-2xl p-8 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary font-mono font-bold text-xl">
                02
              </div>
              <h3 className="font-headline font-bold text-xl text-white mb-3">Talent Kerjakan &amp; Submit</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Talenta menyelesaikan pengerjaan tugas dan mengirimkan bukti validasi berupa Live Demo URL dan tautan repositori kode.
              </p>
              <div className="status-badge status-info mt-auto inline-flex">
                <Code2 className="w-3 h-3" /> PROOF_OF_WORK
              </div>
            </div>

            {/* Step 3 */}
            <div className="github-card rounded-2xl p-8 relative overflow-hidden group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 text-primary font-mono font-bold text-xl">
                03
              </div>
              <h3 className="font-headline font-bold text-xl text-white mb-3">Review &amp; Dana Cair</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                Klien menguji demo live. Setelah disetujui, sistem otomatis mencairkan dana bersih langsung ke dompet talenta.
              </p>
              <div className="status-badge status-success mt-auto inline-flex">
                <CheckCircle2 className="w-3 h-3" /> FUNDS_RELEASED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Showcase Portofolio Live */}
      <section className="py-20 border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">SHOWCASE TALENTA</span>
              <h2 className="font-headline font-bold text-3xl text-white mt-1">Proof-of-Work Portofolio</h2>
              <p className="text-on-surface-variant text-sm mt-1">Kartu karya talenta dengan live health checker 200 OK.</p>
            </div>
            <Link 
              href="/talent/user-talent-1"
              className="text-primary hover:text-primary-fixed text-sm font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              Lihat Profil Contoh <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPortfolios.map((item) => (
              <div key={item.id} className="github-card rounded-2xl overflow-hidden flex flex-col group">
                {/* Embed Live Preview Frame */}
                <div className="h-44 bg-surface-container-high relative overflow-hidden border-b border-outline-variant/40">
                  <iframe 
                    src={item.demoUrl} 
                    title={item.title}
                    className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="status-badge status-success text-[10px] shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      LIVE 200 OK
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline font-bold text-base text-white mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 flex-grow line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.techTags.map(tag => (
                      <span key={tag} className="tech-tag text-[11px]">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 text-xs">
                    <a 
                      href={item.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      Buka Demo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {item.repoUrl && (
                      <a 
                        href={item.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-on-surface-variant hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" /> Repo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Showcase Bounty Terbuka */}
      <section className="py-20 bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-mono text-primary uppercase tracking-widest">MARKETPLACE</span>
              <h2 className="font-headline font-bold text-3xl text-white mt-1">Bounty Terbuka Siap Dikerjakan</h2>
              <p className="text-on-surface-variant font-mono text-xs mt-1">/api/v1/bounties?status=open</p>
            </div>
            <Link 
              href="/bounties" 
              className="px-4 py-2 rounded-lg bg-surface-container-high border border-outline-variant text-white hover:border-primary text-xs font-mono flex items-center gap-2 transition-all"
            >
              Lihat Semua Bounty ({bounties.length}) <ChevronRight className="w-4 h-4 text-primary" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {activeBounties.map(bounty => (
              <div key={bounty.id} className="github-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded">
                      {bounty.category}
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {formatIDR(bounty.budget)}
                    </span>
                  </div>

                  <Link href={`/bounties/${bounty.id}`} className="block group">
                    <h3 className="font-headline font-bold text-lg text-white group-hover:text-primary transition-colors mb-2 leading-snug">
                      {bounty.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-on-surface-variant line-clamp-3 mb-5 leading-relaxed">
                    {bounty.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {bounty.techTags.map(tag => (
                      <span key={tag} className="tech-tag text-[10px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
                    <Timer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Est: {bounty.daysEstimate} Hari</span>
                  </div>
                  <div className="status-badge status-warning text-[10px]">
                    <Lock className="w-2.5 h-2.5" /> ESCROW_HOLD
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust & Escrow Guarantee */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="github-card rounded-3xl p-10 lg:p-14 relative overflow-hidden border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-surface-container to-surface-container">
            <div className="max-w-3xl relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                <ShieldCheck className="w-4 h-4" /> 100% GARANSI ESCROW OTOMATIS
              </div>
              <h2 className="font-headline font-black text-3xl sm:text-4xl text-white">
                Bekerja Tenang Tanpa Takut Tidak Dibayar. Rekrut Tanpa Khawatir Hasil Kerja Tidak Selesai.
              </h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed font-light">
                SkillBounty memastikan setiap bounty telah disetorkan dananya ke sistem sebelum tugas dikerjakan. Jika terjadi ketidaksesuaian spesifikasi atau sengketa, tim Admin kami memoderasi berdasarkan bukti repositori dan live demo.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href="/register"
                  className="px-6 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all"
                >
                  Mulai Sebagai Talent
                </Link>
                <Link
                  href="/client/bounties/create"
                  className="px-6 py-3.5 bg-surface-container-high border border-outline-variant text-white font-bold rounded-xl text-sm hover:bg-surface-variant transition-all"
                >
                  Buka Bounty Klien
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
