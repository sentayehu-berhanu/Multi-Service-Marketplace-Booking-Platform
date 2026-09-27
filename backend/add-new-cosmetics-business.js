const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    // 1. Create a new Business Owner
    const passwordHash = await bcrypt.hash('password123', 10);
    const newOwner = await prisma.user.create({
      data: {
        name: 'Sara Cosmetics Owner',
        email: `saracosmetics${Date.now()}@example.com`,
        password_hash: passwordHash,
        role: 'BUSINESS_OWNER',
        status: 'ACTIVE'
      }
    });
    console.log(`Created new owner: ${newOwner.name} (${newOwner.email})`);

    // 2. Find the Cosmetics category
    const cosmeticsCategory = await prisma.category.findUnique({
      where: { slug: 'cosmetics' }
    });

    if (!cosmeticsCategory) {
      console.error('Cosmetics category not found!');
      return;
    }

    // 3. Create a new Cosmetics Business
    const newBusiness = await prisma.business.create({
      data: {
        owner_id: newOwner.id,
        category_id: cosmeticsCategory.id,
        name: 'Glamour & Glow Boutique',
        description: 'Premium cosmetics and beauty products curated for you.',
        address: 'Bole Road, Addis Ababa',
        location_lat: 8.9806,
        location_lng: 38.7578,
        phone: '+251 911 000000',
        email: newOwner.email,
        cover_image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        status: 'ACTIVE'
      }
    });
    console.log(`Created new business: ${newBusiness.name}`);

    // 4. Add new Cosmetics Products to this business
    const products = [
      { name: 'Organic Cocoa Butter Lotion', category: 'Body Care', price: 850, image: 'https://images.unsplash.com/photo-1608248593842-83b6cb65f12e?auto=format&fit=crop&w=800&q=80', description: 'Deeply moisturizing body lotion.' },
      { name: 'Glow Up Highlighter Palette', category: 'Makeup', price: 1500, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80', description: 'Four stunning highlighter shades for a radiant glow.' },
      { name: 'Tea Tree Cleansing Foam', category: 'Skin Care', price: 650, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80', description: 'Gentle facial cleanser for clear skin.' },
      { name: 'Signature Floral Perfume', category: 'Fragrance', price: 2800, image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80', description: 'Long-lasting elegant floral fragrance.' }
    ];

    for (const prod of products) {
      await prisma.product.create({
        data: {
          business_id: newBusiness.id,
          name: prod.name,
          description: prod.description,
          price: prod.price,
          stock: 20,
          category: prod.category,
          image: prod.image,
          status: 'ACTIVE'
        }
      });
      console.log(`Added product: ${prod.name}`);
    }

    console.log('Successfully added new business owner, business, and cosmetics products!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
