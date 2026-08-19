'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { RoleGuard } from '@/components/auth/role-guard';
import { 
  Send, 
  ArrowLeft, 
  CheckSquare, 
  Code2, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ShieldCheck
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';
import { Github } from '@/components/ui/icons';

export default function BountySubmitPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <RoleGuard allowedRoles={['TALENT']} pageTitle="Kirim Hasil Pekerjaan Bounty">
      <BountySubmitContent params={params} />
    </RoleGuard>
  );
}

function BountySubmitContent({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { bounties, submitBountyWork, currentUser } = useAppStore();

  const bounty = bounties.find(b => b.id === id);
  const talentId = currentUser?.id || 'user-talent-1';
  const existingSub = bounty?.submissions?.find(s => s.talentId === talentId);

  const [demoUrl, setDemoUrl] = useState(existingSub?.demoUrl || 'https://skillbounty-demo.vercel.app');
  const [repoUrl, setRepoUrl] = useState(existingSub?.repoUrl || 'https://github.com/budipratama-dev/skillbounty-submission');
  const [notes, setNotes] = useState(existingSub?.notes || 'Halo, saya telah menyelesaikan seluruh kriteria kelulusan sesuai deskripsi tugas.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!bounty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState title="Bounty Tidak Ditemukan" description="Tugas mikro ini tidak tersedia." />
      </div>
    );
  }

  const isRevision = existingSub && existingSub.status === 'REVISION_REQUESTED';
  const revisionCount = existingSub ? existingSub.revisionCount + 1 : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!demoUrl.trim()) {
      setErrorMsg('Live Demo URL wajib diisi untuk validasi proof-of-work.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitBountyWork(bounty.id, demoUrl, repoUrl, notes);
      setIsSubmitting(false);
      router.push(`/bounties/${bounty.id}`);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <Link 
        href={`/bounties/${bounty.id}`} 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE DETAIL BOUNTY
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Context & Criteria Checklist */}
        <div className="space-y-6">
          <div className="github-card rounded-2xl p-6">
            <span className="text-[11px] font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded">
              {bounty.category}
            </span>
            <h2 className="font-headline font-bold text-lg text-white mt-3 mb-2">{bounty.title}</h2>
            <div className="text-sm font-mono text-emerald-400 font-bold mb-4">
              Budget Escrow: Rp {bounty.budget.toLocaleString('id-ID')}
            </div>

            <div className="pt-4 border-t border-outline-variant/30 space-y-2">
              <span className="text-xs font-headline font-bold text-white uppercase tracking-wider block mb-2">
                Kriteria Kelulusan:
              </span>
              {bounty.criteria.map((c, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Revision Note Banner if applicable */}
          {isRevision && existingSub.revisionNotes && (
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-amber-200 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-amber-400 font-bold">
                <span>CATATAN REVISI KLIEN:</span>
                <span>Percobaan #{revisionCount} dari maks. 2</span>
              </div>
              <p className="text-xs text-amber-200/90 font-light leading-relaxed">
                {existingSub.revisionNotes[existingSub.revisionNotes.length - 1]}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Submission Form */}
        <div className="lg:col-span-2">
          <div className="github-card rounded-3xl p-8 border-outline-variant/60 shadow-2xl">
            
            <div className="mb-6 pb-4 border-b border-outline-variant/30">
              <h1 className="font-headline font-black text-2xl text-white">
                {isRevision ? `Kirim Revisi Submission (Percobaan ${revisionCount}/2)` : 'Kirim Submission Hasil Kerja'}
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Sertakan tautan live demo dan repositori asli untuk diverifikasi oleh klien.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">
                  LIVE DEMO URL (Vercel / Netlify / Live Server) *
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                  <input
                    type="url"
                    placeholder="https://hasil-kerja-saya.vercel.app"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white font-mono text-xs focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">
                  REPOSITORI KODE (GitHub / GitLab)
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                  <input
                    type="url"
                    placeholder="https://github.com/username/repo-bounty"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">
                  CATATAN TAMBAHAN &amp; CARA PENGUJIAN
                </label>
                <textarea
                  rows={4}
                  placeholder="Jelaskan implementasi kode, kredensial demo (jika ada akun dummy), dan catatan penting lainnya..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Real-time Iframe Preview */}
              {demoUrl && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-mono text-emerald-400">
                    PRATINJAU LIVE DEMO:
                  </label>
                  <div className="h-44 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant relative">
                    <iframe 
                      src={demoUrl} 
                      title="Pratinjau Live Demo"
                      className="w-[200%] h-[200%] scale-50 origin-top-left"
                    />
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/50 text-xs text-on-surface-variant space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Perlindungan Pembayaran Escrow Aktif
                </div>
                <p>
                  Setelah submission dikirim, status tugas akan berubah menjadi <strong>IN_REVIEW</strong>. Klien memiliki waktu 48 jam untuk menyetujui atau meminta revisi.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
                <Link
                  href={`/bounties/${bounty.id}`}
                  className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:text-white text-xs font-medium"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Mengirim Submission...' : 'Kirim Submission Sekarang'}
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        </div>

      </div>

    </div>
  );
}
