import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { BountyStatus, EscrowStatus } from '@prisma/client';
import { broadcastEvent } from '../lib/websocket';
import { z } from 'zod';

export const createBountySchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Judul bounty minimal 5 karakter').trim(),
    category: z.string().default('Frontend Slicing'),
    description: z.string().min(10, 'Deskripsi minimal 10 karakter').trim(),
    budget: z.number().min(50000, 'Budget minimal Rp 50.000'),
    daysEstimate: z.number().min(1).max(30).default(3),
    deadline: z.string().or(z.date()),
    criteria: z.array(z.string()).min(1, 'Minimal 1 kriteria kelulusan'),
    techTags: z.array(z.string()).default([]),
    paymentMethod: z.string().default('QRIS')
  })
});

export async function listBounties(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, category, status, sortBy, maxBudget, clientId, page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(String(page)) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit)) || 20));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (clientId) {
      where.clientId = String(clientId);
    }

    if (category && category !== 'ALL') {
      where.category = String(category);
    }

    if (status && status !== 'ALL') {
      where.status = status as BountyStatus;
    }

    if (maxBudget) {
      where.budget = { lte: Number(maxBudget) };
    }

    if (search) {
      const q = String(search).toLowerCase();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { techTags: { hasSome: [q] } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'BUDGET_HIGH') orderBy = { budget: 'desc' };
    if (sortBy === 'BUDGET_LOW') orderBy = { budget: 'asc' };

    // Parallel execution of Count and Records query to avoid N+1 and slow response
    const [totalCount, bounties] = await Promise.all([
      prisma.bounty.count({ where }),
      prisma.bounty.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true,
              reputationScore: true
            }
          },
          escrow: true,
          submissions: {
            select: {
              id: true,
              talentId: true,
              talentName: true,
              status: true,
              revisionCount: true
            }
          },
          review: true
        }
      })
    ]);

    const formatted = bounties.map(b => ({
      id: b.id,
      clientId: b.clientId,
      clientName: b.client.name,
      clientAvatar: b.client.avatarUrl,
      clientRating: b.client.reputationScore,
      title: b.title,
      category: b.category,
      description: b.description,
      budget: Number(b.budget),
      daysEstimate: b.daysEstimate,
      deadline: b.deadline.toISOString(),
      status: b.status,
      criteria: b.criteria,
      techTags: b.techTags,
      applicantsCount: b.submissions.length,
      submissions: b.submissions,
      escrow: b.escrow ? {
        id: b.escrow.id,
        amount: Number(b.escrow.amount),
        feePlatform: Number(b.escrow.feePlatform),
        netAmount: Number(b.escrow.netAmount),
        paymentMethod: b.escrow.paymentMethod,
        status: b.escrow.status
      } : null,
      review: b.review,
      createdAt: b.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: {
        bounties: formatted,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalCount,
          totalPages: Math.ceil(totalCount / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getBountyById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const b = await prisma.bounty.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            reputationScore: true
          }
        },
        escrow: true,
        submissions: {
          include: {
            talent: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
                reputationScore: true,
                githubUsername: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        disputes: {
          orderBy: { createdAt: 'desc' }
        },
        review: true
      }
    });

    if (!b) {
      return res.status(404).json({ success: false, message: 'Bounty tidak ditemukan.' });
    }

    const formatted = {
      id: b.id,
      clientId: b.clientId,
      clientName: b.client.name,
      clientAvatar: b.client.avatarUrl,
      clientRating: b.client.reputationScore,
      title: b.title,
      category: b.category,
      description: b.description,
      budget: Number(b.budget),
      daysEstimate: b.daysEstimate,
      deadline: b.deadline.toISOString(),
      status: b.status,
      criteria: b.criteria,
      techTags: b.techTags,
      applicantsCount: b.submissions.length,
      submissions: b.submissions.map(s => ({
        id: s.id,
        bountyId: s.bountyId,
        talentId: s.talentId,
        talentName: s.talent.name || s.talentName,
        talentAvatar: s.talent.avatarUrl,
        demoUrl: s.demoUrl,
        repoUrl: s.repoUrl,
        notes: s.notes,
        status: s.status,
        revisionCount: s.revisionCount,
        revisionNotes: s.revisionNotes,
        createdAt: s.createdAt.toISOString()
      })),
      escrow: b.escrow ? {
        id: b.escrow.id,
        amount: Number(b.escrow.amount),
        feePlatform: Number(b.escrow.feePlatform),
        netAmount: Number(b.escrow.netAmount),
        paymentMethod: b.escrow.paymentMethod,
        status: b.escrow.status
      } : null,
      disputes: b.disputes,
      review: b.review,
      createdAt: b.createdAt.toISOString()
    };

    return res.status(200).json({
      success: true,
      data: { bounty: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function createBounty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const {
      title,
      category,
      description,
      budget,
      daysEstimate,
      deadline,
      criteria,
      techTags,
      paymentMethod
    } = req.body;

    const clientId = req.user?.userId || 'user-client-1';

    const feePlatform = Math.round(budget * 0.1);
    const netAmount = budget - feePlatform;

    const newBounty = await prisma.bounty.create({
      data: {
        clientId,
        title,
        category,
        description,
        budget,
        daysEstimate,
        deadline: new Date(deadline),
        status: BountyStatus.OPEN,
        criteria,
        techTags,
        escrow: {
          create: {
            amount: budget,
            feePlatform,
            netAmount,
            paymentMethod: paymentMethod || 'QRIS',
            status: EscrowStatus.HOLD
          }
        }
      },
      include: {
        client: true,
        escrow: true
      }
    });

    broadcastEvent({
      type: 'BOUNTY_CREATED',
      title: 'Bounty Baru Tersedia! 🚀',
      message: `${newBounty.client.name} mempublikasikan bounty "${title}" dengan total reward Rp ${Number(budget).toLocaleString('id-ID')}.`,
      roleTarget: 'ALL',
      bountyId: newBounty.id,
      data: { title, budget, category }
    });

    return res.status(201).json({
      success: true,
      message: 'Bounty berhasil dibuat dan dana escrow telah dikunci.',
      data: { bounty: newBounty }
    });
  } catch (error) {
    next(error);
  }
}
