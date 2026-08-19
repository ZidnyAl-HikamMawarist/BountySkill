import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { z } from 'zod';

export const portfolioSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Judul portofolio minimal 3 karakter'),
    description: z.string().min(10, 'Deskripsi minimal 10 karakter'),
    demoUrl: z.string().url('Format Live Demo URL tidak valid'),
    repoUrl: z.string().url('Format Repository URL tidak valid').optional().or(z.literal('')),
    techTags: z.array(z.string()).default([])
  })
});

export async function listPortfolios(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.query;

    const where: any = {};
    if (userId) where.userId = String(userId);

    const portfolios = await prisma.portfolioItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
            reputationScore: true
          }
        }
      }
    });

    const formatted = portfolios.map(p => ({
      id: p.id,
      userId: p.userId,
      title: p.title,
      description: p.description,
      demoUrl: p.demoUrl,
      repoUrl: p.repoUrl,
      techTags: p.techTags,
      lastCheckedAt: p.lastCheckedAt,
      status: p.status,
      createdAt: p.createdAt.toISOString()
    }));

    return res.status(200).json({
      success: true,
      data: { portfolios: formatted }
    });
  } catch (error) {
    next(error);
  }
}

export async function addPortfolio(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { title, description, demoUrl, repoUrl, techTags } = req.body;

    if (!req.user?.userId) {
      return res.status(401).json({ success: false, message: 'Autentikasi akun diperlukan untuk menambahkan portofolio.' });
    }

    const userId = req.user.userId;

    const item = await prisma.portfolioItem.create({
      data: {
        userId,
        title,
        description,
        demoUrl,
        repoUrl: repoUrl || null,
        techTags,
        lastCheckedAt: '200 OK Live',
        status: 'LIVE'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Portofolio berhasil ditambahkan.',
      data: { portfolio: item }
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePortfolio(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { title, description, demoUrl, repoUrl, techTags } = req.body;

    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan.' });
    }

    // IDOR Check
    if (req.user && req.user.role !== 'ADMIN' && existing.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak untuk mengubah portofolio ini.' });
    }

    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title,
        description,
        demoUrl,
        repoUrl: repoUrl || null,
        techTags
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Portofolio berhasil diperbarui.',
      data: { portfolio: item }
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePortfolio(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existing = await prisma.portfolioItem.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Portofolio tidak ditemukan.' });
    }

    // IDOR Check
    if (req.user && req.user.role !== 'ADMIN' && existing.userId !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Anda tidak memiliki hak untuk menghapus portofolio ini.' });
    }

    await prisma.portfolioItem.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Portofolio berhasil dihapus.'
    });
  } catch (error) {
    next(error);
  }
}
