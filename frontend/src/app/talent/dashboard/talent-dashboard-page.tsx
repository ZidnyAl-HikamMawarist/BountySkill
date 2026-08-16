'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Star, 
  AlertCircle, 
  ArrowUpRight, 
  FolderGit2, 
  Search, 
  Send, 
  Layers, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function TalentDashboardPage() {
  const { currentUser, bounties } = useAppStore();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const talentId = currentUser?.id || 'user-talent-1';
  
  // Find all bounties where current talent has submitted work or is working
  const myBounties = bounties.filter(b => 
    b.submissions?.some(s => s.talentId === talentId) || b.status === 'OPEN' || b.status === 'IN_REVIEW' || b.status === 'COMPLETED'
  );

  const filteredList = myBounties.filter(b => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'REVISION') return b.submissions?.some(s => s.status === 'REVISION_REQUESTED');
    if (filterStatus === 'REVIEW') return b.status === 'IN_REVIEW';
    if (filterStatus === 'COMPLETED') return b.status === 'COMPLETED';
    if (filterStatus === 'DISPUTED') return b.status === 'DISPUTED';
    return true;
  });

  const revisionNeededCount = myBounties.filter(b => b.submissions?.some(s => s.status === 'REVISION_REQUESTED')).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* 1. Header Welcome & Action Shortcuts */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant/60 text-emerald-400 font-mono text-xs mb-2">
            <span>DASHBOARD TALENTA AKTIF</span>
          </div>
          <h1 className="font-headline font-black text-3xl text-white">
            Selamat Datang, {currentUser?.name || 'Budi Pratama'}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Pantau status pengerjaan bounty mikro dan kelola portofolio terverifikasi Anda.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/talent/portfolio"
            className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <FolderGit2 className="w-4 h-4 text-primary" /> Kelola Portofolio
          </Link>
          <Link
            href="/bounties"
            className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-md shadow-primary/20 active:scale-95"
          >
            <Search className="w-4 h-4" /> Cari Bounty Baru
          </Link>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        
        {/* Card 1: Balance */}
        <div className="github-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>SALDO DOMPET TERSEDIA</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-headline font-black text-white">
            {formatIDR(currentUser?.balance || 2450000)}
          </div>
          <Link 
            href="/talent/wallet" 
            className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1 mt-3"
          >
            Tarik Saldo <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: Active Tasks */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>BOUNTY AKTIF</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-headline font-black text-white">
            {myBounties.filter(b => b.status === 'OPEN' || b.status === 'IN_REVIEW').length}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-3 font-mono">
            Sedang Dikerjakan / Review
          </div>
        </div>

        {/* Card 3: Completed */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>BOUNTY SELESAI</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-headline font-black text-white">
            {currentUser?.completedBountiesCount || 14}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-3 font-mono text-emerald-400">
            ✓ 100% Escrow Released
          </div>
        </div>

        {/* Card 4: Reputation */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>SKOR REPUTASI</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-2xl font-headline font-black text-white">
            {currentUser?.reputationScore || 4.9} / 5.0
          </div>
          <div className="text-[11px] text-on-surface-variant mt-3 font-mono">
            Berdasarkan rating klien
          </div>
        </div>

      </div>

      {/* 3. Actionable Revision Banner if any revision requested */}
      {revisionNeededCount > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-500/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-sm text-white">Perhatian: Klien Meminta Revisi Tugas</h4>
              <p className="text-xs text-amber-300/80">Terdapat {revisionNeededCount} submission yang memerlukan perbaikan sebelum escrow dicairkan.</p>
            </div>
          </div>
          <button
            onClick={() => setFilterStatus('REVISION')}
            className="px-4 py-2 bg-amber-500 text-black font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors whitespace-nowrap active:scale-95"
          >
            Lihat Revisi Diminta →
          </button>
        </div>
      )}

      {/* 4. Task History & Status Tabs */}
      <div className="github-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-outline-variant/30 pb-4">
          <h2 className="font-headline font-bold text-xl text-white">Riwayat Pengerjaan Tugas</h2>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {[
              { id: 'ALL', label: 'Semua' },
              { id: 'REVIEW', label: 'Menunggu Review' },
              { id: 'REVISION', label: 'Revisi Diminta' },
              { id: 'COMPLETED', label: 'Selesai' },
              { id: 'DISPUTED', label: 'Sengketa' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  filterStatus === tab.id
                    ? 'bg-primary text-primary-foreground font-bold border-primary'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Task List Items */}
        {filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map(bounty => {
              const sub = bounty.submissions?.find(s => s.talentId === talentId) || bounty.submissions?.[0];
              const netAmount = bounty.escrow?.netAmount || bounty.budget * 0.9;
              const hasRevision = sub?.status === 'REVISION_REQUESTED';

              return (
                <div 
                  key={bounty.id} 
                  className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    hasRevision 
                      ? 'bg-amber-950/20 border-amber-500/50 shadow-md shadow-amber-500/5' 
                      : 'bg-surface-container border-outline-variant/40 hover:border-outline'
                  }`}
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className={`status-badge text-[10px] ${
                        bounty.status === 'COMPLETED' ? 'status-success' :
                        hasRevision ? 'status-warning' :
                        bounty.status === 'DISPUTED' ? 'status-danger' : 'status-info'
                      }`}>
                        {hasRevision ? 'REVISI_DIMINTA' : bounty.status}
                      </span>
                      <span className="text-xs font-mono text-on-surface-variant">Klien: {bounty.clientName}</span>
                    </div>

                    <Link href={`/bounties/${bounty.id}`} className="block group">
                      <h3 className="font-headline font-bold text-base text-white group-hover:text-primary transition-colors">
                        {bounty.title}
                      </h3>
                    </Link>

                    {hasRevision && sub?.revisionNotes && (
                      <p className="text-xs text-amber-300 font-mono pt-1">
                        ⚠️ {sub.revisionNotes[sub.revisionNotes.length - 1]}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                    <div className="text-right">
                      <div className="text-xs font-mono text-on-surface-variant">Net (Setelah 10% Komisi)</div>
                      <div className="text-base font-mono font-bold text-emerald-400">
                        {formatIDR(netAmount)}
                      </div>
                    </div>

                    <Link
                      href={hasRevision ? `/bounties/${bounty.id}/submit` : `/bounties/${bounty.id}`}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap ${
                        hasRevision
                          ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-md shadow-amber-500/20'
                          : 'bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-white'
                      }`}
                    >
                      {hasRevision ? 'Kirim Revisi' : 'Lihat Detail'} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="Tidak Ada Riwayat Bounty"
            description="Belum ada pengerjaan bounty dengan status yang dipilih."
            actionText="Jelajahi Marketplace Bounty"
            onAction={() => window.location.href = '/bounties'}
          />
        )}
      </div>

    </div>
  );
}
