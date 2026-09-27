const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Find up to 3 Pharmacy businesses
    const pharmacies = await prisma.business.findMany({
      where: { category: { slug: 'pharmacy' } },
      take: 3
    });

    for (let i = 0; i < pharmacies.length; i++) {
      const pharmacy = pharmacies[i];
      
      const newService = await prisma.service.create({
        data: {
          business_id: pharmacy.id,
          name: `Clinical Pharmacy Consultation ${i + 1}`,
          description: 'A real clinical pharmacy service added by the system for expert medical advice.',
          price: 250 + (i * 50),
          duration: 30,
          image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80',
          status: 'ACTIVE'
        }
      });
      console.log(`Added "${newService.name}" to Pharmacy: ${pharmacy.name}`);
    }

    console.log('Done adding real pharmacy services to 3 different business owners!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
