const prisma = require('../config/prisma');

exports.createCoupon = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const owner_id = req.user.id;
    const { code, discount_type, discount_value, valid_from, valid_until, usage_limit } = req.body;

    if (!code || !discount_type || !discount_value || !valid_from || !valid_until) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to create coupons for this business' });
    }

    const coupon = await prisma.coupon.create({
      data: {
        business_id,
        code: code.toUpperCase(),
        discount_type,
        discount_value: parseFloat(discount_value),
        valid_from: new Date(valid_from),
        valid_until: new Date(valid_until),
        usage_limit: usage_limit ? parseInt(usage_limit) : null
      }
    });

    res.status(201).json({ message: 'Coupon created successfully', coupon });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'A coupon with this code already exists for this business' });
    }
    console.error('createCoupon error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBusinessCoupons = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const owner_id = req.user.id;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const coupons = await prisma.coupon.findMany({
      where: { business_id },
      orderBy: { created_at: 'desc' }
    });

    res.json(coupons);
  } catch (error) {
    console.error('getBusinessCoupons error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
