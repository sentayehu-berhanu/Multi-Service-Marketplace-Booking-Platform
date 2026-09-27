const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Find the Cosmetics category
  const category = await prisma.category.findUnique({
    where: { slug: 'cosmetics' }
  });

  if (!category) {
    console.log("Cosmetics category not found!");
    return;
  }

  // Find all businesses in Cosmetics
  const businesses = await prisma.business.findMany({
    where: { category_id: category.id }
  });

  if (businesses.length === 0) {
    console.log("No Cosmetics businesses found!");
    return;
  }

  const cosmeticCategories = ['Skin Care', 'Hair Care', 'Makeup', 'Fragrance', 'Body Care', 'Beauty Tools'];

  for (const business of businesses) {
    console.log(`Seeding products for business: ${business.name}`);

    // Add 3 products per business
    for (let i = 1; i <= 3; i++) {
      const productName = `Premium Product ${i} by ${business.name}`;
      
      const existingProduct = await prisma.product.findFirst({
        where: { business_id: business.id, name: productName }
      });

      if (!existingProduct) {
        await prisma.product.create({
          data: {
            business_id: business.id,
            name: productName,
            description: `This is an amazing ${productName} that will make you look and feel great!`,
            price: 500 * i,
            stock: 100,
            category: cosmeticCategories[i % cosmeticCategories.length],
            brand: `Brand ${business.name}`,
            rating: 4.5,
            review_count: 10 * i,
            status: 'ACTIVE'
          }
        });
        console.log(`- Created product: ${productName}`);
      } else {
        console.log(`- Product already exists: ${productName}`);
      }
    }
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
