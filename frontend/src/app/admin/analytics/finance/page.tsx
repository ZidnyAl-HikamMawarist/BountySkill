'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';

export default function FinanceAnalyticsPage() {
  const { bounties, withdrawals } = useAppStore();

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  // Mock data calculations based on global store
  const totalEscrow = bounties.reduce((acc, b) => acc + (b.escrow?.amount || b.budget), 0);
  const totalFees = Math.round(totalEscrow * 0.1); // 10% platform fee
  
  const completedWithdrawals = withdrawals.filter(w => w.status === 'SELESAI').reduce((acc, w) => acc + w.amount, 0);

  // Mock time-series data
  const revenueData = [
    { name: 'Jan', escrow: 12000000, fee: 1200000 },
    { name: 'Feb', escrow: 19000000, fee: 1900000 },
    { name: 'Mar', escrow: 15000000, fee: 1500000 },
    { name: 'Apr', escrow: 22000000, fee: 2200000 },
    { name: 'Mei', escrow: 30000000, fee: 3000000 },
    { name: 'Jun', escrow: totalEscrow, fee: totalFees },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl text-white">Analitik Keuangan</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Pantau volume escrow, pendapatan platform (fee), dan pencairan dana.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TOTAL ESCROW</div>
          </div>
          <div className="text-3xl font-headline font-black text-white">{formatIDR(totalEscrow)}</div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">PENDAPATAN FEE (10%)</div>
          </div>
          <div className="text-3xl font-headline font-black text-primary">{formatIDR(totalFees)}</div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-500/10 rounded-xl">
              <Wallet className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TOTAL PAYOUT BERHASIL</div>
          </div>
          <div className="text-3xl font-headline font-black text-amber-400">{formatIDR(completedWithdrawals)}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Revenue Over Time */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Tren Pertumbuhan Volume Escrow</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }}
                  formatter={(value: any) => formatIDR(Number(value))}
                />
                <Legend />
                <Bar dataKey="escrow" name="Volume Escrow" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Platform Fee Growth */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Tren Pendapatan Platform</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }}
                  formatter={(value: any) => formatIDR(Number(value))}
                />
                <Legend />
                <Line type="monotone" dataKey="fee" name="Platform Fee" stroke="#6366F1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
