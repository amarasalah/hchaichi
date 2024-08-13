const Notification = require("./../models/Notification");
const {User} = require("../models/User");
const mongoose = require('mongoose');

/**-----------------------------------------------
 * @desc    Get notification
 * @route   /notifications
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
 module.exports.getNotifications = async (req, res) => {
  try {
    const { userId, limit = 2 } = req.query;
    const notifications = await Notification.find({
      recipient: new mongoose.Types.ObjectId(userId)
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate({
        path: 'sender',
        select: 'firstName lastName image imageUrl'
      });

    const totalNotifications = await Notification.countDocuments({
      recipient: new mongoose.Types.ObjectId(userId)
    });
    //console.log(totalNotifications);

    const unreadCount = await Notification.countDocuments({
      recipient: new mongoose.Types.ObjectId(userId),
      status: "unread"
    });

    return res.status(200).json({
      notifications,
       totalNotifications ,
      unreadCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch notifications", error });
  }
};
/**-----------------------------------------------
 * @desc    Mark notification as read
 * @route   /notifications/read
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
module.exports.markNotification = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    await Notification.updateMany(
      { _id: { $in: notificationIds } },
      { status: "read" }
    );
    return res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to mark notifications as read", error });
  }
};
