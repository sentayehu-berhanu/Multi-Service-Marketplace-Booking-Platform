const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'transport@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or update the Transportation Owner user
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { password_hash: hashedPassword, role: 'BUSINESS_OWNER' }
    });
    console.log('Updated existing transportation owner user.');
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Transport Hub Owner',
        email,
        password_hash: hashedPassword,
        role: 'BUSINESS_OWNER'
      }
    });
    console.log('Created new transportation owner user.');
  }

  // 2. Ensure Transportation category exists
  let category = await prisma.category.findFirst({ where: { slug: 'transportation' } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Transportation', slug: 'transportation' }
    });
    console.log('Created Transportation category.');
  }

  // 3. Create Transportation Business
  let transportBiz = await prisma.business.findFirst({ where: { name: 'ServiceHub Transportation' } });
  if (transportBiz) {
    await prisma.business.update({
      where: { id: transportBiz.id },
      data: { owner_id: user.id }
    });
    console.log(`Assigned existing ServiceHub Transportation to ${email}`);
  } else {
    transportBiz = await prisma.business.create({
      data: {
        name: 'ServiceHub Transportation',
        description: 'Book rides, rent vehicles, and more all in one place.',
        phone: '0911223355',
        email: 'hello@servicehubtransport.com',
        address: 'Addis Ababa',
        category_id: category.id,
        owner_id: user.id,
        status: 'LIVE'
      }
    });
    console.log(`Created new ServiceHub Transportation business and assigned to ${email}`);
  }

  // 4. Create sample vehicles (services)
  const services = [
    {
      name: "Standard Taxi",
      description: JSON.stringify({ category: "Economy", transmission: "Automatic", seats: 4, transportType: "taxi", desc: "Air Conditioning" }),
      price: 500,
      duration: 1440,
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60"
    },
    {
      name: "Avis Rental SUV",
      description: JSON.stringify({ category: "SUV", transmission: "Automatic", seats: 5, transportType: "rental", desc: "Leather Seats, GPS" }),
      price: 4000,
      duration: 1440,
      image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&auto=format&fit=crop&q=60"
    },
    {
      name: "VIP Airport Transfer",
      description: JSON.stringify({ category: "Luxury", transmission: "Automatic", seats: 3, transportType: "airport", desc: "Chauffeur, Wi-Fi" }),
      price: 2500,
      duration: 1440,
      image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&auto=format&fit=crop&q=60"
    },
    {
      name: "Cross-Country Coach",
      description: JSON.stringify({ category: "Bus", transmission: "Automatic", seats: 45, transportType: "intercity", desc: "Restroom, Reclining Seats" }),
      price: 800,
      duration: 1440,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=60"
    },
    {
      name: "Hotel Express Shuttle",
      description: JSON.stringify({ category: "Van", transmission: "Automatic", seats: 12, transportType: "shuttle", desc: "Luggage Space" }),
      price: 1500,
      duration: 1440,
      image: "https://images.unsplash.com/photo-1549558549-415fe4c37b60?w=500&auto=format&fit=crop&q=60"
    }
  ];

  for (const s of services) {
    const existing = await prisma.service.findFirst({ where: { business_id: transportBiz.id, name: s.name } });
    if (!existing) {
      await prisma.service.create({
        data: {
          business_id: transportBiz.id,
          ...s
        }
      });
      console.log(`Added service: ${s.name}`);
    }
  }

  console.log(`\n=============================`);
  console.log(`Credentials for Transportation Owner:`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`=============================\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
