const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCategories() {
  const defaultCategories = [
    { name: 'Barber', slug: 'barber', description: 'Haircuts and styling for men', status: 'ACTIVE' },
    { name: 'Women\'s Salon', slug: 'womens-salon', description: 'Hair, nails, and beauty services', status: 'ACTIVE' },
    { name: 'Cosmetics', slug: 'cosmetics', description: 'Makeup and beauty products', status: 'ACTIVE' },
    { name: 'Parking', slug: 'parking', description: 'Secure parking spaces', status: 'ACTIVE' },
    { name: 'Pharmacy', slug: 'pharmacy', description: 'Medicines and health supplies', status: 'ACTIVE' },
    { name: 'Café', slug: 'cafe', description: 'Coffee and snacks', status: 'ACTIVE' },
    { name: 'Restaurant', slug: 'restaurant', description: 'Dining and food services', status: 'ACTIVE' }
  ];

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`Created category: ${cat.name}`);
    }
  }
  console.log("Categories checked/seeded successfully.");
}

checkCategories().catch(e => console.error(e)).finally(() => prisma.$disconnect());
