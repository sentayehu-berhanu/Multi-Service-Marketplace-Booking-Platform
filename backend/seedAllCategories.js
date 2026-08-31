const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
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

  for (const cat of categoriesList) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: { name: cat.name }
      });
      console.log(`Updated category: ${cat.name}`);
    } else {
      await prisma.category.create({ data: cat });
      console.log(`Created category: ${cat.name}`);
    }
  }
  console.log("All requested categories seeded successfully.");
}

seedCategories().catch(e => console.error(e)).finally(() => prisma.$disconnect());
