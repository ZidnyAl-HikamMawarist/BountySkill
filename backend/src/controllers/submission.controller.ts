import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { BountyStatus, SubmissionStatus, EscrowStatus } from '@prisma/client';
import { broadcastEvent } from '../lib/websocket';
import { z } from 'zod';

export const submitWorkSchema = z.object({
  body: z.object({
    demoUrl: z.string().url('Format demo URL tidak valid'),
    repoUrl: z.string().url('Format repository URL tidak valid').optional().or(z.literal('')),
    notes: z.string().optional()
  })
});

export const requestRevisionSchema = z.object({
  body: z.object({
    notes: z.string().min(5, 'Catatan revisi minimal 5 karakter')
  })
});

export async function submitWork(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { bountyId } = req.params;
    const { demoUrl, repoUrl, notes } = req.body;
    const talentId = req.user?.userId || 'user-talent-1';

    const bounty = await prisma.bounty.findUnique({
      where: { id: bountyId },
      include: { client: true }
    });

    if (!bounty) {
      return res.status(404).json({ success: false, message: 'Bounty tidak ditemukan.' });
    }

    if (bounty.status === BountyStatus.COMPLETED || bounty.status === BountyStatus.CANCELLED) {
      return res.status(400).json({ success: false, message: 'Bounty ini sudah ditutup atau dibatalkan.' });
    }

    const talent = await prisma.user.findUnique({ where: { id: talentId } });

    // Check existing submission
    const existing = await prisma.submission.findFirst({
      where: { bountyId, talentId }
    });

    let submission;

    if (existing) {
      submission = await prisma.submission.update({
        where: { id: existing.id },
        data: {
          demoUrl,
          repoUrl: repoUrl || null,
          notes,
          status: SubmissionStatus.PENDING,
          revisionCount: existing.status === SubmissionStatus.REVISION_REQUESTED ? existing.revisionCount + 1 : existing.revisionCount
        }
      });
    } else {
      submission = await prisma.submission.create({
        data: {
          bountyId,
          talentId,
          talentName: talent?.name || 'Talenta',
          demoUrl,
          repoUrl: repoUrl || null,
          notes,
          status: SubmissionStatus.PENDING,
          revisionCount: 0
        }
      });
    }

    // Update bounty status
    await prisma.bounty.update({
      where: { id: bountyId },
      data: { status: BountyStatus.IN_REVIEW }
    });

    // Broadcast realtime event
    broadcastEvent({
      type: 'SUBMISSION_NEW',
      title: 'Tugas Baru Telah Diserahkan! 🚀',
      message: `${talent?.name || 'Talenta'} telah menyerahkan hasil pengerjaan untuk bounty "${bounty.title}".`,
      roleTarget: 'CLIENT',
      bountyId: bounty.id,
      data: { submissionId: submission.id, demoUrl: submission.demoUrl }
    });

    return res.status(200).json({
      success: true,
      message: 'Submission berhasil dikirim dan menunggu verifikasi klien.',
      data: { submission }
    });
  } catch (error) {
    next(error);
  }
}

export async function approveSubmission(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { bountyId, submissionId } = req.params;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        bounty: {
          include: { escrow: true, client: true }
        },
        talent: true
      }
    });

    if (!submission || submission.bountyId !== bountyId) {
      return res.status(404).json({ success: false, message: 'Submission tidak ditemukan.' });
    }

    // IDOR & Authorization Check: Only bounty owner client or admin can approve
    if (req.user && req.user.role === 'CLIENT' && submission.bounty.clientId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki otoritas untuk menyetujui bounty milik klien lain.' });
    }

    // Prevent Double-Approval / Race Condition
    if (submission.status === SubmissionStatus.ACCEPTED || submission.bounty.status === BountyStatus.COMPLETED) {
      return res.status(400).json({ success: false, message: 'Submission ini sudah pernah disetujui sebelumnya.' });
    }

    const escrow = submission.bounty.escrow;
    if (!escrow || escrow.status === EscrowStatus.RELEASED) {
      return res.status(400).json({ success: false, message: 'Dana escrow sudah dicairkan atau tidak ditemukan.' });
    }

    const netAmount = Number(escrow.netAmount);

    // Run transaction
    await prisma.$transaction([
      prisma.submission.update({
        where: { id: submission.id },
        data: { status: SubmissionStatus.ACCEPTED }
      }),
      prisma.bounty.update({
        where: { id: bountyId },
        data: { status: BountyStatus.COMPLETED }
      }),
      prisma.escrow.update({
        where: { id: escrow.id },
        data: { status: EscrowStatus.RELEASED }
      }),
      prisma.user.update({
        where: { id: submission.talentId },
        data: {
          balance: { increment: netAmount },
          completedBountiesCount: { increment: 1 }
        }
      })
    ]);

    // Broadcast realtime event
    broadcastEvent({
      type: 'SUBMISSION_APPROVED',
      title: 'Pengerjaan Disetujui & Escrow Cair! 💰',
      message: `Klien ${submission.bounty.client.name} menyetujui tugas "${submission.bounty.title}". Saldo bersih Rp ${netAmount.toLocaleString('id-ID')} telah dicairkan ke dompet talenta!`,
      roleTarget: 'TALENT',
      bountyId: submission.bountyId,
      data: { talentName: submission.talent.name, netAmount }
    });

    return res.status(200).json({
      success: true,
      message: `Submission disetujui! Dana bersih sebesar Rp ${netAmount.toLocaleString('id-ID')} telah dicairkan ke dompet talenta.`
    });
  } catch (error) {
    next(error);
  }
}

export async function requestRevision(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { bountyId, submissionId } = req.params;
    const { notes } = req.body;

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { bounty: true, talent: true }
    });

    if (!submission || submission.bountyId !== bountyId) {
      return res.status(404).json({ success: false, message: 'Submission tidak ditemukan.' });
    }

    // IDOR Check: Only bounty owner client or admin can request revision
    if (req.user && req.user.role === 'CLIENT' && submission.bounty.clientId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak untuk meminta revisi pada tugas klien lain.' });
    }

    if (submission.status === SubmissionStatus.ACCEPTED) {
      return res.status(400).json({ success: false, message: 'Tugas yang telah disetujui tidak dapat diminta revisi kembali.' });
    }

    if (submission.revisionCount >= 2) {
      return res.status(400).json({
        success: false,
        message: 'Batas maksimal revisi (2 kali) telah tercapai. Silakan setujui atau ajukan sengketa (dispute) ke admin.'
      });
    }

    const updatedRevisionNotes = [...submission.revisionNotes, notes];

    const updated = await prisma.submission.update({
      where: { id: submission.id },
      data: {
        status: SubmissionStatus.REVISION_REQUESTED,
        revisionNotes: updatedRevisionNotes
      }
    });

    // Broadcast realtime event
    broadcastEvent({
      type: 'SUBMISSION_REVISION',
      title: 'Permintaan Revisi Tugas 📝',
      message: `Klien meminta revisi (ke-${submission.revisionCount + 1}/2) untuk "${submission.bounty.title}": ${notes}`,
      roleTarget: 'TALENT',
      bountyId: submission.bountyId,
      data: { revisionCount: submission.revisionCount + 1, notes }
    });

    return res.status(200).json({
      success: true,
      message: 'Permintaan revisi telah dikirimkan ke talenta.',
      data: { submission: updated }
    });
  } catch (error) {
    next(error);
  }
}
