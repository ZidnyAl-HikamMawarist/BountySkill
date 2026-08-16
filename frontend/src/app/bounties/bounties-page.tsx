'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { formatIDR } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Lock, 
  Timer, 
  Code2,
  Layers,
  ArrowUpDown,
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';
import { EmptyState } from '@/components/ui/state-kit';

export default function BountyMarketplacePage() {
  const { bounties } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [maxBudget, setMaxBudget] = useState<number>(5000000);
  const [sortBy, setSortBy] = useState<'NEWEST' | 'BUDGET_HIGH' | 'BUDGET_LOW'>('NEWEST');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Categories list
  const categories = [
    'ALL',
    'Frontend Slicing',
    'Backend Integration',
    'Bug Fixing',
    'Fullstack Mini',
    'UI/UX Polish'
  ];

  // Filtering Logic
  const filteredBounties = bounties
    .filter(bounty => {
      const matchesSearch = 
        bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bounty.techTags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'ALL' || bounty.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || bounty.status === selectedStatus;
      const matchesBudget = bounty.budget <= maxBudget;

      return matchesSearch && matchesCategory && matchesStatus && matchesBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'BUDGET_HIGH') return b.budget - a.budget;
      if (sortBy === 'BUDGET_LOW') return a.budget - b.budget;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate Pagination
  const totalItems = filteredBounties.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBounties = filteredBounties.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      
      {/* Header Title Section */}
      <div className="mb-8 border-b border-outline-variant/30 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5" /> REKBER ESCROW 100% DIKUNCI
            </div>
            <h1 className="font-headline font-black text-3xl sm:text-4xl text-white">
              Marketplace Micro-Bounty
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Ambil tugas pengerjaan cepat bergaransi rekber. Kirim proof-of-work, dana cair seketika.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/client/bounties/create"
              className="px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 whitespace-nowrap"
            >
              + Buat Bounty Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="github-card rounded-2xl p-4 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="w-4 h-4 text-on-surface-variant absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari bounty, tugas, tech stack (Next.js, Tailwind, API)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-white text-sm focus:border-primary outline-none transition-colors"
            />
          </div>

          {/* Category Dropdown (Mobile / Compact) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'Semua Kategori' : c}</option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ArrowUpDown className="w-4 h-4 text-on-surface-variant" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-surface-container border border-outline-variant rounded-xl px-3 py-2.5 text-xs text-white focus:border-primary outline-none cursor-pointer"
            >
              <option value="NEWEST">Terbaru</option>
              <option value="BUDGET_HIGH">Budget Tertinggi</option>
              <option value="BUDGET_LOW">Budget Terendah</option>
            </select>
          </div>

        </div>

        {/* Categories Pills & Budget Slider */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pt-2 border-t border-outline-variant/30 text-xs font-mono">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-on-surface-variant mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Kategori:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-lg border transition-all ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground font-bold border-primary'
                    : 'bg-surface-container border-outline-variant/50 text-on-surface-variant hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant">Maks Budget: <strong className="text-emerald-400">{formatIDR(maxBudget)}</strong></span>
            <input
              type="range"
              min={300000}
              max={5000000}
              step={100000}
              value={maxBudget}
              onChange={(e) => {
                setMaxBudget(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="accent-primary cursor-pointer w-28"
            />
          </div>
        </div>
      </div>

      {/* Bounty Cards Grid */}
      {paginatedBounties.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBounties.map(bounty => (
              <div key={bounty.id} className="github-card rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded">
                      {bounty.category}
                    </span>
                    <span className="text-base font-mono font-bold text-emerald-400">
                      {formatIDR(bounty.budget)}
                    </span>
                  </div>

                  <Link href={`/bounties/${bounty.id}`} className="block">
                    <h3 className="font-headline font-bold text-lg text-white group-hover:text-primary transition-colors mb-2 line-clamp-2">
                      {bounty.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-on-surface-variant line-clamp-3 mb-4 leading-relaxed font-light">
                    {bounty.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {bounty.techTags.map(tag => (
                      <span key={tag} className="tech-tag text-[10px]">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-outline-variant/30">
                  <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-amber-400" />
                      <span>Est: {bounty.daysEstimate} Hari</span>
                    </div>
                    <span>{bounty.applicantsCount} Pendaftar</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="status-badge status-warning text-[10px]">
                      <Lock className="w-2.5 h-2.5" /> ESCROW_HOLD
                    </div>
                    <Link
                      href={`/bounties/${bounty.id}`}
                      className="text-xs font-bold text-primary group-hover:text-primary-fixed inline-flex items-center gap-1 hover:underline"
                    >
                      Lihat Detail <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clean Pagination Bar */}
          {totalPages > 1 && (
            <div className="github-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-on-surface-variant font-mono">
                Menampilkan <strong className="text-white">{startIndex + 1}</strong> – <strong className="text-white">{endIndex}</strong> dari <strong className="text-white">{totalItems}</strong> bounty
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman Sebelumnya"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-surface-container border border-outline-variant text-on-surface-variant hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Halaman Selanjutnya"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="Tidak Ada Bounty Yang Cocok"
          description="Coba ubah kata kunci pencarian, tingkatkan rentang budget, atau ganti pilihan kategori."
          actionText="Reset Semua Filter"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('ALL');
            setSelectedStatus('ALL');
            setMaxBudget(5000000);
            setCurrentPage(1);
          }}
        />
      )}

    </div>
  );
}
