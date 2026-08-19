'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { RoleGuard } from '@/components/auth/role-guard';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Building2, 
  CreditCard, 
  User, 
  ArrowLeft,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function TalentWalletPage() {
  return (
    <RoleGuard allowedRoles={['TALENT']} pageTitle="Dompet & Pencairan Dana Talent">
      <TalentWalletContent />
    </RoleGuard>
  );
}

function TalentWalletContent() {
  const { currentUser, withdrawals, requestWithdrawal, bounties } = useAppStore();

  const [amount, setAmount] = useState<number>(1000000);
  const [bankName, setBankName] = useState('BCA (Bank Central Asia)');
  const [accountNum, setAccountNum] = useState('8820194821');
  const [accountName, setAccountName] = useState(currentUser?.name.toUpperCase() || 'BUDI PRATAMA');
  const [isRequesting, setIsRequesting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const talentId = currentUser?.id || 'user-talent-1';
  const myWithdrawals = withdrawals.filter(w => w.userId === talentId);
  const completedBounties = bounties.filter(b => b.status === 'COMPLETED' && b.submissions?.some(s => s.talentId === talentId));

  const currentBalance = currentUser?.balance || 0;

  const handleWithdrawalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (amount <= 0) {
      setErrorMsg('Nominal penarikan harus lebih besar dari Rp 0.');
      return;
    }
    if (amount > currentBalance) {
      setErrorMsg('Saldo dompet Anda tidak mencukupi untuk nominal penarikan ini.');
      return;
    }
    if (!accountNum.trim() || !accountName.trim()) {
      setErrorMsg('Informasi nomor rekening dan nama pemilik wajib diisi.');
      return;
    }

    setIsRequesting(true);
    setTimeout(() => {
      const ok = requestWithdrawal(amount, bankName, accountNum, accountName);
      setIsRequesting(false);
      if (ok) {
        setSuccessMsg(`Permohonan penarikan dana ${formatIDR(amount)} berhasil diajukan dan sedang diproses admin.`);
      } else {
        setErrorMsg('Gagal mengajukan penarikan dana.');
      }
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <Link href="/talent/dashboard" className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
        </Link>
        <h1 className="font-headline font-black text-3xl text-white">Dompet &amp; Penarikan Dana</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Kelola saldo hasil penyelesaian bounty mikro dan ajukan pencairan ke rekening bank / e-wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Balance & Payout Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Balance Overview Card */}
          <div className="github-card rounded-3xl p-8 bg-gradient-to-r from-surface-container-high via-surface-container to-surface-container border-indigo-500/30 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant mb-2">
              <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4 text-emerald-400" /> SALDO DOMPET BERSIH</span>
              <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">SIAP DICAIRKAN</span>
            </div>

            <div className="text-4xl sm:text-5xl font-headline font-black text-white mb-4">
              {formatIDR(currentBalance)}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-outline-variant/30 text-xs font-mono text-on-surface-variant">
              <div>
                <span>Bounty Terselesaikan:</span> <strong className="text-white">{currentUser?.completedBountiesCount || 14} Tugas</strong>
              </div>
              <div>
                <span>Potongan Platform:</span> <strong className="text-emerald-400">10% (Otomatis)</strong>
              </div>
            </div>
          </div>

          {/* Withdrawal Request Form */}
          <div className="github-card rounded-3xl p-8 border-outline-variant/60 shadow-xl">
            <div className="mb-6 pb-4 border-b border-outline-variant/30">
              <h2 className="font-headline font-bold text-xl text-white">Form Pengajuan Penarikan Dana (Payout)</h2>
              <p className="text-xs text-on-surface-variant mt-1">
                Pencairan diproses oleh sistem transfer perbankan lokal &amp; e-wallet (BCA, Mandiri, BRI, BNI, GoPay, OVO, Dana).
              </p>
            </div>

            {successMsg && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawalSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">NOMINAL PENARIKAN (IDR) *</label>
                <div className="relative">
                  <span className="text-sm font-mono text-on-surface-variant absolute left-3.5 top-3">Rp</span>
                  <input
                    type="number"
                    min={50000}
                    step={50000}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white font-mono font-bold focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  {[500000, 1000000, 2000000, currentBalance].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAmount(Math.min(preset, currentBalance))}
                      className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-[11px] font-mono text-on-surface-variant hover:text-white"
                    >
                      {preset === currentBalance ? 'Maksimal' : formatIDR(preset)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">BANK / E-WALLET TUJUAN *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                  <select
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none"
                  >
                    <option value="BCA (Bank Central Asia)">BCA (Bank Central Asia)</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="BRI (Bank Rakyat Indonesia)">BRI (Bank Rakyat Indonesia)</option>
                    <option value="BNI (Bank Negara Indonesia)">BNI (Bank Negara Indonesia)</option>
                    <option value="Bank Jago">Bank Jago</option>
                    <option value="GoPay">GoPay (E-Wallet)</option>
                    <option value="OVO">OVO (E-Wallet)</option>
                    <option value="DANA">DANA (E-Wallet)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">NOMOR REKENING / HP *</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Contoh: 8820194821"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white font-mono focus:border-primary focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">NAMA PEMILIK REKENING *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Sesuai buku tabungan"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none uppercase font-mono text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isRequesting || currentBalance <= 0}
                className="w-full py-3.5 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 mt-4"
              >
                {isRequesting ? 'Memproses Permohonan...' : 'Ajukan Penarikan Dana Sekarang'}
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Withdrawal History */}
        <div className="space-y-6">
          <div className="github-card rounded-3xl p-6">
            <h3 className="font-headline font-bold text-lg text-white mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Status Permohonan Payout
            </h3>

            {myWithdrawals.length > 0 ? (
              <div className="space-y-3.5">
                {myWithdrawals.map(w => (
                  <div key={w.id} className="p-4 rounded-xl bg-surface-container border border-outline-variant/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-white text-sm">{formatIDR(w.amount)}</span>
                      <span className={`status-badge text-[10px] ${
                        w.status === 'SELESAI' ? 'status-success' :
                        w.status === 'PENDING' ? 'status-warning' :
                        w.status === 'DIPROSES' ? 'status-info' : 'status-danger'
                      }`}>
                        {w.status}
                      </span>
                    </div>

                    <div className="text-xs text-on-surface-variant">
                      {w.bankName} • <span className="font-mono">{w.accountNum}</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant/70">
                      Diajukan: {new Date(w.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>

                    {w.rejectionReason && (
                      <div className="p-2 rounded bg-red-950/40 border border-red-500/30 text-red-300 text-[11px]">
                        Alasan: {w.rejectionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant">Belum ada riwayat penarikan dana.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
