'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  ExternalLink, 
  ArrowLeft, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  X, 
  FileCode,
  DollarSign
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/state-kit';

export default function ClientReviewSubmissionPage({ 
  params 
}: { 
  params: Promise<{ id: string; submissionId: string }> 
}) {
  const resolvedParams = use(params);
  const { id, submissionId } = resolvedParams;
  const router = useRouter();
  const { 
    bounties, 
    approveBountySubmission, 
    requestBountyRevision, 
    raiseDispute 
  } = useAppStore();

  const bounty = bounties.find(b => b.id === id);
  const submission = bounty?.submissions?.find(s => s.id === submissionId) || bounty?.submissions?.[0];

  // Modals state
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  // Form states
  const [revisionNotes, setRevisionNotes] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [checkedCriteria, setCheckedCriteria] = useState<number[]>([]);

  if (!bounty || !submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState title="Submission Tidak Ditemukan" description="Data submission tugas mikro tidak ditemukan." />
      </div>
    );
  }

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const toggleCriteria = (index: number) => {
    if (checkedCriteria.includes(index)) {
      setCheckedCriteria(checkedCriteria.filter(i => i !== index));
    } else {
      setCheckedCriteria([...checkedCriteria, index]);
    }
  };

  const handleApprove = () => {
    approveBountySubmission(bounty.id, submission.id);
    setShowApproveModal(false);
    router.push(`/bounties/${bounty.id}/review-feedback`);
  };

  const handleRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNotes.trim()) return;
    requestBountyRevision(bounty.id, submission.id, revisionNotes);
    setShowRevisionModal(false);
    router.push(`/client/dashboard`);
  };

  const handleDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    raiseDispute(bounty.id, disputeReason, `Klien mengajukan eskalasi dispute: ${disputeReason}`);
    setShowDisputeModal(false);
    router.push(`/client/dashboard`);
  };

  const netPayout = bounty.escrow?.netAmount || bounty.budget * 0.9;
  const revisionCount = submission.revisionCount || 0;
  const maxRevisions = 2;
  const canRequestRevision = revisionCount < maxRevisions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Link */}
      <Link 
        href="/client/dashboard" 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE DASHBOARD KLIEN
      </Link>

      {/* Header Info */}
      <div className="github-card rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary mb-1">
            <span>REVIEW SUBMISSION TUGAS</span>
            <span>•</span>
            <span className="text-emerald-400">Escrow: {formatIDR(bounty.budget)} (Terkunci)</span>
          </div>
          <h1 className="font-headline font-black text-2xl text-white">{bounty.title}</h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Talenta: <strong className="text-white">{submission.talentName || 'Budi Pratama'}</strong> • Dikirim pada: {new Date(submission.createdAt).toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* 3 Action Trigger Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowApproveModal(true)}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" /> Setujui &amp; Cairkan Dana
          </button>

          <button
            onClick={() => setShowRevisionModal(true)}
            disabled={!canRequestRevision}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              canRequestRevision
                ? 'bg-surface-container-high hover:bg-amber-950/40 text-amber-300 border-amber-500/40 active:scale-95'
                : 'bg-surface-container text-on-surface-variant/40 border-outline-variant/30 cursor-not-allowed'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Minta Revisi ({revisionCount}/{maxRevisions})
          </button>

          <button
            onClick={() => setShowDisputeModal(true)}
            className="px-4 py-2.5 bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-500/40 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Ajukan Dispute
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Verification Checklist & Notes */}
        <div className="space-y-6">
          
          {/* Passing Criteria Verification Checklist */}
          <div className="github-card rounded-2xl p-6 space-y-4">
            <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider">
              Verifikasi Kriteria Kelulusan
            </h3>
            <p className="text-xs text-on-surface-variant">
              Centang kriteria yang telah Anda validasi pada demo live di samping.
            </p>

            <div className="space-y-2.5 pt-2">
              {bounty.criteria.map((c, i) => {
                const isChecked = checkedCriteria.includes(i);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleCriteria(i)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-2.5 text-xs transition-all ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                        : 'bg-surface-container border-outline-variant/40 text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-on-surface-variant mt-0.5 flex-shrink-0" />
                    )}
                    <span>{c}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Talent Notes */}
          <div className="github-card rounded-2xl p-6 space-y-3">
            <h3 className="font-headline font-bold text-sm text-white uppercase tracking-wider">
              Catatan Dari Talenta
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
              {submission.notes || 'Talenta tidak menyertakan catatan tambahan.'}
            </p>
            {submission.repoUrl && (
              <div className="pt-3 border-t border-outline-variant/30">
                <a
                  href={submission.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-primary hover:underline"
                >
                  <Github className="w-4 h-4" /> Buka Repositori Kode di GitHub
                </a>
              </div>
            )}
          </div>

        </div>

        {/* Right Col (2 Cols): Embedded Live Demo Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="github-card rounded-3xl overflow-hidden border-outline-variant flex flex-col h-[650px] shadow-2xl">
            
            {/* Browser Window Bar */}
            <div className="px-4 py-3 bg-surface-container-high border-b border-outline-variant/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="text-xs font-mono text-on-surface-variant ml-2 truncate max-w-sm">
                  {submission.demoUrl}
                </span>
              </div>

              <a
                href={submission.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-primary hover:underline inline-flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded border border-outline-variant/40"
              >
                Buka di Tab Baru <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Live Interactive Iframe */}
            <div className="flex-grow bg-white relative">
              <iframe
                src={submission.demoUrl}
                title="Live Demo Preview"
                className="w-full h-full border-0"
              />
            </div>

          </div>
        </div>

      </div>

      {/* MODAL 1: Approve & Release Escrow Confirmation */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="github-card rounded-3xl p-8 max-w-md w-full border-emerald-500/40 shadow-2xl space-y-5">
            <div className="flex items-center gap-3 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
              <h3 className="font-headline font-bold text-xl text-white">Setujui &amp; Cairkan Escrow</h3>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Dengan menyetujui submission ini, Anda menyatakan bahwa seluruh kriteria tugas telah terpenuhi. Dana bersih akan langsung ditransfer ke dompet talenta.
            </p>

            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant text-xs font-mono space-y-1.5">
              <div className="flex justify-between">
                <span>Budget Escrow:</span>
                <span className="text-white">{formatIDR(bounty.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee (10%):</span>
                <span>{formatIDR(bounty.budget * 0.1)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-outline-variant/30 font-bold text-emerald-400">
                <span>Pencairan Bersih ke Talenta:</span>
                <span>{formatIDR(netPayout)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface-variant hover:text-white"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="px-6 py-2.5 bg-emerald-500 text-black font-bold rounded-xl text-xs hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 active:scale-95"
              >
                Konfirmasi Pencairan Dana
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Request Revision */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="github-card rounded-3xl p-8 max-w-lg w-full border-amber-500/40 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2 text-amber-400 font-headline font-bold text-lg">
                <RefreshCw className="w-5 h-5" /> Minta Revisi Tugas ({revisionCount + 1}/2)
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-on-surface-variant hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRevision} className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Tuliskan dengan jelas poin-poin yang belum sesuai kriteria tugas agar talenta dapat memperbaikinya.
              </p>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">CATATAN REVISI *</label>
                <textarea
                  rows={4}
                  placeholder="Contoh: Responsive layout di mobile masih overlap pada menu navigasi..."
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-amber-400 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface-variant hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 text-black font-bold rounded-xl text-xs hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Kirim Permintaan Revisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Raise Dispute */}
      {showDisputeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="github-card rounded-3xl p-8 max-w-lg w-full border-red-500/40 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-outline-variant/40">
              <div className="flex items-center gap-2 text-red-400 font-headline font-bold text-lg">
                <AlertTriangle className="w-5 h-5" /> Ajukan Eskalasi Sengketa (Dispute)
              </div>
              <button onClick={() => setShowDisputeModal(false)} className="text-on-surface-variant hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDispute} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200 text-xs leading-relaxed">
                Eskalasi dispute akan ditinjau oleh Admin SkillBounty secara independen dengan memeriksa bukti demo dan repositori kode.
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">ALASAN SENGKETA *</label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan secara detail ketidaksesuaian hasil kerja dengan kesepakatan awal..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-red-400 focus:outline-none leading-relaxed"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDisputeModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant text-xs text-on-surface-variant hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl text-xs hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95"
                >
                  Kirim ke Admin Moderasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
