'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Plus, 
  Trash2, 
  Clock, 
  ArrowRight,
  AlertCircle,
  Building2
} from 'lucide-react';

export default function CreateBountyWizardPage() {
  const router = useRouter();
  const { createBounty, currentUser } = useAppStore();

  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend Slicing');
  const [description, setDescription] = useState('');
  const [daysEstimate, setDaysEstimate] = useState(3);
  const [budget, setBudget] = useState(1500000);
  const [criteria, setCriteria] = useState<string[]>([
    'Struktur kode modular dan rapi sesuai best-practice',
    'Responsive di mobile dan desktop',
    'Live Demo URL dapat diakses lancar'
  ]);
  const [newCrit, setNewCrit] = useState('');
  const [techTags, setTechTags] = useState<string[]>(['Next.js', 'Tailwind CSS', 'TypeScript']);
  const [newTag, setNewTag] = useState('');

  // Step 2 Payment States
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'VIRTUAL_ACCOUNT'>('QRIS');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const feePlatform = Math.round(budget * 0.1);
  const totalDeposit = budget; // client pays the bounty budget; platform fee is either included or added. PRD: 10% platform fee deducted from total.

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const handleAddCrit = () => {
    if (newCrit.trim()) {
      setCriteria([...criteria, newCrit.trim()]);
      setNewCrit('');
    }
  };

  const handleRemoveCrit = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !techTags.includes(newTag.trim())) {
      setTechTags([...techTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTechTags(techTags.filter(t => t !== tag));
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || criteria.length === 0) return;
    setStep(2);
  };

  const handleConfirmEscrowPayment = () => {
    setIsProcessingPayment(true);

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + daysEstimate);

    setTimeout(() => {
      const newBounty = createBounty({
        title,
        category,
        description,
        criteria,
        budget,
        daysEstimate,
        deadline: deadlineDate.toISOString(),
        techTags
      }, paymentMethod);

      setIsProcessingPayment(false);
      setPaymentSuccess(true);

      setTimeout(() => {
        router.push(`/bounties/${newBounty.id}`);
      }, 1200);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Link */}
      <Link 
        href="/client/dashboard" 
        className="inline-flex items-center gap-2 text-xs font-mono text-on-surface-variant hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> KEMBALI KE DASHBOARD KLIEN
      </Link>

      {/* Stepper Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between max-w-md mx-auto relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full bg-surface-container-high -z-0"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-0"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>

          {/* Step 1 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono border-2 transition-all ${
              step >= 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}>
              1
            </div>
            <span className="text-[11px] font-mono text-white mt-1.5 font-bold">Detail Tugas</span>
          </div>

          {/* Step 2 Node */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs font-mono border-2 transition-all ${
              step === 2 ? 'bg-primary text-primary-foreground border-primary' : 'bg-surface-container border-outline-variant text-on-surface-variant'
            }`}>
              2
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant mt-1.5">Deposit Escrow</span>
          </div>
        </div>
      </div>

      {/* STEP 1: Detail Spesifikasi Tugas */}
      {step === 1 && (
        <div className="github-card rounded-3xl p-8 sm:p-10 border-outline-variant/60 shadow-2xl animate-in fade-in">
          
          <div className="mb-8 pb-4 border-b border-outline-variant/30">
            <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              LANGKAH 1 DARI 2
            </span>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-white mt-2">
              Spesifikasi Micro-Bounty
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Jelaskan tugas secara spesifik beserta kriteria kelulusan yang jelas.
            </p>
          </div>

          <form onSubmit={handleStep1Submit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">JUDUL BOUNTY *</label>
              <input
                type="text"
                placeholder="Contoh: Slicing Landing Page Figma ke Next.js & Tailwind"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none font-medium"
                required
              />
            </div>

            {/* Category & Deadline (1-5 days) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">KATEGORI TUGAS</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none"
                >
                  <option value="Frontend Slicing">Frontend Slicing</option>
                  <option value="Backend Integration">Backend Integration</option>
                  <option value="Bug Fixing">Bug Fixing</option>
                  <option value="Fullstack Feature">Fullstack Feature</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">ESTIMASI DURASI (1–5 HARI)</label>
                <select
                  value={daysEstimate}
                  onChange={(e) => setDaysEstimate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map(d => (
                    <option key={d} value={d}>{d} Hari Pengerjaan</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">BUDGET TOTAL (IDR) *</label>
              <div className="relative">
                <span className="text-sm font-mono text-on-surface-variant absolute left-3.5 top-3">Rp</span>
                <input
                  type="number"
                  min={100000}
                  step={50000}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white font-mono font-bold focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">DESKRIPSI TUGAS *</label>
              <textarea
                rows={4}
                placeholder="Jelaskan ruang lingkup pengerjaan secara detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white focus:border-primary focus:outline-none leading-relaxed"
                required
              />
            </div>

            {/* Criteria Checklist (Pass/Fail) */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">
                KRITERIA KELULUSAN / ACCEPTANCE CRITERIA *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Tambah kriteria (e.g. Lulus Lighthouse skor 90)"
                  value={newCrit}
                  onChange={(e) => setNewCrit(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCrit(); } }}
                  className="flex-grow px-3 py-2 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCrit}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-white font-medium rounded-xl text-xs border border-outline-variant"
                >
                  Tambah Kriteria
                </button>
              </div>

              <div className="space-y-2">
                {criteria.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-container border border-outline-variant/40 text-xs text-white">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      {c}
                    </span>
                    <button type="button" onClick={() => handleRemoveCrit(i)} className="text-on-surface-variant hover:text-red-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Tags */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">TAGS TEKNOLOGI</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Contoh: Next.js, Prisma, Tailwind"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  className="flex-grow px-3 py-2 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-variant text-white font-medium rounded-xl text-xs border border-outline-variant"
                >
                  Tambah Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {techTags.map(tag => (
                  <span key={tag} className="tech-tag text-xs flex items-center gap-1.5">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="flex justify-end pt-4 border-t border-outline-variant/40">
              <button
                type="submit"
                className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
              >
                Lanjut ke Pembayaran Escrow
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      )}

      {/* STEP 2: Escrow Payment Deposit Simulation */}
      {step === 2 && (
        <div className="github-card rounded-3xl p-8 sm:p-10 border-outline-variant/60 shadow-2xl animate-in fade-in">
          
          <div className="mb-8 pb-4 border-b border-outline-variant/30 flex justify-between items-start">
            <div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                LANGKAH 2 DARI 2
              </span>
              <h1 className="font-headline font-black text-2xl sm:text-3xl text-white mt-2">
                Deposit Rekening Bersama (Escrow)
              </h1>
              <p className="text-xs text-on-surface-variant mt-1">
                Dana akan dikunci di rekening penampung SkillBounty sampai hasil kerja disetujui.
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="text-xs font-mono text-primary hover:underline"
            >
              ← Ubah Detail Tugas
            </button>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-headline font-bold text-2xl text-white">Pembayaran Escrow Berhasil Dikunci!</h2>
              <p className="text-xs text-on-surface-variant font-mono">
                Bounty Anda kini berstatus <strong>OPEN</strong> dan siap dikerjakan oleh komunitas talenta.
              </p>
              <div className="text-xs text-primary animate-pulse">Mengalihkan ke halaman detail...</div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Payment Summary Box */}
              <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant space-y-3">
                <div className="flex justify-between text-sm text-white">
                  <span>Bounty: <strong>{title}</strong></span>
                  <span className="font-mono">{formatIDR(budget)}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant font-mono">
                  <span>Komisi Platform (10% saat pencairan):</span>
                  <span>{formatIDR(feePlatform)}</span>
                </div>
                <div className="pt-3 border-t border-outline-variant/40 flex justify-between text-base font-bold text-white font-mono">
                  <span>Total Deposit yang Dikunci:</span>
                  <span className="text-emerald-400">{formatIDR(totalDeposit)}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-3">PILIH METODE PEMBAYARAN ESCROW:</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                      paymentMethod === 'QRIS'
                        ? 'bg-primary/10 border-primary text-white shadow-md shadow-primary/10'
                        : 'bg-surface-container border-outline-variant/60 text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-emerald-400" />
                    <span className="font-bold text-sm">QRIS Instant (Gojek / OVO / Dana / BCA)</span>
                    <span className="text-[10px] font-mono text-on-surface-variant">Konfirmasi Otomatis</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('VIRTUAL_ACCOUNT')}
                    className={`p-4 rounded-xl border flex flex-col items-center text-center gap-2 transition-all ${
                      paymentMethod === 'VIRTUAL_ACCOUNT'
                        ? 'bg-primary/10 border-primary text-white shadow-md shadow-primary/10'
                        : 'bg-surface-container border-outline-variant/60 text-on-surface-variant hover:border-outline'
                    }`}
                  >
                    <Building2 className="w-6 h-6 text-blue-400" />
                    <span className="font-bold text-sm">Virtual Account (BCA / Mandiri / BNI)</span>
                    <span className="text-[10px] font-mono text-on-surface-variant">Konfirmasi Otomatis</span>
                  </button>
                </div>
              </div>

              {/* Simulated QRIS / VA Display */}
              <div className="p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/50 text-center flex flex-col items-center justify-center">
                {paymentMethod === 'QRIS' ? (
                  <div className="space-y-3">
                    <div className="w-44 h-44 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                      <QrCode className="w-36 h-36 text-black" />
                    </div>
                    <div className="text-xs font-mono text-on-surface-variant">
                      Pindai QRIS di atas melalui aplikasi Mobile Banking atau E-Wallet apa saja.
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-w-sm">
                    <div className="text-xs text-on-surface-variant font-mono">NOMOR VIRTUAL ACCOUNT BCA:</div>
                    <div className="text-2xl font-mono font-bold text-white tracking-widest bg-surface-container p-3 rounded-xl border border-outline-variant">
                      80777 08123984729
                    </div>
                    <div className="text-xs text-on-surface-variant font-mono">
                      Nama Rekening: <strong>SKILLBOUNTY ESCROW</strong>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant hover:text-white text-xs font-medium"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleConfirmEscrowPayment}
                  disabled={isProcessingPayment}
                  className="px-8 py-3.5 bg-emerald-500 text-black font-bold rounded-xl text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {isProcessingPayment ? 'Memverifikasi Setoran Escrow...' : 'Konfirmasi Setoran Escrow & Terbitkan Bounty'}
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
