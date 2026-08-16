'use client';

import React from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  Gavel, 
  Wallet, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ArrowRight,
  ChevronRight,
  Lock,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function AdminDashboardPage() {
  const { disputes, withdrawals, bounties } = useAppStore();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const pendingDisputes = disputes.filter(d => d.status === 'PENDING_REVIEW' || d.status === 'INVESTIGATING');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING');
  const totalEscrowVolume = bounties.reduce((acc, b) => acc + (b.escrow?.amount || b.budget), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs mb-2">
            <Gavel className="w-3.5 h-3.5" /> PUSAT MODERASI &amp; COMPLIANCE ADMIN
          </div>
          <h1 className="font-headline font-black text-3xl text-white">
            SkillBounty Admin Hub
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Moderasi sengketa escrow, verifikasi pencairan dana, dan pengawasan transaksi platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/withdrawals"
            className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-variant border border-outline-variant text-white font-medium rounded-xl text-xs flex items-center gap-2 transition-all"
          >
            <Wallet className="w-4 h-4 text-emerald-400" /> Verifikasi Payout ({pendingWithdrawals.length})
          </Link>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Metric 1: Pending Disputes */}
        <div className="github-card rounded-2xl p-6 border-red-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>SENGKETA AKTIF</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-3xl font-headline font-black text-red-400">
            {pendingDisputes.length} Kasus
          </div>
          <div className="text-[11px] text-on-surface-variant mt-2 font-mono">
            Butuh keputusan admin
          </div>
        </div>

        {/* Metric 2: Pending Withdrawals */}
        <div className="github-card rounded-2xl p-6 border-amber-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>PENARIKAN MENUNGGU</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-headline font-black text-amber-400">
            {pendingWithdrawals.length} Permohonan
          </div>
          <div className="text-[11px] text-on-surface-variant mt-2 font-mono">
            Antrian verifikasi payout
          </div>
        </div>

        {/* Metric 3: Total Escrow Volume */}
        <div className="github-card rounded-2xl p-6 border-emerald-500/30">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>TOTAL VOLUME ESCROW</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-headline font-black text-emerald-400">
            {formatIDR(totalEscrowVolume)}
          </div>
          <div className="text-[11px] text-on-surface-variant mt-2 font-mono">
            Total transaksi kumulatif
          </div>
        </div>

        {/* Metric 4: Total Bounties */}
        <div className="github-card rounded-2xl p-6">
          <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
            <span>TOTAL BOUNTY DIBUKA</span>
            <Layers className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-headline font-black text-white">
            {bounties.length} Tugas
          </div>
          <div className="text-[11px] text-on-surface-variant mt-2 font-mono">
            100% transparan
          </div>
        </div>

      </div>

      {/* Priority 1: Dispute Moderation Queue */}
      <div className="github-card rounded-2xl p-6 sm:p-8 mb-10">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline font-bold text-xl text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" /> Antrian Moderasi Dispute ({disputes.length})
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Kasus sengketa yang membutuhkan peninjauan bukti repositori, demo, dan putusan pembagian dana.
            </p>
          </div>
        </div>

        {disputes.length > 0 ? (
          <div className="space-y-4">
            {disputes.map(caseItem => (
              <div
                key={caseItem.id}
                className="p-5 rounded-xl bg-surface-container border border-outline-variant/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-red-500/40 transition-colors"
              >
                <div className="space-y-1.5 flex-grow">
                  <div className="flex items-center gap-2.5">
                    <span className="status-badge status-danger text-[10px]">
                      {caseItem.status}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">
                      Inisiator: {caseItem.initiatedBy}
                    </span>
                  </div>

                  <h3 className="font-headline font-bold text-base text-white">
                    {caseItem.bounty.title}
                  </h3>

                  <p className="text-xs text-on-surface-variant line-clamp-1">
                    Alasan: {caseItem.reason}
                  </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-outline-variant/30">
                  <div className="text-right font-mono text-xs">
                    <div className="text-on-surface-variant">Nilai Sengketa</div>
                    <div className="text-emerald-400 font-bold">{formatIDR(caseItem.bounty.budget)}</div>
                  </div>

                  <Link
                    href={`/admin/disputes/${caseItem.id}`}
                    className="px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg text-xs hover:bg-primary-fixed transition-all flex items-center gap-1 active:scale-95 whitespace-nowrap"
                  >
                    Buka Kasus Moderasi →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Tidak Ada Sengketa Aktif"
            description="Semua transaksi berjalan lancar tanpa ada kasus dispute."
          />
        )}
      </div>

    </div>
  );
}
