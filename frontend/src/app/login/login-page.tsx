'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Role } from '@/types';
import { 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  Code2, 
  Briefcase, 
  Gavel, 
  Check, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { Github } from '@/components/ui/icons';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { loginUser, users } = useAppStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'TALENT' as Role,
      title: 'Talent Pengembang',
      name: 'Budi Pratama',
      email: 'budi.dev@gmail.com',
      icon: Code2,
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500'
    },
    {
      role: 'CLIENT' as Role,
      title: 'Klien Pemberi Tugas',
      name: 'Hendra Wijaya',
      email: 'hendra@kopiindonesia.co.id',
      icon: Briefcase,
      badgeColor: 'text-blue-400 border-blue-500/30 bg-blue-500/10 hover:border-blue-500'
    },
    {
      role: 'ADMIN' as Role,
      title: 'Administrator Platform',
      name: 'Admin SkillBounty',
      email: 'admin@skillbounty.id',
      icon: Gavel,
      badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-500'
    }
  ];

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123456');
    setErrorMsg('');
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        
        // If there is a redirect query matching the role, go there
        if (redirectUrl) {
          if (redirectUrl.startsWith('/admin') && found?.role === 'ADMIN') {
            router.push(redirectUrl);
            return;
          }
          if (redirectUrl.startsWith('/client') && found?.role === 'CLIENT') {
            router.push(redirectUrl);
            return;
          }
          if (redirectUrl.startsWith('/talent') && found?.role === 'TALENT') {
            router.push(redirectUrl);
            return;
          }
        }

        // Standard role redirect
        if (found?.role === 'TALENT') router.push('/talent/dashboard');
        else if (found?.role === 'CLIENT') router.push('/client/dashboard');
        else if (found?.role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/bounties');
      } else {
        setErrorMsg('Email tidak terdaftar. Pilih salah satu Akun Demo di bawah atau daftar akun baru.');
      }
    }, 350);
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="github-card rounded-3xl p-8 sm:p-10 border-outline-variant/60 shadow-2xl">
          
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Autentikasi Akun
            </span>
            <h1 className="font-headline font-black text-3xl text-white mt-3 mb-2">
              Masuk ke SkillBounty
            </h1>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              Akses akun Anda sesuai hak izin peran (Talent, Client, atau Admin).
            </p>
          </div>

          {/* Quick Fill Demo Selector */}
          <div className="mb-6 bg-surface-container/60 border border-outline-variant/50 p-3.5 rounded-2xl">
            <div className="text-[10px] font-mono text-on-surface-variant mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-white">
                <Sparkles className="w-3 h-3 text-primary" /> PILIH KREDENSIAL DEMO:
              </span>
              <span className="text-[9px] text-on-surface-variant">Klik untuk isi otomatis</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((acc) => {
                const Icon = acc.icon;
                const isSelected = email.toLowerCase() === acc.email.toLowerCase();
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleFillDemo(acc.email)}
                    className={`p-2 rounded-xl border text-xs font-mono flex flex-col items-center gap-1 transition-all ${acc.badgeColor} ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`}
                    title={`Isi otomatis ${acc.name} (${acc.role})`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-[11px]">{acc.role}</span>
                    <span className="text-[9px] text-on-surface-variant truncate max-w-[80px]">{acc.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">EMAIL AKUN</label>
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
                <span className="text-xs text-on-surface-variant/70">Demo: demo123456</span>
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
              {isLoading ? 'Memverifikasi Hak Izin...' : 'Masuk ke Akun'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* GitHub OAuth Demo */}
          <div className="mt-6 pt-5 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={() => {
                handleFillDemo('budi.dev@gmail.com');
                loginUser('budi.dev@gmail.com');
                router.push('/talent/dashboard');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#24292e] hover:bg-[#1b1f23] text-white font-medium text-xs border border-outline-variant flex items-center justify-center gap-2.5 transition-colors active:scale-95"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Masuk dengan GitHub (Talent)</span>
            </button>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6 pt-5 border-t border-outline-variant/30 text-xs text-on-surface-variant">
            Belum punya akun?{' '}
            <Link href="/register" className="text-primary hover:underline font-bold">
              Daftar akun baru di sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xs font-mono text-on-surface-variant">Memuat halaman autentikasi...</div>
      </div>
    }>
      <LoginFormContent />
    </Suspense>
  );
}
