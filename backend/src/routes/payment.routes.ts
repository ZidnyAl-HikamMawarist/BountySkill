import { Router } from 'express';
import { handlePaymentWebhook } from '../controllers/payment.controller';

const router = Router();

router.post('/webhook', handlePaymentWebhook);

export default router;
