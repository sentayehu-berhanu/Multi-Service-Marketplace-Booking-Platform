const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ethiopianAddresses = [
  'Bole Road, Addis Ababa',
  'Piassa, Addis Ababa',
  'Kazanchis, Addis Ababa',
  'CMC, Addis Ababa',
  'Bole Medhanialem, Addis Ababa',
  'Megenagna, Addis Ababa',
  'Sarbet, Addis Ababa',
  'Haya Hulet, Addis Ababa',
  'Gerji, Addis Ababa',
  'Jemo, Addis Ababa',
  'Lebu, Addis Ababa',
  'Ayat, Addis Ababa'
];

async function main() {
  const businesses = await prisma.business.findMany();
  
  let count = 0;
  for (const biz of businesses) {
    // Pick a random address from the list
    const randomAddress = ethiopianAddresses[Math.floor(Math.random() * ethiopianAddresses.length)];
    
    await prisma.business.update({
      where: { id: biz.id },
      data: {
        address: randomAddress
      }
    });
    count++;
  }
  
  console.log(`Successfully updated addresses for ${count} businesses to Ethiopian locations.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
