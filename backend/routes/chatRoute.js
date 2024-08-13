const router = require("express").Router();
const { setAllMessagesUnread,markAsRead,getAssisstance, postMessage, getMessage, getclients, editMessage,deleteMessage} = require("../controllers/chatController");
const createMulterConfig = require('./../config/multerConfig');
const getImg = require("./../utils/getImage");
const {authenticate} = require('./../config/ProtectRoutes');
const upload = createMulterConfig('uploads/chat/');

// Route to get image by name
router.get('/image/profile/:filename', (req, res) => getImg(req, res, "uploads/ProfilesIMG"));
router.get('/image/:filename', (req, res) => getImg(req, res, "uploads/chat"));


router.get("/users/assistance",authenticate, getAssisstance);
// Send a message
router.post("/user/post",authenticate, upload.single('attachment'), postMessage);
// Get messages between two users
router.get("/user/get/:userId",authenticate, getMessage);


router.get("/users/clients/:receiverId",authenticate, getclients);

router.put("/user/edit/:messageId", authenticate, editMessage);
router.delete("/user/delete/:messageId", authenticate, deleteMessage);


router.put('/user/read/:messageId', markAsRead);

//router.get('/user/unread_count/:userId', getUnreadCount);
router.put('/messages/read-status', setAllMessagesUnread);

module.exports = router;