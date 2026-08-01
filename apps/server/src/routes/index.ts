import { Router } from 'express';

import healthRouter from './health.route';
import authRouter from './auth.route';

const router = Router();

/**
 * API v1 route registry.
 */

// Infrastructure & Auth
router.use('/health', healthRouter);
router.use('/auth', authRouter);

export default router;
