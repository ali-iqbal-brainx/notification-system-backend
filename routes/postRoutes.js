const router = require("express").Router();
const postController = require('../controllers/postController');
const postMiddleware = require("../middlewares/postMiddleware");

//post routes
router.post('/add_post', postController.addPost);
router.delete('/delete_post/:id', postController.deletePost);
router.post('/like_post', postMiddleware.postGuard, postController.likePost);
router.delete('/unlike_post/:id', postController.unlikePost);
router.get('/post_listing', postController.postListing);

module.exports = router;