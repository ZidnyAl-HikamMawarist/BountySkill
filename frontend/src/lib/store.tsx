'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, PortfolioItem, Bounty, Withdrawal, DisputeCase, Review, Role, BountyStatus } from '@/types';
import { initialUsers, initialPortfolios, initialBounties, initialWithdrawals, initialDisputes } from './mock-data';
import api from './api-client';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  portfolios: PortfolioItem[];
  bounties: Bounty[];
  withdrawals: Withdrawal[];
  disputes: DisputeCase[];
  isServerWarming: boolean;
  isBackendConnected: boolean;
  
  // Auth & Session
  switchUserRole: (role: Role | 'GUEST') => void;
  loginUser: (email: string, role?: Role) => boolean;
  registerUser: (name: string, email: string, role: Role) => User;
  logoutUser: () => void;
  
  // Portfolio CRUD
  addPortfolio: (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'isHealthy' | 'lastCheckedAt'>) => void;
  updatePortfolio: (id: string, item: Partial<PortfolioItem>) => void;
  deletePortfolio: (id: string) => void;
  
  // Bounty & Escrow CRUD
  createBounty: (bountyData: Omit<Bounty, 'id' | 'clientId' | 'clientName' | 'clientAvatar' | 'clientRating' | 'status' | 'applicantsCount' | 'createdAt' | 'updatedAt'>, paymentMethod: 'QRIS' | 'VIRTUAL_ACCOUNT') => Bounty;
  submitBountyWork: (bountyId: string, demoUrl: string, repoUrl: string, notes: string) => void;
  approveBountySubmission: (bountyId: string, submissionId: string) => void;
  requestBountyRevision: (bountyId: string, submissionId: string, revisionNote: string) => void;
  raiseDispute: (bountyId: string, reason: string, clientNotes?: string) => void;
  addReview: (bountyId: string, rating: number, comment: string) => void;
  
  // Wallet & Withdrawal
  requestWithdrawal: (amount: number, bankName: string, accountNum: string, accountName: string) => boolean;
  
  // Admin Operations
  resolveDispute: (disputeId: string, decision: 'RELEASE_TO_TALENT' | 'REFUND_TO_CLIENT' | 'SPLIT_50_50', adminNotes: string) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: 'SELESAI' | 'DITOLAK', rejectionReason?: string) => void;
  
  // Refresh from backend
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>(initialPortfolios);
  const [bounties, setBounties] = useState<Bounty[]>(initialBounties);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(initialWithdrawals);
  const [disputes, setDisputes] = useState<DisputeCase[]>(initialDisputes);
  const [isServerWarming, setIsServerWarming] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync data from backend API
  const refreshData = useCallback(async () => {
    try {
      const [bountiesRes, portfoliosRes] = await Promise.allSettled([
        api.bounties.list(),
        api.portfolios.list()
      ]);

      if (bountiesRes.status === 'fulfilled' && bountiesRes.value.data?.bounties?.length) {
        setBounties(bountiesRes.value.data.bounties);
        setIsBackendConnected(true);
      }

      if (portfoliosRes.status === 'fulfilled' && portfoliosRes.value.data?.portfolios?.length) {
        setPortfolios(portfoliosRes.value.data.portfolios);
      }
    } catch (e) {
      console.warn('Backend sync failed, running with local reactive store cache.');
    }
  }, []);

  // Initial load
  useEffect(() => {
    try {
      const savedBounties = localStorage.getItem('sb_bounties');
      if (savedBounties) setBounties(JSON.parse(savedBounties));
      
      const savedPortfolios = localStorage.getItem('sb_portfolios');
      if (savedPortfolios) setPortfolios(JSON.parse(savedPortfolios));
      
      const savedWithdrawals = localStorage.getItem('sb_withdrawals');
      if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
      
      const savedDisputes = localStorage.getItem('sb_disputes');
      if (savedDisputes) setDisputes(JSON.parse(savedDisputes));
    } catch (e) {
      console.error('Failed to load local storage state', e);
    }

    refreshData();
  }, [refreshData]);

  // Save to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem('sb_bounties', JSON.stringify(bounties));
      localStorage.setItem('sb_portfolios', JSON.stringify(portfolios));
      localStorage.setItem('sb_withdrawals', JSON.stringify(withdrawals));
      localStorage.setItem('sb_disputes', JSON.stringify(disputes));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [bounties, portfolios, withdrawals, disputes]);

  const switchUserRole = (role: Role | 'GUEST') => {
    if (role === 'GUEST') {
      setCurrentUser(null);
      return;
    }
    const found = users.find(u => u.role === role);
    if (found) setCurrentUser(found);
  };

  const loginUser = (email: string, role?: Role): boolean => {
    // Attempt backend login in background
    api.auth.login({ email }).then(res => {
      if (res.data?.token) {
        localStorage.setItem('sb_auth_token', res.data.token);
      }
    }).catch(() => {});

    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      return true;
    }
    if (role) {
      const byRole = users.find(u => u.role === role);
      if (byRole) {
        setCurrentUser(byRole);
        return true;
      }
    }
    return false;
  };

  const registerUser = (name: string, email: string, role: Role): User => {
    // Attempt backend registration in background
    api.auth.register({ name, email, role }).then(res => {
      if (res.data?.token) {
        localStorage.setItem('sb_auth_token', res.data.token);
      }
    }).catch(() => {});

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      balance: role === 'CLIENT' ? 5000000 : 0,
      reputationScore: 5.0,
      completedBountiesCount: 0,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    localStorage.removeItem('sb_auth_token');
    setCurrentUser(null);
  };

  // Portfolio CRUD
  const addPortfolio = (item: Omit<PortfolioItem, 'id' | 'createdAt' | 'isHealthy' | 'lastCheckedAt'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      userId: currentUser ? currentUser.id : 'user-talent-1',
      isHealthy: true,
      lastCheckedAt: 'Baru saja',
      createdAt: new Date().toISOString()
    };
    setPortfolios(prev => [newItem, ...prev]);

    // Backend sync
    api.portfolios.add(item).catch(() => {});
  };

  const updatePortfolio = (id: string, updated: Partial<PortfolioItem>) => {
    setPortfolios(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    api.portfolios.update(id, updated).catch(() => {});
  };

  const deletePortfolio = (id: string) => {
    setPortfolios(prev => prev.filter(p => p.id !== id));
    api.portfolios.delete(id).catch(() => {});
  };

  // Bounty & Escrow
  const createBounty = (
    bountyData: Omit<Bounty, 'id' | 'clientId' | 'clientName' | 'clientAvatar' | 'clientRating' | 'status' | 'applicantsCount' | 'createdAt' | 'updatedAt'>,
    paymentMethod: 'QRIS' | 'VIRTUAL_ACCOUNT'
  ): Bounty => {
    const id = `bounty-${Date.now()}`;
    const feePlatform = Math.round(bountyData.budget * 0.1);
    const netAmount = bountyData.budget - feePlatform;

    const newBounty: Bounty = {
      ...bountyData,
      id,
      clientId: currentUser?.id || 'user-client-1',
      clientName: currentUser?.name || 'Hendra Wijaya (Kopi Nusantara)',
      clientAvatar: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      clientRating: currentUser?.reputationScore || 5.0,
      status: 'OPEN',
      applicantsCount: 0,
      escrow: {
        id: `escrow-${Date.now()}`,
        bountyId: id,
        amount: bountyData.budget,
        feePlatform,
        netAmount,
        paymentMethod,
        status: 'HOLD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      submissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setBounties(prev => [newBounty, ...prev]);

    // Backend sync
    api.bounties.create({ ...bountyData, paymentMethod }).catch(() => {});
    return newBounty;
  };

  const submitBountyWork = (bountyId: string, demoUrl: string, repoUrl: string, notes: string) => {
    const talentId = currentUser?.id || 'user-talent-1';
    const talentName = currentUser?.name || 'Budi Pratama';
    const talentAvatar = currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    setBounties(prev => prev.map(b => {
      if (b.id !== bountyId) return b;

      const existingSub = b.submissions?.find(s => s.talentId === talentId);
      let updatedSubs = b.submissions ? [...b.submissions] : [];

      if (existingSub) {
        updatedSubs = updatedSubs.map(s => s.id === existingSub.id ? {
          ...s,
          demoUrl,
          repoUrl,
          notes,
          status: 'PENDING',
          updatedAt: new Date().toISOString()
        } : s);
      } else {
        const newSub = {
          id: `sub-${Date.now()}`,
          bountyId,
          talentId,
          talentName,
          talentAvatar,
          demoUrl,
          repoUrl,
          notes,
          status: 'PENDING' as const,
          revisionCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedSubs.push(newSub);
      }

      return {
        ...b,
        status: 'IN_REVIEW' as BountyStatus,
        submissions: updatedSubs,
        applicantsCount: Math.max(b.applicantsCount, updatedSubs.length),
        updatedAt: new Date().toISOString()
      };
    }));

    // Backend sync
    api.submissions.submit(bountyId, { demoUrl, repoUrl, notes }).catch(() => {});
  };

  const approveBountySubmission = (bountyId: string, submissionId: string) => {
    setBounties(prev => prev.map(b => {
      if (b.id !== bountyId) return b;

      const sub = b.submissions?.find(s => s.id === submissionId);
      const netAmount = b.escrow?.netAmount || (b.budget * 0.9);

      if (sub) {
        setUsers(uList => uList.map(u => u.id === sub.talentId ? {
          ...u,
          balance: u.balance + netAmount,
          completedBountiesCount: (u.completedBountiesCount || 0) + 1
        } : u));
      }

      return {
        ...b,
        status: 'COMPLETED' as BountyStatus,
        escrow: b.escrow ? { ...b.escrow, status: 'RELEASED' as const } : undefined,
        submissions: b.submissions?.map(s => s.id === submissionId ? { ...s, status: 'ACCEPTED' as const } : s),
        updatedAt: new Date().toISOString()
      };
    }));

    // Backend sync
    api.submissions.approve(bountyId, submissionId).catch(() => {});
  };

  const requestBountyRevision = (bountyId: string, submissionId: string, revisionNote: string) => {
    setBounties(prev => prev.map(b => {
      if (b.id !== bountyId) return b;

      const updatedSubs = b.submissions?.map(s => {
        if (s.id !== submissionId) return s;
        const newRevisionCount = s.revisionCount + 1;
        const notesList = s.revisionNotes ? [...s.revisionNotes, `Revisi ${newRevisionCount}: ${revisionNote}`] : [`Revisi 1: ${revisionNote}`];

        return {
          ...s,
          status: 'REVISION_REQUESTED' as const,
          revisionCount: newRevisionCount,
          revisionNotes: notesList,
          updatedAt: new Date().toISOString()
        };
      });

      return {
        ...b,
        submissions: updatedSubs,
        updatedAt: new Date().toISOString()
      };
    }));

    // Backend sync
    api.submissions.requestRevision(bountyId, submissionId, revisionNote).catch(() => {});
  };

  const raiseDispute = (bountyId: string, reason: string, clientNotes?: string) => {
    const bounty = bounties.find(b => b.id === bountyId);
    if (!bounty) return;

    const submission = bounty.submissions?.[0] || {
      id: `sub-generic-${Date.now()}`,
      bountyId,
      talentId: 'user-talent-1',
      demoUrl: 'https://demo.example.com',
      status: 'PENDING',
      revisionCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newDispute: DisputeCase = {
      id: `disp-${Date.now()}`,
      bountyId,
      bounty,
      submission,
      reason,
      initiatedBy: currentUser?.role || 'CLIENT',
      clientNotes: clientNotes || reason,
      talentNotes: 'Talent telah menyerahkan hasil pengerjaan sesuai kriteria awal tugas.',
      status: 'PENDING_REVIEW',
      createdAt: new Date().toISOString()
    };

    setDisputes(prev => [newDispute, ...prev]);

    setBounties(prev => prev.map(b => b.id === bountyId ? {
      ...b,
      status: 'DISPUTED' as BountyStatus,
      updatedAt: new Date().toISOString()
    } : b));

    // Backend sync
    api.disputes.raise(bountyId, { reason, clientNotes }).catch(() => {});
  };

  const addReview = (bountyId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      bountyId,
      reviewerId: currentUser?.id || 'user-client-1',
      reviewerName: currentUser?.name || 'Klien SkillBounty',
      receiverId: 'user-talent-1',
      receiverName: 'Budi Pratama',
      rating,
      comment,
      createdAt: new Date().toISOString()
    };

    setBounties(prev => prev.map(b => b.id === bountyId ? { ...b, review: newReview } : b));

    // Backend sync
    api.reviews.add(bountyId, { rating, comment }).catch(() => {});
  };

  const requestWithdrawal = (amount: number, bankName: string, accountNum: string, accountName: string): boolean => {
    if (!currentUser || currentUser.balance < amount) return false;

    const updatedBalance = currentUser.balance - amount;
    setCurrentUser({ ...currentUser, balance: updatedBalance });
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, balance: updatedBalance } : u));

    const newWithdrawal: Withdrawal = {
      id: `wd-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount,
      bankName,
      accountNum,
      accountName,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    setWithdrawals(prev => [newWithdrawal, ...prev]);

    // Backend sync
    api.withdrawals.request({ amount, bankName, accountNum, accountName }).catch(() => {});
    return true;
  };

  const resolveDispute = (disputeId: string, decision: 'RELEASE_TO_TALENT' | 'REFUND_TO_CLIENT' | 'SPLIT_50_50', adminNotes: string) => {
    const dispute = disputes.find(d => d.id === disputeId);
    if (!dispute) return;

    const bounty = bounties.find(b => b.id === dispute.bountyId);
    const netAmount = bounty?.escrow?.netAmount || 1000000;

    if (decision === 'RELEASE_TO_TALENT') {
      setUsers(uList => uList.map(u => u.id === dispute.submission.talentId ? { ...u, balance: u.balance + netAmount } : u));
    } else if (decision === 'REFUND_TO_CLIENT' && bounty) {
      setUsers(uList => uList.map(u => u.id === bounty.clientId ? { ...u, balance: u.balance + bounty.budget } : u));
    } else if (decision === 'SPLIT_50_50' && bounty) {
      setUsers(uList => uList.map(u => {
        if (u.id === dispute.submission.talentId) return { ...u, balance: u.balance + (netAmount / 2) };
        if (u.id === bounty.clientId) return { ...u, balance: u.balance + (bounty.budget / 2) };
        return u;
      }));
    }

    setDisputes(prev => prev.map(d => d.id === disputeId ? {
      ...d,
      status: decision === 'RELEASE_TO_TALENT' ? 'RESOLVED_RELEASED' : decision === 'REFUND_TO_CLIENT' ? 'RESOLVED_REFUNDED' : 'RESOLVED_SPLIT',
      adminDecisionNotes: adminNotes
    } : d));

    setBounties(prev => prev.map(b => b.id === dispute.bountyId ? {
      ...b,
      status: 'COMPLETED' as BountyStatus,
      escrow: b.escrow ? { ...b.escrow, status: decision === 'REFUND_TO_CLIENT' ? 'REFUNDED' : 'RELEASED' } : undefined
    } : b));

    // Backend sync
    api.disputes.resolve(disputeId, { decision, adminNotes }).catch(() => {});
  };

  const updateWithdrawalStatus = (withdrawalId: string, status: 'SELESAI' | 'DITOLAK', rejectionReason?: string) => {
    const wd = withdrawals.find(w => w.id === withdrawalId);
    if (!wd) return;

    if (status === 'DITOLAK') {
      setUsers(uList => uList.map(u => u.id === wd.userId ? { ...u, balance: u.balance + wd.amount } : u));
      if (currentUser && currentUser.id === wd.userId) {
        setCurrentUser({ ...currentUser, balance: currentUser.balance + wd.amount });
      }
    }

    setWithdrawals(prev => prev.map(w => w.id === withdrawalId ? { ...w, status, rejectionReason } : w));

    // Backend sync
    api.withdrawals.adminUpdate(withdrawalId, { status, rejectionReason }).catch(() => {});
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      portfolios,
      bounties,
      withdrawals,
      disputes,
      isServerWarming,
      isBackendConnected,
      switchUserRole,
      loginUser,
      registerUser,
      logoutUser,
      addPortfolio,
      updatePortfolio,
      deletePortfolio,
      createBounty,
      submitBountyWork,
      approveBountySubmission,
      requestBountyRevision,
      raiseDispute,
      addReview,
      requestWithdrawal,
      resolveDispute,
      updateWithdrawalStatus,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppStore must be used within an AppProvider');
  return context;
}
