import { Router } from 'express';
import { addReview, listTalentReviews, reviewSchema } from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.post('/:bountyId/reviews', authenticate, authorizeRoles(Role.CLIENT, Role.ADMIN), validate(reviewSchema), addReview);
router.get('/talents/:talentId', listTalentReviews);

export default router;
