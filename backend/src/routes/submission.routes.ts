import { Router } from 'express';
import {
  submitWork,
  approveSubmission,
  requestRevision,
  submitWorkSchema,
  requestRevisionSchema
} from '../controllers/submission.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/:bountyId/submit', authenticate, authorizeRoles(Role.TALENT), validate(submitWorkSchema), submitWork);
router.post('/:bountyId/submissions/:submissionId/approve', authenticate, authorizeRoles(Role.CLIENT, Role.ADMIN), approveSubmission);
router.post('/:bountyId/submissions/:submissionId/revision', authenticate, authorizeRoles(Role.CLIENT, Role.ADMIN), validate(requestRevisionSchema), requestRevision);

export default router;
