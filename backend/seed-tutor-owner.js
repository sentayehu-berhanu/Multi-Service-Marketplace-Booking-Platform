const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'tutorowner@example.com';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. Create or update the Tutor Owner user
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (user) {
    user = await prisma.user.update({
      where: { email },
      data: { password_hash: hashedPassword, role: 'BUSINESS_OWNER' }
    });
    console.log('Updated existing tutor owner user.');
  } else {
    user = await prisma.user.create({
      data: {
        name: 'Michael Bekele (Tutor)',
        email,
        password_hash: hashedPassword,
        role: 'BUSINESS_OWNER'
      }
    });
    console.log('Created new tutor owner user.');
  }

  // 2. Make sure the Tutors category exists
  let category = await prisma.category.findUnique({ where: { slug: 'tutors' } });
  if (!category) {
    console.log('Tutors category missing, creating it...');
    category = await prisma.category.create({
      data: { name: '🎓 Tutors', slug: 'tutors', description: 'Education and learning', status: 'ACTIVE' }
    });
  }

  // 3. Create or Update the Tutor Business
  const businessName = 'Learn & Train Academy';
  let business = await prisma.business.findFirst({ where: { name: businessName } });
  if (business) {
    await prisma.business.update({
      where: { id: business.id },
      data: { owner_id: user.id, category_id: category.id }
    });
    console.log(`Updated existing business: ${businessName}`);
  } else {
    business = await prisma.business.create({
      data: {
        name: businessName,
        owner_id: user.id,
        category_id: category.id,
        description: 'Professional tutoring and training center.',
        address: 'Addis Ababa',
        status: 'APPROVED'
      }
    });
    console.log(`Created new business: ${businessName}`);
  }

  console.log(`\nCredentials:\nEmail: ${email}\nPassword: ${password}\n`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
