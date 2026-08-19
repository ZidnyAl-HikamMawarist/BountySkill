'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ComposedChart, Line
} from 'recharts';
import { Briefcase, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function BountiesAnalyticsPage() {
  const { bounties, disputes } = useAppStore();

  const totalBounties = bounties.length;
  const completedBounties = bounties.filter(b => b.status === 'COMPLETED').length;
  const completionRate = totalBounties > 0 ? Math.round((completedBounties / totalBounties) * 100) : 0;
  
  const disputeRate = totalBounties > 0 ? ((disputes.length / totalBounties) * 100).toFixed(1) : 0;

  // Mock data for categories
  const categoryData = [
    { name: 'Frontend Web', count: 45 },
    { name: 'Backend API', count: 32 },
    { name: 'Mobile App', count: 28 },
    { name: 'UI/UX Design', count: 20 },
    { name: 'Data Sci/AI', count: 12 },
  ];

  // Mock data for success vs dispute trend
  const trendData = [
    { name: 'Jan', completed: 10, dispute: 1 },
    { name: 'Feb', completed: 15, dispute: 2 },
    { name: 'Mar', completed: 20, dispute: 1 },
    { name: 'Apr', completed: 35, dispute: 3 },
    { name: 'Mei', completed: 42, dispute: 2 },
    { name: 'Jun', completed: completedBounties, dispute: disputes.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl text-white">Analisis Pekerjaan (Bounties)</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Pantau tren pekerjaan, kategori terpopuler, dan tingkat keberhasilan penyelesaian.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TOTAL BOUNTY (ALL TIME)</div>
          </div>
          <div className="text-3xl font-headline font-black text-white">{totalBounties}</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">
            Proyek diunggah ke platform
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TINGKAT PENYELESAIAN (SUCCESS RATE)</div>
          </div>
          <div className="text-3xl font-headline font-black text-emerald-400">{completionRate}%</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">
            {completedBounties} proyek selesai tanpa masalah
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-red-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TINGKAT SENGKETA (DISPUTE RATE)</div>
          </div>
          <div className="text-3xl font-headline font-black text-red-400">{disputeRate}%</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">
            {disputes.length} kasus ditangani admin
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Categories Bar Chart */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Kategori Pekerjaan Terpopuler</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" horizontal={false} />
                <XAxis type="number" stroke="#ffffff60" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#ffffff60" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }}
                  cursor={{ fill: '#ffffff10' }}
                />
                <Bar dataKey="count" name="Jumlah Bounty" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Success vs Dispute Trend */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Tren Penyelesaian vs Sengketa</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Legend />
                <Bar dataKey="completed" name="Bounty Selesai" fill="#10B981" barSize={20} radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="dispute" name="Sengketa Terjadi" stroke="#EF4444" strokeWidth={3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
