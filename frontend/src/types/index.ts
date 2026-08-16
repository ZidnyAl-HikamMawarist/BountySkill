export type Role = 'TALENT' | 'CLIENT' | 'ADMIN';

export type BountyStatus = 
  | 'DRAFT'
  | 'PENDING_PAYMENT'
  | 'OPEN'
  | 'IN_REVIEW'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type SubmissionStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'REVISION_REQUESTED'
  | 'REJECTED';

export type EscrowStatus = 
  | 'HOLD'
  | 'RELEASED'
  | 'REFUNDED';

export type WithdrawalStatus =
  | 'PENDING'
  | 'DIPROSES'
  | 'SELESAI'
  | 'DITOLAK';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: Role;
  balance: number;
  bio?: string;
  githubUsername?: string;
  reputationScore?: number;
  completedBountiesCount?: number;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  demoUrl: string;
  repoUrl?: string;
  techTags: string[];
  isHealthy: boolean;
  lastCheckedAt?: string;
  createdAt: string;
}

export interface Escrow {
  id: string;
  bountyId: string;
  amount: number;
  feePlatform: number;
  netAmount: number;
  paymentGatewayRef?: string;
  paymentMethod?: 'QRIS' | 'VIRTUAL_ACCOUNT' | 'MANDIRI_VA' | 'BCA_VA';
  status: EscrowStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  bountyId: string;
  talentId: string;
  talentName?: string;
  talentAvatar?: string;
  demoUrl: string;
  repoUrl?: string;
  notes?: string;
  status: SubmissionStatus;
  revisionCount: number;
  revisionNotes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bountyId: string;
  bountyTitle?: string;
  reviewerId: string;
  reviewerName: string;
  receiverId: string;
  receiverName: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankName: string;
  accountNum: string;
  accountName: string;
  status: WithdrawalStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface Bounty {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  clientRating?: number;
  title: string;
  description: string;
  criteria: string[];
  budget: number;
  deadline: string; // ISO date string
  daysEstimate: number;
  category: string;
  techTags: string[];
  status: BountyStatus;
  escrow?: Escrow;
  submissions?: Submission[];
  review?: Review;
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DisputeCase {
  id: string;
  bountyId: string;
  bounty: Bounty;
  submission: Submission;
  reason: string;
  initiatedBy: Role;
  clientNotes: string;
  talentNotes: string;
  status: 'PENDING_REVIEW' | 'INVESTIGATING' | 'RESOLVED_RELEASED' | 'RESOLVED_REFUNDED' | 'RESOLVED_SPLIT';
  adminDecisionNotes?: string;
  createdAt: string;
}
