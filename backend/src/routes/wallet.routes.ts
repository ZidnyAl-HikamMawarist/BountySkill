import { Router } from 'express';
import {
  requestWithdrawal,
  listMyWithdrawals,
  listAllWithdrawals,
  updateWithdrawalStatus,
  withdrawalSchema
} from '../controllers/wallet.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/', authenticate, validate(withdrawalSchema), requestWithdrawal);
router.get('/my', authenticate, listMyWithdrawals);
router.get('/admin', authenticate, authorizeRoles(Role.ADMIN), listAllWithdrawals);
router.patch('/admin/:id', authenticate, authorizeRoles(Role.ADMIN), updateWithdrawalStatus);

export default router;
