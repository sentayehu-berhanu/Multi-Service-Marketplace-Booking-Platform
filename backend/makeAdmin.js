const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users found. Please register a user first.");
    return;
  }
  
  // Just make the first user an ADMIN for demonstration, or prompt?
  // Let's just make the user with ID 1 an admin.
  const user = await prisma.user.update({
    where: { id: users[0].id },
    data: { role: 'ADMIN' }
  });
  
  console.log(`User ${user.email} is now an ADMIN.`);
}

makeAdmin().catch(e => console.error(e)).finally(() => prisma.$disconnect());
