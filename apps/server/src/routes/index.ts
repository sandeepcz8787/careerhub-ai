import { Router } from 'express';

import healthRouter from './health.route';
import authRouter from './auth.route';
import profileRouter from './profile.route';
import resumeRouter from './resume.route';

const router = Router();

/**
 * API v1 route registry.
 */

// Infrastructure & Auth
router.use('/health', healthRouter);
router.use('/auth', authRouter);

// Core Modules
router.use('/profiles', profileRouter);
router.use('/resumes', resumeRouter);

export default router;
