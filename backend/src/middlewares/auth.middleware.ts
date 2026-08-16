import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../lib/jwt';
import { Role } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Autentikasi diperlukan. Token tidak ditemukan.' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return res.status(401).json({ success: false, message: 'Token tidak valid atau telah kedaluwarsa.' });
  }

  req.user = payload;
  next();
}

export function authorizeRoles(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Pengguna tidak terautentikasi.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Peran '${req.user.role}' tidak memiliki izin untuk tindakan ini.`
      });
    }

    next();
  };
}
