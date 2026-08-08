import 'dotenv/config';
import { connectDatabase } from '../config/db.config';
import { runAuthTestSuite } from './auth.test';
import { runResumeTestSuite } from './resume.test';
import mongoose from 'mongoose';
import { logger } from '../utils/logger.util';

async function runTests() {
  logger.info('🚀 Starting CareerHub AI Server Tests...');
  
  try {
    // Connect to database
    await connectDatabase();
    
    // Run Auth Tests
    await runAuthTestSuite();
    
    // Run Resume Tests
    await runResumeTestSuite();
    
    logger.info('✅ All test suites completed successfully.');
  } catch (error) {
    logger.error('❌ Tests execution failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    logger.info('💤 Database connection closed.');
    process.exit(0);
  }
}

runTests();
