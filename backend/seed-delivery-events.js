const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  try {
    const password_hash = await bcrypt.hash('password123', 10);

    // Delivery Owner
    const deliveryUser = await prisma.user.upsert({
      where: { email: 'delivery_owner@example.com' },
      update: {},
      create: {
        name: 'Delivery Owner',
        email: 'delivery_owner@example.com',
        password_hash,
        role: 'BUSINESS_OWNER',
        phone: '0911223344',
      },
    });

    const deliveryCategory = await prisma.category.findUnique({ where: { slug: 'local-delivery' } });
    if (deliveryCategory) {
      await prisma.business.create({
        data: {
          owner_id: deliveryUser.id,
          category_id: deliveryCategory.id,
          name: 'Fast Track Delivery',
          description: 'Local express delivery service.',
          address: 'Bole, Addis Ababa',
          phone: '0911223344',
          email: 'contact@fasttrack.com',
          status: 'APPROVED',
          rating: 4.8,
          review_count: 120,
          cover_image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=800',
        }
      });
      console.log('Delivery business created for owner: delivery_owner@example.com (password123)');
    }

    // Events Owner
    const eventsUser = await prisma.user.upsert({
      where: { email: 'events_owner@example.com' },
      update: {},
      create: {
        name: 'Events Organizer',
        email: 'events_owner@example.com',
        password_hash,
        role: 'BUSINESS_OWNER',
        phone: '0911223355',
      },
    });

    const eventsCategory = await prisma.category.findUnique({ where: { slug: 'events-tickets' } });
    if (eventsCategory) {
      await prisma.business.create({
        data: {
          owner_id: eventsUser.id,
          category_id: eventsCategory.id,
          name: 'Premium Events',
          description: 'Top event organizer in the city.',
          address: 'Kazanchis, Addis Ababa',
          phone: '0911223355',
          email: 'contact@premiumevents.com',
          status: 'APPROVED',
          rating: 4.9,
          review_count: 350,
          cover_image: 'https://images.unsplash.com/photo-1540039155732-6761b54cb1bd?auto=format&fit=crop&w=800',
        }
      });
      console.log('Events business created for owner: events_owner@example.com (password123)');
    }

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
