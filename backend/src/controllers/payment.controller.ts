import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { broadcastEvent } from '../lib/websocket';
import { BountyStatus, EscrowStatus } from '@prisma/client';

export async function handlePaymentWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      order_id,
      transaction_status,
      fraud_status,
      gross_amount,
      payment_type,
      signature_key,
      bountyId: explicitBountyId
    } = req.body;

    console.log(`💳 [PAYMENT WEBHOOK] Order: ${order_id}, Status: ${transaction_status}, Method: ${payment_type}`);

    // Robust ID Resolution: Try explicit bountyId, direct order_id, or stripped prefix order- / bounty-
    let targetBounty = null;
    const candidates = [
      explicitBountyId,
      order_id,
      order_id?.startsWith('order-') ? order_id.replace('order-', '') : null,
      order_id?.startsWith('bounty-') ? order_id : null
    ].filter(Boolean);

    for (const candidate of candidates) {
      targetBounty = await prisma.bounty.findUnique({
        where: { id: candidate },
        include: { escrow: true, client: true }
      });
      if (targetBounty) break;
    }

    if (!targetBounty) {
      return res.status(404).json({
        success: false,
        message: `Bounty tidak ditemukan untuk order_id: ${order_id || explicitBountyId}`
      });
    }

    const bountyId = targetBounty.id;

    if (transaction_status === 'settlement' || transaction_status === 'capture') {
      if (targetBounty.escrow) {
        await prisma.escrow.update({
          where: { id: targetBounty.escrow.id },
          data: {
            status: EscrowStatus.HOLD,
            paymentGatewayRef: order_id || `PAY-${Date.now()}`,
            paymentMethod: payment_type?.toUpperCase() || 'QRIS'
          }
        });
      }

      await prisma.bounty.update({
        where: { id: bountyId },
        data: { status: BountyStatus.OPEN }
      });

      broadcastEvent({
        type: 'BOUNTY_CREATED',
        title: 'Bounty Baru Dibuka! 🎯',
        message: `Setoran Escrow Rp ${Number(targetBounty.budget).toLocaleString('id-ID')} terverifikasi. Bounty "${targetBounty.title}" siap dikerjakan!`,
        roleTarget: 'ALL',
        bountyId: targetBounty.id,
        data: { bountyTitle: targetBounty.title, budget: Number(targetBounty.budget) }
      });
    } else if (transaction_status === 'cancel' || transaction_status === 'expire') {
      if (targetBounty.escrow) {
        await prisma.escrow.update({
          where: { id: targetBounty.escrow.id },
          data: { status: EscrowStatus.REFUNDED }
        });
      }
      await prisma.bounty.update({
        where: { id: bountyId },
        data: { status: BountyStatus.CANCELLED }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notifikasi pembayaran berhasil diproses.',
      data: { bountyId, status: targetBounty.status }
    });
  } catch (error) {
    next(error);
  }
}
