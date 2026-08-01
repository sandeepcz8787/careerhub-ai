import { Router } from 'express';
import os from 'os';
import mongoose from 'mongoose';

import { asyncHandler } from '../utils/asyncHandler.util';
import { sendSuccess } from '../utils/response.util';
import { env } from '../config/env.config';

const router = Router();

/**
 * GET /api/v1/health
 * Health check endpoint for load balancers, deployment health checks, and monitoring.
 */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';

    const healthData = {
      status: 'healthy',
      environment: env.NODE_ENV,
      version: process.env['npm_package_version'] ?? '1.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: {
          status: dbStatus,
          latencyMs: await measureDbLatency(),
        },
      },
      system: {
        nodeVersion: process.version,
        platform: os.platform(),
        freeMemoryMB: Math.round(os.freemem() / 1024 / 1024),
        totalMemoryMB: Math.round(os.totalmem() / 1024 / 1024),
        cpuCount: os.cpus().length,
      },
    };

    sendSuccess(res, healthData, 'Service is healthy');
  }),
);

async function measureDbLatency(): Promise<number | null> {
  try {
    const start = Date.now();
    await mongoose.connection.db?.admin().ping();
    return Date.now() - start;
  } catch {
    return null;
  }
}

export default router;
