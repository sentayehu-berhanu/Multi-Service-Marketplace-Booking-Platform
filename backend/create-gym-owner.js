const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'gymowner@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or update the Gym Owner user
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { password_hash: hashedPassword, role: 'BUSINESS_OWNER' }
    });
    console.log('Updated existing gym owner user.');
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Gym Owner',
        email,
        password_hash: hashedPassword,
        role: 'BUSINESS_OWNER'
      }
    });
    console.log('Created new gym owner user.');
  }

  // 2. Assign Power Gym to this user
  const gym = await prisma.business.findFirst({ where: { name: 'Power Gym' } });
  if (gym) {
    await prisma.business.update({
      where: { id: gym.id },
      data: { owner_id: user.id }
    });
    console.log('Assigned Power Gym to gymowner@example.com');
  } else {
    console.log('Power Gym not found! Did you run the seed script?');
  }

  console.log(`\nCredentials:\nEmail: ${email}\nPassword: ${password}\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
