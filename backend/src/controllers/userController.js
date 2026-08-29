const prisma = require('../config/prisma');

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, phone }
    });

    res.json({
      message: 'Profile updated successfully',
      user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, phone: updatedUser.phone, role: updatedUser.role }
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
