import { Router } from 'express';
import { addReview, listTalentReviews, reviewSchema } from '../controllers/review.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:bountyId/reviews', authenticate, validate(reviewSchema), addReview);
router.get('/talents/:talentId', listTalentReviews);

export default router;
