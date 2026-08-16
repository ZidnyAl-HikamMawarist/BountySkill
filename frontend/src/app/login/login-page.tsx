'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Role } from '@/types';
import { ArrowRight, Lock, Mail, AlertCircle, Code2, Briefcase, Gavel } from 'lucide-react';
import { Github } from '@/components/ui/icons';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, switchUserRole, users } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Silakan masukkan email akun Anda.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = loginUser(email);
      setIsLoading(false);

      if (success) {
        const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (found?.role === 'TALENT') router.push('/talent/dashboard');
        else if (found?.role === 'CLIENT') router.push('/client/dashboard');
        else if (found?.role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/bounties');
      } else {
        setErrorMsg('Email atau kata sandi tidak ditemukan. Gunakan tombol Akun Demo di bawah untuk uji coba cepat.');
      }
    }, 400);
  };

  const handleQuickLogin = (role: Role) => {
    switchUserRole(role);
    if (role === 'TALENT') router.push('/talent/dashboard');
    else if (role === 'CLIENT') router.push('/client/dashboard');
    else if (role === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="github-card rounded-3xl p-8 sm:p-10 border-outline-variant/60 shadow-2xl">
          
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Autentikasi Pengguna
            </span>
            <h1 className="font-headline font-black text-3xl text-white mt-3 mb-2">
              Masuk ke SkillBounty
            </h1>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              Akses dashboard portofolio atau manajemen bounty Anda.
            </p>
          </div>

          {/* Quick Demo Logins for Instant Testing */}
          <div className="mb-6 bg-surface-container/60 border border-outline-variant/50 p-3.5 rounded-2xl">
            <div className="text-[10px] font-mono text-on-surface-variant mb-2.5 flex items-center justify-between">
              <span>⚡ LOGIN CEPAT DENGAN AKUN DEMO:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="btn-demo-login-talent"
                type="button"
                onClick={() => handleQuickLogin('TALENT')}
                className="px-2.5 py-2 rounded-lg bg-surface-container-high hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex flex-col items-center gap-1 transition-all"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Talent</span>
              </button>
              <button
                id="btn-demo-login-client"
                type="button"
                onClick={() => handleQuickLogin('CLIENT')}
                className="px-2.5 py-2 rounded-lg bg-surface-container-high hover:bg-blue-950/40 border border-blue-500/30 text-blue-300 text-xs font-mono flex flex-col items-center gap-1 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Client</span>
              </button>
              <button
                id="btn-demo-login-admin"
                type="button"
                onClick={() => handleQuickLogin('ADMIN')}
                className="px-2.5 py-2 rounded-lg bg-surface-container-high hover:bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-mono flex flex-col items-center gap-1 transition-all"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* GitHub OAuth */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => handleQuickLogin('TALENT')}
              className="w-full py-3 px-4 rounded-xl bg-[#24292e] hover:bg-[#1b1f23] text-white font-medium text-xs sm:text-sm border border-outline-variant flex items-center justify-center gap-2.5 transition-colors active:scale-95"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Masuk dengan GitHub</span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-outline-variant/40"></div>
            <span className="px-3 text-[11px] font-mono text-on-surface-variant">ATAU EMAIL</span>
            <div className="flex-grow border-t border-outline-variant/40"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="budi.dev@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-on-surface-variant">KATA SANDI</label>
                <a href="#" className="text-xs text-primary hover:underline">Lupa sandi?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Memverifikasi...' : 'Masuk Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center mt-8 pt-6 border-t border-outline-variant/30 text-xs text-on-surface-variant">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Daftar gratis di sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
