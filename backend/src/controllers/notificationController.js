const prisma = require('../config/prisma');

// Get all notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.user.id;

    const notifications = await prisma.notification.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      take: 20 // Limit to 20 recent notifications
    });

    res.json(notifications);
  } catch (error) {
    console.error('getNotifications error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;
    const notification_id = parseInt(req.params.id);

    const notification = await prisma.notification.findFirst({
      where: { id: notification_id, user_id }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    const updated = await prisma.notification.update({
      where: { id: notification_id },
      data: { is_read: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('markAsRead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const user_id = req.user.id;

    await prisma.notification.updateMany({
      where: { user_id, is_read: false },
      data: { is_read: true }
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
