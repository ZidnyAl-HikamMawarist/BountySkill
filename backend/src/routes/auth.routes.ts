import { Router } from 'express';
import { register, login, getMe, listUsers, registerSchema, loginSchema } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.get('/me', authenticate, getMe);
router.get('/users', listUsers);

export default router;
