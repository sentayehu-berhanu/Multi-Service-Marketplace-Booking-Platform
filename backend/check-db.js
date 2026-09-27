const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const services = await prisma.service.count();
  const products = await prisma.product.count();
  const businesses = await prisma.business.count();
  console.log(`Businesses: ${businesses}, Services: ${services}, Products: ${products}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
