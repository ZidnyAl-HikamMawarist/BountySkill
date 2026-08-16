import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';
import { generateToken } from '../lib/jwt';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Nama minimal 2 karakter').trim(),
    email: z.string().email('Format email tidak valid').toLowerCase().trim(),
    password: z.string().min(6, 'Kata sandi minimal 6 karakter'),
    role: z.enum(['TALENT', 'CLIENT', 'ADMIN']).default('TALENT')
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Format email tidak valid').toLowerCase().trim(),
    password: z.string().min(1, 'Kata sandi wajib diisi')
  })
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Alamat email sudah terdaftar.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role as Role,
        balance: role === 'TALENT' ? 0 : 5000000,
        reputationScore: 5.0
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        balance: true,
        reputationScore: true,
        completedBountiesCount: true,
        createdAt: true
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi akun berhasil.',
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak cocok.' });
    }

    if (user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ success: false, message: 'Email atau kata sandi tidak cocok.' });
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatarUrl: user.avatarUrl,
      balance: user.balance,
      reputationScore: user.reputationScore,
      completedBountiesCount: user.completedBountiesCount,
      bio: user.bio,
      githubUsername: user.githubUsername,
      createdAt: user.createdAt
    };

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: { user: safeUser, token }
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Tidak terautentikasi.' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        balance: true,
        reputationScore: true,
        completedBountiesCount: true,
        bio: true,
        githubUsername: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan.' });
    }

    return res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        balance: true,
        reputationScore: true,
        completedBountiesCount: true,
        bio: true,
        githubUsername: true
      },
      orderBy: { createdAt: 'asc' }
    });

    return res.status(200).json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
}
