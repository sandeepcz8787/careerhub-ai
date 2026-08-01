import { Router } from 'express';

import healthRouter from './health.route';

const router = Router();

/**
 * API v1 route registry.
 * All feature routes are mounted here as the platform grows.
 */

// Infrastructure
router.use('/health', healthRouter);

// Future feature routes (uncomment as modules are built):
// router.use('/auth', authRouter);
// router.use('/users', usersRouter);
// router.use('/resumes', resumeRouter);
// router.use('/jobs', jobsRouter);
// router.use('/community', communityRouter);
// router.use('/referrals', referralsRouter);
// router.use('/companies', companiesRouter);

export default router;
