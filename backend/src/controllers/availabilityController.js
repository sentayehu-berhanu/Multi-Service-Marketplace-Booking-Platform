const prisma = require('../config/prisma');

exports.setBusinessHours = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const { hours } = req.body; // Expects an array of objects: [{day_of_week: 0, open_time: '09:00', close_time: '17:00', is_closed: false}]
    const owner_id = req.user.id;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to modify hours for this business.' });
    }

    // Process each day in a transaction to handle upserts
    const results = await prisma.$transaction(
      hours.map((h) => 
        prisma.businessHours.upsert({
          where: {
            business_id_day_of_week: {
              business_id: business_id,
              day_of_week: h.day_of_week
            }
          },
          update: {
            open_time: h.open_time,
            close_time: h.close_time,
            is_closed: h.is_closed
          },
          create: {
            business_id: business_id,
            day_of_week: h.day_of_week,
            open_time: h.open_time,
            close_time: h.close_time,
            is_closed: h.is_closed || false
          }
        })
      )
    );

    res.json({ message: 'Business hours updated successfully.', hours: results });
  } catch (error) {
    console.error('setBusinessHours error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBusinessHours = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);

    const hours = await prisma.businessHours.findMany({
      where: { business_id },
      orderBy: { day_of_week: 'asc' }
    });

    res.json(hours);
  } catch (error) {
    console.error('getBusinessHours error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
