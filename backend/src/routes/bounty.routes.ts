import { Router } from 'express';
import { listBounties, getBountyById, createBounty, createBountySchema } from '../controllers/bounty.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listBounties);
router.get('/:id', getBountyById);
router.post('/', authenticate, validate(createBountySchema), createBounty);

export default router;
