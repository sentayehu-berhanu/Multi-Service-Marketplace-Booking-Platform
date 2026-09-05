const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Gym...');
  
  // 1. Ensure Gym category exists
  let category = await prisma.category.findFirst({ where: { slug: 'gym' } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Gym', slug: 'gym' }
    });
  }

  // 2. Find an owner user (just grab the first one, or admin)
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log('No users found to own the gym.');
    return;
  }

  // 3. Create Power Gym
  let gym = await prisma.business.findFirst({ where: { name: 'Power Gym' } });
  if (!gym) {
    gym = await prisma.business.create({
      data: {
        name: 'Power Gym',
        description: 'Premium fitness center',
        phone: '0911000000',
        email: 'powergym@example.com',
        address: 'Bole, Addis Ababa',
        category_id: category.id,
        owner_id: user.id,
        status: 'LIVE'
      }
    });
  }

  // 4. Create Services (Memberships and Classes)
  const servicesToCreate = [
    { name: 'Basic Plan', duration: '1 Month', price: 1000 },
    { name: 'Standard Plan', duration: '3 Months', price: 2500 },
    { name: 'Premium Plan', duration: '6 Months', price: 4000 },
    { name: 'VIP Plan', duration: '12 Months', price: 7000 },
    { name: 'Yoga & Core', duration: '1 Class', price: 150 },
    { name: 'HIIT Extreme', duration: '1 Class', price: 150 },
    { name: 'Zumba Dance', duration: '1 Class', price: 150 },
    { name: 'PT: Alex Johnson', duration: '1 Session (60 min)', price: 500 },
    { name: 'PT: Maria Garcia', duration: '1 Session (60 min)', price: 500 },
  ];

  for (const s of servicesToCreate) {
    const existing = await prisma.service.findFirst({
      where: { business_id: gym.id, name: s.name }
    });
    if (!existing) {
      await prisma.service.create({
        data: {
          business_id: gym.id,
          name: s.name,
          description: s.duration,
          price: s.price,
          duration: 60, // Arbitrary for gym plans
        }
      });
    }
  }

  console.log('Gym seeded successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
