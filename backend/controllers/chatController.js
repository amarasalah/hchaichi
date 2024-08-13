const { User } = require("./../models/User");
const Message = require ('./../models/Message');
const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");

const Notification = require('./../models/Notification');

/**-----------------------------------------------
 * @desc    Get all assistants
 * @route   /chat/users/assistance
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
/* module.exports.getAssisstance = async (req, res) => {
  try {
    const search  = req.query.search || '';
    const recieverId  = req.query.recieverId;
    //console.log(recieverId);
    const query = {
        role: 'assistance',
        $or: [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ]
    };

    let users = await User.find(query);


    const baseURL = "http://localhost:4000/api/image/profile/";
      users = users.map(user => {
      if (user.image) {
        user.image = `${baseURL}${user.image}`;
      }else if(user.imageUrl){
        user.imageUrl = `${baseURL}${user.imageUrl}`;
      }

      return user;
    });   



    console.log(users);



    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}; */


module.exports.getAssisstance = async (req, res) => {
  try {
    const search = req.query.search || '';
    const recieverId = req.query.recieverId;

    const query = {
      role: { $in: ['assistance', 'admin'] },
      $or: [
        { firstName: new RegExp(search, 'i') },
        { lastName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    };

    // Fetch users and convert to plain JavaScript objects
    var users = await User.find(query).lean();

    const baseURL = "http://localhost:4000/api/image/profile/";

    // Map through users to update their image URLs and unreadCount
    users = await Promise.all(users.map(async (user) => {
      if (user.image) {
        user.image = `${baseURL}${user.image}`;
      } else if (user.imageUrl) {
        user.imageUrl = `${baseURL}${user.imageUrl}`;
      }

      // Count unread messages for the user
      const unreadCount = await Message.countDocuments({
        sender: user._id,
        receiver: recieverId,
        read: false
      });

      // Add unreadCount to user object
      return { ...user, unreadCount };
    }));
    //console.log(users)

    // Return the list of user objects with unreadCount
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



/**-----------------------------------------------
 * @desc    Get all clients for an assistance
 * @route   /chat/users/clients/:receiverId
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
  module.exports.getclients = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const search  = req.query.search || '';

    // Get all unique sender IDs for the given receiver ID
    const senderIds = await Message.distinct('sender', { receiver: receiverId });
    const receiverIds = await Message.distinct('receiver', { sender: receiverId });

        // Combine senderIds and receiverIds into a single array and remove duplicates
        const uniqueIds = [...new Set([...senderIds, ...receiverIds])];


    const query = {
        role: 'client',
        _id: { $in:uniqueIds },
        $or: [
            { firstName: new RegExp(search, 'i') },
            { lastName: new RegExp(search, 'i') },
            { email: new RegExp(search, 'i') }
        ]
    };

    var users = await User.find(query).lean();


    const baseURL = "http://localhost:4000/api/image/profile/";
    // Map through users to update their image URLs and unreadCount
    users = await Promise.all(users.map(async (user) => {
      if (user.image) {
        user.image = `${baseURL}${user.image}`;
      } else if (user.imageUrl) {
        user.imageUrl = `${baseURL}${user.imageUrl}`;
      }

      // Count unread messages for the user
      const unreadCount = await Message.countDocuments({
        sender: user._id,
        receiver: receiverId,
        read: false
      });

      // Add unreadCount to user object
      return { ...user, unreadCount };
    }));



    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



/**-----------------------------------------------
 * @desc    Post Message
 * @route   /chat/user/post
 * @method  POST
 * @access  private    
 ------------------------------------------------*/
 module.exports.postMessage = async (req, res) => {
    const { receiver, content } = req.body;
    const sender = req.verified.id;

    console.log(receiver);
    console.log(content);

      // Track the uploaded file path for potential cleanup
  const attachmentPath = req.file ? path.join(__dirname, "..", "uploads", "chat", req.file.filename) : null;

    
  
    try {
      if (receiver && sender) {

        const attachment = req.file ? {
          originalname: req.file.originalname,
          path: req.file.filename,
        } : null;


        const message = new Message({ sender, receiver, content,attachment });


        console.log("message : " + message);
        await message.save();

        const newMessageNotification = new Notification({
          recipient:  receiver,
          sender:  sender,
          type: "message",
          messageId: message._id,
          content: "You have received a new message.",
          status: "unread"
        });
        newMessageNotification.save()


        return res.status(201).json(message); // Ensure the response is JSON
      } else {
        return res.status(400).json({ error: 'Invalid data' });
      }
    } catch (error) {
      console.error('Error saving message:', error);
          // Delete the uploaded file if an error occurred
    if (attachmentPath && fs.existsSync(attachmentPath)) {
      fs.unlinkSync(attachmentPath);
    }
      return res.status(500).json({ error: 'Server error' });
    }
  };


  /**-----------------------------------------------
 * @desc    Get Message
 * @route   /chat/user/get/:userId
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
 module.exports.getMessage = async (req, res) => {
/*     try {
        const { userId } = req.params;
        const currentUserId = req.verified.id;
    
        //console.log("currentUserId:", currentUserId);
        //console.log("userId:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(200).send('Invalid user ID');
          }else{
            const messages = await Message.find({
                $or: [
                  { sender: currentUserId, receiver: userId },
                  { sender: userId, receiver: currentUserId }
                ]
              }).sort({ timestamp: 1 });
          
              if (!messages) {
                return res.status(404).send({ error: "No messages found" });
              }
          
              return res.status(200).send(messages);
          }
      } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).send({ error: "Internal server error" });
      } */

    try {
        const { userId } = req.params;
        const currentUserId = req.verified.id;

        const limit = parseInt(req.query.limit) || 10;
    
        //console.log("currentUserId:", currentUserId);
        //console.log("userId:", userId);

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(200).send('Invalid user ID');
          }else{
            const messages = await Message.find({
                $or: [
                  { sender: currentUserId, receiver: userId },
                  { sender: userId, receiver: currentUserId }
                ]
              }).sort({ createdAt: -1 }).limit(limit);

              const count = await Message.countDocuments({
                $or: [
                  { sender: currentUserId, receiver: userId },
                  { sender: userId, receiver: currentUserId }
                ]
              });
          
              if (!messages) {
                return res.status(404).send({ error: "No messages found" });
              }

              return res.status(200).json({
                messages,
                totalMessages: count
              });
          
              //return res.status(200).send(messages);
          }
      } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).send({ error: "Internal server error" });
      } 



  };





  /**-----------------------------------------------
 * @desc    Edit Message
 * @route   /chat/user/edit/:messageId
 * @method  PUT
 * @access  private    
 ------------------------------------------------*/
module.exports.editMessage = async (req, res) => {
  const { messageId } = req.params;
  const { content } = req.body;
  const userId = req.verified.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'You can only edit your own messages' });
    }

    message.content = content;
    message.timestamp= Date.now();
    await message.save();

    return res.status(200).json(message);
  } catch (error) {
    console.error('Error editing message:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**-----------------------------------------------
 * @desc    Delete Message
 * @route   /chat/user/delete/:messageId
 * @method  DELETE
 * @access  private    
 ------------------------------------------------*/
 module.exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;
  const userId = req.verified.id;

  try {
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.sender.toString() !== userId) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }
    if (message.attachment && message.attachment.path) {
      const imagePath = path.join(__dirname, "..", "uploads", "chat", message.attachment.path);
      console.log(imagePath);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Mark message as deleted
    message.attachment = null;
    message.content = 'This message was deleted';
    message.isDeleted = true;

    // Save the updated message
    await message.save();


    //await Message.deleteOne({ _id: messageId });

    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

/**-----------------------------------------------
 * @desc    Mark messages as read
 * @route   /chat/user/read/:userId
 * @method  PUT
 * @access  private    
 ------------------------------------------------*/
 module.exports.markAsRead = async (req, res) => {
  try {
    const {messageId} = req.params;

    console.log(messageId);

    // Update the message's read status to true
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId },
      { read: true },
      { new: true } // This option returns the updated document
    );

    console.log( updatedMessage)

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    return res.json(updatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
/**-----------------------------------------------
 * @desc    Get unread message count
 * @route   /chat/user/unread_count/:userId
 * @method  GET
 * @access  private    
 ------------------------------------------------*/
/*  module.exports.getUnreadCount = async (req, res) => {
  const { userId } = req.params;

  try {
    const unreadCount = await Message.countDocuments({ receiver: userId, read: false });

    return res.status(200).json({ unreadCount });
  } catch (error) {
    console.error('Error getting unread message count:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}; */







module.exports.setAllMessagesUnread = async (req, res) => {
  try {
    const result = await Message.updateMany({}, { $set: { read: false } });

    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No messages were updated' });
    }

    return res.status(200).json({ message: 'All messages marked as unread', result });
  } catch (error) {
    console.error('Error setting messages to unread:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};