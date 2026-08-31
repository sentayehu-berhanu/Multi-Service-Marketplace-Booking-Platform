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

// Get all businesses (public route), optionally filtered by category name
exports.getAllBusinesses = async (req, res) => {
  try {
    const { category } = req.query;
    
    let whereClause = {};
    if (category) {
      whereClause = {
        category: {
          name: {
            contains: category,
            mode: 'insensitive' // case-insensitive match
          }
        }
      };
    }

    const businesses = await prisma.business.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(businesses);
  } catch (error) {
    console.error('getAllBusinesses error:', error);
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
    console.log('addService req.headers:', req.headers);
    console.log('addService req.body:', req.body);
    console.log('addService req.file:', req.file);

    const business_id = parseInt(req.params.id);
    let { name, description, price, duration, image } = req.body || {};
    const owner_id = req.user.id;

    if (req.file) {
      image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

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
        duration: parseInt(duration),
        image
      }
    });

    res.status(201).json({ message: 'Service added successfully.', service });
  } catch (error) {
    console.error('addService error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing service
exports.updateService = async (req, res) => {
  try {
    console.log('updateService req.headers:', req.headers);
    console.log('updateService req.body:', req.body);
    console.log('updateService req.file:', req.file);

    const business_id = parseInt(req.params.id);
    const service_id = parseInt(req.params.serviceId);
    let { name, description, price, duration, image, status } = req.body || {};
    const owner_id = req.user.id;

    if (req.file) {
      image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    if (business.owner_id !== owner_id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to modify this business.' });
    }

    const service = await prisma.service.findFirst({
      where: { id: service_id, business_id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    const updatedService = await prisma.service.update({
      where: { id: service_id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        duration: duration ? parseInt(duration) : undefined,
        image,
        status
      }
    });

    res.json({ message: 'Service updated successfully.', service: updatedService });
  } catch (error) {
    console.error('updateService error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a service (Soft delete by archiving)
exports.deleteService = async (req, res) => {
  try {
    const business_id = parseInt(req.params.id);
    const service_id = parseInt(req.params.serviceId);
    const owner_id = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business) {
      return res.status(404).json({ error: 'Business not found.' });
    }

    if (business.owner_id !== owner_id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to modify this business.' });
    }

    const service = await prisma.service.findFirst({
      where: { id: service_id, business_id }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }

    // Soft delete: change status to ARCHIVED to not break existing bookings
    await prisma.service.update({
      where: { id: service_id },
      data: { status: 'ARCHIVED' }
    });

    res.json({ message: 'Service deleted (archived) successfully.' });
  } catch (error) {
    console.error('deleteService error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all unique customers for a business based on bookings
exports.getBusinessCustomers = async (req, res) => {
  try {
    const business_id = parseInt(req.params.id);
    const owner_id = req.user.id;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to view this business.' });
    }

    // Fetch all bookings for the business and include customer data
    const bookings = await prisma.booking.findMany({
      where: { business_id },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            created_at: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Extract unique customers and aggregate stats
    const customersMap = new Map();
    bookings.forEach(booking => {
      if (booking.customer && !customersMap.has(booking.customer.id)) {
        const customerBookings = bookings.filter(b => b.customer_id === booking.customer.id);
        const totalSpent = customerBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
        
        customersMap.set(booking.customer.id, {
          ...booking.customer,
          last_booking: booking.created_at,
          total_bookings: customerBookings.length,
          total_spent: totalSpent
        });
      }
    });

    res.json(Array.from(customersMap.values()));
  } catch (error) {
    console.error('getBusinessCustomers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    console.error('getCategories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
