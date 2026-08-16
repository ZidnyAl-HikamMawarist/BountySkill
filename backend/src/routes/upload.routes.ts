import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, uploadFile);

export default router;
