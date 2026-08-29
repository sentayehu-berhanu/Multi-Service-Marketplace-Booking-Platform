const prisma = require('../config/prisma');

exports.createOrder = async (req, res) => {
  try {
    // Expected body: { business_id: 1, delivery_address: "123 Main St", items: [{ product_id: 1, quantity: 2 }], booking_id: 5 }
    const { business_id, delivery_address, items, booking_id } = req.body;
    const customer_id = req.user.id;

    if (!business_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'business_id and items are required.' });
    }

    // We must execute this inside a transaction to ensure stock levels are atomically verified and decremented
    const result = await prisma.$transaction(async (tx) => {
      let total_amount = 0;
      const orderItemsData = [];

      // Verify each item's stock and calculate total price securely on the backend
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.product_id } });
        
        if (!product || product.business_id !== parseInt(business_id)) {
          throw new Error(`Product ${item.product_id} not found or belongs to different business.`);
        }
        
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.name}`);
        }

        // Decrement stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity }
        });

        const itemTotal = product.price * item.quantity;
        total_amount += itemTotal;

        orderItemsData.push({
          product_id: product.id,
          quantity: item.quantity,
          unit_price: product.price
        });
      }

      // Create the order
      const order = await tx.order.create({
        data: {
          customer_id,
          business_id: parseInt(business_id),
          booking_id: booking_id ? parseInt(booking_id) : null,
          delivery_address,
          total_amount,
          status: 'PENDING', // Awaiting payment (Phase 11)
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      return order;
    });

    res.status(201).json({ message: 'Order placed successfully.', order: result });
  } catch (error) {
    console.error('createOrder error:', error);
    // Determine if it's our custom validation error vs a generic database failure
    if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order_id = parseInt(req.params.orderId);
    const { status } = req.body;
    const owner_id = req.user.id;

    const order = await prisma.order.findUnique({ 
      where: { id: order_id },
      include: { business: true }
    });

    if (!order || (order.business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.order.update({
      where: { id: order_id },
      data: { status }
    });

    res.json({ message: 'Order status updated.', order: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerOrders = async (req, res) => {
  try {
    const customer_id = req.user.id;
    const orders = await prisma.order.findMany({
      where: { customer_id },
      include: { business: true, items: { include: { product: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBusinessOrders = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const owner_id = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: { business_id },
      include: { customer: true, items: { include: { product: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
