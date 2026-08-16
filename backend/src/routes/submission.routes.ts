import { Router } from 'express';
import {
  submitWork,
  approveSubmission,
  requestRevision,
  submitWorkSchema,
  requestRevisionSchema
} from '../controllers/submission.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:bountyId/submit', authenticate, validate(submitWorkSchema), submitWork);
router.post('/:bountyId/submissions/:submissionId/approve', authenticate, approveSubmission);
router.post('/:bountyId/submissions/:submissionId/revision', authenticate, validate(requestRevisionSchema), requestRevision);

export default router;
