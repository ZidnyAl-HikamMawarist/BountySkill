'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { formatIDR } from '@/lib/utils';
import { 
  ShieldCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Users,
  MoreVertical,
  Share2,
  Lock
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function ClientDashboardPage() {
  const { bounties, currentUser } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clientBounties = bounties.filter(b => b.clientId === (currentUser?.id || 'user-client-1'));

  // Metrics
  const totalEscrowLocked = clientBounties
    .filter(b => b.status === 'OPEN' || b.status === 'IN_REVIEW' || b.status === 'DISPUTED')
    .reduce((sum, b) => sum + b.budget, 0);

  const pendingReviewCount = clientBounties.filter(b => b.status === 'IN_REVIEW').length;
  const activeBountiesCount = clientBounties.filter(b => b.status === 'OPEN').length;
  const completedCount = clientBounties.filter(b => b.status === 'COMPLETED').length;

  // Filtered List
  const filteredBounties = clientBounties.filter(b => {
    if (filterStatus === 'ALL') return true;
    return b.status === filterStatus;
  });

  const handleCopyLink = (bountyId: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${window.location.origin}/bounties/${bountyId}`);
      setCopiedId(bountyId);
      setTimeout(() => setCopiedId(null), 2000);
      setActiveDropdownId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> DASHBOARD KLIEN / UMKM
          </div>
          <h1 className="font-headline font-black text-3xl text-white">Dashboard Klien</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Pantau status dana escrow dan validasi penyerahan tugas live dari talenta.
          </p>
        </div>

        <Link
          href="/client/bounties/create"
          className="px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Buat Bounty Baru
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        
        {/* Total Escrow Locked */}
        <div className="github-card rounded-2xl p-6 border-emerald-500/30 bg-gradient-to-b from-surface-container to-surface-container-high">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
            <span>DANA TERKUNCI DI ESCROW</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-headline font-black text-white">{formatIDR(totalEscrowLocked)}</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">100% aman di rekening bersama</div>
        </div>

        {/* Pending Review Tasks */}
        <div className="github-card rounded-2xl p-6 border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
            <span>MENUNGGU TINJAUAN</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-3xl font-headline font-black text-white">{pendingReviewCount} Tugas</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">Batas waktu review 48 jam</div>
        </div>

        {/* Active Bounties Open */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>BOUNTY AKTIF DIBUKA</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-headline font-black text-white">{activeBountiesCount} Tugas</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">Menerima submission talenta</div>
        </div>

        {/* Completed Bounties */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>BOUNTY SELESAI</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-headline font-black text-white">{completedCount} Tugas</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">100% dana dicairkan ke talenta</div>
        </div>

      </div>

      {/* Submission Review Urgent Banner */}
      {pendingReviewCount > 0 && (
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 text-indigo-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-primary flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-white">Ada Submission Talenta Menunggu Tinjauan Anda!</h4>
              <p className="text-xs text-indigo-300">Terdapat {pendingReviewCount} tugas dengan hasil demo live siap direview dan dicairkan escrownya.</p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('IN_REVIEW')}
            className="px-4 py-2 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary-fixed transition-colors whitespace-nowrap active:scale-95 shadow-md shadow-primary/20"
          >
            Review Submission Sekarang →
          </button>
        </div>
      )}

      {/* Bounties List Section */}
      <div className="github-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-outline-variant/30 pb-4">
          <h2 className="font-headline font-bold text-xl text-white">Daftar Bounty yang Anda Buat</h2>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['ALL', 'OPEN', 'IN_REVIEW', 'COMPLETED', 'DISPUTED'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  filterStatus === status
                    ? 'bg-primary text-primary-foreground font-bold border-primary'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredBounties.length > 0 ? (
          <div className="space-y-4">
            {filteredBounties.map(bounty => {
              const hasSubmissions = bounty.submissions && bounty.submissions.length > 0;
              const isReviewPending = bounty.status === 'IN_REVIEW';

              return (
                <div
                  key={bounty.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ${
                    isReviewPending 
                      ? 'bg-indigo-950/20 border-indigo-500/60 shadow-lg shadow-indigo-500/5' 
                      : 'bg-surface-container border-outline-variant/40 hover:border-outline'
                  }`}
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`status-badge text-[10px] ${
                        bounty.status === 'OPEN' ? 'status-info' :
                        bounty.status === 'IN_REVIEW' ? 'status-warning' :
                        bounty.status === 'COMPLETED' ? 'status-success' : 'status-danger'
                      }`}>
                        {bounty.status}
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">Kategori: {bounty.category}</span>
                      <span className="text-xs font-mono text-emerald-400 font-bold">• Escrow: {formatIDR(bounty.budget)}</span>
                    </div>

                    <Link href={`/bounties/${bounty.id}`} className="block group">
                      <h3 className="font-headline font-bold text-base text-white group-hover:text-primary transition-colors">
                        {bounty.title}
                      </h3>
                    </Link>

                    <div className="text-xs text-on-surface-variant font-mono">
                      Deadline: {new Date(bounty.deadline).toLocaleDateString('id-ID')} • {bounty.submissions?.length || 0} Submission Masuk
                    </div>
                  </div>

                  {/* Actions & 3-Dots Menu */}
                  <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-outline-variant/30 relative">
                    {isReviewPending && hasSubmissions ? (
                      <Link
                        href={`/client/bounties/${bounty.id}/review/${bounty.submissions![0].id}`}
                        className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center gap-1.5 shadow-lg shadow-primary/20 whitespace-nowrap active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review Submission Live
                      </Link>
                    ) : (
                      <Link
                        href={`/bounties/${bounty.id}`}
                        className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Detail Bounty →
                      </Link>
                    )}

                    {/* 3-Dots Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveDropdownId(activeDropdownId === bounty.id ? null : bounty.id)}
                        className="p-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-outline-variant transition-colors"
                        title="Opsi Lanjutan"
                        aria-label="Opsi Lanjutan"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeDropdownId === bounty.id && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-slate-900 border border-outline-variant/80 shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in-95 backdrop-blur-xl"
                        >
                          <Link
                            href={`/bounties/${bounty.id}`}
                            className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                            onClick={() => setActiveDropdownId(null)}
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-primary" />
                            <span>Lihat Halaman Publik</span>
                          </Link>

                          {hasSubmissions && (
                            <Link
                              href={`/client/bounties/${bounty.id}/review/${bounty.submissions![0].id}`}
                              className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                              onClick={() => setActiveDropdownId(null)}
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              <span>Buka Review Submission</span>
                            </Link>
                          )}

                          <button
                            onClick={() => handleCopyLink(bounty.id)}
                            className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors text-left"
                          >
                            <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{copiedId === bounty.id ? '✓ Tautan Disalin!' : 'Salin Tautan Tugas'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Belum Ada Bounty"
            description="Anda belum membuka bounty tugas mikro dengan filter status ini."
            actionText="Posting Bounty Baru Sekarang"
            onAction={() => window.location.href = '/client/bounties/create'}
          />
        )}
      </div>

    </div>
  );
}
