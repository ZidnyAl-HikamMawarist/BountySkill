import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { broadcastEvent } from '../lib/websocket';
import { z } from 'zod';

export const withdrawalSchema = z.object({
  body: z.object({
    amount: z.number().min(50000, 'Nominal penarikan minimal Rp 50.000'),
    bankName: z.string().min(2, 'Nama bank / e-wallet wajib diisi'),
    accountNum: z.string().min(5, 'Nomor rekening wajib diisi'),
    accountName: z.string().min(3, 'Nama pemilik rekening wajib diisi')
  })
});

export async function requestWithdrawal(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { amount, bankName, accountNum, accountName } = req.body;
    const userId = req.user?.userId || 'user-talent-1';

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    if (Number(user.balance) < amount) {
      return res.status(400).json({ success: false, message: 'Saldo dompet Anda tidak mencukupi.' });
    }

    // Atomic Transaction: Prevent concurrency race condition & balance overdraft
    const [updatedUser, withdrawal] = await prisma.$transaction(async (tx) => {
      const freshUser = await tx.user.findUnique({ where: { id: userId } });
      if (!freshUser || Number(freshUser.balance) < amount) {
        throw new Error('Saldo dompet tidak mencukupi saat proses debit.');
      }

      const updated = await tx.user.update({
        where: { id: userId },
        data: { balance: { decrement: amount } }
      });

      const wd = await tx.withdrawal.create({
        data: {
          userId,
          amount,
          bankName,
          accountNum,
          accountName,
          status: 'PENDING'
        }
      });

      return [updated, wd];
    });

    broadcastEvent({
      type: 'WITHDRAWAL_REQUESTED',
      title: 'Permohonan Penarikan Dana Baru 💳',
      message: `${user.name} mengajukan penarikan Rp ${amount.toLocaleString('id-ID')} ke ${bankName} (${accountNum}).`,
      roleTarget: 'ADMIN',
      data: { withdrawalId: withdrawal.id, amount, bankName }
    });

    return res.status(201).json({
      success: true,
      message: 'Permohonan penarikan dana berhasil diajukan dan sedang diproses admin.',
      data: { withdrawal, remainingBalance: updatedUser.balance }
    });
  } catch (error: any) {
    if (error.message === 'Saldo dompet tidak mencukupi saat proses debit.') {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
}

export async function listMyWithdrawals(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId || 'user-talent-1';

    const withdrawals = await prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    const formatted = withdrawals.map(w => ({
      id: w.id,
      userId: w.userId,
      amount: Number(w.amount),
      bankName: w.bankName,
      accountNum: w.accountNum,
      accountName: w.accountName,
      status: w.status,
      rejectionReason: w.rejectionReason,
      createdAt: w.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: { withdrawals: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function listAllWithdrawals(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);

    const withdrawals = await prisma.withdrawal.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const formatted = withdrawals.map(w => ({
      id: w.id,
      userId: w.userId,
      userName: w.user.name,
      userEmail: w.user.email,
      amount: Number(w.amount),
      bankName: w.bankName,
      accountNum: w.accountNum,
      accountName: w.accountName,
      status: w.status,
      rejectionReason: w.rejectionReason,
      createdAt: w.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: { withdrawals: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateWithdrawalStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const withdrawal = await prisma.withdrawal.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!withdrawal) {
      return res.status(404).json({ success: false, message: 'Permohonan penarikan tidak ditemukan.' });
    }

    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({ success: false, message: `Penarikan ini sudah diproses sebelumnya (Status: ${withdrawal.status}).` });
    }

    if (status === 'DITOLAK') {
      await prisma.$transaction([
        prisma.withdrawal.update({
          where: { id },
          data: { status: 'DITOLAK', rejectionReason: rejectionReason || 'Ditolak oleh admin.' }
        }),
        prisma.user.update({
          where: { id: withdrawal.userId },
          data: { balance: { increment: Number(withdrawal.amount) } }
        })
      ]);

      broadcastEvent({
        type: 'WITHDRAWAL_STATUS_CHANGED',
        title: 'Penarikan Dana Ditolak ⚠️',
        message: `Penarikan Rp ${Number(withdrawal.amount).toLocaleString('id-ID')} ditolak (${rejectionReason || 'Alasan administratif'}). Saldo dikembalikan ke dompet.`,
        roleTarget: 'TALENT',
        data: { withdrawalId: id, status: 'DITOLAK' }
      });

      return res.status(200).json({
        success: true,
        message: 'Permohonan penarikan ditolak dan saldo telah dikembalikan ke dompet talenta.'
      });
    }

    const updated = await prisma.withdrawal.update({
      where: { id },
      data: { status, rejectionReason }
    });

    broadcastEvent({
      type: 'WITHDRAWAL_STATUS_CHANGED',
      title: 'Pencairan Dana Berhasil! 💸',
      message: `Penarikan Rp ${Number(withdrawal.amount).toLocaleString('id-ID')} ke ${withdrawal.bankName} (${withdrawal.accountNum}) telah disetujui & ditransfer!`,
      roleTarget: 'TALENT',
      data: { withdrawalId: id, status: 'SELESAI' }
    });

    return res.status(200).json({
      success: true,
      message: `Status penarikan diperbarui menjadi '${status}'.`,
      data: { withdrawal: updated }
    });
  } catch (error) {
    next(error);
  }
}
