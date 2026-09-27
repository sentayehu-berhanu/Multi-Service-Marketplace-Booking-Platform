const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Remove "Kids Haircut" from all businesses (Barber category)
    const deleted = await prisma.service.deleteMany({
      where: { name: 'Kids Haircut' }
    });
    console.log(`Deleted ${deleted.count} "Kids Haircut" services.`);

    // 2. Add 3 new different services to 3 different business owners
    // Find one Salon business
    const salonBiz = await prisma.business.findFirst({
      where: { category: { slug: 'womens-salon' } }
    });
    if (salonBiz) {
      await prisma.service.create({
        data: {
          business_id: salonBiz.id,
          name: 'Keratin Hair Treatment',
          description: 'Premium smoothing keratin treatment.',
          price: 2500,
          duration: 180,
          image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80',
          status: 'ACTIVE'
        }
      });
      console.log(`Added "Keratin Hair Treatment" to Salon: ${salonBiz.name}`);
    }

    // Find one Cafe business
    const cafeBiz = await prisma.business.findFirst({
      where: { category: { slug: 'cafe' } }
    });
    if (cafeBiz) {
      await prisma.service.create({
        data: {
          business_id: cafeBiz.id,
          name: 'Caramel Frappuccino',
          description: 'Ice blended caramel coffee.',
          price: 180,
          duration: 10,
          image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=400&q=80',
          status: 'ACTIVE'
        }
      });
      console.log(`Added "Caramel Frappuccino" to Cafe: ${cafeBiz.name}`);
    }

    // Find one Gym business
    const gymBiz = await prisma.business.findFirst({
      where: { category: { slug: 'gym' } }
    });
    if (gymBiz) {
      await prisma.service.create({
        data: {
          business_id: gymBiz.id,
          name: 'CrossFit Group Session',
          description: 'High intensity interval training.',
          price: 400,
          duration: 60,
          image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
          status: 'ACTIVE'
        }
      });
      console.log(`Added "CrossFit Group Session" to Gym: ${gymBiz.name}`);
    }

    console.log('Done!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
