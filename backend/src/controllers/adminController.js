const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

// Create a business along with its owner
exports.createBusinessWithOwner = async (req, res) => {
  try {
    const { 
      businessName, 
      categoryId, 
      description,
      address,
      phone,
      email,
      ownerName, 
      ownerEmail, 
      ownerPassword,
      ownerPhone
    } = req.body;

    if (!businessName || !categoryId || !ownerName || !ownerEmail || !ownerPassword) {
      return res.status(400).json({ error: 'Business name, category, and owner details (name, email, password) are required.' });
    }

    // Check if the owner email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: ownerEmail }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(ownerPassword, salt);

    // Create the user and business in a transaction
    const result = await prisma.$transaction(async (prismaClient) => {
      // 1. Create the owner user
      const user = await prismaClient.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password_hash,
          phone: ownerPhone,
          role: 'BUSINESS_OWNER',
        }
      });

      // 2. Create the business
      const business = await prismaClient.business.create({
        data: {
          name: businessName,
          category_id: parseInt(categoryId),
          owner_id: user.id,
          description,
          address,
          phone,
          email,
          status: 'ACTIVE', // Automatically active since created by admin
        }
      });

      return { user, business };
    });

    // Remove password hash from response
    delete result.user.password_hash;

    res.status(201).json({ 
      message: 'Business and owner account created successfully.', 
      data: result 
    });
  } catch (error) {
    console.error('createBusinessWithOwner error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all businesses (admin view, includes owner details)
exports.getAllBusinessesAdmin = async (req, res) => {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        category: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        services: true
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(businesses);
  } catch (error) {
    console.error('getAllBusinessesAdmin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
