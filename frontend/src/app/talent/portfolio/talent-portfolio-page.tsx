'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/lib/store';
import { RoleGuard } from '@/components/auth/role-guard';
import { PortfolioItem } from '@/types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Activity, 
  Layers, 
  ArrowLeft, 
  Check, 
  X, 
  Eye,
  Sparkles,
  MoreVertical,
  Code2
} from 'lucide-react';
import { Github } from '@/components/ui/icons';
import { EmptyState } from '@/components/ui/state-kit';

export default function TalentPortfolioManagePage() {
  return (
    <RoleGuard allowedRoles={['TALENT']} pageTitle="Kelola Portofolio Talent">
      <TalentPortfolioContent />
    </RoleGuard>
  );
}

function TalentPortfolioContent() {
  const { portfolios, addPortfolio, updatePortfolio, deletePortfolio, currentUser } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [techTagInput, setTechTagInput] = useState('');
  const [techTags, setTechTags] = useState<string[]>(['React', 'Tailwind CSS']);

  const myPortfolios = portfolios.filter(p => p.userId === (currentUser?.id || 'user-talent-1'));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdownId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setDemoUrl('https://nextjs.org');
    setRepoUrl('https://github.com/example/repo');
    setTechTags(['Next.js', 'Tailwind CSS', 'TypeScript']);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: PortfolioItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setDemoUrl(item.demoUrl);
    setRepoUrl(item.repoUrl || '');
    setTechTags(item.techTags);
    setIsModalOpen(true);
    setActiveDropdownId(null);
  };

  const handleAddTag = () => {
    if (techTagInput.trim() && !techTags.includes(techTagInput.trim())) {
      setTechTags([...techTags, techTagInput.trim()]);
      setTechTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTechTags(techTags.filter(t => t !== tag));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !demoUrl || !description) return;

    if (editingId) {
      updatePortfolio(editingId, {
        title,
        description,
        demoUrl,
        repoUrl: repoUrl || undefined,
        techTags
      });
    } else {
      addPortfolio({
        userId: currentUser?.id || 'user-talent-1',
        title,
        description,
        demoUrl,
        repoUrl: repoUrl || undefined,
        techTags
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-outline-variant/30 pb-6">
        <div>
          <Link href="/talent/dashboard" className="inline-flex items-center gap-1.5 text-xs font-mono text-on-surface-variant hover:text-white mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Dashboard
          </Link>
          <h1 className="font-headline font-black text-3xl text-white">Kelola Portofolio Interaktif</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Tambahkan atau perbarui showcase proyek dengan live demo URL terverifikasi.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-primary text-primary-foreground font-bold rounded-xl text-sm hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Tambah Portofolio Baru
        </button>
      </div>

      {/* Portfolio Items Grid */}
      {myPortfolios.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPortfolios.map(item => (
            <div key={item.id} className="github-card rounded-2xl overflow-hidden flex flex-col justify-between group relative">
              <div>
                {/* Embed Live Preview Frame */}
                <div className="h-44 bg-surface-container-high relative overflow-hidden border-b border-outline-variant/40">
                  <iframe 
                    src={item.demoUrl} 
                    title={item.title}
                    sandbox="allow-scripts allow-same-origin"
                    className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="status-badge status-success text-[10px] shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      LIVE 200 OK
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-headline font-bold text-base text-white mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant mb-4 line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {item.techTags.map(tag => (
                      <span key={tag} className="tech-tag text-[10px]">{tag}</span>
                    ))}
                  </div>

                  <div className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Health Check: {item.lastCheckedAt || 'Aktif 200 OK'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons with 3-Dots Dropdown Menu */}
              <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between relative">
                <a 
                  href={item.demoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-mono"
                >
                  <Eye className="w-3.5 h-3.5" /> Buka Demo
                </a>

                {/* 3-Dots Action Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveDropdownId(activeDropdownId === item.id ? null : item.id)}
                    className="p-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white border border-outline-variant/60 transition-colors"
                    title="Menu Aksi"
                    aria-label="Menu Opsi Aksi"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeDropdownId === item.id && (
                    <div 
                      ref={dropdownRef}
                      className="absolute right-0 bottom-full mb-2 w-48 rounded-xl bg-slate-900 border border-outline-variant/80 shadow-2xl z-30 py-1.5 animate-in fade-in zoom-in-95 backdrop-blur-xl"
                    >
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                        onClick={() => setActiveDropdownId(null)}
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-primary" />
                        <span>Lihat Demo Live</span>
                      </a>

                      {item.repoUrl && (
                        <a
                          href={item.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors"
                          onClick={() => setActiveDropdownId(null)}
                        >
                          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Lihat Repositori</span>
                        </a>
                      )}

                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="w-full px-4 py-2 text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2.5 transition-colors text-left"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Edit Portofolio</span>
                      </button>

                      <div className="my-1 border-t border-outline-variant/40" />

                      <button
                        onClick={() => {
                          deletePortfolio(item.id);
                          setActiveDropdownId(null);
                        }}
                        className="w-full px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus Portofolio</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Belum Ada Item Portofolio"
          description="Tambahkan tautan live demo aplikasi dan repositori kode untuk membangun reputasi proof-of-work Anda."
          actionText="Tambah Portofolio Baru"
          onAction={handleOpenAdd}
        />
      )}

      {/* Modal Tambah / Edit Portofolio */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="github-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-outline-variant">
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant/40">
              <h2 className="font-headline font-bold text-xl text-white">
                {editingId ? 'Edit Item Portofolio' : 'Tambah Portofolio Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">JUDUL PROYEK</label>
                <input
                  type="text"
                  placeholder="Contoh: POS Kasir Mini UMKM Kopi"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">DESKRIPSI TUGAS / FITUR</label>
                <textarea
                  rows={3}
                  placeholder="Jelaskan fungsionalitas dan tantangan teknis yang diselesaikan..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-primary outline-none resize-none"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">LIVE DEMO URL (Wajib)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={demoUrl}
                    onChange={e => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">GITHUB REPO URL (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={repoUrl}
                    onChange={e => setRepoUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-primary outline-none"
                  />
                </div>
              </div>

              {/* Live Preview in Modal */}
              {demoUrl && (
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant mb-1.5">PRATINJAU LANGSUNG (LIVE PREVIEW EMBED):</label>
                  <div className="h-36 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant relative">
                    <iframe 
                      src={demoUrl} 
                      title="Preview Modal"
                      sandbox="allow-scripts allow-same-origin"
                      className="w-[200%] h-[200%] scale-50 origin-top-left pointer-events-none opacity-90"
                    />
                  </div>
                </div>
              )}

              {/* Tech Tags Input */}
              <div>
                <label className="block text-xs font-mono text-on-surface-variant mb-1.5">TECH STACK TAGS</label>
                <div className="flex gap-2 mb-2.5">
                  <input
                    type="text"
                    placeholder="Ketik tag lalu tekan tambah (misal: Next.js)"
                    value={techTagInput}
                    onChange={e => setTechTagInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant text-white text-sm focus:border-primary outline-none"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2.5 bg-surface-container-high hover:bg-surface-variant border border-outline-variant rounded-xl text-xs font-bold text-white transition-colors"
                  >
                    Tambah
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {techTags.map(tag => (
                    <span key={tag} className="tech-tag text-xs flex items-center gap-1.5 py-1 px-2.5">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-outline-variant/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-variant text-on-surface-variant hover:text-white text-xs font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary-fixed transition-all flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  {editingId ? 'Simpan Perubahan' : 'Terbitkan Portofolio'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
