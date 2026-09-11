const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prods = await prisma.product.findMany();
  console.log(JSON.stringify(prods, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
