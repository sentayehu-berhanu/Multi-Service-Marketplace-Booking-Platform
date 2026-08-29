const prisma = require('../config/prisma');

exports.addProduct = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const { name, description, price, stock, sku, image } = req.body;
    const owner_id = req.user.id;

    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to add products to this business.' });
    }

    const product = await prisma.product.create({
      data: {
        business_id,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock) || 0,
        sku,
        image,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ message: 'Product added successfully.', product });
  } catch (error) {
    console.error('addProduct error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);

    const products = await prisma.product.findMany({
      where: { 
        business_id,
        status: 'ACTIVE' 
      }
    });

    res.json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProductStock = async (req, res) => {
  try {
    const product_id = parseInt(req.params.productId);
    const { stock } = req.body;
    const owner_id = req.user.id;

    const product = await prisma.product.findUnique({ 
      where: { id: product_id },
      include: { business: true }
    });

    if (!product || (product.business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to modify this product.' });
    }

    const updated = await prisma.product.update({
      where: { id: product_id },
      data: { stock: parseInt(stock) }
    });

    res.json({ message: 'Stock updated', product: updated });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
