const prisma = require('../config/prisma');

exports.addStaff = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const { name, role, user_id } = req.body;
    const owner_id = req.user.id;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to modify staff for this business.' });
    }

    const staff = await prisma.staff.create({
      data: {
        business_id,
        name,
        role: role || 'STAFF',
        user_id: user_id ? parseInt(user_id) : null
      }
    });

    res.status(201).json({ message: 'Staff added successfully.', staff });
  } catch (error) {
    console.error('addStaff error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getStaffByBusiness = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);

    const staff = await prisma.staff.findMany({
      where: { business_id, status: 'ACTIVE' }
    });

    res.json(staff);
  } catch (error) {
    console.error('getStaffByBusiness error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
