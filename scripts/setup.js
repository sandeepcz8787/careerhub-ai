/**
 * CareerHub AI — Developer Setup Script
 * Run with: node scripts/setup.js
 */

import { execSync } from 'child_process';
import { existsSync, copyFileSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();

function run(cmd) {
  console.log(`\n$ ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function copyEnvIfMissing(source, dest) {
  if (!existsSync(dest)) {
    copyFileSync(source, dest);
    console.log(`✅ Created ${dest}`);
  } else {
    console.log(`⚡ ${dest} already exists — skipping`);
  }
}

console.log('\n🚀 CareerHub AI — Setup\n');
console.log('='.repeat(50));

// 1. Copy env files
console.log('\n📋 Setting up environment files...');
copyEnvIfMissing(
  join(ROOT, 'apps/server/.env.example'),
  join(ROOT, 'apps/server/.env'),
);
copyEnvIfMissing(
  join(ROOT, 'apps/web/.env.example'),
  join(ROOT, 'apps/web/.env.local'),
);

console.log('\n✅ Setup complete!');
console.log('\nNext steps:');
console.log('  1. Fill in apps/server/.env with your MongoDB URI, JWT secrets, etc.');
console.log('  2. Fill in apps/web/.env.local with your API URL');
console.log('  3. Run: npm run dev');
console.log('\nDocs: docs/ENVIRONMENT.md\n');
