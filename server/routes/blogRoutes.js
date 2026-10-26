// routes/blogRoutes.js
// Blog post and comment routes: public reads, protected writes, author-only
// update and delete on posts.

const router = require('express').Router();
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

// Post collection
router
  .route('/')
  .get(blogController.getBlogPosts)
  .post(protect, blogController.createBlogPost);

// Single post
router
  .route('/:id')
  .get(blogController.getBlogPostById)
  .put(protect, blogController.updateBlogPost)
  .delete(protect, blogController.deleteBlogPost);

// Comments under a post
router.get('/:postId/comments', commentController.getCommentsByPost);
router.post('/:postId/comments', protect, commentController.createComment);

module.exports = router;
