import { Router } from 'express';
import {
  listPortfolios,
  addPortfolio,
  updatePortfolio,
  deletePortfolio,
  portfolioSchema
} from '../controllers/portfolio.controller';
import { validate } from '../middlewares/validate.middleware';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', listPortfolios);
router.post('/', authenticate, authorizeRoles(Role.TALENT, Role.ADMIN), validate(portfolioSchema), addPortfolio);
router.put('/:id', authenticate, authorizeRoles(Role.TALENT, Role.ADMIN), validate(portfolioSchema), updatePortfolio);
router.delete('/:id', authenticate, authorizeRoles(Role.TALENT, Role.ADMIN), deletePortfolio);

export default router;
