const router = require("express").Router();
const authController = require('../controllers/authController');

//auth routes
router.post('/sign_up', authController.signup);
router.post('/log_in', authController.login);

module.exports = router;