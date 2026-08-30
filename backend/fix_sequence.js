const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Reset sequence for Service
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"Service"', 'id'),
        coalesce(max(id), 0) + 1,
        false
      ) FROM "Service";
    `);
    
    // Also reset sequence for Business since it was seeded with id: 1
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"Business"', 'id'),
        coalesce(max(id), 0) + 1,
        false
      ) FROM "Business";
    `);

    console.log('Sequences reset successfully.');
  } catch (error) {
    console.error('Error resetting sequences:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
