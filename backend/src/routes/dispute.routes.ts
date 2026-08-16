import { Router } from 'express';
import {
  raiseDispute,
  listDisputes,
  getDisputeById,
  resolveDispute,
  raiseDisputeSchema,
  resolveDisputeSchema
} from '../controllers/dispute.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/:bountyId/dispute', authenticate, validate(raiseDisputeSchema), raiseDispute);
router.get('/', listDisputes);
router.get('/:id', getDisputeById);
router.post('/:id/resolve', authenticate, authorizeRoles(Role.ADMIN), validate(resolveDisputeSchema), resolveDispute);

export default router;
