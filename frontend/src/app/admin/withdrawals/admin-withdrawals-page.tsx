'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { 
  Wallet, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Clock, 
  Building2, 
  CreditCard, 
  AlertCircle, 
  X,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function AdminWithdrawalsPage() {
  const { withdrawals, updateWithdrawalStatus } = useAppStore();
  
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedRejectWdId, setSelectedRejectWdId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Nomor rekening tidak cocok dengan nama pemilik tabungan.');
  const [successToast, setSuccessToast] = useState('');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    if (filterStatus === 'ALL') return true;
    return w.status === filterStatus;
  });

  // Calculate Pagination
  const totalItems = filteredWithdrawals.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedWithdrawals = filteredWithdrawals.slice(startIndex, endIndex);

  const handleApprove = (id: string) => {
    updateWithdrawalStatus(id, 'SELESAI');
    setSuccessToast('Permohonan penarikan dana berhasil disetujui dan ditandai selesai.');
    setActiveDropdownId(null);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRejectWdId || !rejectionReason.trim()) return;

    updateWithdrawalStatus(selectedRejectWdId, 'DITOLAK', rejectionReason);
    setSelectedRejectWdId(null);
    setSuccessToast('Permohonan penarikan dana ditolak dan saldo telah dikembalikan ke akun talenta.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCopyAccount = (item: any) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${item.bankName} - ${item.accountNum} (a/n ${item.accountName})`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
      setActiveDropdownId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-outline-variant/30 pb-6">
        <div>
          <Link href="/admin/dashboard" className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Admin Hub
          </Link>
          <h1 className="font-headline font-black text-3xl text-white">Verifikasi Penarikan Dana (Payout)</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Antrian verifikasi transfer saldo penarikan talenta ke rekening bank / e-wallet.
          </p>
        </div>
      </div>

      {successToast && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 mb-6 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="github-card rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-outline-variant/30">
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            {['ALL', 'PENDING', 'SELESAI', 'DITOLAK'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1);
                }}
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

        {/* Withdrawal Table / Cards */}
        {paginatedWithdrawals.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {paginatedWithdrawals.map(item => {
                const isPending = item.status === 'PENDING';

                return (
                  <div
                    key={item.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 relative ${
                      isPending
                        ? 'bg-surface-container border-amber-500/40 shadow-md shadow-amber-500/5'
                        : 'bg-surface-container-lowest border-outline-variant/40'
                    }`}
                  >
                    <div className="space-y-1.5 flex-grow">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className={`status-badge text-[10px] ${
                          item.status === 'SELESAI' ? 'status-success' :
                          item.status === 'PENDING' ? 'status-warning' : 'status-danger'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-xs font-bold text-white">{item.userName}</span>
                        <span className="text-xs font-mono text-on-surface-variant">
                          • Diajukan: {new Date(item.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant font-mono">
                        <span>Bank: <strong className="text-white">{item.bankName}</strong></span>
                        <span>No Rek: <strong className="text-white">{item.accountNum}</strong></span>
                        <span>A/N: <strong className="text-white">{item.accountName}</strong></span>
                      </div>

                      {item.rejectionReason && (
                        <p className="text-xs text-red-300 font-mono pt-1">
                          Alasan Penolakan: {item.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between lg:justify-end w-full lg:w-auto gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-outline-variant/30 relative">
                      <div className="text-right">
                        <div className="text-[11px] font-mono text-on-surface-variant">Nominal Payout</div>
                        <div className="text-lg font-mono font-bold text-emerald-400">
                          {formatIDR(item.amount)}
                        </div>
                      </div>

                      {isPending && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95 whitespace-nowrap"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Setujui
                          </button>
                          <button
                            onClick={() => setSelectedRejectWdId(item.id)}
                            className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Tolak
                          </button>
                        </div>
                      )}

                      {/* 3-Dots Menu */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdownId(activeDropdownId === item.id ? null : item.id)}
                          className="p-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-outline-variant transition-colors"
                          title="Menu Opsi"
                          aria-label="Menu Opsi Payout"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdownId === item.id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-slate-900 border border-outline-variant/80 shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in-95 backdrop-blur-xl"
                          >
                            <button
                              onClick={() => handleCopyAccount(item)}
                              className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors text-left"
                            >
                              <Copy className="w-3.5 h-3.5 text-primary" />
                              <span>{copiedId === item.id ? '✓ Berhasil Disalin!' : 'Salin Rekening'}</span>
                            </button>

                            {isPending && (
                              <>
                                <button
                                  onClick={() => handleApprove(item.id)}
                                  className="w-full px-4 py-2 text-xs text-emerald-400 hover:bg-emerald-500/10 flex items-center gap-2.5 transition-colors text-left"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Setujui Penarikan</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRejectWdId(item.id);
                                    setActiveDropdownId(null);
                                  }}
                                  className="w-full px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors text-left"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Tolak Permohonan</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-on-surface-variant font-mono">
                  Menampilkan <strong className="text-white">{startIndex + 1}</strong> – <strong className="text-white">{endIndex}</strong> dari <strong className="text-white">{totalItems}</strong> permohonan
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                          : 'bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl bg-surface-container-high border border-outline-variant text-on-surface-variant hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="Tidak Ada Antrian Penarikan"
            description="Tidak ada data permohonan penarikan dana dengan status filter ini."
            actionText="Lihat Semua Status"
            onAction={() => {
              setFilterStatus('ALL');
              setCurrentPage(1);
            }}
          />
        )}
      </div>

      {/* Modal Tolak Penarikan */}
      {selectedRejectWdId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="github-card rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-outline-variant">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/40">
              <h2 className="font-headline font-bold text-xl text-white">Tolak Permohonan Penarikan Dana</h2>
              <button onClick={() => setSelectedRejectWdId(null)} className="text-on-surface-variant hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-2">ALASAN PENOLAKAN KEPADA TALENTA</label>
                <textarea
                  rows={4}
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-red-500 outline-none resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setSelectedRejectWdId(null)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
                >
                  Konfirmasi Penolakan & Kembalikan Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
