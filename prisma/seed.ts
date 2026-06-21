import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Use environment variables for emails - change these in .env before deployment
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const mariaEmail = process.env.MARIA_EMAIL || 'maria@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const mariaPassword = process.env.MARIA_PASSWORD || 'maria123';

  const hashedAdmin = await bcrypt.hash(adminPassword, 12);
  const hashedMaria = await bcrypt.hash(mariaPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Admin',
      passwordHash: hashedAdmin,
      role: 'admin',
    },
    create: {
      email: adminEmail,
      name: 'Admin',
      passwordHash: hashedAdmin,
      role: 'admin',
    },
  });

  const mariaUser = await prisma.user.upsert({
    where: { email: mariaEmail },
    update: {
      name: 'Maria',
      passwordHash: hashedMaria,
      role: 'admin',
    },
    create: {
      email: mariaEmail,
      name: 'Maria',
      passwordHash: hashedMaria,
      role: 'admin',
    },
  });

  console.log('Seeded users:', adminUser.email, mariaUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
