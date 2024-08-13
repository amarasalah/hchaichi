const router = require("express").Router();
const { getNotifications, markNotification} = require("../controllers/notificationController");




router.get("/get", getNotifications);

router.post("/read", markNotification);











module.exports = router;