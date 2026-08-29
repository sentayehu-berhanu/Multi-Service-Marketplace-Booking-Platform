const prisma = require('../config/prisma');

// Register a new business
exports.createBusiness = async (req, res) => {
  try {
    const { name, description, phone, email, category_id, address, location_lat, location_lng } = req.body;
    const owner_id = req.user.id; // from auth middleware

    if (!name || !category_id) {
      return res.status(400).json({ error: 'Business name and category are required.' });
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        phone,
        email,
        address,
        location_lat,
        location_lng,
        category_id: parseInt(category_id),
        owner_id,
        status: 'PENDING', // Needs admin approval to go LIVE
      }
    });

    res.status(201).json({ message: 'Business registered successfully and is pending approval.', business });
  } catch (error) {
    console.error('createBusiness error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all businesses for the authenticated owner
exports.getMyBusinesses = async (req, res) => {
  try {
    const owner_id = req.user.id;

    const businesses = await prisma.business.findMany({
      where: { owner_id },
      include: {
        category: true,
        services: true
      }
    });

    res.json(businesses);
  } catch (error) {
    console.error('getMyBusinesses error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a service to a business
exports.addService = async (req, res) => {
  try {
    const business_id = parseInt(req.params.id);
    const { name, description, price, duration } = req.body;
    const owner_id = req.user.id;

    // Verify the business exists and belongs to the owner
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }
    
    // Only the owner or an admin can add services to this business
    if (business.owner_id !== owner_id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to modify this business.' });
    }

    const service = await prisma.service.create({
      data: {
        business_id,
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration)
      }
    });

    res.status(201).json({ message: 'Service added successfully.', service });
  } catch (error) {
    console.error('addService error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
