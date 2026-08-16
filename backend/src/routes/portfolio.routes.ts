import { Router } from 'express';
import {
  listPortfolios,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  portfolioSchema
} from '../controllers/portfolio.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listPortfolios);
router.post('/', authenticate, validate(portfolioSchema), addPortfolio);
router.put('/:id', authenticate, validate(portfolioSchema), updatePortfolio);
router.delete('/:id', authenticate, deletePortfolio);

export default router;
