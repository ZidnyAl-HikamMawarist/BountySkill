'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { 
  ShieldCheck, 
  Wallet, 
  UserCheck, 
  LogOut, 
  Menu, 
  X, 
  ChevronDown, 
  Code2, 
  Briefcase, 
  FolderGit2, 
  PlusCircle,
  Gavel
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, switchUserRole, logoutUser } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <nav className="bg-surface/90 backdrop-blur-md font-body fixed top-0 w-full z-50 border-b border-outline-variant/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-headline font-black tracking-tight text-white group-hover:text-primary transition-colors">
                  Skill<span className="text-primary">Bounty</span>
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant -mt-1 tracking-wider uppercase">
                  Proof-of-Work Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/bounties" 
              className={`transition-colors hover:text-primary ${pathname.startsWith('/bounties') && !pathname.includes('/submit') ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
            >
              Marketplace Bounty
            </Link>

            {currentUser?.role === 'TALENT' && (
              <>
                <Link 
                  href="/talent/dashboard" 
                  className={`transition-colors hover:text-primary ${pathname === '/talent/dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Dashboard Talent
                </Link>
                <Link 
                  href="/talent/portfolio" 
                  className={`transition-colors hover:text-primary ${pathname === '/talent/portfolio' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Kelola Portofolio
                </Link>
                <Link 
                  href="/talent/wallet" 
                  className={`transition-colors hover:text-primary ${pathname === '/talent/wallet' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Dompet
                </Link>
              </>
            )}

            {currentUser?.role === 'CLIENT' && (
              <>
                <Link 
                  href="/client/dashboard" 
                  className={`transition-colors hover:text-primary ${pathname === '/client/dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Dashboard Klien
                </Link>
                <Link 
                  href="/client/bounties/create" 
                  className={`transition-colors hover:text-primary ${pathname === '/client/bounties/create' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  + Buat Bounty
                </Link>
              </>
            )}

            {currentUser?.role === 'ADMIN' && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  className={`transition-colors hover:text-primary ${pathname === '/admin/dashboard' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Admin Hub
                </Link>
                <Link 
                  href="/admin/withdrawals" 
                  className={`transition-colors hover:text-primary ${pathname === '/admin/withdrawals' ? 'text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  Verifikasi Payout
                </Link>
              </>
            )}
          </div>

          {/* Right Action Bar / Profile / Role Switcher */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Switch Role Quick Tester Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/60 text-xs font-mono text-on-surface-variant hover:border-primary transition-all active:scale-95"
                title="Beralih Role Akun untuk Pengujian"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Role: <strong className="text-white">{currentUser ? currentUser.role : 'GUEST'}</strong></span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-high border border-outline-variant rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[11px] font-mono text-on-surface-variant border-b border-outline-variant/40 mb-1">
                    GANTI PERAN (TESTING SIMULATOR)
                  </div>
                  <button
                    onClick={() => { switchUserRole('TALENT'); setRoleMenuOpen(false); router.push('/talent/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-variant flex items-center justify-between text-white"
                  >
                    <span className="flex items-center gap-2"><Code2 className="w-4 h-4 text-emerald-400" /> Talent (Budi Pratama)</span>
                    {currentUser?.role === 'TALENT' && <span className="text-primary font-mono text-[10px]">AKTIF</span>}
                  </button>
                  <button
                    onClick={() => { switchUserRole('CLIENT'); setRoleMenuOpen(false); router.push('/client/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-variant flex items-center justify-between text-white"
                  >
                    <span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400" /> Client (Kopi Nusantara)</span>
                    {currentUser?.role === 'CLIENT' && <span className="text-primary font-mono text-[10px]">AKTIF</span>}
                  </button>
                  <button
                    onClick={() => { switchUserRole('ADMIN'); setRoleMenuOpen(false); router.push('/admin/dashboard'); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-variant flex items-center justify-between text-white"
                  >
                    <span className="flex items-center gap-2"><Gavel className="w-4 h-4 text-amber-400" /> Admin (Dispute Moderator)</span>
                    {currentUser?.role === 'ADMIN' && <span className="text-primary font-mono text-[10px]">AKTIF</span>}
                  </button>
                  <div className="border-t border-outline-variant/40 my-1"></div>
                  <button
                    onClick={() => { switchUserRole('GUEST'); setRoleMenuOpen(false); router.push('/'); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-surface-variant text-on-surface-variant flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Mode Tamu / Logout
                  </button>
                </div>
              )}
            </div>

            {/* Auth / Balance */}
            {currentUser ? (
              <div className="flex items-center gap-3">
                {currentUser.role === 'TALENT' && (
                  <Link 
                    href="/talent/wallet" 
                    className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 transition-colors"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{formatIDR(currentUser.balance)}</span>
                  </Link>
                )}

                <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/40">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/40 bg-surface-container">
                    <img 
                      src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">{currentUser.name}</span>
                    <span className="text-[10px] font-mono text-primary leading-tight">{currentUser.role}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-on-surface-variant hover:text-white font-medium text-sm transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-lg hover:bg-primary-fixed transition-all text-sm active:scale-95 shadow-md shadow-primary/20"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-b border-outline-variant p-4 space-y-4">
          <div className="flex flex-col space-y-3 font-medium text-sm">
            <Link 
              href="/bounties" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-surface-variant text-white"
            >
              Marketplace Bounty
            </Link>

            {currentUser?.role === 'TALENT' && (
              <>
                <Link 
                  href="/talent/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-white"
                >
                  Dashboard Talent
                </Link>
                <Link 
                  href="/talent/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-white"
                >
                  Kelola Portofolio
                </Link>
                <Link 
                  href="/talent/wallet" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-emerald-400"
                >
                  Dompet ({formatIDR(currentUser.balance)})
                </Link>
              </>
            )}

            {currentUser?.role === 'CLIENT' && (
              <>
                <Link 
                  href="/client/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-white"
                >
                  Dashboard Klien
                </Link>
                <Link 
                  href="/client/bounties/create" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-primary"
                >
                  + Buat Bounty Baru
                </Link>
              </>
            )}

            {currentUser?.role === 'ADMIN' && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-white"
                >
                  Admin Hub
                </Link>
                <Link 
                  href="/admin/withdrawals" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-surface-variant text-amber-400"
                >
                  Verifikasi Penarikan Dana
                </Link>
              </>
            )}
          </div>

          <div className="pt-3 border-t border-outline-variant/40 flex flex-col gap-2">
            <div className="text-[11px] font-mono text-on-surface-variant">Role Testing Simulator:</div>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => { switchUserRole('TALENT'); setMobileMenuOpen(false); router.push('/talent/dashboard'); }}
                className={`py-1.5 text-xs rounded border text-center ${currentUser?.role === 'TALENT' ? 'bg-primary text-black font-bold' : 'bg-surface-variant text-white'}`}
              >
                Talent
              </button>
              <button 
                onClick={() => { switchUserRole('CLIENT'); setMobileMenuOpen(false); router.push('/client/dashboard'); }}
                className={`py-1.5 text-xs rounded border ${currentUser?.role === 'CLIENT' ? 'bg-primary text-black font-bold' : 'bg-surface-variant text-white'}`}
              >
                Client
              </button>
              <button 
                onClick={() => { switchUserRole('ADMIN'); setMobileMenuOpen(false); router.push('/admin/dashboard'); }}
                className={`py-1.5 text-xs rounded border ${currentUser?.role === 'ADMIN' ? 'bg-primary text-black font-bold' : 'bg-surface-variant text-white'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
