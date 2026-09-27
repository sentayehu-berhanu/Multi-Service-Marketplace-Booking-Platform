const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCosmetics() {
  // Find or create cosmetics category
  let category = await prisma.category.findUnique({ where: { slug: 'cosmetics' } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Cosmetics', slug: 'cosmetics' }
    });
  }

  // Create two business owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'beauty1@example.com' },
    update: {},
    create: { name: 'Beauty Owner 1', email: 'beauty1@example.com', password_hash: 'hash', role: 'BUSINESS_OWNER' }
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'beauty2@example.com' },
    update: {},
    create: { name: 'Beauty Owner 2', email: 'beauty2@example.com', password_hash: 'hash', role: 'BUSINESS_OWNER' }
  });

  // Create two cosmetics businesses
  const biz1 = await prisma.business.create({
    data: {
      name: 'Addis Glow Cosmetics',
      owner_id: owner1.id,
      category_id: category.id,
      status: 'ACTIVE'
    }
  });

  const biz2 = await prisma.business.create({
    data: {
      name: 'Sheger Beauty Supply',
      owner_id: owner2.id,
      category_id: category.id,
      status: 'ACTIVE'
    }
  });

  // Add products
  const products = [
    { business_id: biz1.id, name: 'Ethiopian Shea Butter Moisturizer', description: 'Deep hydrating organic shea butter.', price: 450, stock: 50, category: 'Skin Care', brand: 'Addis Naturals', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80', rating: 4.8, review_count: 12 },
    { business_id: biz1.id, name: 'Rose Water Toner', description: 'Refreshing facial mist.', price: 300, stock: 30, category: 'Skin Care', brand: 'Addis Naturals', image: 'https://images.unsplash.com/photo-1615397323209-b7b596395b28?auto=format&fit=crop&w=400&q=80', rating: 4.5, review_count: 8 },
    { business_id: biz1.id, name: 'Matte Liquid Lipstick - Red', description: 'Long lasting matte finish.', price: 250, stock: 100, category: 'Makeup', brand: 'Luxe Cosmetics', image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80', rating: 4.9, review_count: 45 },
    { business_id: biz2.id, name: 'Argan Oil Hair Serum', description: 'Nourishing oil for frizzy hair.', price: 600, stock: 25, category: 'Hair Care', brand: 'HairPro', image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=400&q=80', rating: 4.6, review_count: 22 },
    { business_id: biz2.id, name: 'Vitamin C Brightening Serum', description: 'For glowing skin.', price: 850, stock: 15, category: 'Skin Care', brand: 'Sheger Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80', rating: 4.7, review_count: 31 },
    { business_id: biz2.id, name: 'Professional Makeup Brush Set', description: '12-piece soft bristle brushes.', price: 1200, stock: 10, category: 'Beauty Tools', brand: 'Glamour', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80', rating: 5.0, review_count: 5 },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log('Cosmetics seeded successfully!');
}

seedCosmetics()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
