const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Find up to 3 Cosmetics businesses
    const cosmeticsBiz = await prisma.business.findMany({
      where: { category: { slug: 'cosmetics' } },
      take: 3
    });

    const products = [
      { name: 'Luxury Matte Lipstick', category: 'Makeup', price: 600, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80', description: 'Long-lasting, richly pigmented matte lipstick.' },
      { name: 'Hydrating Facial Serum', category: 'Skin Care', price: 1200, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80', description: 'Deeply moisturizing serum with hyaluronic acid.' },
      { name: 'Volume Mascara Black', category: 'Makeup', price: 450, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80', description: 'Intense volume and length for your lashes.' },
      { name: 'Rose Water Toner', category: 'Skin Care', price: 350, image: 'https://images.unsplash.com/photo-1608248593842-83b6cb65f12e?auto=format&fit=crop&w=800&q=80', description: 'Refreshing natural rose water toner for all skin types.' }
    ];

    for (let i = 0; i < cosmeticsBiz.length; i++) {
      const biz = cosmeticsBiz[i];
      
      for (let j = 0; j < products.length; j++) {
        const prodTemplate = products[j];
        
        await prisma.product.create({
          data: {
            business_id: biz.id,
            name: `${prodTemplate.name} by ${biz.name}`,
            description: prodTemplate.description,
            price: prodTemplate.price + (i * 50),
            stock: 15,
            category: prodTemplate.category,
            image: prodTemplate.image,
            status: 'ACTIVE'
          }
        });
        console.log(`Added "${prodTemplate.name}" to ${biz.name}`);
      }
    }

    console.log('Done adding real cosmetics products to 3 different business owners!');
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
