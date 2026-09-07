const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'spaowner@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or update the Spa Owner user
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { password_hash: hashedPassword, role: 'BUSINESS_OWNER' }
    });
    console.log('Updated existing spa owner user.');
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Relax Spa Owner',
        email,
        password_hash: hashedPassword,
        role: 'BUSINESS_OWNER'
      }
    });
    console.log('Created new spa owner user.');
  }

  // 2. Ensure Spa category exists
  let category = await prisma.category.findFirst({ where: { slug: 'spa' } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Spa', slug: 'spa' }
    });
    console.log('Created Spa category.');
  }

  // 3. Create Relax Spa Business
  let spa = await prisma.business.findFirst({ where: { name: 'Relax Spa' } });
  if (spa) {
    await prisma.business.update({
      where: { id: spa.id },
      data: { owner_id: user.id }
    });
    console.log('Assigned existing Relax Spa to spaowner@example.com');
  } else {
    spa = await prisma.business.create({
      data: {
        name: 'Relax Spa',
        description: 'Rejuvenate your body and soul with our signature treatments.',
        phone: '0911223344',
        email: 'hello@relaxspa.com',
        address: 'Bole, Addis Ababa',
        category_id: category.id,
        owner_id: user.id,
        status: 'LIVE'
      }
    });
    console.log('Created new Relax Spa business and assigned to spaowner@example.com');
  }

  console.log(`\n=============================`);
  console.log(`Credentials for Spa Owner:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`=============================\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
