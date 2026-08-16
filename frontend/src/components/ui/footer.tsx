'use client';

import React from 'react';
import Link from 'next/link';
import { Code2, ShieldCheck, Globe, Heart } from 'lucide-react';
import { Github } from '@/components/ui/icons';

export function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full py-14 px-6 border-t border-outline-variant/40 font-body text-xs text-on-surface-variant">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
        
        {/* Col 1: Brand & Bio */}
        <div className="col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <span className="text-lg font-headline font-black text-white">
              Skill<span className="text-primary">Bounty</span>
            </span>
          </div>
          <p className="text-on-surface-variant/90 max-w-sm leading-relaxed text-xs">
            Platform micro-bounty berbasis <em>proof-of-work</em> (live demo &amp; repository terverifikasi) untuk talenta muda dan UMKM dengan sistem Escrow otomatis.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Automated Micro-Escrow Protection Active
          </div>
        </div>

        {/* Col 2: For Talent */}
        <div className="space-y-3">
          <h4 className="font-headline font-bold text-white text-sm">Untuk Talent</h4>
          <ul className="space-y-2">
            <li><Link href="/bounties" className="hover:text-primary transition-colors">Jelajahi Tugas</Link></li>
            <li><Link href="/talent/dashboard" className="hover:text-primary transition-colors">Dashboard Talent</Link></li>
            <li><Link href="/talent/portfolio" className="hover:text-primary transition-colors">Portofolio Interaktif</Link></li>
            <li><Link href="/talent/wallet" className="hover:text-primary transition-colors">Pencairan Dana</Link></li>
          </ul>
        </div>

        {/* Col 3: For Client */}
        <div className="space-y-3">
          <h4 className="font-headline font-bold text-white text-sm">Untuk Klien</h4>
          <ul className="space-y-2">
            <li><Link href="/client/bounties/create" className="hover:text-primary transition-colors">Posting Bounty Baru</Link></li>
            <li><Link href="/client/dashboard" className="hover:text-primary transition-colors">Monitoring Tugas</Link></li>
            <li><Link href="/bounties" className="hover:text-primary transition-colors">Cari Referensi</Link></li>
            <li><span className="text-on-surface-variant/60 cursor-not-allowed">Talent Matcher AI (Soon)</span></li>
          </ul>
        </div>

        {/* Col 4: Platform & Legal */}
        <div className="space-y-3">
          <h4 className="font-headline font-bold text-white text-sm">Transparansi</h4>
          <ul className="space-y-2">
            <li><Link href="/admin/dashboard" className="hover:text-primary transition-colors">Pusat Moderasi Dispute</Link></li>
            <li><Link href="/states-demo" className="hover:text-primary transition-colors">Design State Kit</Link></li>
            <li><span className="text-on-surface-variant/70">Aturan Escrow 10% Fee</span></li>
            <li><span className="text-on-surface-variant/70">Kebijakan Privasi</span></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono">
        <div>© 2026 SkillBounty. Built for the Proof-of-Work Generation.</div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span>Target: Gen Z &amp; Alpha Creators</span>
          <span>•</span>
          <span>Next.js + Tailwind + shadcn/ui</span>
        </div>
      </div>
    </footer>
  );
}
