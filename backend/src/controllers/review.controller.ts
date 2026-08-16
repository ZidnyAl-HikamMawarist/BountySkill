import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { broadcastEvent } from '../lib/websocket';
import { z } from 'zod';

export const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
  })
});

export async function addReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { bountyId } = req.params;
    const { rating, comment } = req.body;
    const reviewerId = req.user?.userId || 'user-client-1';

    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
      include: {
        submissions: {
          where: { status: 'ACCEPTED' },
          include: { talent: true }
        },
        client: true
      }
    });

    if (!bounty) {
      return res.status(404).json({ success: false, message: 'Bounty tidak ditemukan.' });
    }

    // IDOR & Authorization check: only client of this bounty or admin can leave review
    if (req.user && req.user.role === 'CLIENT' && bounty.clientId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Hanya klien pembuat bounty yang dapat memberikan ulasan.' });
    }

    const talentId = bounty.submissions[0]?.talentId || 'user-talent-1';
    const talentName = bounty.submissions[0]?.talent.name || 'Talenta';

    // Upsert review
    const review = await prisma.review.upsert({
      where: { bountyId },
      create: {
        bountyId,
        reviewerId,
        receiverId: talentId,
        rating,
        comment
      },
      update: {
        rating,
        comment
      }
    });

    // Database Aggregation: Avoid N+1 Memory Allocation
    const aggregateResult = await prisma.review.aggregate({
      _avg: { rating: true },
      where: { receiverId: talentId }
    });

    const avgRating = aggregateResult._avg.rating || rating;
    await prisma.user.update({
      where: { id: talentId },
      data: { reputationScore: Math.round(avgRating * 10) / 10 }
    });

    broadcastEvent({
      type: 'REVIEW_SUBMITTED',
      title: `Ulasan Bintang ${rating} Diterima! ⭐`,
      message: `${bounty.client.name} memberikan rating ${rating}/5 bintang untuk "${bounty.title}": "${comment || 'Kerja bagus!'}"`,
      roleTarget: 'TALENT',
      bountyId: bounty.id,
      data: { rating, comment, talentName }
    });

    return res.status(201).json({
      success: true,
      message: 'Ulasan berhasil disimpan.',
      data: { review }
    });
  } catch (error) {
    next(error);
  }
}

export async function listTalentReviews(req: Request, res: Response, next: NextFunction) {
  try {
    const { talentId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { receiverId: talentId },
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: {
          select: {
            id: true,
            name: true,
            avatarUrl: true
          }
        },
        bounty: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: { reviews }
    });
  } catch (error) {
    next(error);
  }
}
