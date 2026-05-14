const express = require('express');
const router = express.Router();
const { ensureAuth } = require('../middleware/auth');
const taskController = require('../controllers/taskController');

router.get('/', ensureAuth, taskController.getTodayTasks);
router.get('/upcoming', ensureAuth, taskController.getUpcomingTasks);
router.get('/utility', ensureAuth, taskController.getUtilityHub);
router.get('/add', ensureAuth, taskController.getAddTask);
router.post('/add', ensureAuth, taskController.postAddTask);
router.get('/:id/edit', ensureAuth, taskController.getEditTask);
router.put('/:id', ensureAuth, taskController.putUpdateTask);
router.patch('/:id/status', ensureAuth, taskController.patchUpdateStatus);
router.delete('/:id', ensureAuth, taskController.deleteTask);
router.get('/api/tasks', ensureAuth, taskController.getTasksApi);

module.exports = router;
