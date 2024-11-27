const router = require("express").Router();
const followerController = require('../controllers/followerController');

//folow routes
router.post('/:id', followerController.follow);
router.delete('/:id', followerController.unfollow);
router.put('/address_request/:id', followerController.addressRequest);

module.exports = router;