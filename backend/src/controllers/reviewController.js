const prisma = require('../config/prisma');

exports.createReview = async (req, res) => {
  try {
    const { business_id, rating, comment } = req.body;
    const customer_id = req.user.id;

    if (!business_id || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid business_id and rating (1-5) are required.' });
    }

    // VERIFICATION: Check if the customer has a COMPLETED booking or DELIVERED order
    const hasCompletedBooking = await prisma.booking.findFirst({
      where: {
        customer_id,
        business_id: parseInt(business_id),
        status: 'COMPLETED'
      }
    });

    const hasDeliveredOrder = await prisma.order.findFirst({
      where: {
        customer_id,
        business_id: parseInt(business_id),
        status: 'DELIVERED'
      }
    });

    if (!hasCompletedBooking && !hasDeliveredOrder) {
      return res.status(403).json({ error: 'You can only review a business after completing a service or receiving an order.' });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        customer_id,
        business_id: parseInt(business_id),
        booking_id: hasCompletedBooking ? hasCompletedBooking.id : null,
        order_id: (!hasCompletedBooking && hasDeliveredOrder) ? hasDeliveredOrder.id : null,
        rating: parseInt(rating),
        comment
      }
    });

    // Recalculate business average rating
    const aggregations = await prisma.review.aggregate({
      where: { business_id: parseInt(business_id) },
      _avg: { rating: true },
      _count: { rating: true }
    });

    await prisma.business.update({
      where: { id: parseInt(business_id) },
      data: {
        rating: aggregations._avg.rating || 0,
        review_count: aggregations._count.rating || 0
      }
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (error) {
    console.error('createReview error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBusinessReviews = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);

    const reviews = await prisma.review.findMany({
      where: { business_id },
      include: { customer: { select: { name: true } } },
      orderBy: { created_at: 'desc' }
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
