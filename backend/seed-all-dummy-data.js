const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categoriesList = [
    { name: '💈 Barber', slug: 'barber', description: 'Haircuts and styling for men', status: 'ACTIVE' },
    { name: '💇‍♀️ Women\'s Salon', slug: 'womens-salon', description: 'Hair, nails, and beauty services', status: 'ACTIVE' },
    { name: '💄 Cosmetics', slug: 'cosmetics', description: 'Makeup and beauty products', status: 'ACTIVE' },
    { name: '🅿️ Parking', slug: 'parking', description: 'Secure parking spaces', status: 'ACTIVE' },
    { name: '💊 Pharmacy', slug: 'pharmacy', description: 'Medicines and health supplies', status: 'ACTIVE' },
    { name: '☕ Café', slug: 'cafe', description: 'Coffee and snacks', status: 'ACTIVE' },
    { name: '🍽️ Restaurant', slug: 'restaurant', description: 'Dining and food services', status: 'ACTIVE' },
    { name: '💆 Spa', slug: 'spa', description: 'Relaxation and wellness', status: 'ACTIVE' },
    { name: '🚗 Car Wash', slug: 'car-wash', description: 'Car cleaning and detailing', status: 'ACTIVE' },
    { name: '🏋️ Gym', slug: 'gym', description: 'Fitness and workout', status: 'ACTIVE' },
    { name: '🧹 Cleaning', slug: 'cleaning', description: 'Home and office cleaning', status: 'ACTIVE' },
    { name: '🔧 Home Repair', slug: 'home-repair', description: 'Plumbing, electrical, and repairs', status: 'ACTIVE' },
    { name: '🏨 Hotel', slug: 'hotel', description: 'Accommodation and lodging', status: 'ACTIVE' },
    { name: '🩺 Healthcare', slug: 'healthcare', description: 'Medical and health services', status: 'ACTIVE' },
    { name: '🎓 Tutors', slug: 'tutors', description: 'Education and learning', status: 'ACTIVE' },
    { name: '🚕 Transportation', slug: 'transportation', description: 'Taxi and ride services', status: 'ACTIVE' },
    { name: '📦 Local Delivery', slug: 'local-delivery', description: 'Package and courier services', status: 'ACTIVE' },
    { name: '🎟️ Events/Tickets', slug: 'events-tickets', description: 'Event booking and tickets', status: 'ACTIVE' },
];

async function main() {
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  for (const cat of categoriesList) {
    let category = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!category) {
      category = await prisma.category.create({ data: cat });
      console.log(`Created category: ${cat.name}`);
    } else {
        // Ensure name is up to date with emoji
        await prisma.category.update({
            where: { id: category.id },
            data: { name: cat.name }
        });
    }

    // 3 businesses per category
    for (let i = 1; i <= 3; i++) {
      const email = `owner_${cat.slug}_${i}@example.com`;
      
      let user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: `Owner ${i} of ${cat.name}`,
            email,
            password_hash: hashedPassword,
            role: 'BUSINESS_OWNER'
          }
        });
      }

      const cleanCatName = cat.name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
      const businessName = `${cleanCatName} Business ${i}`;
      let business = await prisma.business.findFirst({ where: { name: businessName, owner_id: user.id } });
      if (!business) {
        business = await prisma.business.create({
          data: {
            name: businessName,
            description: `A great ${cat.name} service provider`,
            phone: `123456789${i}`,
            email: `contact@${cat.slug}${i}.com`,
            address: `10${i} Main St, City`,
            category_id: category.id,
            owner_id: user.id,
            status: 'LIVE'
          }
        });
      }

      // 3 services per business
      for (let j = 1; j <= 3; j++) {
        const serviceName = `${cleanCatName} Service ${j} for ${businessName}`;
        const existingService = await prisma.service.findFirst({
          where: { business_id: business.id, name: serviceName }
        });
        if (!existingService) {
          await prisma.service.create({
            data: {
              business_id: business.id,
              name: serviceName,
              description: `Description for ${serviceName}`,
              price: 10 * j + 20,
              duration: 30 * j
            }
          });
        }
      }
    }
    console.log(`Seeded 3 owners, businesses, and 3 services each for ${cat.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
