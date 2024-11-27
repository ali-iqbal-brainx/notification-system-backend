const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware');

router.use('/auth', require('./authRoutes'));
router.use('/post', authMiddleware.verifyAuth, require('./postRoutes'));
router.use('/follow', authMiddleware.verifyAuth, require('./followRoutes'));
router.use('/notification', authMiddleware.verifyAuth, require('./notificationRoutes'));
router.use('/user', authMiddleware.verifyAuth, require('./userRoutes'));

module.exports = router;
