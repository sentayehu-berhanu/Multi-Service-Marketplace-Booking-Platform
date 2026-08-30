const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.notification.create({
    data: {
      user_id: 1, // Assuming the owner is user 1
      title: 'Welcome to your Dashboard!',
      message: 'You have successfully set up your business profile.',
      type: 'SYSTEM'
    }
  });
  console.log('Test notification created!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
