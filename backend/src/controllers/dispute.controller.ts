import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { BountyStatus, DisputeStatus, EscrowStatus } from '@prisma/client';
import { broadcastEvent } from '../lib/websocket';
import { z } from 'zod';

export const raiseDisputeSchema = z.object({
  body: z.object({
    reason: z.string().min(10, 'Alasan sengketa minimal 10 karakter'),
    clientNotes: z.string().optional(),
    talentNotes: z.string().optional()
  })
});

export const resolveDisputeSchema = z.object({
  body: z.object({
    decision: z.enum(['RELEASE_TO_TALENT', 'REFUND_TO_CLIENT', 'SPLIT_50_50']),
    adminNotes: z.string().min(5, 'Catatan putusan admin minimal 5 karakter')
  })
});

export async function raiseDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { bountyId } = req.params;
    const { reason, clientNotes, talentNotes } = req.body;
    const user = req.user;

    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
      include: { submissions: true, client: true, disputes: true }
    });

    if (!bounty) {
      return res.status(404).json({ success: false, message: 'Bounty tidak ditemukan.' });
    }

    // Bug Prevention: Check if already in dispute or completed
    if (bounty.status === BountyStatus.DISPUTED) {
      return res.status(400).json({ success: false, message: 'Bounty ini sudah memiliki kasus sengketa aktif yang sedang ditinjau admin.' });
    }

    if (bounty.status === BountyStatus.COMPLETED || bounty.status === BountyStatus.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Bounty yang telah selesai atau dibatalkan tidak dapat disengketakan.' });
    }

    const latestSubmission = bounty.submissions[0];

    const dispute = await prisma.dispute.create({
      data: {
        bountyId,
        submissionId: latestSubmission?.id || null,
        initiatedBy: user?.role === 'CLIENT' ? 'Klien' : 'Talenta',
        reason,
        clientNotes: clientNotes || reason,
        talentNotes: talentNotes || null,
        status: DisputeStatus.PENDING_REVIEW
      }
    });

    await prisma.bounty.update({
      where: { id: bountyId },
      data: { status: BountyStatus.DISPUTED }
    });

    broadcastEvent({
      type: 'DISPUTE_RAISED',
      title: 'Kasus Sengketa Baru Diajukan! ⚖️',
      message: `Kasus moderasi baru untuk "${bounty.title}" memerlukan tinjauan admin. Alasan: ${reason}`,
      roleTarget: 'ADMIN',
      bountyId: bounty.id,
      data: { disputeId: dispute.id, reason }
    });

    return res.status(201).json({
      success: true,
      message: 'Kasus sengketa berhasil diajukan dan masuk dalam antrian moderasi admin.',
      data: { dispute }
    });
  } catch (error) {
    next(error);
  }
}

export async function listDisputes(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') where.status = status as DisputeStatus;

    const disputes = await prisma.dispute.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        bounty: {
          include: {
            client: true,
            escrow: true
          }
        },
        submission: {
          include: {
            talent: true
          }
        }
      }
    });

    const formatted = disputes.map(d => ({
      id: d.id,
      bountyId: d.bountyId,
      submissionId: d.submissionId,
      bounty: {
        id: d.bounty.id,
        title: d.bounty.title,
        budget: Number(d.bounty.budget),
        status: d.bounty.status,
        clientName: d.bounty.client.name,
        clientAvatar: d.bounty.client.avatarUrl
      },
      submission: {
        id: d.submission?.id || '',
        talentId: d.submission?.talentId || '',
        talentName: d.submission?.talent.name || 'Talenta',
        demoUrl: d.submission?.demoUrl || '',
        repoUrl: d.submission?.repoUrl || ''
      },
      initiatedBy: d.initiatedBy,
      reason: d.reason,
      clientNotes: d.clientNotes,
      talentNotes: d.talentNotes,
      adminNotes: d.adminNotes,
      status: d.status,
      createdAt: d.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: { disputes: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function getDisputeById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const d = await prisma.dispute.findUnique({
      where: { id },
      include: {
        bounty: {
          include: {
            client: true,
            escrow: true
          }
        },
        submission: {
          include: {
            talent: true
          }
        }
      }
    });

    if (!d) {
      return res.status(404).json({ success: false, message: 'Kasus sengketa tidak ditemukan.' });
    }

    const formatted = {
      id: d.id,
      bountyId: d.bountyId,
      submissionId: d.submissionId,
      bounty: {
        id: d.bounty.id,
        title: d.bounty.title,
        budget: Number(d.bounty.budget),
        status: d.bounty.status,
        clientName: d.bounty.client.name,
        clientAvatar: d.bounty.client.avatarUrl
      },
      submission: {
        id: d.submission?.id || '',
        talentId: d.submission?.talentId || '',
        talentName: d.submission?.talent.name || 'Talenta',
        demoUrl: d.submission?.demoUrl || '',
        repoUrl: d.submission?.repoUrl || ''
      },
      initiatedBy: d.initiatedBy,
      reason: d.reason,
      clientNotes: d.clientNotes,
      talentNotes: d.talentNotes,
      adminNotes: d.adminNotes,
      status: d.status,
      createdAt: d.createdAt.toISOString()
    };

    return res.status(200).json({
      success: true,
      data: { dispute: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function resolveDispute(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { decision, adminNotes } = req.body;

    const dispute = await prisma.dispute.findUnique({
      where: { id },
      include: {
        bounty: {
          include: {
            escrow: true,
            submissions: true,
            client: true
          }
        }
      }
    });

    if (!dispute || !dispute.bounty.escrow) {
      return res.status(404).json({ success: false, message: 'Data sengketa atau escrow tidak valid.' });
    }

    // Bug Prevention: Guard against double-resolution financial race condition
    if (
      dispute.status === DisputeStatus.RESOLVED_RELEASED ||
      dispute.status === DisputeStatus.RESOLVED_REFUNDED ||
      dispute.status === DisputeStatus.RESOLVED_SPLIT
    ) {
      return res.status(400).json({
        success: false,
        message: 'Kasus sengketa ini sudah pernah diputuskan sebelumnya dan tidak dapat diubah kembali.'
      });
    }

    const escrow = dispute.bounty.escrow;
    if (escrow.status === EscrowStatus.RELEASED || escrow.status === EscrowStatus.REFUNDED) {
      return res.status(400).json({
        success: false,
        message: 'Dana escrow untuk bounty ini sudah pernah dicairkan atau dikembalikan sebelumnya.'
      });
    }

    const netAmount = Number(escrow.netAmount);
    const talentId = dispute.submissionId ? dispute.bounty.submissions.find(s => s.id === dispute.submissionId)?.talentId : dispute.bounty.submissions[0]?.talentId;
    const clientId = dispute.bounty.clientId;

    const transactions: any[] = [
      prisma.dispute.update({
        where: { id },
        data: {
          status: decision === 'RELEASE_TO_TALENT'
            ? DisputeStatus.RESOLVED_RELEASED
            : decision === 'REFUND_TO_CLIENT'
            ? DisputeStatus.RESOLVED_REFUNDED
            : DisputeStatus.RESOLVED_SPLIT,
          adminNotes
        }
      })
    ];

    if (decision === 'RELEASE_TO_TALENT') {
      transactions.push(
        prisma.bounty.update({ where: { id: dispute.bountyId }, data: { status: BountyStatus.COMPLETED } }),
        prisma.escrow.update({ where: { id: escrow.id }, data: { status: EscrowStatus.RELEASED } })
      );
      if (talentId) {
        transactions.push(
          prisma.user.update({ where: { id: talentId }, data: { balance: { increment: netAmount }, completedBountiesCount: { increment: 1 } } })
        );
      }
    } else if (decision === 'REFUND_TO_CLIENT') {
      transactions.push(
        prisma.bounty.update({ where: { id: dispute.bountyId }, data: { status: BountyStatus.CANCELLED } }),
        prisma.escrow.update({ where: { id: escrow.id }, data: { status: EscrowStatus.REFUNDED } }),
        prisma.user.update({ where: { id: clientId }, data: { balance: { increment: Number(escrow.amount) } } })
      );
    } else if (decision === 'SPLIT_50_50') {
      const halfNet = Math.round(netAmount / 2);
      transactions.push(
        prisma.bounty.update({ where: { id: dispute.bountyId }, data: { status: BountyStatus.COMPLETED } }),
        prisma.escrow.update({ where: { id: escrow.id }, data: { status: EscrowStatus.RELEASED } }),
        prisma.user.update({ where: { id: clientId }, data: { balance: { increment: halfNet } } })
      );
      if (talentId) {
        transactions.push(
          prisma.user.update({ where: { id: talentId }, data: { balance: { increment: halfNet }, completedBountiesCount: { increment: 1 } } })
        );
      }
    }

    await prisma.$transaction(transactions);

    broadcastEvent({
      type: 'DISPUTE_RESOLVED',
      title: 'Putusan Sengketa Telah Ditetapkan ⚖️',
      message: `Admin telah memutuskan sengketa "${dispute.bounty.title}" dengan opsi: ${decision}. Catatan: ${adminNotes}`,
      roleTarget: 'ALL',
      bountyId: dispute.bountyId,
      data: { decision, adminNotes }
    });

    return res.status(200).json({
      success: true,
      message: `Putusan berhasil dieksekusi dengan opsi '${decision}'.`
    });
  } catch (error) {
    next(error);
  }
}
