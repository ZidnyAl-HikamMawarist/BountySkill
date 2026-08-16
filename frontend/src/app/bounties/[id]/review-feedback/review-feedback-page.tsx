'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Star, CheckCircle2, ArrowRight, Heart, Sparkles, MessageSquare } from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function ReviewFeedbackPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();
  const { bounties, addReview, currentUser } = useAppStore();

  const bounty = bounties.find(b => b.id === id);

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('Pengerjaan sangat cepat, live demo lancar dan kode rapi sesuai kriteria.');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!bounty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20">
        <EmptyState title="Bounty Tidak Ditemukan" description="Data tugas tidak ditemukan." />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview(bounty.id, rating, comment);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="github-card rounded-3xl p-8 sm:p-10 border-indigo-500/30 shadow-2xl relative overflow-hidden">
        
        {isSubmitted ? (
          <div className="text-center py-8 space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="font-headline font-black text-2xl text-white">Terima Kasih Atas Ulasan Anda!</h2>
              <p className="text-xs text-on-surface-variant mt-1.5 max-w-sm mx-auto">
                Ulasan Anda telah ditambahkan ke profil reputasi talenta untuk membangun ekosistem proof-of-work yang terpercaya.
              </p>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Link
                href="/client/dashboard"
                className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                Kembali ke Dashboard Klien <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="text-center mb-6">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                ✓ ESCROW BERHASIL DICAIRKAN
              </span>
              <h1 className="font-headline font-black text-2xl text-white mt-3 mb-1">
                Beri Rating &amp; Ulasan Talenta
              </h1>
              <p className="text-xs text-on-surface-variant font-mono">
                Bounty: {bounty.title}
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-container border border-outline-variant/40 space-y-2">
              <span className="text-xs font-mono text-on-surface-variant">BERIKAN BINTANG:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          isActive
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-outline-variant'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">
                {rating === 5 ? '⭐⭐⭐⭐⭐ Luar Biasa (5/5)' : `${rating} Bintang`}
              </span>
            </div>

            {/* Comment Textarea */}
            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">
                ULASAN / TESTIMONI HASIL KERJA
              </label>
              <textarea
                rows={4}
                placeholder="Tuliskan pengalaman Anda bekerja dengan talenta ini..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container border border-outline-variant/60 rounded-xl text-xs text-white focus:border-primary focus:outline-none leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
            >
              Kirim Ulasan &amp; Selesaikan
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
