// controllers/projectController.js
// Portfolio project CRUD controllers. Read endpoints are public; create,
// update and delete require a logged-in user (protect middleware).

const Project = require('../models/ProjectModel');
const ErrorHandler = require('../utils/ErrorHandler');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('user', 'username');
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single project by id
// @route   GET /api/projects/:id
// @access  Public
exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'user',
      'username'
    );
    if (!project) {
      return next(new ErrorHandler('Project not found', 404));
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project, linked to the logged-in user
// @route   POST /api/projects
// @access  Protected
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;

    const project = await Project.create({
      title,
      description,
      imageUrl,
      repoUrl,
      liveUrl,
      user: req.user._id,
    });

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing project
// @route   PUT /api/projects/:id
// @access  Protected
exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler('Project not found', 404));
    }

    // Whitelist editable fields; the owner reference stays untouched
    const { title, description, imageUrl, repoUrl, liveUrl } = req.body;

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, imageUrl, repoUrl, liveUrl },
      { new: true, runValidators: true }
    ).populate('user', 'username');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Protected
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return next(new ErrorHandler('Project not found', 404));
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project removed' });
  } catch (error) {
    next(error);
  }
};
