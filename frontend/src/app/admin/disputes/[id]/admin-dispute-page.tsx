'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  Gavel, 
  ArrowLeft, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  AlertCircle, 
  Clock,
  Scale
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/state-kit';

export default function AdminDisputeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { disputes, resolveDispute } = useAppStore();

  const disputeCase = disputes.find(d => d.id === id) || disputes[0];

  const [decision, setDecision] = useState<'RELEASE_TO_TALENT' | 'REFUND_TO_CLIENT' | 'SPLIT_50_50'>('RELEASE_TO_TALENT');
  const [adminNotes, setAdminNotes] = useState('Berdasarkan pengujian live demo dan commit repositori, kode telah memenuhi 90% kriteria dengan sedikit bug minor yang dapat diperbaiki.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolved, setResolved] = useState(false);

  if (!disputeCase) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState title="Kasus Sengketa Tidak Ditemukan" description="ID sengketa tidak valid." />
      </div>
    );
  }

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminNotes.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      resolveDispute(disputeCase.id, decision, adminNotes);
      setIsSubmitting(false);
      setResolved(true);
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1200);
    }, 600);
  };

  const isAlreadyResolved = disputeCase.status.startsWith('RESOLVED') || resolved;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Link */}
      <Link 
        href="/admin/dashboard" 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE ADMIN HUB
      </Link>

      {/* Case Header */}
      <div className="github-card rounded-3xl p-8 mb-8 border-red-500/30 bg-gradient-to-r from-red-950/20 via-surface-container to-surface-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-red-400 mb-2">
              <ShieldAlert className="w-4 h-4" /> KASUS SENGKETA ESCROW #{disputeCase.id}
            </div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-white">
              {disputeCase.bounty.title}
            </h1>
            <p className="text-xs text-on-surface-variant mt-1 font-mono">
              Inisiator: <strong>{disputeCase.initiatedBy}</strong> • Nilai Escrow: <strong className="text-emerald-400">{formatIDR(disputeCase.bounty.budget)}</strong>
            </p>
          </div>

          <div className="status-badge status-danger text-xs px-3 py-1">
            {disputeCase.status}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Arguments & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Comparison of Arguments */}
          <div className="github-card rounded-2xl p-6 space-y-4">
            <h2 className="font-headline font-bold text-lg text-white">
              Argumen Kedua Belah Pihak
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client argument */}
              <div className="p-4 rounded-xl bg-surface-container border border-blue-500/30 space-y-2">
                <div className="text-xs font-mono text-blue-400 font-bold">ARGUMEN KLIEN:</div>
                <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                  {disputeCase.clientNotes || disputeCase.reason}
                </p>
              </div>

              {/* Talent argument */}
              <div className="p-4 rounded-xl bg-surface-container border border-emerald-500/30 space-y-2">
                <div className="text-xs font-mono text-emerald-400 font-bold">ARGUMEN TALENTA:</div>
                <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                  {disputeCase.talentNotes || 'Talenta mengklaim telah mengunggah kode dan demo yang berfungsi.'}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Inspection & Live Demo Embed */}
          <div className="github-card rounded-2xl p-6 space-y-4">
            <h2 className="font-headline font-bold text-lg text-white">
              Pemeriksaan Bukti Digital (Proof-of-Work)
            </h2>

            <div className="flex flex-wrap gap-4 text-xs font-mono">
              {disputeCase.submission.demoUrl && (
                <a
                  href={disputeCase.submission.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-variant text-primary border border-outline-variant/60 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Buka Live Demo Terkait
                </a>
              )}

              {disputeCase.submission.repoUrl && (
                <a
                  href={disputeCase.submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-surface-container hover:bg-surface-variant text-white border border-outline-variant/60 flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" /> Repositori Kode di GitHub
                </a>
              )}
            </div>

            {/* Embedded Demo */}
            {disputeCase.submission.demoUrl && (
              <div className="h-64 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant relative mt-4">
                <iframe
                  src={disputeCase.submission.demoUrl}
                  title="Evidence Demo"
                  className="w-full h-full"
                />
              </div>
            )}
          </div>

        </div>

        {/* Right Col: Admin Verdict Panel */}
        <div>
          <div className="github-card rounded-3xl p-6 sm:p-8 border-indigo-500/40 shadow-2xl sticky top-24">
            <div className="flex items-center gap-2 text-primary text-xs font-mono mb-2">
              <Scale className="w-4 h-4" /> FORM PUTUSAN MODERATOR ADMIN
            </div>
            
            <h3 className="font-headline font-bold text-xl text-white mb-4">
              Eksekusi Putusan Dana
            </h3>

            {isAlreadyResolved ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold font-mono">
                  <CheckCircle2 className="w-4 h-4" /> SENGKETA TELAH DISELESAIKAN
                </div>
                <p>Status putusan telah dicatat dan dana escrow dialokasikan sesuai keputusan.</p>
              </div>
            ) : (
              <form onSubmit={handleResolve} className="space-y-5">
                
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-2">PILIH OPSI PUTUSAN:</label>
                  <div className="space-y-2">
                    
                    <button
                      type="button"
                      onClick={() => setDecision('RELEASE_TO_TALENT')}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        decision === 'RELEASE_TO_TALENT'
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      ✓ Cairkan 100% ke Talenta (Tugas Memenuhi Kriteria)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('REFUND_TO_CLIENT')}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        decision === 'REFUND_TO_CLIENT'
                          ? 'bg-blue-950/40 border-blue-500 text-blue-300 font-bold'
                          : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      ↩ Refund 100% ke Klien (Tugas Gagal / Tidak Sesuai)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDecision('SPLIT_50_50')}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        decision === 'SPLIT_50_50'
                          ? 'bg-amber-950/40 border-amber-500 text-amber-300 font-bold'
                          : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                      }`}
                    >
                      ⚖ Bagi Rata 50:50 (Penyelesaian Kompromi)
                    </button>

                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">CATATAN &amp; ALASAN PUTUSAN ADMIN *</label>
                  <textarea
                    rows={4}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-primary focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  <Gavel className="w-4 h-4" />
                  {isSubmitting ? 'Mengeksekusi Putusan...' : 'Tetapkan & Eksekusi Putusan'}
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
