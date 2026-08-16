import { Request, Response, NextFunction } from 'express';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'application/pdf'
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { filename, fileType, base64Data, fallbackUrl } = req.body;

    if (fallbackUrl) {
      return res.status(200).json({
        success: true,
        data: {
          url: fallbackUrl,
          filename: filename || 'uploaded_image.png',
          uploadedAt: new Date().toISOString()
        }
      });
    }

    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'Data file base64 atau fallbackUrl wajib disertakan.'
      });
    }

    // MIME type validation
    const mime = fileType || 'image/png';
    if (!ALLOWED_MIME_TYPES.includes(mime.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Tipe file '${mime}' tidak diizinkan. Tipe yang didukung: PNG, JPEG, WEBP, SVG, PDF.`
      });
    }

    // File payload size validation
    const estimatedSizeBytes = (base64Data.length * 3) / 4;
    if (estimatedSizeBytes > MAX_FILE_SIZE_BYTES) {
      return res.status(400).json({
        success: false,
        message: 'Ukuran file melebihi batas maksimal 5 MB.'
      });
    }

    const hostedUrl = base64Data.startsWith('data:')
      ? base64Data
      : `data:${mime};base64,${base64Data}`;

    return res.status(201).json({
      success: true,
      message: 'File berhasil diunggah.',
      data: {
        url: hostedUrl,
        filename: filename || 'file_' + Date.now(),
        fileType: mime,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
}
