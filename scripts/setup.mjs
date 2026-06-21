#!/usr/bin/env node

/**
 * One-time setup script for Maria's Portfolio.
 * Generates secure secrets, creates .env, seeds DB.
 */

import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const envPath = resolve(root, '.env');
const examplePath = resolve(root, '.env.example');

function generateSecret() {
  return randomBytes(32).toString('base64');
}

function main() {
  console.log('\n🔧 Setting up Maria\'s Portfolio...\n');

  // 1. Read .env.example
  if (!existsSync(examplePath)) {
    console.error('❌ .env.example not found. Are you in the project root?');
    process.exit(1);
  }

  let envContent = readFileSync(examplePath, 'utf-8');

  // 2. Generate secrets
  const nextauthSecret = generateSecret();
  const revalidationSecret = generateSecret();

  envContent = envContent.replace(
    /NEXTAUTH_SECRET=".*"/,
    `NEXTAUTH_SECRET="${nextauthSecret}"`,
  );
  envContent = envContent.replace(
    /REVALIDATION_SECRET=".*"/,
    `REVALIDATION_SECRET="${revalidationSecret}"`,
  );

  // 3. Write .env (don't overwrite existing)
  if (!existsSync(envPath)) {
    writeFileSync(envPath, envContent);
    console.log('✅ Created .env file with secure secrets');
  } else {
    // Only update specific values, keep existing
    let existing = readFileSync(envPath, 'utf-8');
    if (existing.includes('NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"')) {
      existing = existing.replace(
        /NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"/,
        `NEXTAUTH_SECRET="${nextauthSecret}"`,
      );
    }
    if (existing.includes('REVALIDATION_SECRET="your-revalidation-secret"')) {
      existing = existing.replace(
        /REVALIDATION_SECRET="your-revalidation-secret"/,
        `REVALIDATION_SECRET="${revalidationSecret}"`,
      );
    }
    writeFileSync(envPath, existing);
    console.log('✅ Updated existing .env with generated secrets');
  }

  // 4. Install dependencies if needed
  if (!existsSync(resolve(root, 'node_modules'))) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { cwd: root, stdio: 'inherit' });
  }

  // 5. Generate Prisma client
  console.log('🗄️  Generating Prisma client...');
  execSync('npx prisma generate', { cwd: root, stdio: 'inherit' });

  // 6. Push database schema
  console.log('🗄️  Setting up database...');
  execSync('npx prisma db push', { cwd: root, stdio: 'inherit' });

  console.log('\n✅ Setup complete!');
  console.log('\n📝 Next steps:');
  console.log('   1. Edit .env with your Cloudinary credentials');
  console.log('   2. Set ADMIN_PASSWORD and MARIA_PASSWORD in .env');
  console.log('   3. Run: npm run seed');
  console.log('   4. Run: npm run dev\n');
}

main();
