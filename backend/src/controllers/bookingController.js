const prisma = require('../config/prisma');

// Helper to check if two time ranges overlap
const isOverlapping = (start1, end1, start2, end2) => {
  return start1 < end2 && start2 < end1;
};

exports.getAvailability = async (req, res) => {
  try {
    const { businessId, serviceId, date } = req.query;

    if (!businessId || !serviceId || !date) {
      return res.status(400).json({ error: 'businessId, serviceId, and date are required.' });
    }

    const targetDate = new Date(date); // assumes YYYY-MM-DD
    const dayOfWeek = targetDate.getUTCDay(); // 0 for Sunday

    // Fetch business hours
    const businessHours = await prisma.businessHours.findUnique({
      where: {
        business_id_day_of_week: {
          business_id: parseInt(businessId),
          day_of_week: dayOfWeek
        }
      }
    });

    if (!businessHours || businessHours.is_closed) {
      return res.json({ availableSlots: [], message: 'Business is closed on this day.' });
    }

    // Fetch service duration
    const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found.' });
    }
    const durationMs = service.duration * 60000;

    // Fetch existing bookings for that day
    // We look for bookings that overlap with the target date (start of day to end of day)
    const startOfDay = new Date(targetDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setUTCHours(23, 59, 59, 999));

    const existingBookings = await prisma.booking.findMany({
      where: {
        business_id: parseInt(businessId),
        status: { in: ['PENDING', 'CONFIRMED'] },
        start_time: { gte: startOfDay, lte: endOfDay }
      }
    });

    // Generate slots
    const availableSlots = [];
    const [openHour, openMin] = businessHours.open_time.split(':').map(Number);
    const [closeHour, closeMin] = businessHours.close_time.split(':').map(Number);

    let currentSlotStart = new Date(targetDate);
    currentSlotStart.setUTCHours(openHour, openMin, 0, 0);

    const closeTimeDate = new Date(targetDate);
    closeTimeDate.setUTCHours(closeHour, closeMin, 0, 0);

    // Simple fixed slot generation (every 30 mins)
    // A better approach would be sliding windows, but this is a solid start.
    const slotIntervalMs = 30 * 60000; 

    while (currentSlotStart.getTime() + durationMs <= closeTimeDate.getTime()) {
      const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMs);

      // Check if this slot overlaps with any existing booking
      const overlaps = existingBookings.some(b => 
        isOverlapping(currentSlotStart, currentSlotEnd, b.start_time, b.end_time)
      );

      if (!overlaps) {
        availableSlots.push({
          start_time: currentSlotStart.toISOString(),
          end_time: currentSlotEnd.toISOString(),
        });
      }

      currentSlotStart = new Date(currentSlotStart.getTime() + slotIntervalMs);
    }

    res.json({ availableSlots });
  } catch (error) {
    console.error('getAvailability error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { business_id, service_id, start_time, staff_id } = req.body;
    const customer_id = req.user.id;

    if (!business_id || !service_id || !start_time) {
      return res.status(400).json({ error: 'business_id, service_id, and start_time are required.' });
    }

    const service = await prisma.service.findUnique({ where: { id: parseInt(service_id) } });
    if (!service || service.business_id !== parseInt(business_id)) {
      return res.status(404).json({ error: 'Invalid service or business.' });
    }

    const requestedStart = new Date(start_time);
    const requestedEnd = new Date(requestedStart.getTime() + service.duration * 60000);

    // Concurrency check: Ensure slot is still free
    const overlaps = await prisma.booking.findFirst({
      where: {
        business_id: parseInt(business_id),
        status: { in: ['PENDING', 'CONFIRMED'] },
        AND: [
          { start_time: { lt: requestedEnd } },
          { end_time: { gt: requestedStart } }
        ]
      }
    });

    if (overlaps) {
      return res.status(409).json({ error: 'This time slot is no longer available.' });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customer_id,
        business_id: parseInt(business_id),
        service_id: parseInt(service_id),
        staff_id: staff_id ? parseInt(staff_id) : null,
        start_time: requestedStart,
        end_time: requestedEnd,
        total_price: service.price,
        status: 'PENDING' // Awaiting payment
      }
    });

    res.status(201).json({ message: 'Booking created successfully.', booking });
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerBookings = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { customer_id },
      include: { business: true, service: true },
      orderBy: { start_time: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBusinessBookings = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const owner_id = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const bookings = await prisma.booking.findMany({
      where: { business_id },
      include: { customer: true, service: true, staff: true },
      orderBy: { start_time: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const bookingId = parseInt(req.params.id);
    const { status } = req.body;
    const owner_id = req.user.id;

    if (!['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if booking exists and user owns the business
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { business: true }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.business.owner_id !== owner_id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized to update this booking' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status }
    });

    res.json({ message: 'Booking status updated successfully', booking: updatedBooking });
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
