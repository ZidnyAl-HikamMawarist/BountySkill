import { Router } from 'express';
import authRoutes from './auth.routes';
import bountyRoutes from './bounty.routes';
import submissionRoutes from './submission.routes';
import portfolioRoutes from './portfolio.routes';
import walletRoutes from './wallet.routes';
import disputeRoutes from './dispute.routes';
import reviewRoutes from './review.routes';
import paymentRoutes from './payment.routes';
import uploadRoutes from './upload.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/bounties', bountyRoutes);
router.use('/bounties', submissionRoutes);
router.use('/portfolios', portfolioRoutes);
router.use('/withdrawals', walletRoutes);
router.use('/disputes', disputeRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payment', paymentRoutes);
router.use('/upload', uploadRoutes);

export default router;
