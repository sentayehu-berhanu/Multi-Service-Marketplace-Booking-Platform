const prisma = require('../config/prisma');

exports.addProduct = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const { name, description, price, stock, sku, category, brand, rating } = req.body;
    let image = req.body.image;
    const owner_id = req.user.id;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

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
        category,
        brand,
        rating: rating ? parseFloat(rating) : 0,
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
    const { category, brand, minPrice, maxPrice, search } = req.query;

    let whereClause = {
      status: 'ACTIVE'
    };

    if (!isNaN(business_id)) {
      whereClause.business_id = business_id;
    } else {
      // Global shop fetch. Let's filter by the cosmetic category if we want, or rely on frontend to pass category.
    }

    if (category) {
      whereClause.category = category;
    }
    if (brand) {
      whereClause.brand = { contains: brand, mode: 'insensitive' };
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
    }
    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        business: {
          select: { name: true }
        }
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

exports.updateProduct = async (req, res) => {
  try {
    const product_id = parseInt(req.params.productId);
    const { name, description, price, stock, sku, category, brand, rating, status } = req.body;
    let image = req.body.image;
    const owner_id = req.user.id;

    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    const product = await prisma.product.findUnique({
      where: { id: product_id },
      include: { business: true }
    });

    if (!product || (product.business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to modify this product.' });
    }

    const updated = await prisma.product.update({
      where: { id: product_id },
      data: {
        name,
        description,
        price: price ? parseFloat(price) : undefined,
        stock: stock ? parseInt(stock) : undefined,
        sku,
        image,
        category,
        brand,
        rating: rating ? parseFloat(rating) : undefined,
        status
      }
    });

    res.json({ message: 'Product updated successfully', product: updated });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product_id = parseInt(req.params.productId);
    const owner_id = req.user.id;

    const product = await prisma.product.findUnique({
      where: { id: product_id },
      include: { business: true }
    });

    if (!product || (product.business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to modify this product.' });
    }

    // Soft delete
    await prisma.product.update({
      where: { id: product_id },
      data: { status: 'ARCHIVED' }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
