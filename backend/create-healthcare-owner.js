const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'healthowner@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or update the Healthcare Owner user
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { password_hash: hashedPassword, role: 'BUSINESS_OWNER' }
    });
    console.log('Updated existing healthcare owner user.');
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Dr. Ahmed',
        email,
        password_hash: hashedPassword,
        role: 'BUSINESS_OWNER'
      }
    });
    console.log('Created new healthcare owner user.');
  }

  // 2. Ensure Healthcare category exists
  let category = await prisma.category.findFirst({ where: { slug: 'healthcare' } });
  if (!category) {
    category = await prisma.category.create({
      data: { name: 'Healthcare', slug: 'healthcare' }
    });
    console.log('Created Healthcare category.');
  }

  // 3. Create Dr. Ahmed Clinic
  let clinic = await prisma.business.findFirst({ where: { name: 'Dr. Ahmed Clinic' } });
  if (!clinic) {
    clinic = await prisma.business.create({
      data: {
        name: 'Dr. Ahmed Clinic',
        description: 'General Physician Services',
        phone: '0911223344',
        email: 'drahmed@example.com',
        address: 'Downtown Medical Center',
        category_id: category.id,
        owner_id: user.id,
        status: 'LIVE'
      }
    });
    console.log('Created Dr. Ahmed Clinic and assigned to owner.');
  } else {
    await prisma.business.update({
      where: { id: clinic.id },
      data: { owner_id: user.id }
    });
    console.log('Assigned existing Dr. Ahmed Clinic to owner.');
  }

  // 4. Create initial services
  const servicesToCreate = [
    { name: 'General Consultation', description: '[Consultation] Initial checkup and advice', price: 500, duration: 30 },
    { name: 'Follow-up Checkup', description: '[Checkup] Follow-up for ongoing treatment', price: 300, duration: 20 },
  ];

  for (const s of servicesToCreate) {
    const existing = await prisma.service.findFirst({
      where: { business_id: clinic.id, name: s.name }
    });
    if (!existing) {
      await prisma.service.create({
        data: {
          business_id: clinic.id,
          name: s.name,
          description: s.description,
          price: s.price,
          duration: s.duration,
        }
      });
    }
  }

  console.log(`\nHealthcare Owner Credentials:\nEmail: ${email}\nPassword: ${password}\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
