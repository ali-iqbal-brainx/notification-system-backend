const router = require("express").Router();
const notificationController = require('../controllers/notificationController');

//noti routes
router.get('/', notificationController.getNotifications);

module.exports = router;