import { Router } from 'express';
import { listBounties, getBountyById, createBounty, createBountySchema } from '../controllers/bounty.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', listBounties);
router.get('/:id', getBountyById);
router.post('/', authenticate, authorizeRoles(Role.CLIENT, Role.ADMIN), validate(createBountySchema), createBounty);

export default router;
