const prisma = require('../config/prisma');

exports.uploadImage = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const owner_id = req.user.id;
    const { caption } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const image_url = `http://localhost:5000/uploads/${req.file.filename}`;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized to upload images for this business' });
    }

    const galleryImage = await prisma.galleryImage.create({
      data: {
        business_id,
        image_url,
        caption
      }
    });

    res.status(201).json({ message: 'Image uploaded successfully', image: galleryImage });
  } catch (error) {
    console.error('uploadImage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);

    const images = await prisma.galleryImage.findMany({
      where: { business_id },
      orderBy: { created_at: 'desc' }
    });

    res.json(images);
  } catch (error) {
    console.error('getGallery error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const business_id = parseInt(req.params.businessId);
    const image_id = parseInt(req.params.imageId);
    const owner_id = req.user.id;

    // Verify ownership
    const business = await prisma.business.findUnique({ where: { id: business_id } });
    if (!business || (business.owner_id !== owner_id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const image = await prisma.galleryImage.findFirst({
      where: { id: image_id, business_id }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    await prisma.galleryImage.delete({
      where: { id: image_id }
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('deleteImage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
