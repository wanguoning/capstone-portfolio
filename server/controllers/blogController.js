// controllers/blogController.js
// Blog post CRUD controllers. Read endpoints are public; create requires
// login; update and delete additionally require the post author.

const BlogPost = require('../models/BlogPostModel');
const Comment = require('../models/CommentModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all blog posts, newest first, with author username
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res, next) => {
  try {
    const posts = await BlogPost.find()
      .populate('author', 'username')
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single blog post with author and its comments (oldest first)
// @route   GET /api/blog/:id
// @access  Public
exports.getBlogPostById = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate(
      'author',
      'username'
    );
    if (!post) {
      return next(new ErrorHandler('Blog post not found', 404));
    }

    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: { ...post.toObject(), comments },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post, linked to the logged-in user
// @route   POST /api/blog
// @access  Protected
exports.createBlogPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post (author only)
// @route   PUT /api/blog/:id
// @access  Protected & Authorized
exports.updateBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler('Blog post not found', 404));
    }

    // Only the original author may edit the post
    if (!req.user._id.equals(post.author)) {
      return next(new ErrorHandler('Not authorized to update this post', 403));
    }

    // Whitelist editable fields; the author reference stays untouched
    const { title, content } = req.body;

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true, runValidators: true }
    ).populate('author', 'username');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post (author only) and cascade-delete its comments
// @route   DELETE /api/blog/:id
// @access  Protected & Authorized
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler('Blog post not found', 404));
    }

    // Only the original author may delete the post
    if (!req.user._id.equals(post.author)) {
      return next(new ErrorHandler('Not authorized to delete this post', 403));
    }

    // Remove all comments attached to this post as well
    await Comment.deleteMany({ post: req.params.id });
    await BlogPost.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Blog post removed' });
  } catch (error) {
    next(error);
  }
};
