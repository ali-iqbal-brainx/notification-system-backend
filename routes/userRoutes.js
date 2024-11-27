const router = require("express").Router();
const userController = require('../controllers/userController');

//user routes
router.get('/user_listing', userController.userListing);

module.exports = router;