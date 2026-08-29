const prisma = require('../config/prisma');
const crypto = require('crypto');

exports.initializePayment = async (req, res) => {
  try {
    const { booking_id, order_id } = req.body;
    const user_id = req.user.id;

    if (!booking_id && !order_id) {
      return res.status(400).json({ error: 'Must provide booking_id or order_id' });
    }

    let amount = 0;
    let business_id = 0;

    if (booking_id) {
      const booking = await prisma.booking.findUnique({ where: { id: parseInt(booking_id) } });
      if (!booking || booking.customer_id !== user_id) return res.status(403).json({ error: 'Unauthorized' });
      if (booking.status !== 'PENDING') return res.status(400).json({ error: 'Booking is not pending' });
      amount = booking.total_price;
      business_id = booking.business_id;
    } else if (order_id) {
      const order = await prisma.order.findUnique({ where: { id: parseInt(order_id) } });
      if (!order || order.customer_id !== user_id) return res.status(403).json({ error: 'Unauthorized' });
      if (order.status !== 'PENDING') return res.status(400).json({ error: 'Order is not pending' });
      amount = order.total_amount;
      business_id = order.business_id;
    }

    // Generate mock transaction ID
    const tx_ref = `tx-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Create Payment record
    const payment = await prisma.payment.create({
      data: {
        user_id,
        booking_id: booking_id ? parseInt(booking_id) : null,
        order_id: order_id ? parseInt(order_id) : null,
        amount,
        transaction_id: tx_ref,
        provider: 'MOCK_PAY',
        status: 'PENDING'
      }
    });

    // In a real app, you would call Chapa/Stripe here and get a checkout_url
    const checkout_url = `http://localhost:5173/mock-checkout/${tx_ref}`;

    res.json({ message: 'Payment initialized', checkout_url, tx_ref });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.paymentWebhook = async (req, res) => {
  try {
    // In a real app, verify webhook signature here
    const { tx_ref, status } = req.body; // e.g., status = 'SUCCESS'

    if (!tx_ref) return res.status(400).json({ error: 'tx_ref is required' });

    const payment = await prisma.payment.findUnique({ where: { transaction_id: tx_ref } });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (status === 'SUCCESS') {
      // Execute in a transaction
      await prisma.$transaction(async (tx) => {
        // Update payment
        await tx.payment.update({
          where: { id: payment.id },
          data: { status: 'PAID' }
        });

        // Update corresponding booking or order
        if (payment.booking_id) {
          await tx.booking.update({
            where: { id: payment.booking_id },
            data: { status: 'CONFIRMED', payment_status: 'PAID' }
          });
        }
        
        if (payment.order_id) {
          await tx.order.update({
            where: { id: payment.order_id },
            data: { status: 'CONFIRMED' }
          });
        }
      });
      return res.json({ message: 'Payment verified and resource confirmed' });
    } else {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' }
      });
      return res.json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
