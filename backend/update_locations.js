const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const businesses = await prisma.business.findMany();
  
  // Base coordinates around Addis Ababa
  const baseLat = 9.0054;
  const baseLng = 38.7636;
  
  let count = 0;
  for (const biz of businesses) {
    // Generate a random slight offset for each business so they don't overlap perfectly
    // (Math.random() - 0.5) * 0.1 gives a range of roughly -0.05 to +0.05 degrees, which is a few km.
    const latOffset = (Math.random() - 0.5) * 0.1;
    const lngOffset = (Math.random() - 0.5) * 0.1;
    
    const newLat = baseLat + latOffset;
    const newLng = baseLng + lngOffset;
    
    // Update the business
    await prisma.business.update({
      where: { id: biz.id },
      data: {
        location_lat: newLat,
        location_lng: newLng,
        // Optional: also update the address text if it's missing or empty
        address: biz.address && biz.address.trim() !== '' ? biz.address : 'Addis Ababa, Ethiopia'
      }
    });
    count++;
  }
  
  console.log(`Successfully updated locations for ${count} businesses to Ethiopian coordinates.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
