'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  Star, 
  CheckCircle2, 
  ExternalLink, 
  Briefcase, 
  Layers, 
  ShieldCheck, 
  Mail, 
  ArrowLeft,
  Activity,
  Plus
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/state-kit';

export default function TalentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const { users, portfolios, currentUser } = useAppStore();

  const talent = users.find(u => u.id === id) || users.find(u => u.role === 'TALENT');
  const talentPortfolios = portfolios.filter(p => p.userId === talent?.id || p.userId === 'user-talent-1');
  const isOwner = currentUser?.id === talent?.id;

  if (!talent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState title="Profil Talenta Tidak Ditemukan" description="User yang Anda cari tidak terdaftar dalam sistem." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <Link 
        href="/bounties" 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE MARKETPLACE
      </Link>

      {/* 1. Header Profile Banner */}
      <div className="github-card rounded-3xl p-8 sm:p-10 mb-10 border-indigo-500/30 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary shadow-xl bg-surface-container flex-shrink-0">
              <img src={talent.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"} alt={talent.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">{talent.name}</h1>
                <span className="status-badge status-success text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> PROOF_VERIFIED
                </span>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl font-light">
                {talent.bio || 'Junior Developer & Frontend Specialist. Membangun karya nyata berbasis demo live dan repositori kode bersih.'}
              </p>

              {talent.githubUsername && (
                <a
                  href={`https://github.com/${talent.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline pt-1"
                >
                  <Github className="w-3.5 h-3.5" /> @{talent.githubUsername}
                </a>
              )}
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex sm:flex-col gap-4 bg-surface-container-lowest/80 border border-outline-variant/50 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <div>
                <div className="text-lg font-headline font-black text-white">{talent.reputationScore || 4.9}</div>
                <div className="text-[10px] font-mono text-on-surface-variant">Skor Reputasi</div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:pt-2 sm:border-t border-outline-variant/30">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <div className="text-lg font-headline font-black text-white">{talent.completedBountiesCount || 14}</div>
                <div className="text-[10px] font-mono text-on-surface-variant">Bounty Selesai</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Interactive Portfolio Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-headline font-bold text-2xl text-white">Portofolio Interaktif (Live Demo)</h2>
            <p className="text-on-surface-variant text-xs">Seluruh proyek diverifikasi melalui status respon demo URL.</p>
          </div>

          {isOwner && (
            <Link
              href="/talent/portfolio"
              className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary-fixed transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Kelola Portofolio
            </Link>
          )}
        </div>

        {talentPortfolios.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talentPortfolios.map((item) => (
              <div key={item.id} className="github-card rounded-2xl overflow-hidden flex flex-col group">
                {/* Embed Live Preview Frame */}
                <div className="h-48 bg-surface-container-high relative overflow-hidden border-b border-outline-variant/40">
                  <iframe 
                    src={item.demoUrl} 
                    title={item.title}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="status-badge status-success text-[10px] shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE 200 OK
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="font-headline font-bold text-base text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 flex-grow leading-relaxed font-light">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.techTags.map(tag => (
                      <span key={tag} className="tech-tag text-[10px]">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30 text-xs">
                    <a 
                      href={item.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary hover:underline font-medium flex items-center gap-1"
                    >
                      Buka Demo Live <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {item.repoUrl && (
                      <a 
                        href={item.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-on-surface-variant hover:text-white flex items-center gap-1 font-mono"
                      >
                        <Github className="w-3.5 h-3.5" /> Repositori
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum Ada Item Portofolio"
            description="Talenta ini belum menambahkan item portofolio dengan live demo URL."
            actionText={isOwner ? "Tambah Portofolio Pertama" : undefined}
            onAction={isOwner ? () => window.location.href = '/talent/portfolio' : undefined}
          />
        )}
      </div>

      {/* 3. Client Reviews & Feedback Section */}
      <div className="github-card rounded-2xl p-8">
        <h3 className="font-headline font-bold text-xl text-white mb-6">
          Ulasan &amp; Reputasi Dari Klien Sebelumnya
        </h3>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">Hendra Wijaya (Kopi Nusantara)</span>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
            </div>
            <p className="text-xs text-on-surface-variant font-light leading-relaxed">
              "Luar biasa cepat! Dalam 3 jam bug re-render langsung beres dan kodenya rapi sekali sesuai best-practice React."
            </p>
            <div className="text-[10px] font-mono text-on-surface-variant/70">
              Bounty: Fix Bug Infinite Re-render React Table Filter
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
