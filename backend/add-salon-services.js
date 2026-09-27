const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Find up to 3 Women's Salon businesses
    const salons = await prisma.business.findMany({
      where: { category: { slug: 'womens-salon' } },
      take: 3
    });

    for (let i = 0; i < salons.length; i++) {
      const salon = salons[i];
      
      const newService = await prisma.service.create({
        data: {
          business_id: salon.id,
          name: `Signature Women's Salon Service ${i + 1}`,
          description: 'A luxurious and real women\'s salon service added by the system.',
          price: 1500 + (i * 100),
          duration: 90,
          image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=400&q=80',
          status: 'ACTIVE'
        }
      });
      console.log(`Added "${newService.name}" to Salon: ${salon.name}`);
    }

    console.log('Done adding real women\'s salon services to 3 different business owners!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
