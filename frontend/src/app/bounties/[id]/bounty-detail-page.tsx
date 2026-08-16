'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  Lock, 
  Clock, 
  CheckSquare, 
  ShieldCheck, 
  DollarSign, 
  User, 
  ArrowLeft, 
  ExternalLink, 
  Send, 
  AlertTriangle,
  Star,
  Layers,
  FileCode
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function BountyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { bounties, currentUser } = useAppStore();

  const bounty = bounties.find(b => b.id === id);

  if (!bounty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState
          title="Bounty Tidak Ditemukan"
          description="Bounty dengan ID yang diminta tidak terdaftar atau sudah dihapus."
          actionText="Kembali ke Marketplace"
          onAction={() => router.push('/bounties')}
        />
      </div>
    );
  }

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const isClientOwner = currentUser?.role === 'CLIENT' && currentUser.id === bounty.clientId;
  const mySubmission = bounty.submissions?.find(s => s.talentId === (currentUser?.id || 'user-talent-1'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <Link 
        href="/bounties" 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE MARKETPLACE
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <div className="github-card rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-md">
                {bounty.category}
              </span>
              
              {/* Status Badge */}
              <div className={`status-badge ${
                bounty.status === 'OPEN' ? 'status-info' :
                bounty.status === 'IN_REVIEW' ? 'status-warning' :
                bounty.status === 'COMPLETED' ? 'status-success' : 'status-danger'
              }`}>
                {bounty.status}
              </div>
            </div>

            <h1 className="font-headline font-black text-2xl sm:text-3xl text-white mb-4 leading-snug">
              {bounty.title}
            </h1>

            {/* Client Info Bar */}
            <div className="flex items-center gap-3 py-3 border-y border-outline-variant/30 text-xs text-on-surface-variant">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container border border-outline-variant">
                <img src={bounty.clientAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"} alt={bounty.clientName} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold">{bounty.clientName}</span>
                <span className="flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                  <Star className="w-3 h-3 fill-amber-400" /> {bounty.clientRating || 5.0} Rating Klien
                </span>
              </div>
              <div className="ml-auto text-right font-mono text-[11px]">
                Diposting: {new Date(bounty.createdAt).toLocaleDateString('id-ID')}
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider mb-2">
                Deskripsi Tugas
              </h3>
              <p className="text-on-surface-variant text-sm leading-relaxed whitespace-pre-line font-light">
                {bounty.description}
              </p>
            </div>

            {/* Criteria Checklist */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30">
              <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider mb-3">
                Kriteria Kelulusan Submission
              </h3>
              <div className="space-y-2.5">
                {bounty.criteria.map((crit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface-variant">
                    <CheckSquare className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30">
              <h3 className="font-headline font-bold text-xs text-on-surface-variant uppercase tracking-wider mb-2.5">
                Teknologi yang Dibutuhkan
              </h3>
              <div className="flex flex-wrap gap-2">
                {bounty.techTags.map(tag => (
                  <span key={tag} className="tech-tag text-xs">{tag}</span>
                ))}
              </div>
            </div>

          </div>

          {/* Submissions Section (For Client or Talent) */}
          {isClientOwner && (
            <div className="github-card rounded-2xl p-6 sm:p-8">
              <h2 className="font-headline font-bold text-lg text-white mb-4">
                Daftar Submission Talenta ({bounty.submissions?.length || 0})
              </h2>

              {bounty.submissions && bounty.submissions.length > 0 ? (
                <div className="space-y-4">
                  {bounty.submissions.map(sub => (
                    <div key={sub.id} className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white text-sm">{sub.talentName || 'Talenta'}</span>
                          <span className={`status-badge text-[10px] ${
                            sub.status === 'ACCEPTED' ? 'status-success' :
                            sub.status === 'REVISION_REQUESTED' ? 'status-warning' : 'status-info'
                          }`}>
                            {sub.status}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant line-clamp-1">{sub.notes || 'Submission link demo & repo'}</p>
                      </div>

                      <Link
                        href={`/client/bounties/${bounty.id}/review/${sub.id}`}
                        className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary-fixed transition-colors active:scale-95 whitespace-nowrap"
                      >
                        Review Submission →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant">Belum ada submission masuk untuk bounty ini.</p>
              )}
            </div>
          )}

          {/* Talent's Active Submission status banner if submitted */}
          {mySubmission && (
            <div className="github-card rounded-2xl p-6 border-indigo-500/40 bg-indigo-950/20">
              <div className="flex items-center justify-between mb-3">
                <span className="font-headline font-bold text-white text-sm">Status Submission Anda</span>
                <span className={`status-badge text-[10px] ${
                  mySubmission.status === 'ACCEPTED' ? 'status-success' :
                  mySubmission.status === 'REVISION_REQUESTED' ? 'status-warning' : 'status-info'
                }`}>
                  {mySubmission.status}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mb-4">{mySubmission.notes}</p>
              
              {mySubmission.status === 'REVISION_REQUESTED' && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs mb-4">
                  <strong>Catatan Revisi Klien:</strong> {mySubmission.revisionNotes?.[mySubmission.revisionNotes.length - 1]}
                </div>
              )}

              <Link
                href={`/bounties/${bounty.id}/submit`}
                className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary-fixed inline-flex items-center gap-2"
              >
                Kirim Revisi Submission (Percobaan #{mySubmission.revisionCount + 1})
              </Link>
            </div>
          )}

        </div>

        {/* Sidebar Info & Escrow Panel */}
        <div className="space-y-6">
          
          {/* Escrow Budget Card */}
          <div className="github-card rounded-2xl p-6 border-emerald-500/30 bg-gradient-to-b from-surface-container to-surface-container-high">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-2">
              <ShieldCheck className="w-4 h-4" /> REKENING BERSAMA (ESCROW)
            </div>
            
            <div className="text-3xl font-headline font-black text-white mb-1">
              {formatIDR(bounty.budget)}
            </div>
            <div className="text-xs text-on-surface-variant mb-6 font-mono">
              Status Dana: <strong className="text-emerald-400 font-bold">{bounty.escrow?.status || 'HOLD'}</strong>
            </div>

            <div className="space-y-2 py-3 border-t border-outline-variant/30 text-xs font-mono text-on-surface-variant">
              <div className="flex justify-between">
                <span>Budget Bersih Talenta:</span>
                <span className="text-white font-bold">{formatIDR(bounty.escrow?.netAmount || bounty.budget * 0.9)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (10%):</span>
                <span>{formatIDR(bounty.escrow?.feePlatform || bounty.budget * 0.1)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/30">
                <span>Metode Deposit:</span>
                <span className="text-white">{bounty.escrow?.paymentMethod || 'QRIS'}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              {bounty.status === 'OPEN' && (!mySubmission || mySubmission.status === 'REVISION_REQUESTED') ? (
                <Link
                  href={`/bounties/${bounty.id}/submit`}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  {mySubmission ? 'Kirim Revisi Tugas' : 'Kirim Submission Tugas'}
                </Link>
              ) : bounty.status === 'COMPLETED' ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs text-center rounded-xl font-mono">
                  ✓ BOUNTY INI TELAH SELESAI &amp; DANA TERCURAH
                </div>
              ) : (
                <div className="p-3 bg-surface-container border border-outline-variant text-on-surface-variant text-xs text-center rounded-xl font-mono">
                  STATUS: {bounty.status}
                </div>
              )}
            </div>
          </div>

          {/* Deadline Countdown Card */}
          <div className="github-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Clock className="w-4 h-4" /> DEADLINE PENGERJAAN
            </div>
            <div className="text-sm font-bold text-white">
              {new Date(bounty.deadline).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Tugas berjangka waktu pendek {bounty.daysEstimate} hari untuk memastikan feedback cepat.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
