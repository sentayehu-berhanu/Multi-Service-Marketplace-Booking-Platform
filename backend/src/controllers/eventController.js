const prisma = require('../config/prisma');

// Add a new event
exports.addEvent = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    let { title, description, category, date, time, venue, city, price } = req.body;
    const owner_id = req.user.id;

    let image = null;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Verify business ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business) return res.status(404).json({ error: 'Business not found.' });
    if (business.owner_id !== owner_id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    const event = await prisma.event.create({
      data: {
        business_id,
        title,
        description,
        category,
        date,
        time,
        venue,
        city,
        price: parseFloat(price),
        image
      }
    });

    res.status(201).json({ message: 'Event added successfully.', event });
  } catch (error) {
    console.error('addEvent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get events for a business
exports.getEventsByBusiness = async (req, res) => {
  try {
    const business_id = parseInt(req.query.businessId);
    if (isNaN(business_id)) {
      return res.status(400).json({ error: 'businessId query parameter is required.' });
    }

    const events = await prisma.event.findMany({
      where: { business_id, status: 'ACTIVE' },
      orderBy: { created_at: 'desc' }
    });

    res.json(events);
  } catch (error) {
    console.error('getEventsByBusiness error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete (archive) an event
exports.deleteEvent = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const event_id = parseInt(req.params.eventId);
    const owner_id = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    await prisma.event.update({
      where: { id: event_id },
      data: { status: 'ARCHIVED' }
    });

    res.json({ message: 'Event removed successfully.' });
  } catch (error) {
    console.error('deleteEvent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
