// controllers/commentController.js
// Blog comment controllers: list comments for a post (public) and post a new
// comment (protected).

const Comment = require('../models/CommentModel');
const BlogPost = require('../models/BlogPostModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all comments for a blog post, oldest first, with author username
// @route   GET /api/blog/:postId/comments
// @access  Public
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new comment on a blog post, linked to the logged-in user
// @route   POST /api/blog/:postId/comments
// @access  Protected
exports.createComment = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      return next(new ErrorHandler('Blog post not found', 404));
    }

    const { body } = req.body;

    const comment = await Comment.create({
      body,
      author: req.user._id,
      post: req.params.postId,
    });

    const populated = await Comment.findById(comment._id).populate(
      'author',
      'username'
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};
