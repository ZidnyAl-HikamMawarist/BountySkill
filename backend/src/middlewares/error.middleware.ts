import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('💥 Server Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validasi data gagal.',
      errors: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Terjadi kesalahan internal pada server.';

  res.status(statusCode).json({
    success: false,
    message
  });
}
