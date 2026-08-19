'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Gavel,
  User,
  LayoutDashboard,
  Coins,
  ShieldAlert
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logoutUser, isAuthInitialized } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleLogout = () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    logoutUser();
    router.push('/login');
  };

  const getRoleBadgeStyle = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'CLIENT':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'TALENT':
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
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

          {/* Desktop Nav Links (Role-Aware) */}
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

          {/* Right Action Bar / Authenticated Profile */}
          <div className="hidden md:flex items-center gap-4">
            
            {isAuthInitialized && currentUser ? (
              <div className="flex items-center gap-3">
                {/* Wallet Balance Pill for Talent & Client */}
                {currentUser.role === 'TALENT' && (
                  <Link 
                    href="/talent/wallet" 
                    className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-xs font-mono text-emerald-400 transition-colors"
                    title="Saldo Dompet Talent"
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>{formatIDR(currentUser.balance)}</span>
                  </Link>
                )}

                {currentUser.role === 'CLIENT' && (
                  <Link 
                    href="/client/dashboard" 
                    className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container border border-outline-variant/50 px-3 py-1.5 rounded-lg text-xs font-mono text-blue-400 transition-colors"
                    title="Deposit Escrow Klien"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>{formatIDR(currentUser.balance)}</span>
                  </Link>
                )}

                {/* User Profile Dropdown Menu */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-surface-container border border-outline-variant/60 hover:border-primary/60 transition-all text-left group active:scale-95"
                    aria-label="Menu Pengguna"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-primary/40 bg-surface-container-high flex-shrink-0">
                      <img 
                        src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                        alt={currentUser.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white leading-tight max-w-[130px] truncate group-hover:text-primary transition-colors">
                        {currentUser.name}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border w-fit mt-0.5 ${getRoleBadgeStyle(currentUser.role)}`}>
                        {currentUser.role}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-on-surface-variant transition-transform ${profileMenuOpen ? 'rotate-180 text-primary' : ''}`} />
                  </button>

                  {/* Profile Dropdown Content */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-surface-container-high border border-outline-variant rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 font-body">
                      
                      {/* Account Identity Header */}
                      <div className="px-4 py-2.5 border-b border-outline-variant/40">
                        <div className="text-xs font-bold text-white truncate">{currentUser.name}</div>
                        <div className="text-[11px] font-mono text-on-surface-variant truncate">{currentUser.email}</div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(currentUser.role)}`}>
                            Peran: {currentUser.role}
                          </span>
                          {currentUser.role === 'TALENT' && (
                            <span className="text-[10px] font-mono text-amber-400">
                              ★ {currentUser.reputationScore || 5.0}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Role Specific Actions */}
                      <div className="py-1">
                        {currentUser.role === 'TALENT' && (
                          <>
                            <Link
                              href="/talent/dashboard"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                              <span>Dashboard Talent</span>
                            </Link>
                            <Link
                              href="/talent/portfolio"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <FolderGit2 className="w-4 h-4 text-indigo-400" />
                              <span>Portofolio Saya</span>
                            </Link>
                            <Link
                              href="/talent/wallet"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Wallet className="w-4 h-4 text-amber-400" />
                              <span>Dompet &amp; Pencairan Dana</span>
                            </Link>
                          </>
                        )}

                        {currentUser.role === 'CLIENT' && (
                          <>
                            <Link
                              href="/client/dashboard"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              <span>Dashboard Klien</span>
                            </Link>
                            <Link
                              href="/client/bounties/create"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <PlusCircle className="w-4 h-4 text-primary" />
                              <span>Buat Bounty Baru</span>
                            </Link>
                          </>
                        )}

                        {currentUser.role === 'ADMIN' && (
                          <>
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <Gavel className="w-4 h-4 text-amber-400" />
                              <span>Pusat Moderasi (Admin Hub)</span>
                            </Link>
                            <Link
                              href="/admin/withdrawals"
                              onClick={() => setProfileMenuOpen(false)}
                              className="w-full px-4 py-2 text-xs text-on-surface hover:bg-surface-variant hover:text-white flex items-center gap-2.5 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-emerald-400" />
                              <span>Verifikasi Penarikan Dana</span>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Logout Option */}
                      <div className="border-t border-outline-variant/40 pt-1 mt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2.5 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Keluar dari Akun</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              </div>
            ) : isAuthInitialized ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-on-surface-variant hover:text-white font-medium text-sm transition-colors px-3 py-1.5"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-primary-foreground font-bold px-4 py-2 rounded-xl hover:bg-primary-fixed transition-all text-sm active:scale-95 shadow-md shadow-primary/20"
                >
                  Daftar
                </Link>
              </div>
            ) : null}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-surface-container text-on-surface-variant hover:text-white"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low border-b border-outline-variant p-4 space-y-4 font-body animate-in slide-in-from-top-2">
          
          {/* User Status in Mobile */}
          {currentUser ? (
            <div className="p-3.5 rounded-2xl bg-surface-container border border-outline-variant/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-primary/40 bg-surface-container-high">
                  <img 
                    src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} 
                    alt={currentUser.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-bold text-white leading-tight">{currentUser.name}</div>
                  <div className="text-[11px] font-mono text-on-surface-variant truncate max-w-[170px]">{currentUser.email}</div>
                  <span className={`inline-block text-[9px] font-mono px-2 py-0.5 rounded border mt-1 ${getRoleBadgeStyle(currentUser.role)}`}>
                    Peran: {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Link 
                href="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center bg-surface-container text-white font-medium rounded-xl text-xs border border-outline-variant/50"
              >
                Masuk
              </Link>
              <Link 
                href="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center bg-primary text-primary-foreground font-bold rounded-xl text-xs shadow-md shadow-primary/20"
              >
                Daftar
              </Link>
            </div>
          )}

          {/* Nav Links */}
          <div className="flex flex-col space-y-1.5 font-medium text-sm pt-2">
            <Link 
              href="/bounties" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-white flex items-center gap-2.5"
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span>Marketplace Bounty</span>
            </Link>

            {currentUser?.role === 'TALENT' && (
              <>
                <Link 
                  href="/talent/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-white flex items-center gap-2.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                  <span>Dashboard Talent</span>
                </Link>
                <Link 
                  href="/talent/portfolio" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-white flex items-center gap-2.5"
                >
                  <FolderGit2 className="w-4 h-4 text-indigo-400" />
                  <span>Kelola Portofolio</span>
                </Link>
                <Link 
                  href="/talent/wallet" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-emerald-400 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2.5">
                    <Wallet className="w-4 h-4" />
                    <span>Dompet Talent</span>
                  </span>
                  <span className="font-mono text-xs font-bold">{formatIDR(currentUser.balance)}</span>
                </Link>
              </>
            )}

            {currentUser?.role === 'CLIENT' && (
              <>
                <Link 
                  href="/client/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-white flex items-center gap-2.5"
                >
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Dashboard Klien</span>
                </Link>
                <Link 
                  href="/client/bounties/create" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-primary flex items-center gap-2.5 font-bold"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Buat Bounty Baru</span>
                </Link>
              </>
            )}

            {currentUser?.role === 'ADMIN' && (
              <>
                <Link 
                  href="/admin/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-white flex items-center gap-2.5"
                >
                  <Gavel className="w-4 h-4 text-amber-400" />
                  <span>Admin Hub</span>
                </Link>
                <Link 
                  href="/admin/withdrawals" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl hover:bg-surface-variant text-amber-400 flex items-center gap-2.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verifikasi Penarikan Dana</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Logout Button */}
          {currentUser && (
            <div className="pt-3 border-t border-outline-variant/40">
              <button 
                onClick={handleLogout}
                className="w-full py-2.5 px-3 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          )}

        </div>
      )}
    </nav>
  );
}
