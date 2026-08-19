'use client';

import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';

export default function UsersAnalyticsPage() {
  
  // Mock data for user distribution
  const userDistribution = [
    { name: 'Talent (Pekerja)', value: 1250 },
    { name: 'Client (Pemberi Kerja)', value: 450 },
  ];
  
  const COLORS = ['#6366F1', '#F59E0B'];

  // Mock data for user growth
  const growthData = [
    { name: 'Jan', talent: 400, client: 150 },
    { name: 'Feb', talent: 600, client: 210 },
    { name: 'Mar', talent: 850, client: 280 },
    { name: 'Apr', talent: 1000, client: 350 },
    { name: 'Mei', talent: 1150, client: 400 },
    { name: 'Jun', talent: 1250, client: 450 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-headline font-black text-3xl text-white">Statistik Pengguna</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Pantau pertumbuhan, demografi, dan aktivitas pengguna platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TOTAL PENGGUNA AKTIF</div>
          </div>
          <div className="text-3xl font-headline font-black text-white">1,700</div>
          <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
            <TrendingUpIcon /> +12% dari bulan lalu
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <UserPlus className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">PENGGUNA BARU (BULAN INI)</div>
          </div>
          <div className="text-3xl font-headline font-black text-emerald-400">150</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">
            100 Talent, 50 Client
          </div>
        </div>

        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-sm font-mono text-on-surface-variant">TINGKAT VERIFIKASI KYC</div>
          </div>
          <div className="text-3xl font-headline font-black text-blue-400">85%</div>
          <div className="text-xs text-on-surface-variant mt-2 font-mono">
            Akun terverifikasi identitas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Demographics Pie */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Distribusi Peran Pengguna</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent = 0 }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {userDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }} 
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: User Growth Area Chart */}
        <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
          <h3 className="font-headline font-bold text-lg text-white mb-6">Tren Pertumbuhan Pengguna Baru</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTalent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorClient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff60" fontSize={12} />
                <YAxis stroke="#ffffff60" fontSize={12} />
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" />
                <Tooltip contentStyle={{ backgroundColor: '#1E1E2E', borderColor: '#ffffff20', borderRadius: '12px' }} />
                <Legend />
                <Area type="monotone" dataKey="talent" name="Talent (Pekerja)" stroke="#6366F1" fillOpacity={1} fill="url(#colorTalent)" />
                <Area type="monotone" dataKey="client" name="Client (Pemberi Kerja)" stroke="#F59E0B" fillOpacity={1} fill="url(#colorClient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}
