'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Role } from '@/types';
import { Code2, Briefcase, ArrowRight, CheckCircle2, ShieldCheck, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { Github } from '@/components/ui/icons';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAppStore();

  const [role, setRole] = useState<Role>('TALENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Simple password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: 'Kosong', width: '0%', color: 'bg-outline-variant' };
    if (password.length < 6) return { label: 'Lemah', width: '33%', color: 'bg-red-400' };
    if (password.length < 10) return { label: 'Sedang', width: '66%', color: 'bg-amber-400' };
    return { label: 'Kuat & Aman', width: '100%', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Alamat email valid wajib diisi.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Kata sandi minimal harus 6 karakter.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      registerUser(name, email, role);
      setIsLoading(false);
      if (role === 'TALENT') {
        router.push('/talent/dashboard');
      } else {
        router.push('/client/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen py-16 px-4 flex items-center justify-center relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background pointer-events-none"></div>

      <div className="max-w-xl w-full relative z-10">
        
        {/* Card Container */}
        <div className="github-card rounded-3xl p-8 sm:p-10 border-outline-variant/60 shadow-2xl">
          
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono text-primary uppercase tracking-wider bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              Pendaftaran Akun Baru
            </span>
            <h1 className="font-headline font-black text-3xl text-white mt-3 mb-2">
              Bergabung di SkillBounty
            </h1>
            <p className="text-on-surface-variant text-xs sm:text-sm">
              Validasi keahlian lewat demo kode langsung &amp; transaksi aman bergaransi escrow.
            </p>
          </div>

          {/* 1. Role Selector Tabs */}
          <div className="mb-8">
            <label className="block text-xs font-mono text-on-surface-variant mb-2.5">
              PILIH PERAN ANDA:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('TALENT')}
                className={`p-4 rounded-xl border flex flex-col items-start text-left transition-all ${
                  role === 'TALENT'
                    ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 text-white'
                    : 'bg-surface-container border-outline-variant/60 text-on-surface-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Code2 className="w-4 h-4" />
                  </div>
                  {role === 'TALENT' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <div className="font-headline font-bold text-sm text-white">Talent / Developer</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Cari tugas mikro &amp; bangun portofolio</div>
              </button>

              <button
                type="button"
                onClick={() => setRole('CLIENT')}
                className={`p-4 rounded-xl border flex flex-col items-start text-left transition-all ${
                  role === 'CLIENT'
                    ? 'bg-primary/10 border-primary shadow-md shadow-primary/10 text-white'
                    : 'bg-surface-container border-outline-variant/60 text-on-surface-variant hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  {role === 'CLIENT' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
                <div className="font-headline font-bold text-sm text-white">Klien / UMKM</div>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Posting bounty tugas &amp; delegasi teknis</div>
              </button>
            </div>
          </div>

          {/* 2. GitHub OAuth Button (Highlighted for Talent) */}
          <div className="mb-6">
            <button
              type="button"
              onClick={() => {
                registerUser(role === 'TALENT' ? 'Budi Pratama (GitHub)' : 'Klien Digital (GitHub)', 'github.user@skillbounty.dev', role);
                router.push(role === 'TALENT' ? '/talent/dashboard' : '/client/dashboard');
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#24292e] hover:bg-[#1b1f23] text-white font-medium text-xs sm:text-sm border border-outline-variant flex items-center justify-center gap-2.5 transition-colors active:scale-95"
            >
              <Github className="w-4 h-4 text-white" />
              <span>Daftar Cepat dengan GitHub {role === 'TALENT' && '(Rekomendasi Talent)'}</span>
            </button>
          </div>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-outline-variant/40"></div>
            <span className="px-3 text-[11px] font-mono text-on-surface-variant">ATAU EMAIL MANUAL</span>
            <div className="flex-grow border-t border-outline-variant/40"></div>
          </div>

          {/* 3. Form Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">NAMA LENGKAP</label>
              <div className="relative">
                <User className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Contoh: Budi Pratama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">ALAMAT EMAIL</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-on-surface-variant mb-1.5">KATA SANDI</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-3" />
                <input
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-xl text-sm text-white placeholder-on-surface-variant/50 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              
              {/* Password strength meter */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${strength.color} transition-all duration-300`} style={{ width: strength.width }}></div>
                  </div>
                  <div className="text-[10px] font-mono text-right text-on-surface-variant">
                    Kekuatan Sandi: <strong className="text-white">{strength.label}</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="rounded bg-surface-container border-outline-variant text-primary focus:ring-0"
              />
              <label htmlFor="terms" className="text-xs text-on-surface-variant cursor-pointer">
                Saya menyetujui Ketentuan Layanan dan Kebijakan Escrow Otomatis.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-50 mt-4"
            >
              {isLoading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-8 pt-6 border-t border-outline-variant/30 text-xs text-on-surface-variant">
            Sudah memiliki akun SkillBounty?{' '}
            <Link href="/login" className="text-primary hover:underline font-bold">
              Masuk di sini
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
