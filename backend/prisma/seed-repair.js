const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('repair123', 10);
  
  const owner = await prisma.user.upsert({
    where: { email: 'repair@example.com' },
    update: {},
    create: {
      name: 'Bob Fixit',
      email: 'repair@example.com',
      password_hash: password,
      role: 'BUSINESS_OWNER',
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: 'home-repair' },
    update: {},
    create: {
      name: 'Home Repair',
      slug: 'home-repair'
    }
  });

  const existingBiz = await prisma.business.findFirst({ where: { owner_id: owner.id } });
  if (!existingBiz) {
    await prisma.business.create({
      data: {
        name: 'Bob\'s Quick Repairs',
        owner_id: owner.id,
        category_id: category.id,
        status: 'ACTIVE',
        services: {
          create: [
            { name: 'Plumbing Diagnosis', duration: 30, price: 50 },
            { name: 'Electrical Repair', duration: 60, price: 120 },
            { name: 'AC Maintenance', duration: 90, price: 200 },
          ]
        }
      }
    });
  }
  
  console.log('Home Repair Seed completed. Email: repair@example.com, Password: repair123');
}

main().finally(() => prisma.$disconnect());
