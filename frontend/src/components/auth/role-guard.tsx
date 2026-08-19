'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Role } from '@/types';
import { ShieldAlert, Lock, ArrowRight, Home, LogOut, Loader2 } from 'lucide-react';

interface RoleGuardProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  pageTitle?: string;
}

export function RoleGuard({ allowedRoles, children, pageTitle }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, isAuthInitialized, logoutUser } = useAppStore();

  // 1. Loading state while checking localStorage session
  if (!isAuthInitialized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-xs font-mono text-on-surface-variant">Memvalidasi izin akses akun...</p>
      </div>
    );
  }

  // 2. Unauthenticated: User is not logged in
  if (!currentUser) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full github-card rounded-3xl p-8 border-outline-variant/60 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-5 text-amber-400">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            401 &bull; Autentikasi Diperlukan
          </span>

          <h2 className="font-headline font-black text-2xl text-white mt-4 mb-2">
            Silakan Masuk Terlebih Dahulu
          </h2>

          <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">
            Halaman {pageTitle ? <strong>&ldquo;{pageTitle}&rdquo;</strong> : 'ini'} memerlukan login ke akun yang terdaftar dengan hak akses yang sesuai.
          </p>

          <div className="space-y-3">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span>Masuk ke Akun Anda</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 border border-outline-variant/40 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthorized: Role mismatch (e.g. Talent trying to access Admin Hub)
  if (!allowedRoles.includes(currentUser.role)) {
    const roleLabels: Record<Role, string> = {
      TALENT: 'Talent / Pengembang',
      CLIENT: 'Klien / Pemberi Bounty',
      ADMIN: 'Administrator / Moderator'
    };

    const getDashboardPath = (role: Role) => {
      switch (role) {
        case 'TALENT': return '/talent/dashboard';
        case 'CLIENT': return '/client/dashboard';
        case 'ADMIN': return '/admin/dashboard';
        default: return '/';
      }
    };

    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full github-card rounded-3xl p-8 border-red-500/30 shadow-2xl text-center bg-red-950/10">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-5 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider text-red-400 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
            403 &bull; Akses Ditolak (Forbidden)
          </span>

          <h2 className="font-headline font-black text-2xl text-white mt-4 mb-2">
            Hak Akses Tidak Sesuai
          </h2>

          <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed mb-6">
            Halaman ini hanya dapat diakses oleh akun dengan peran{' '}
            <strong className="text-white">
              {allowedRoles.map(r => roleLabels[r] || r).join(' atau ')}
            </strong>.
            <br />
            Akun Anda saat ini: <strong className="text-primary">{currentUser.name}</strong> ({roleLabels[currentUser.role]}).
          </p>

          <div className="space-y-3">
            <Link
              href={getDashboardPath(currentUser.role)}
              className="w-full py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl text-xs sm:text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <span>Buka Dashboard {currentUser.role}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => {
                logoutUser();
                router.push('/login');
              }}
              className="w-full py-2.5 px-4 bg-surface-container hover:bg-red-950/30 text-on-surface-variant hover:text-red-300 font-medium rounded-xl text-xs flex items-center justify-center gap-2 border border-outline-variant/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Ganti Akun (Login Ulang)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized: render children
  return <>{children}</>;
}
