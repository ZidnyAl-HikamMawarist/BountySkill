'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ColdStartBanner, 
  BountyCardSkeleton, 
  PortfolioCardSkeleton, 
  EmptyState, 
  ErrorState 
} from '@/components/ui/state-kit';
import { 
  ArrowLeft, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Code2, 
  RefreshCw 
} from 'lucide-react';

export default function StatesDemoPage() {
  const [retryCount, setRetryCount] = useState(0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header */}
      <div className="border-b border-outline-variant/30 pb-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Beranda
        </Link>
        <h1 className="font-headline font-black text-3xl text-white">
          Design System &amp; State Kit Showcase (Halaman 18)
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Koleksi komponen UI untuk penanganan state khusus: Loading Skeletons, Empty State, Error Fallbacks, dan Status Badges.
        </p>
      </div>

      {/* 1. Status Badges Design System Tokens */}
      <div className="space-y-4">
        <h2 className="font-headline font-bold text-xl text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-primary" /> CI/CD Style Status Badges (Stitch Tokens)
        </h2>
        <div className="flex flex-wrap gap-3 p-6 rounded-2xl bg-surface-container border border-outline-variant">
          <div className="status-badge status-success">
            <CheckCircle2 className="w-3 h-3" /> COMPLETED / 200 OK
          </div>
          <div className="status-badge status-warning">
            <Lock className="w-3 h-3" /> ESCROW_HOLD / IN_PROGRESS
          </div>
          <div className="status-badge status-danger">
            <AlertTriangle className="w-3 h-3" /> DISPUTED / REJECTED
          </div>
          <div className="status-badge status-info">
            <Code2 className="w-3 h-3" /> PROOF_OF_WORK / IN_REVIEW
          </div>
          <div className="status-badge status-purple">
            <Sparkles className="w-3 h-3" /> FEATURED / REVISED
          </div>
        </div>
      </div>

      {/* 2. Skeleton Loaders */}
      <div className="space-y-4">
        <h2 className="font-headline font-bold text-xl text-white">
          Skeleton Loading States (Content Placeholders)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-mono text-on-surface-variant mb-2 block">BountyCardSkeleton:</span>
            <BountyCardSkeleton />
          </div>
          <div>
            <span className="text-xs font-mono text-on-surface-variant mb-2 block">PortfolioCardSkeleton:</span>
            <PortfolioCardSkeleton />
          </div>
        </div>
      </div>

      {/* 3. Empty State */}
      <div className="space-y-4">
        <h2 className="font-headline font-bold text-xl text-white">
          Reusable Empty State Component
        </h2>
        <EmptyState
          title="Tidak Ada Tugas Yang Cocok"
          description="Kriteria pencarian Anda belum menemukan bounty yang tersedia. Coba sesuaikan kata kunci atau rentang budget."
          actionText="Jelajahi Semua Bounty"
          onAction={() => window.location.href = '/bounties'}
        />
      </div>

      {/* 4. Error State with Retry */}
      <div className="space-y-4">
        <h2 className="font-headline font-bold text-xl text-white">
          Reusable Error State Component (With Retry Callback)
        </h2>
        <ErrorState
          title="Koneksi API Backend Terputus"
          description={`Gagal mengambil data dari server. Jumlah percobaan retry saat ini: ${retryCount}`}
          onRetry={() => setRetryCount(prev => prev + 1)}
        />
      </div>

    </div>
  );
}
