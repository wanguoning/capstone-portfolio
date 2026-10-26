// routes/projectRoutes.js
// Portfolio project routes: public reads, protected writes.

const router = require('express').Router();
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');

router
  .route('/')
  .get(projectController.getProjects)
  .post(protect, projectController.createProject);

router
  .route('/:id')
  .get(projectController.getProjectById)
  .put(protect, projectController.updateProject)
  .delete(protect, projectController.deleteProject);

module.exports = router;
