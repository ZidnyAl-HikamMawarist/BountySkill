'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Briefcase, 
  ShieldAlert, 
  Wallet,
  Settings
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

export function AdminSidebar() {
  const pathname = usePathname();
  const { disputes, withdrawals } = useAppStore();

  const pendingDisputes = disputes.filter(d => d.status === 'PENDING_REVIEW' || d.status === 'INVESTIGATING').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'PENDING').length;

  type NavItem = { name: string, href: string, icon: any, badge?: number };
  type NavSection = { title: string, items: NavItem[] };

  const navItems: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { name: 'Keuangan & Fee', href: '/admin/analytics/finance', icon: BarChart3 },
        { name: 'Statistik Pengguna', href: '/admin/analytics/users', icon: Users },
        { name: 'Analisis Bounty', href: '/admin/analytics/bounties', icon: Briefcase },
      ]
    },
    {
      title: 'Moderation',
      items: [
        { 
          name: 'Sengketa (Disputes)', 
          href: '/admin/disputes', 
          icon: ShieldAlert,
          badge: pendingDisputes > 0 ? pendingDisputes : undefined
        },
        { 
          name: 'Pencairan Dana', 
          href: '/admin/withdrawals', 
          icon: Wallet,
          badge: pendingWithdrawals > 0 ? pendingWithdrawals : undefined
        },
      ]
    }
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-surface-container border-r border-outline-variant/30 hidden md:flex flex-col h-[calc(100vh-64px)] sticky top-16">
      <div className="p-6 overflow-y-auto flex-1">
        {navItems.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-3">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all group ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-on-surface hover:bg-surface-variant hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-white'}`} />
                      {item.name}
                    </div>
                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-primary text-primary-foreground' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-outline-variant/30">
        <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-on-surface-variant hover:bg-surface-variant hover:text-white transition-all group">
          <Settings className="w-4 h-4 group-hover:text-white" />
          Pengaturan Sistem
        </button>
      </div>
    </aside>
  );
}
