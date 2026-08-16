import prisma from './prisma';
import { broadcastEvent } from './websocket';
import { SubmissionStatus, BountyStatus, EscrowStatus } from '@prisma/client';

export function startBackgroundWorkers() {
  console.log('⏰ Starting Background Escrow Auto-Release Scheduler...');

  // Run initial check and then interval every 60 seconds
  checkAndReleaseExpiredSubmissions();
  setInterval(checkAndReleaseExpiredSubmissions, 60 * 1000);
}

export async function checkAndReleaseExpiredSubmissions() {
  try {
    // 48 hours threshold in ms (48 * 60 * 60 * 1000)
    const thresholdDate = new Date(Date.now() - 48 * 60 * 60 * 1000);

    // Use updatedAt to respect the latest revision submission timestamp
    const expiredSubmissions = await prisma.submission.findMany({
      where: {
        status: SubmissionStatus.PENDING,
        updatedAt: { lte: thresholdDate },
        bounty: {
          status: BountyStatus.IN_REVIEW,
          escrow: {
            status: EscrowStatus.HOLD
          }
        }
      },
      include: {
        bounty: {
          include: {
            escrow: true,
            client: true
          }
        },
        talent: true
      }
    });

    if (expiredSubmissions.length === 0) return;

    console.log(`⏳ Found ${expiredSubmissions.length} pending submission(s) exceeding 48h limit. Auto-releasing escrow...`);

    for (const sub of expiredSubmissions) {
      if (!sub.bounty.escrow) continue;

      const netAmount = Number(sub.bounty.escrow.netAmount);

      await prisma.$transaction([
        prisma.submission.update({
          where: { id: sub.id },
          data: { status: SubmissionStatus.ACCEPTED }
        }),
        prisma.bounty.update({
          where: { id: sub.bountyId },
          data: { status: BountyStatus.COMPLETED }
        }),
        prisma.escrow.update({
          where: { id: sub.bounty.escrow.id },
          data: { status: EscrowStatus.RELEASED }
        }),
        prisma.user.update({
          where: { id: sub.talentId },
          data: {
            balance: { increment: netAmount },
            completedBountiesCount: { increment: 1 }
          }
        })
      ]);

      broadcastEvent({
        type: 'SUBMISSION_APPROVED',
        title: 'Dana Escrow Otomatis Dicairkan! 💸',
        message: `Batas waktu 48 jam review klien terlampaui. Saldo Rp ${netAmount.toLocaleString('id-ID')} telah dicairkan ke dompet ${sub.talent.name}.`,
        roleTarget: 'TALENT',
        bountyId: sub.bountyId,
        data: { autoReleased: true, bountyTitle: sub.bounty.title }
      });
    }
  } catch (error) {
    console.error('Error in checkAndReleaseExpiredSubmissions:', error);
  }
}
