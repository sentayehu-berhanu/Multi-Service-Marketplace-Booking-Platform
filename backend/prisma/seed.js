const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  
  const owner = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      name: 'Owner',
      email: 'owner@example.com',
      password_hash: password,
      role: 'BUSINESS_OWNER',
    }
  });

  const category = await prisma.category.upsert({
    where: { slug: 'barber' },
    update: {},
    create: {
      name: 'Barber',
      slug: 'barber'
    }
  });

  // check if business id 1 exists
  const existingBiz = await prisma.business.findUnique({ where: { id: 1 } });
  if (!existingBiz) {
    await prisma.business.create({
      data: {
        id: 1,
        name: 'Elite Barber',
        owner_id: owner.id,
        category_id: category.id,
        status: 'ACTIVE',
        services: {
          create: [
            { id: 1, name: 'Haircut', duration: 30, price: 200 },
            { id: 2, name: 'Beard Trim', duration: 15, price: 100 },
            { id: 3, name: 'Hair + Beard', duration: 45, price: 280 },
          ]
        }
      }
    });
  }
  
  console.log('Seed completed');
}

main().finally(() => prisma.$disconnect());
