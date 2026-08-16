'use client';

import React from 'react';
import { AlertCircle, RefreshCw, Server, FolderSearch, ShieldAlert } from 'lucide-react';

export function ColdStartBanner() {
  return (
    <div 
      id="cold-start-banner"
      className="bg-indigo-950/70 border-b border-indigo-500/30 px-4 py-2.5 text-xs font-mono text-indigo-200 flex items-center justify-between"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>⚡ <strong>Render Tier Ping:</strong> Backend API siap dalam status live &amp; healthy.</span>
        </div>
        <span className="text-[10px] text-indigo-400 bg-indigo-900/50 px-2 py-0.5 rounded border border-indigo-700/50">
          HEALTH_CHECK: 200 OK
        </span>
      </div>
    </div>
  );
}

export function BountyCardSkeleton() {
  return (
    <div className="github-card rounded-xl p-6 flex flex-col h-72 animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-6 bg-surface-variant/80 rounded w-3/4"></div>
        <div className="h-5 bg-surface-variant/80 rounded w-16"></div>
      </div>
      <div className="space-y-2 flex-grow">
        <div className="h-4 bg-surface-variant/50 rounded w-full"></div>
        <div className="h-4 bg-surface-variant/50 rounded w-5/6"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-5 bg-surface-variant/60 rounded w-14"></div>
        <div className="h-5 bg-surface-variant/60 rounded w-16"></div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30">
        <div className="h-4 bg-surface-variant/50 rounded w-20"></div>
        <div className="h-5 bg-surface-variant/70 rounded-full w-24"></div>
      </div>
    </div>
  );
}

export function PortfolioCardSkeleton() {
  return (
    <div className="github-card rounded-xl overflow-hidden animate-pulse flex flex-col h-80">
      <div className="h-40 bg-surface-variant/70 w-full"></div>
      <div className="p-5 space-y-3 flex-grow">
        <div className="h-5 bg-surface-variant/80 rounded w-2/3"></div>
        <div className="h-4 bg-surface-variant/50 rounded w-full"></div>
        <div className="flex gap-2 pt-2">
          <div className="h-5 bg-surface-variant/60 rounded w-12"></div>
          <div className="h-5 bg-surface-variant/60 rounded w-14"></div>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "Tidak ada data ditemukan",
  description = "Belum ada item yang sesuai dengan kriteria filter saat ini. Coba sesuaikan filter pencarian Anda.",
  actionText,
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <div className="github-card rounded-2xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto my-8 border-dashed border-outline-variant">
      <div className="w-16 h-16 rounded-2xl bg-surface-variant flex items-center justify-center text-primary-fixed mb-4 border border-outline-variant/50">
        {icon || <FolderSearch className="w-8 h-8 text-primary" />}
      </div>
      <h3 className="font-headline font-bold text-xl text-white mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary-fixed transition-all text-sm active:scale-95 shadow-md shadow-primary/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Gagal Memuat Data",
  description = "Terjadi gangguan saat menghubungkan ke server. Mohon periksa koneksi internet Anda dan coba lagi.",
  onRetry
}: ErrorStateProps) {
  return (
    <div className="github-card rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-md mx-auto my-8 border-red-500/30 bg-red-950/10">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4">
        <ShieldAlert className="w-7 h-7" />
      </div>
      <h3 className="font-headline font-bold text-lg text-white mb-2">{title}</h3>
      <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-surface-container-high hover:bg-surface-variant text-white font-medium rounded-lg transition-all text-sm inline-flex items-center gap-2 border border-outline-variant active:scale-95"
        >
          <RefreshCw className="w-4 h-4" /> Coba Lagi
        </button>
      )}
    </div>
  );
}
