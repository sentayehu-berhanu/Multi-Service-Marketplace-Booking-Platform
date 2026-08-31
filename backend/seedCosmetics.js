const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCosmetics() {
  console.log("Looking for a cosmetics business...");
  
  // First ensure we have a 'Cosmetics' category
  let cosmeticsCategory = await prisma.category.findUnique({
    where: { slug: 'cosmetics' }
  });

  if (!cosmeticsCategory) {
    cosmeticsCategory = await prisma.category.create({
      data: {
        name: '💄 Cosmetics',
        slug: 'cosmetics',
        description: 'Makeup and beauty products',
        status: 'ACTIVE'
      }
    });
  }

  // Check if we have an owner to associate businesses with
  let owner = await prisma.user.findFirst({
    where: { role: 'BUSINESS_OWNER' }
  });

  if (!owner) {
    // If no owner exists, we'll assign it to an admin or create a dummy owner
    owner = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (!owner) {
      owner = await prisma.user.create({
        data: {
          name: 'Dummy Owner',
          email: 'owner@example.com',
          password_hash: 'hashedpassword',
          role: 'BUSINESS_OWNER'
        }
      });
    }
  }

  // Create a dummy cosmetics business if none exists
  let business = await prisma.business.findFirst({
    where: { category_id: cosmeticsCategory.id }
  });

  if (!business) {
    business = await prisma.business.create({
      data: {
        name: 'Luxe Beauty Shop',
        owner_id: owner.id,
        category_id: cosmeticsCategory.id,
        status: 'ACTIVE',
        description: 'Premium cosmetics and beauty tools'
      }
    });
  }

  const products = [
    {
      name: 'Hydrating Face Cream',
      description: 'A deeply hydrating face cream with hyaluronic acid and vitamin E. Perfect for all skin types.',
      price: 600,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Skin Care',
      brand: 'GlowRecipe',
      rating: 4.8,
      review_count: 120,
    },
    {
      name: 'Matte Liquid Lipstick',
      description: 'Long-lasting matte liquid lipstick in a beautiful rose shade.',
      price: 450,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Makeup',
      brand: 'Fenty',
      rating: 4.5,
      review_count: 85,
    },
    {
      name: 'Argan Oil Hair Serum',
      description: 'Nourishing hair serum that controls frizz and adds incredible shine.',
      price: 550,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Hair Care',
      brand: 'Moroccanoil',
      rating: 4.9,
      review_count: 230,
    },
    {
      name: 'Midnight Bloom Perfume',
      description: 'A sensual blend of dark florals and warm musk. Eau de Parfum.',
      price: 1200,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Fragrance',
      brand: 'Dior',
      rating: 4.7,
      review_count: 54,
    },
    {
      name: 'Shea Butter Body Lotion',
      description: 'Rich and creamy body lotion for 24-hour moisture.',
      price: 350,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Body Care',
      brand: 'Nivea',
      rating: 4.3,
      review_count: 320,
    },
    {
      name: 'Rose Quartz Roller',
      description: 'Facial massage tool to de-puff and improve circulation.',
      price: 300,
      stock: 75,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
      category: 'Beauty Tools',
      brand: 'Herbivore',
      rating: 4.6,
      review_count: 45,
    }
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.product.create({
        data: {
          ...p,
          business_id: business.id,
          status: 'ACTIVE'
        }
      });
      console.log(`Created product: ${p.name}`);
    } else {
      console.log(`Product ${p.name} already exists.`);
    }
  }

  console.log("Mock cosmetics seeded successfully.");
}

seedCosmetics().catch(e => console.error(e)).finally(() => prisma.$disconnect());
